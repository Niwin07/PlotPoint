import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRoute } from 'wouter';
import Rating from 'react-rating';
import './ReviewDetail.css';
import { Link } from "wouter";
import useComentario from '../../hooks/useComentario.jsx';

export default function ReviewDetail() {
  const BACKEND_URL = 'http://localhost:3000';
  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const miId = usuario?.id;

  const [match, params] = useRoute("/reseñalibro/:id");
  const resenaId = params ? params.id : null;

  const [ comentario, setDato ] = useComentario();

  const [review, setReview] = useState(null);
  const [comments, setComments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshComments, setRefreshComments] = useState(false);



  useEffect(() => {
    const fetchReviewAndComments = async () => {
      if (!resenaId) {
        setError("No se especificó un ID de reseña.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const reviewPromise = axios.get(`${BACKEND_URL}/api/resenas/${resenaId}`);
        const commentsPromise = axios.get(`${BACKEND_URL}/api/comentarios/resena/${resenaId}`);

        const [reviewRes, commentsRes] = await Promise.all([reviewPromise, commentsPromise]);

        setReview(reviewRes.data);
        setComments(commentsRes.data.comentarios);
        console.log('reseña:', reviewRes.data);
        console.log('comentarios:', commentsRes.data.comentarios);

      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError(err.response?.data?.message || "Error al cargar la reseña y los comentarios");
      } finally {
        setLoading(false);
      }
    };

    fetchReviewAndComments();
  }, [resenaId, refreshComments]);

  const handlePostComment = async () => {
    if (!token) {
      alert("Debes iniciar sesión para comentar");
      return;
    }
    if (comentario.contenido.trim().length < 1) {
      alert("El comentario no puede estar vacío");
      return;
    }

    try {
      await axios.post(
        `${BACKEND_URL}/api/comentarios`,
        {
          resena_id: parseInt(resenaId),
          contenido: comentario.contenido.trim()
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      setDato('contenido', '');
      setRefreshComments(prev => !prev);
    } catch (err) {
      console.error("Error al publicar comentario:", err);
      alert(err.response?.data?.message || "Error al enviar el comentario");
    }
  };

  const eliminarComentario = async (idComentario) => {
    if (!token) {
      alert("Debes iniciar sesión.");
      return;
    }

    if (!confirm("¿Eliminar este comentario?")) return;

    try {
      await axios.delete(`${BACKEND_URL}/api/comentarios/${idComentario}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setRefreshComments(prev => !prev); // refresca la lista
    } catch (err) {

      if (err.response?.status === 401) {
        alert("Tu sesión expiró. Inicia sesión nuevamente.");
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        window.location.href = "/iniciarsesion";
        return;
      }

      alert(err.response?.data?.message || "No se pudo eliminar el comentario.");
    }
  };

  if (loading) {
    return <div className="container">Cargando...</div>;
  }

  if (error) {
    return <div className="container" style={{ color: "red" }}>Error: {error}</div>;
  }

  if (!review) {
    return <div className="container">Reseña no encontrada.</div>;
  }

  return (
    <div className="container">
      <div className="main-card">
        <div className="usuario-reseña">
          <Link href={`/usuario/${review.usuario_id}`}>
            <img
              src={review.url_avatar ? `${BACKEND_URL}${review.url_avatar}` : '/path/to/default/avatar.png'}
              alt={review.nombre_usuario}
              className="foto-perfil"
            />
          </Link>
          <p className="user-name">{review.nombre_usuario}</p>


        </div>

        <div className="content">
          <div className="book-info">
            <p className="book-titulo">{review.libro_titulo}</p>
            <div className="estrellas">
              <Rating
                initialRating={review.puntuacion}
                readonly
                emptySymbol={<span className="star empty">☆</span>}
                fullSymbol={<span className="star full">★</span>}
              />
            </div>
            <p className="review">{review.contenido}</p>
          </div>
          <Link href={`/libro/${review.libro_id}`}>
            <img
              src={review.url_portada || ''}
              alt={review.libro_titulo}
              className="book-portada"
            />
          </Link>
        </div>
      </div>

      <div className="input-section">
        <input
          type="text"
          className="input"
          placeholder="Escribe un comentario..."
          value={comentario.contenido}
          onChange={(e) => setDato('contenido', e.target.value)}
        />
        <button className="send-button" onClick={handlePostComment}>
          Enviar
        </button>
      </div>

      <div className="reviews-list">
        {comments.length === 0 && (
          <p>No hay comentarios aún. ¡Sé el primero!</p>
        )}

        {comments.map((comment) => (
          <div className="comentario-card" key={comment.id}>
            
            <div className="review-header">
              <Link href={`/usuario/${comment.usuario_id}`}>
                <img
                  src={comment.url_avatar ? `${BACKEND_URL}${comment.url_avatar}` : '/path/to/default/avatar.png'}
                  alt={comment.nombre_usuario}
                  className="foto-perfil"
                />
              </Link>
              <p className="review-usuario">{comment.nombre_usuario}</p>
              {Number(comment.usuario_id) === Number(miId) && (
              <button
                className="eliminar-comentario-btn"
                onClick={() => eliminarComentario(comment.id)}
              >
                Eliminar
              </button>
            )}
            </div>
            <p className="review-text">{comment.contenido}</p>
          </div>
        ))}
      </div>
    </div>
  );
}