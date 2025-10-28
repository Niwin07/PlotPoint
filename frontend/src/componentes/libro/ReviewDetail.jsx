import React, { useState } from 'react';
import '/src/componentes/libro/ReviewDetail.css';
import Rating from "react-rating";

export default function BookReviewApp() {
  const [comment, setComment] = useState('');

  const reviewData = {
    id: 101,
    nombreUsuario: 'Maria_Jose_Rodriguez2006',
    urlAvatar: '/src/img/perfil.webp',
    titulo: 'Harry Potter and the Deathly Hallows',
    anioPublicacion: 2022,
    puntuacion: 4,
    urlPortada: '/src/img/libro.webp',
    contenido: `An unforgettable experience that blends emotion, tension, and beauty in perfect harmony. 
    The characters feel alive, their choices meaningful, and the world richly detailed. Every twist adds 
    weight to the story, creating a rhythm that never loses momentum. It’s the kind of book that leaves you 
    quiet afterward, lost in thought, replaying moments and lines long after the final page is turned.`
  };


  //simulamos comentarios de usuarios referentes a la reseña de un usuario
  const [reviews, setReviews] = useState([
    {
      id: 1,
      nombreUsuario: 'Beck',
      urlAvatar:"/src/img/perfil.webp",
      contenido: 'this is my favourite review'
    },
    {
      id: 2,
      nombreUsuario: 'Beck',
      urlAvatar: "/src/img/perfil.webp",
      contenido: 'Desde mi sincera opinion tu perspectiva me resulto bastante elocuente y blablablablablablablabla'
    },
    {
      id: 3,
      nombreUsuario:'Beck',
      urlAvatar: "/src/img/perfil.webp",
      contenido: 'this is my favourite review'
    },
    {
      id: 4,
      nombreUsuario: 'Beck',
      urlAvatar: "/src/img/perfil.webp",
      contenido: 'Borra la cuenta'
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
            <img className="foto-perfil" src={reviewData.urlAvatar}></img>

            <h2 className="user-name">{reviewData.nombreUsuario}</h2>
          </a>
        </div>

        <div className="content">
          <div className="book-info">
            <h1 className="book-titulo">{reviewData.titulo} {reviewData.anioPublicacion}</h1>
            <div className="estrellas">
              <Rating
                initialRating={reviewData.puntuacion}
                readonly
                emptySymbol={<span className="star empty">☆</span>}
                fullSymbol={<span className="star full">★</span>}
              />
            </div>
            <p className="review">
              {reviewData.contenido}
            </p>
          </div>
          <img
            src={reviewData.urlPortada}
            alt={reviewData.titulo}
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
              <img src={review.urlAvatar} alt="" className="foto-perfil" />


              <h2 className="review-usuario">{review.nombreUsuario}</h2>
            </a>



            <p className="review-text">{review.contenido}</p>
          </div>
        ))}
      </div>
    </div>
  );
}