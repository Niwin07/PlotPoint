import React from "react";
import "/src/componentes/home/ReseñaCard.css";
import Rating from "react-rating";
import { Link } from "wouter"; // 1. Importar Link
import axios from 'axios';

//tarjeta de las reseñsa de VARIOS USUARIOS (para el la seccion "reseñas" del inicio)

const ReseñaCard = ({ id, libro_titulo, nombre_usuario, url_portada, contenido, puntuacion, url_avatar, miId, usuario_id, onReseñaEliminada }) => {
  const BACKEND_URL = 'http://localhost:3000';
  const token = localStorage.getItem('token');
  const miIdNum = Number(miId);
  const usuarioIdNum = Number(usuario_id);

  const puedeEliminar = (miIdNum === usuarioIdNum);




  const eliminarReseña = async (e) => {
    e.preventDefault(); // evita que Link cambie de página
    if (!confirm("¿Eliminar reseña?")) return;

    try {
      const response = await axios.delete(`${BACKEND_URL}/api/resenas/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(response)

      if (onReseñaEliminada) {
        onReseñaEliminada(); 
      }
    } catch (error) {
      alert(error);
    }
  };
  return (
    <Link className="link-reseña" href={`/reseñalibro/${id}`}>
      <div className="reseña-card">
        {puedeEliminar && (
          <button className="eliminar-btn" onClick={eliminarReseña}>
            Eliminar
          </button>
        )}
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
    </Link>
  );
};

export default ReseñaCard;