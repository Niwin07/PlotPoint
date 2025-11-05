import React from 'react';
import '/src/componentes/perfil/PerfilPag.css';
import { Link } from 'wouter'; // Importamos Link para el botón "Editar Perfil"

const BACKEND_URL = 'http://localhost:3000';

export default function PerfilPag({ perfil, esMiPerfil, siguiendo, onFollowToggle, token }) {

  if (!perfil) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="containerperfil">
      <div className="profile-content">
       
        {/* Profile Avatar */}
        <div className="avatar-container">
          <img 
            className="perfil-foto" 
            src={perfil.url_avatar ? `${BACKEND_URL}${perfil.url_avatar}` : '/src/img/perfil.webp'} 
            alt={perfil.nombre_usuario}
          />
          <div className="dot-decoration"></div>
        </div>

        {/* nombre de usuario */}
        <h2 className="nombre">{perfil.nombre}</h2>
        <h2 className='username'>{perfil.nombre_usuario}</h2>

        {/* Lógica de botones */}
        {token && ( // Solo muestra botones si el usuario está logueado
          esMiPerfil ? (
            // Si es mi perfil, muestro "Editar Perfil"
            <Link href="/editar-perfil" className="follow-button">
              Editar Perfil
            </Link>
          ) : (
            // Si es otro perfil, muestro "Seguir/Dejar de seguir"
            <button
              className="follow-button"
              onClick={onFollowToggle}
              style={{
                backgroundColor: siguiendo ? "var(--secundario2)" : "var(--secundario1)",
              }}
            >
              {siguiendo ? "Seguido" : "Seguir"}
            </button>
          )
        )}

        {/* cantidad de seguidores, seguidos y reseñas del usuario */}
        <div className="stats">
          <div className="stat-item">
            <div className="stat-number">{perfil.reseñas}</div>
            <div className="stat-label">Reseñas</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{perfil.seguidores}</div>
            <div className="stat-label">Seguidores</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{perfil.seguidos}</div>
            <div className="stat-label">Seguidos</div>
          </div>
        </div>

                {/* biografia */}
        <p className="bio">
         {perfil.biografia || "Este usuario no tiene biografía."}
        </p>
        
      </div>
    </div>
  );
}