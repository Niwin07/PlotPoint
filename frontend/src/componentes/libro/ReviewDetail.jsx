import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '/src/componentes/libro/ReviewDetail.css';
import Rating from "react-rating";

export default function BookReviewApp() {
  const [manualId, setManualId] = useState(14);
  const [comment, setComment] = useState('');
  const [reviewData, setReviewData] = useState(null)
  const [reviews, setReviews] = useState([])

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BACKEND_URL = "http://localhost:3000";
  const token = localStorage.getItem('token');


  
  //simulamos que hacemos un comentario reaccionando a la reseña

  const handleSubmit = async (id) => {
    console.log(id)
    if (comment.trim()) {
      console.log(comment.trim())
      try {

        const response = await axios.post(
          `${BACKEND_URL}/api/comentarios`,
          {
            resena_id: parseInt(id),
            contenido: comment.trim()
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );
        console.log(response)
        setComment('')
      } catch {
        console.log("comentario error")
      }

      
    }
  };
 
  useEffect(() => {
    const fetchReviewData = async () => {
      setLoading(true);
      setError(null);

      try {

        const [reviewData, review] = await Promise.all([
          axios.get(`${BACKEND_URL}/api/resenas/${manualId}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${BACKEND_URL}/api/comentarios/resena/${manualId}`)

        ]);

        console.log(review.data.comentarios)


        setReviews(review.data.comentarios)
        console.log(reviewData.data)
        setReviewData(reviewData.data)
        
      } catch (err) {
        console.error('Error fetching review:', err);
        setError(err.response?.data?.message || 'Error al cargar la reseña');
      } finally {
        setLoading(false);
      }
    };

    fetchReviewData();
  }, [manualId, token]);

  if (loading) return <div className="container">Cargando...</div>;
  if (error) return <div className="container">Error: {error}</div>;
  if (!reviewData) return <div className="container">No se encontró la reseña</div>;


  return (


    <div className="container">
      {/* tarjeta detallada de una reseña en espefico */}
      <div className="main-card">
        <div className="usuario-reseña">
          <a className="usuario-reseña" href='/usuario/'>
            <img className="foto-perfil" src={reviewData.url_avatar ? `${BACKEND_URL}${reviewData.url_avatar}` : ''} alt={reviewData.nombre_usuario} ></img>

            <h2 className="user-name">{reviewData.nombre_usuario || ''}</h2>
          </a>
        </div>

        <div className="content">
          <div className="book-info">
            <h1 className="book-titulo">{reviewData.libro_titulo || ''}</h1>
            <div className="estrellas">
              <Rating
                initialRating={reviewData.puntuacion || ''}
                readonly
                emptySymbol={<span className="star empty">☆</span>}
                fullSymbol={<span className="star full">★</span>}
              />
            </div>
            <p className="review">
              {reviewData.contenido || ''}
            </p>
          </div>
          <img
            src={reviewData.url_portada || ''}
            alt={reviewData.libro_titulo || ''}
            className="book-portada"
          />
        </div>


      </div>
      {/* seccion para agregar tu comentario*/}
      <div className="input-section" >
        <input
          type="text"
          placeholder="Agregar comentario"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="input"
          
        />
        <button onClick={handleSubmit(reviewData.id)} className="send-button">
          Enviar
        </button>
      </div>

      <div className="reviews-list">

        {/* imprimimos los comentarios */}
        {reviews.map((review) => (
          <div key={review.id} className="comentario-card">


            <a className="review-usuario" href='/usuario/'>
              <img className='foto-perfil' src={reviewData.url_avatar ? `${BACKEND_URL}${reviewData.url_avatar}` : ''} alt={reviewData.nombre_usuario}/>


              <h2 className="review-usuario">{review.nombre_usuario}</h2>
            </a>



            <p className="review-text">{review.contenido}</p>
          </div>
        ))}
      </div>
    </div>
  );
}