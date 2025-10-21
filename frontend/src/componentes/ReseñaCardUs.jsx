import React from "react";
import "../css/ReseñaCard.css";
import Rating from "react-rating";

//tarjeta de reseña de un usuario en espeficico o tuyo (para la seccion de "reseñas" del perfil)

const ReseñaCardUs = ({ titulo, portada, texto, rating }) => {
  return (
    <a className="link-reseña" href="/reseñalibro">
      <div className="reseña-card">
        <div className="reseña-header">
          <h3 className="titulo">{titulo}</h3>
          {/*}
          <div className="autor">


          </div>
          {*/}
        </div>

        <div className="reseña-estrellas">
          <Rating
            initialRating={rating}
            readonly
            emptySymbol={<span className="star empty">☆</span>}
            fullSymbol={<span className="star full">★</span>}
          />
        </div>

        <div className="reseña-contenido">
          <img src={portada} alt={titulo} className="portada" />
          <p className="texto">{texto}</p>
        </div>
      </div>
    </a>
  );
};

export default ReseñaCardUs;
