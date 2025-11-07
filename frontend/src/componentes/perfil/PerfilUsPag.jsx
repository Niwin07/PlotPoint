import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '/src/componentes/perfil/PerfilPag.css';
import { Link } from "wouter";

export default function ProfilePageUs() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const BACKEND_URL = 'http://localhost:3000';

  useEffect(() => {
    //trae los datos del usuario
    const fetchUserProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${BACKEND_URL}/api/usuarios/perfil`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          }
        });

        const payload = response.data.user ?? response.data;
        setUser(payload);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || err.message || 'Error al cargar perfil');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [token]);

  if (loading) return <div className="containerperfil">Cargando perfil...</div>;
  if (error) return <div className="containerperfil">Error: {error}</div>;
  if (!user) return <div className="containerperfil">No se encontró el perfil</div>;

  return (

    <div className="containerperfil">
      {/*imprimimos los datos recibidos*/}
      <div className="profile-content">
        <div className="avatar-container">
          <img
            className="perfil-foto"
            src={user.url_avatar ? `${BACKEND_URL}${user.url_avatar}` : '/src/img/perfil.webp'}
            alt={user.nombre ?? user.nombre_usuario ?? 'Perfil'}
          />

          <div className="dot-decoration"></div>
        </div>

        <div className="editar">
          <h2 className="nombre">{user.nombre ?? user.nombre_real ?? ''}</h2>
          <Link href={`/perfil/${user.id}/editarperfil`}>
            <img src="/src/img/editar.webp" alt="Editar Perfil" />
          </Link>
        </div>

        <h2 className="username">{user.nombre_usuario ?? user.nombreUsuario ?? ''}</h2>


        <div className="stats">
          <div className="stat-item">
            <div className="stat-number">{user.reseñas ?? user.reviews ?? 0}</div>
            <div className="stat-label">Reseñas</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{user.seguidores ?? user.followers ?? 0}</div>
            <div className="stat-label">Seguidores</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{user.seguidos ?? user.following ?? 0}</div>
            <div className="stat-label">Seguidos</div>
          </div>
        </div>

        <p className="bio">{user.biografia ?? user.bio ?? ''}</p>

      </div>
    </div>
  );
}