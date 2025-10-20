import React, { useState } from 'react';
import '../css/ReviewDetail.css';

export default function BookReviewApp() {
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([
    {
      id: 1,
      user: 'Beck',
      color: '#00ff00',
      text: 'this is my favourite review'
    },
    {
      id: 2,
      user: 'Beck',
      color: '#ff00ff',
      text: 'Desde mi sincera opinion tu perspectiva me resulto bastante elocuente y blablablablablablablabla'
    },
    {
      id: 3,
      user: 'Beck',
      color: '#ff0000',
      text: 'this is my favourite review'
    },
    {
      id: 4,
      user: 'Beck',
      color: '#8b4513',
      text: 'Borra la cuenta'
    }
  ]);

  const handleSubmit = () => {
    if (comment.trim()) {
      const newReview = {
        id: Date.now(),
        user: 'Beck',
        color: '#' + Math.floor(Math.random()*16777215).toString(16),
        text: comment
      };
      setReviews([newReview, ...reviews]);
      setComment('');
    }
  };

  return (
    <div className="container">
      <div className="main-card">
        <div className="usuario-reseña">
          <a className="usuario-reseña" href='/usuario/'>
          <img className="foto-perfil" src='/src/img/perfil.webp'></img>
          
          <h2 className="user-name">Maria_Jose_Rodriguez2006</h2>
          </a>
        </div>
        
        <div className="content">
          <div className="book-info">
            <h1 className="book-titulo">Harry Potter and the Deathly Hallows 2022</h1>
            <div className="estrellas">⭐⭐⭐⭐</div>
            <p className="review">
              An unforgettable experience that blends emotion, tension, and beauty in perfect harmony. The characters feel alive, their choices meaningful, and the world richly detailed. Every twist adds weight to the story, creating a rhythm that never loses momentum. It’s the kind of book that leaves you quiet afterward, lost in thought, replaying moments and lines long after the final page is turned.
            </p>
          </div>
          <img 
            src="/src/img/libro.webp" 
            alt="Harry Potter Book Cover" 
            className="book-portada"
          />
        </div>

       
      </div>
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
        {reviews.map((review) => (
          <div key={review.id} className="comentario-card">
            
            
              <a className="review-usuario" href='/usuario/'>
              <img src="/src/img/perfil.webp" alt="" className="foto-perfil" />
              
              
              <h2 className="review-usuario">Beck</h2>
              </a>
              
            
            
            <p className="review-text">{review.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}