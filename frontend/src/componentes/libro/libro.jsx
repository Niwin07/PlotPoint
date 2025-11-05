import React, { useState, useEffect } from "react";
import axios from "axios";
import "/src/componentes/libro/libro.css";
import Rating from "react-rating";
import { useRoute } from "wouter";
import { Link } from "wouter";

export default function BookPage() {
  const BACKEND_URL = "http://localhost:3000";

  const [match, params] = useRoute("/libro/:id");
  const libroId = params ? params.id : null;

  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isFavorite, setIsFavorite] = useState(false);
  
  const [showModal, setShowModal] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newOpinion, setNewOpinion] = useState("");
  const [refreshReviews, setRefreshReviews] = useState(false);
  const token = localStorage.getItem("token");

  const fetchBookAndReviews = async (idToFetch) => {
    setLoading(false);
    setError(null);
    setBook(null);
    setReviews([]);
    try {
      const bookRes = await axios.get(`${BACKEND_URL}/api/libros/${idToFetch}`);
      console.log(bookRes)
      setBook(bookRes.data.book ?? bookRes.data);
      const avgRes = await axios.get(`${BACKEND_URL}/api/resenas/libro/${idToFetch}/promedio`);
      if (avgRes.data.promedio) {
        setBook(prev => ({
          ...prev,
          promedio: avgRes.data.promedio
        }));
      }

      try {
        const reviewsRes = await axios.get(`${BACKEND_URL}/api/resenas?libro_id=${idToFetch}`);
        setReviews(reviewsRes.data.resenas)
        console.log(reviewsRes.data.resenas)
      } catch (errReviews) {
        console.warn("No se cargaron reseñas:", errReviews.message);
      }

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Error al cargar libro");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (libroId) {
      fetchBookAndReviews(libroId);
    } else {
      setError("No se especificó un ID de libro en la URL.");
    }
  }, [libroId]); 

  const openModal = () => {
    setNewRating(0);
    setNewOpinion("");
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const addReview = async () => {
    const id = libroId;
    if (!book || !id) {
      alert("No se ha cargado un libro válido");
      return;
    }
    if (newRating === 0 || newOpinion.trim().length < 10) {
      alert("La puntuación es requerida y el contenido debe tener al menos 10 caracteres");
      return;
    }

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/resenas`,
        {
          libro_id: parseInt(id), 
          puntuacion: newRating,
          contenido: newOpinion.trim()
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      
      setRefreshReviews(prev => !prev) 
      closeModal();
      alert("Reseña publicada exitosamente");
    } catch (err) {
      console.error("Error:", err);
       if (err.response?.status === 401) {
        alert("Debes iniciar sesión para publicar una reseña");
      } else if (err.response?.status === 409) {
        alert("Ya has reseñado este libro");
      } else if (err.response?.status === 400) {
        alert(err.response.data.message || "Error en los datos de la reseña");
      } else {
        alert("Error al publicar la reseña");
      }
    }
  };

  useEffect(() => {
    const checkFavoriteAndLoadData = async () => {
      if (!libroId || !token) return;

      try {
        const [favoriteRes, reviewsRes, avgRes] = await Promise.all([
          axios.get(`${BACKEND_URL}/api/likes/check/${libroId}`, { 
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${BACKEND_URL}/api/resenas?libro_id=${libroId}`),
          axios.get(`${BACKEND_URL}/api/resenas/libro/${libroId}/promedio`) 
        ]);

        console.log(favoriteRes)
        setIsFavorite(favoriteRes.data.es_favorito);
       
        setReviews(reviewsRes.data.resenas);

        if (avgRes.data.promedio) { 
          setBook(prev => ({
            ...prev,
            promedio: avgRes.data.promedio
          }));
        }

      } catch (err) {
        console.error("Error loading data:", err);
      }
    };

    if (book) { 
      checkFavoriteAndLoadData();
    }

  }, [refreshReviews, libroId, token, book?.id]); 

  const toggleFavorite = async () => {
    if (!token) {
      alert("Debes iniciar sesión para marcar favoritos");
      return;
    }

    try {
      if (isFavorite) {
        await axios.delete(`${BACKEND_URL}/api/likes/${libroId}`, { 
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsFavorite(false);
        
        alert(`Haz eliminado "${book.titulo}" de tus favoritos`)
      } else {
        const response = await axios.post(
          `${BACKEND_URL}/api/likes`,
          { libro_id: parseInt(libroId) }, 
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );
        setIsFavorite(true);
        
        alert(`Haz agregado "${book.titulo}" a tus favoritos`)
      }
    } catch (err) {

      alert(err.response?.data?.message || "Error al actualizar favoritos");

    }
  };


  return (
    <div className="book-container">

      {loading && <div>Cargando...</div>}
      {error && <div style={{ color: "red" }}>Error: {error}</div>}


      {book && (
        <>
          <div className="book-header">
            <div className="book-cover-container">
              <img
                src={book.urlPortada || `${book.url_portada || ""}`}
                alt={book.titulo}
                className="book-cover"
              />
              <span
                className={`heart-${isFavorite ? 'active' : ''}`}
                onClick={toggleFavorite}
                title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
              >
                ♥
              </span>
            </div>

            <h1 className="book-title">{book.titulo}</h1>
            <p className="book-info">
              {(book.anioPublicacion ?? book.anio_publicacion) || "—"} - Escrito por {book.autor_nombre} {book.autor_apellido}
            </p>
            <p className="book-info">{book.paginas ?? "—"} páginas</p>
            <p className="book-info">Género:  {book.generos?.map(genero => genero.nombre).join(', ') || '—'} </p>
            <p className="book-info">Editorial: {book.editorial_nombre}</p>

            <p className="book-description">{book.sinopsis}</p>
          </div>

          <div className="book-rating">
            <div className="rating-score">
              <p className="score">{book.promedio ?? book.promedio_rating ?? 0}</p>
              <div className="stars">
                <Rating
                  initialRating={book.promedio ?? book.promedio_rating ?? 0}
                  fractions={2}
                  readonly
                  emptySymbol={<span className="star empty medium">☆</span>}
                  fullSymbol={<span className="star full medium">★</span>}
                />
              </div>
              <button className="rate-button" onClick={openModal}>CALIFICAR LIBRO</button>
            </div>
          </div>

          <div className="reviews2">
            <h2>Reseñas</h2>
            {reviews.length === 0 && <p>No hay reseñas aún</p>}
            {reviews.map((review) => (
              <div className="review-card" key={review.id || review._id || Math.random()}>
                <Link href={`/reseñalibro/${review.id || review._id}`}>
                  <div className="review-header">
                    <div className="avatar-foto">
                      <img src={review.url_avatar ? `${BACKEND_URL}${review.url_avatar}` : ''} alt={review.nombre_usuario} />
                    </div>
                    <p className="review-user">{review.nombre_usuario}</p>
                    <div className="review-stars">
                      <Rating
                        initialRating={review.rating ?? review.puntuacion}
                        fractions={2}
                        readonly
                        emptySymbol={<span className="star empty">☆</span>}
                        fullSymbol={<span className="star full">★</span>}
                      />
                    </div>
                  </div>
                  <p className="review-text">{review.opinion ?? review.contenido}</p>
                </Link>
              </div>
            ))}
          </div>
        </>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button onClick={closeModal} className="cancel-btn">VOLVER</button>
            <h2>Calificar libro</h2>
            <Rating
              initialRating={newRating}
              onChange={setNewRating}
              fractions={2}
              emptySymbol={<span className="star empty big">☆</span>}
              fullSymbol={<span className="star full big">★</span>}
            />
            <textarea value={newOpinion} onChange={(e) => setNewOpinion(e.target.value)} placeholder="Explica tu reseña..."></textarea>
            <div className="modal-buttons">
              <button onClick={addReview} className="save-btn">Calificar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}