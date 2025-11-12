import React, { useState, useEffect } from "react";
import axios from 'axios';
import ReseñaCard from "../home/ReseñaCard";
import ReseñaCardUs from "./ReseñaCardUs";
import portadaHP from "/src/img/libro.webp";

const ListaReseñas = () => {
  const [reviews, setReviews] = useState ([]);
   const token = localStorage.getItem('token');
  const BACKEND_URL = 'http://localhost:3000';

  useEffect(() => {
    const fetchUserReviews = async () => {
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

    fetchUserReviews();
  }, []);

const ListaReseñas = ({ usuarioId }) => { // Solo necesita el ID del usuario a mostrar
  
  const [reseñas, setReseñas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReseñas = async () => {
        setLoading(true);
        if (!usuarioId) return; // No hacer nada si no hay ID

        try {
            // Siempre usa el endpoint público para obtener reseñas de un usuario específico
            const url = `${BACKEND_URL}/api/resenas?usuario_id=${usuarioId}`;
            const res = await axios.get(url);
            setReseñas(res.data.resenas);

        } catch (error) {
            console.error("Error cargando reseñas:", error);
        } finally {
            setLoading(false);
        }
    };

    fetchReseñas();
  }, [usuarioId]); // Se actualiza solo si el usuarioId cambia

  if (loading) {
    return <div style={{ padding: '20px', color: 'white' }}>Cargando reseñas...</div>;
  }

  if (reseñas.length === 0) {
    return <div style={{ padding: '20px', color: 'white' }}>Este usuario aún no tiene reseñas.</div>;
  }

  return (
    <div className="lista-reseñas">
      {reseñas.map((r) => (
        <ReseñaCard 
          key={r.id} 
          id={r.id} // ID de la reseña para el link
          titulo={r.libro_titulo}
          nombreUsuario={r.nombre_usuario}
          urlPortada={`${BACKEND_URL}${r.url_portada}`}
          contenido={r.contenido}
          puntuacion={r.puntuacion}
          urlAvatar={`${BACKEND_URL}${r.url_avatar}`}
        />
      ))}
    </div>
  );
};
}
export default ListaReseñas;
