import React from "react";
import "/src/componentes/home/ReseñaCard.css";
import Rating from "react-rating";

//tarjeta de reseña de un usuario en espeficico o tuyo (para la seccion de "reseñas" del perfil)

const ReseñaCardUs = ({ titulo, urlPortada, contenido, puntuacion }) => {
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
            initialRating={puntuacion}
            readonly
            emptySymbol={<span className="star empty">☆</span>}
            fullSymbol={<span className="star full">★</span>}
          />
        </div>

        <div className="reseña-contenido">
          <img src={urlPortada} alt={titulo} className="portada" />
          <p className="texto">{contenido}</p>
        </div>
      </div>
    </a>
  );
};

export default ReseñaCardUs;
