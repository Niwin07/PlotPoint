
import React,  { useState } from 'react';
import '/src/componentes/perfil/PerfilPag.css';

export default function ProfilePage() {
   const user = {
    id: 1,
    nombreUsuario: "usuario_diferente",
    urlAvatar: "/src/img/perfil.webp",
    biografia:
      "Hola me llamo Gustavos, me fascinan los libros de fantasía y mi mayor sueño es poder realizar mi propio libro que trate del medio ambiente!",
    reseñas: 8,
    seguidores: 7,
    seguidos: 4,
    siguiendo: true, // por si después querés alternar el botón de seguir
  };

   const [isFollowing, setIsFollowing] = useState(user.siguiendo);

  // Al apretar el botón
  const handleFollow = () => {
    setIsFollowing((prev) => !prev);
  };

  // (opcional) función que podría simular seguir/dejar de seguir
  

  return (
    <div className="containerperfil">
      
      

      {/* contenedor de usuario*/}
      <div className="profile-content">
       
       

        {/* Profile Avatar */}
        <div className="avatar-container">
          <img className="perfil-foto" src={user.urlAvatar}></img>
          <div className="dot-decoration"></div>
        </div>

        {/* nombre de usuario */}
        <h2 className="username">{user.nombreUsuario}</h2>


         <button
          className="follow-button"
          onClick={handleFollow}
          style={{
            backgroundColor: isFollowing ? "var(--secundario2)" : "var(--secundario1)",
          }}
        >
          {isFollowing ? "Seguido" : "Seguir"}
        </button>

        {/* biografia */}
        <p className="bio">
         {user.biografia}
        </p>

        {/* cantidad de seguidores, seguidos y reseñas del usuario */}
        <div className="stats">
          <div className="stat-item">
            <div className="stat-number">{user.reseñas}</div>
            <div className="stat-label">Reseñas</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{user.seguidores}</div>
            <div className="stat-label">Seguidores</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{user.seguidos}</div>
            <div className="stat-label">Seguidos</div>
          </div>
        </div>
      </div>
    </div>
  );
}