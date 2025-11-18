import React, { useState, useEffect } from "react";
import axios from 'axios';
import ReseñaCard from "../home/ReseñaCard";



const ListaReseñas = ({ usuarioId }) => { 
  const BACKEND_URL = 'http://localhost:3000';
  const miId = JSON.parse(localStorage.getItem("usuario"))?.id;

  const [reseñas, setReseñas] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReseñas = async () => {
    setLoading(true);
    if (!usuarioId) return; 

    try {
      const url = `${BACKEND_URL}/api/resenas?usuario_id=${usuarioId}`;
      const res = await axios.get(url);
      setReseñas(res.data.resenas);

    } catch (error) {
      console.error("Error cargando reseñas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReseñas();
  }, [usuarioId]); 

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
          id={r.id} 
          libro_titulo={r.libro_titulo}
          nombre_usuario={r.nombre_usuario}
          url_portada={r.url_portada}
          contenido={r.contenido}
          puntuacion={r.puntuacion}
          url_avatar={r.url_avatar}

          miId={miId}
          usuario_id={r.usuario_id}

          onReseñaEliminada={fetchReseñas}
        />
      ))}
    </div>
  );
};

export default ListaReseñas;
