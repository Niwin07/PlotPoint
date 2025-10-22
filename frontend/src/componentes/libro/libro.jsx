import React, { useState } from "react";
import "/src/componentes/libro/libro.css";
import Rating from "react-rating";


const BookPage = () => {
   const libro = {
    id: 1,
    titulo: "Harry Potter and the Deathly Hallows",
    autor: "J. K. Rowling",
    anio: 2025,
    paginas: 137,
    genero: "Fantasía",
    editorial: "LibroTeca",
    descripcion:
      "Harry, Ron y Hermione emprenden una peligrosa misión para encontrar y destruir los Horrocruxes restantes de Voldemort, creyendo que este es el único camino para derrotarlo definitivamente. Mientras buscan, descubren la existencia de las legendarias Reliquias de la Muerte...",
    promedio: 3.5,
    portada: "/src/img/libro.webp",
    fans: 38,
  };

  const [reviews, setReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newOpinion, setNewOpinion] = useState("");

  const openModal = () => {
    setNewRating(0);
    setNewOpinion("");
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const addReview = () => {
    if (newRating === 0 || newOpinion.trim() === "") {
      alert("Por favor completa todos los campos.");
      return;
    }

    const newReview = {
      id: Date.now(),
      rating: newRating,
      opinion: newOpinion.trim(),
    };

    setReviews([newReview, ...reviews]);

    console.log(reviews)
    closeModal();
  };

  return (

    //se imprimiran los datos del libro consultado

    <div className="book-container">
      <div className="book-header">
        <div className="book-cover-container">
          <img
            src={libro.portada}
            alt={libro.titulo}
            className="book-cover"
          />
          <span className="heart">♥</span>
        </div>

        <h1 className="book-title">{libro.titulo}</h1>
        <p className="book-info">{libro.anio} - Escrito por {libro.autor}</p>
        <p className="book-info">{libro.paginas} páginas</p>
        <p className="book-info">Género: {libro.genero}</p>
        <p className="book-info">Editorial: {libro.editorial}</p>

        <p className="book-description">
          {libro.descripcion}
        </p>
      </div>

      <div className="book-rating">

        <div className="rating-score">
          <p className="score">{libro.promedio}</p>
          <div className="stars">
            <Rating
              initialRating={libro.promedio}
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

        {/* simulamos reseñas a este libro */}

        {reviews.map((review, index) => (

          <div className="review-card" key={index}>
            <a href="/reseñalibro">
              <div className="review-header">
                <div
                  className="avatar-foto"
                ><img src="/src/img/perfil.webp"></img></div>
                <p className="review-user">Beck</p>
                <div className="review-stars">
                  <Rating
                    initialRating={review.rating}
                    fractions={2}
                    readonly
                    emptySymbol={<span className="star empty">☆</span>}
                    fullSymbol={<span className="star full">★</span>}
                  />
                </div>
              </div>
              <p className="review-text">
                {review.opinion}
              </p>
            </a>
          </div>


        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button onClick={closeModal} className="cancel-btn">
              VOLVER
            </button>
            <h2>Calificar libro</h2>
            <Rating
              initialRating={newRating}
              onChange={setNewRating}
              fractions={2}
              emptySymbol={<span className="star empty big">☆</span>}
              fullSymbol={<span className="star full big">★</span>}
            />



            <textarea
              value={newOpinion}
              onChange={(e) => setNewOpinion(e.target.value)}
              placeholder="Explica tu reseña..."
            ></textarea>

            <div className="modal-buttons">
              <button onClick={addReview} className="save-btn">
                Calificar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookPage;
