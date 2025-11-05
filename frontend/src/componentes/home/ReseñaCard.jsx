import React from "react";
import "/src/componentes/home/ReseñaCard.css";
import Rating from "react-rating";

//tarjeta de las reseñsa de VARIOS USUARIOS (para el la seccion "reseñas" del inicio)

const ReseñaCard = ({ id, libro_titulo, nombre_usuario, url_portada, contenido, puntuacion, url_avatar }) => {
  const BACKEND_URL = 'http://localhost:3000';
  return (
    <a className="link-reseña" href="/reseñalibro">
      <div className="reseña-card">
        <div className="reseña-header">
          <h3 className="titulo">{libro_titulo}</h3>
          <div className="autor">
            <span>{nombre_usuario}</span>

            <img src={url_avatar ? `${BACKEND_URL}${url_avatar}` : '/src/img/perfil.webp'} alt={nombre_usuario} />

          </div>
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
          <img src={url_portada} alt={libro_titulo} className="portada" />
          <p className="texto">{contenido}</p>
        </div>
      </div>
    </a>
  );
};

export default ReseñaCard;
