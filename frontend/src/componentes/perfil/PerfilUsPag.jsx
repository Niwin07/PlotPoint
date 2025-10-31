
import React from 'react';
import '/src/componentes/perfil/PerfilPag.css';

export default function ProfilePageUs() {
  const user = {
    nombreUsuario: "tu_perfil",
    urlAvatar: "/src/img/perfil.webp",
    biografia:
      "Hola me llamo David, me fascinan los libros de fantasía y mi mayor sueño es poder realizar mi propio libro que trate del medio ambiente!",
    reseñas: 8,
    seguidores: 7,
    seguidos: 4,
  };
  return (
    <div className="containerperfil">
      

      {/* contenedor de tu perfil */}
      <div className="profile-content">
       
       

        {/* Profile Avatar */}
        <div className="avatar-container">
          <img className="perfil-foto" src={user.urlAvatar}></img>
          <div className="dot-decoration"></div>
        </div>

        <div className='editar'>
            <h2 className="username">{user.nombreUsuario}</h2>

            {/* aqui te direccionara al componente que te permitira editar el nombre de usuario, contraseña o biografia de tu perfil */}
            <a href="editarperfil">
                <img src="/src/img/editar.webp" alt="Editar Perfil" />
            </a>

        </div>
        

        
        {/* Biografia */}
        <p className="bio">
        {user.biografia}
        </p>

        {/* cantidad de seguidores, seguidos y reseñas de tu perfil*/}
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