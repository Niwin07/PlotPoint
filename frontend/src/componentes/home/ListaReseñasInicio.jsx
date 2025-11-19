import React, { useState, useEffect } from "react";
import ReseñaCard from "./ReseñaCard";
import axios from 'axios';

const ListaReseñasInicio = () => {
  const [reviews, setReviews] = useState([]);
  const token = localStorage.getItem('token');
  const BACKEND_URL = 'http://localhost:3000';
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const miId = usuario?.id;


  const fetchFeedReviews = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/resenas`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log(response.data.resenas); 
      setReviews(response.data.resenas);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEliminarReseña = async (idReseña) => {
    if (!confirm("¿Eliminar reseña?")) return;

    try {
      await axios.delete(`${BACKEND_URL}/api/resenas/${idReseña}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      fetchFeedReviews();
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    fetchFeedReviews();
  }, []); 

  return (
    <div className="lista-reseñas">
      {reviews.map((r) => (
        <ReseñaCard
          key={r.id}
          id={r.id}
          libro_titulo={r.libro_titulo}
          nombre_usuario={r.nombre_usuario}
          url_portada={r.url_portada}
          contenido={r.contenido}
          puntuacion={r.puntuacion}
          url_avatar={r.url_avatar}
          miId={miId}
          usuario_id={r.usuario_id}

          onReseñaEliminada={() => handleEliminarReseña(r.id)} 
        />
      ))}
    </div>
  );
};

export default ListaReseñasInicio;