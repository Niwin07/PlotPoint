import React from "react";
import "/src/componentes/home/ReseñaCard.css";
import Rating from "react-rating";
import { Link } from "wouter"; 

const ReseñaCard = ({ id, libro_titulo, nombre_usuario, url_portada, contenido, puntuacion, url_avatar, miId, usuario_id, onReseñaEliminada }) => {
  
  const miIdNum = Number(miId);
  const usuarioIdNum = Number(usuario_id);
  const puedeEliminar = (miIdNum === usuarioIdNum);

  const eliminarReseña = (e) => {
    e.preventDefault(); 
    onReseñaEliminada(); 
  };

  return (
    <div className="reseña-card">
      <Link className="link-reseña" href={`/resenalibro/${id}`}>
        {puedeEliminar && (
          <button className="eliminar-btn" onClick={eliminarReseña}>
            Eliminar
          </button>
        )}
        <div className="reseña-header">
          <h3 className="titulo">{libro_titulo}</h3>
          <div className="autor">
            <span>{nombre_usuario}</span>
            <img src={url_avatar ? `${url_avatar}` : '/src/img/perfil.webp'} alt={nombre_usuario} />
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
      </Link>
    </div>
  );
};

export default ReseñaCard;