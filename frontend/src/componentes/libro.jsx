import React from "react";
import "../css/libro.css";

const BookPage = () => {
  return (

    //se imprimiran los datos del libro consultado

    <div className="book-container">
      <div className="book-header">
        <div className="book-cover-container">
          <img
            src="/src/img/libro.webp"
            alt="Harry Potter and the Deathly Hallows"
            className="book-cover"
          />
          <span className="heart">♥</span>
        </div>

        <h1 className="book-title">Harry Potter and the Deathly Hallows</h1>
        <p className="book-info">2025 - Escrito por J. K. Rowling</p>
        <p className="book-info">137 páginas</p>
        <p className="book-info">Género: Fantasía</p>
        <p className="book-info">Editorial: LibroTeca</p>

        <p className="book-description">
          Harry, Ron y Hermione emprenden una peligrosa misión para encontrar y
          destruir los Horrocruxes restantes de Voldemort, creyendo que este es
          el único camino para derrotarlo definitivamente. Mientras buscan,
          descubren la existencia de las legendarias Reliquias de la Muerte,
          tres objetos de gran poder que podrían ser la clave para el control de
          Voldemort...
        </p>
      </div>

      <div className="book-rating">
        
        <div className="rating-score">
          <p className="score">3.7</p>
          <div className="stars">★★★★☆</div>
          <button className="rate-button">CALIFICAR LIBRO</button>
        </div>
        
      </div>

      <div className="reviews2">
        <h2>Reseñas</h2>

        {/* simulamos reseñas a este libro */}

        {["#002244", "#888888", "#e60000", "#ffcc00"].map((color, index) => (
          
          <div className="review-card" key={index}>
            <a href="/reseñalibro">
            <div className="review-header">
              <div
                className="avatar-foto"
              ><img src="/src/img/perfil.webp"></img></div>
              <p className="review-user">Beck</p>
              <div className="review-stars">★★★★☆</div>
            </div>
            <p className="review-text">
              so heartbreaking i lowkey started to feel bad for watching sitting
              down
            </p>
            </a>
          </div>
          
          
        ))}
      </div>
    </div>
  );
};

export default BookPage;
