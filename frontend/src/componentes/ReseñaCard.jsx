import React from "react";
import "../css/ReseñaCard.css";
import Rating from "react-rating";

//tarjeta de las reseñsa de VARIOS USUARIOS (para el la seccion "reseñas" del inicio)

const ReseñaCard = ({ titulo, autor, portada, texto, rating, perfil }) => {
  return (
    <a className="link-reseña" href="/reseñalibro">
      <div className="reseña-card">
        <div className="reseña-header">
          <h3 className="titulo">{titulo}</h3>
          <div className="autor">
            <span>{autor}</span>

            <img src={perfil} alt="" />

          </div>
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

export default ReseñaCard;
