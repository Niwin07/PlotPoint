import React from "react";
import "/src/componentes/home/ReseñaCard.css";
import Rating from "react-rating";
import { Link } from "wouter"; // 1. Importar Link

//tarjeta de las reseñsa de VARIOS USUARIOS (para el la seccion "reseñas" del inicio)

const ReseñaCard = ({ id, titulo, nombreUsuario, url_portada, contenido, puntuacion, urlAvatar }) => {
  
  // El 'id' que recibe este componente debe ser el ID de la reseña
  
  return (
    // 2. Cambiar <a> por <Link> y usar el 'id' para la ruta dinámica
    <Link className="link-reseña" href={`/resenalibro/${id}`}>
      <div className="reseña-card">
        <div className="reseña-header">
          <h3 className="titulo">{titulo}</h3>
          <div className="autor">
            <span>{nombreUsuario}</span>
            <img src={urlAvatar} alt={nombreUsuario} />
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
          <img src={url_portada} alt={titulo} className="portada" />
          <p className="texto">{contenido}</p>
        </div>
      </div>
    </Link>
  );
};

export default ReseñaCard;