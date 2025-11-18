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
        headers: {
          'Authorization': `Bearer ${token}`

        }
      });
      console.log(response.data.resenas)

      const data = response.data.resenas;
      setReviews(data)

    } catch (err) {

      console.error(err);
    }
  };

  useEffect(() => {
    fetchFeedReviews();
  }, [reviews.id]);



  return (
    <div className="lista-reseñas">

      {/* se imprimen las reseñas al array */}
      {reviews.map((r, i) => (
        <ReseñaCard //key={i} {...r} 

          key={r.id}
          id={r.id} // ID de la reseña para el link
          libro_titulo={r.libro_titulo}
          nombre_usuario={r.nombre_usuario}
          url_portada={r.url_portada}
          contenido={r.contenido}
          puntuacion={r.puntuacion}
          url_avatar={r.url_avatar}

          miId={miId}
          usuario_id={r.usuario_id}

          onReseñaEliminada={fetchFeedReviews}

        />
      ))}
    </div>
  );
};

export default ListaReseñasInicio;
