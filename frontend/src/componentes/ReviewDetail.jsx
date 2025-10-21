import React, { useState } from 'react';
import '../css/ReviewDetail.css';
import Rating from "react-rating";

export default function BookReviewApp() {
  const [comment, setComment] = useState('');

  const reviewData = {
    id: 101,
    user: 'Maria_Jose_Rodriguez2006',
    userImg: '/src/img/perfil.webp',
    bookTitle: 'Harry Potter and the Deathly Hallows',
    year: 2022,
    stars: 4,
    bookImg: '/src/img/libro.webp',
    reviewText: `An unforgettable experience that blends emotion, tension, and beauty in perfect harmony. 
    The characters feel alive, their choices meaningful, and the world richly detailed. Every twist adds 
    weight to the story, creating a rhythm that never loses momentum. It’s the kind of book that leaves you 
    quiet afterward, lost in thought, replaying moments and lines long after the final page is turned.`
  };


  //simulamos comentarios de usuarios referentes a la reseña de un usuario
  const [reviews, setReviews] = useState([
    {
      id: 1,
      user: 'Beck',
      perfil: "/src/img/perfil.webp",
      text: 'this is my favourite review'
    },
    {
      id: 2,
      user: 'Beck',
      perfil: "/src/img/perfil.webp",
      text: 'Desde mi sincera opinion tu perspectiva me resulto bastante elocuente y blablablablablablablabla'
    },
    {
      id: 3,
      user: 'Beck',
      perfil: "/src/img/perfil.webp",
      text: 'this is my favourite review'
    },
    {
      id: 4,
      user: 'Beck',
      perfil: "/src/img/perfil.webp",
      text: 'Borra la cuenta'
    }
  ]);

  //simulamos que hacemos un comentario reaccionando a la reseña

  const handleSubmit = () => {
    if (comment.trim()) {
      const newReview = {
        id: Date.now(),
        user: 'Beck',
        perfil: "/src/img/perfil.webp",
        text: comment
      };
      setReviews([newReview, ...reviews]);
      setComment('');
    }
  };

  return (


    <div className="container">
      {/* tarjeta detallada de una reseña en espefico */}
      <div className="main-card">
        <div className="usuario-reseña">
          <a className="usuario-reseña" href='/usuario/'>
            <img className="foto-perfil" src={reviewData.userImg}></img>

            <h2 className="user-name">{reviewData.user}</h2>
          </a>
        </div>

        <div className="content">
          <div className="book-info">
            <h1 className="book-titulo">{reviewData.bookTitle} {reviewData.year}</h1>
            <div className="estrellas">
              <Rating
                initialRating={reviewData.stars}
                readonly
                emptySymbol={<span className="star empty">☆</span>}
                fullSymbol={<span className="star full">★</span>}
              />
            </div>
            <p className="review">
              {reviewData.reviewText}
            </p>
          </div>
          <img
            src={reviewData.bookImg}
            alt={reviewData.bookTitle}
            className="book-portada"
          />
        </div>


      </div>
      {/* seccion para agregar tu comentario*/}
      <div className="input-section">
        <input
          type="text"
          placeholder="Agregar comentario"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="input"
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <button onClick={handleSubmit} className="send-button">
          Enviar
        </button>
      </div>

      <div className="reviews-list">

        {/* imprimimos los comentarios */}
        {reviews.map((review) => (
          <div key={review.id} className="comentario-card">


            <a className="review-usuario" href='/usuario/'>
              <img src={review.perfil} alt="" className="foto-perfil" />


              <h2 className="review-usuario">{review.user}</h2>
            </a>



            <p className="review-text">{review.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}