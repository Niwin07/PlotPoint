import React, { useState, useEffect } from "react";
import ReseñaCard from "./ReseñaCard";
import axios from 'axios';

const ListaReseñasInicio = () => {
  const [reviews, setReviews] = useState([]);
  
  // sacamos el token y el id del user del localstorage
  // con 'miId' sabremos si la reseña que se muestra fue escrita por el user logueado
  const token = localStorage.getItem('token');
  const BACKEND_URL = 'http://localhost:3000';
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const miId = usuario?.id;

  const fetchReseñas = async () => {
    try {
      // enviamos el token en el header para que la api sepa quien hace la peticion
      const response = await axios.get(`${BACKEND_URL}/api/resenas`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log(response.data.resenas); 
      setReviews(response.data.resenas);
    } catch (err) {
      console.error(err);
    }
  };

  const eliminarReseña = async (idReseña) => {
    if (!confirm("¿Eliminar reseña?")) return;

    try {
      await axios.delete(`${BACKEND_URL}/api/resenas/${idReseña}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // despues de borrar una reseña, volvemos a llamar a la api
      // para que la lista en pantalla se actualice y desaparezca lo borrado.
      fetchReseñas();
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    fetchReseñas();
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
          
          // pasamos los IDs para verificar permisos en el hijo
          miId={miId}          
          usuario_id={r.usuario_id} 

          // pasamos la función de borrado como un callback. 
          // el hijo va a avisar cuando ocurra 
          onReseñaEliminada={() => eliminarReseña(r.id)} 
        />
      ))}
    </div>
  );
};

export default ListaReseñasInicio;