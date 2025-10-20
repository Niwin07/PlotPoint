
import React from 'react';
import '../css/PerfilPag.css';

export default function ProfilePage() {
  return (
    <div className="containerperfil">
      
      

      {/* contenedor de usuario*/}
      <div className="profile-content">
       
       

        {/* Profile Avatar */}
        <div className="avatar-container">
          <img className="perfil-foto" src="/src/img/perfil.webp"></img>
          <div className="dot-decoration"></div>
        </div>

        {/* nombre de usuario */}
        <h2 className="username">usuario_diferente</h2>

        {/* boton de seguir */}
        <button className="follow-button">Seguir</button>

        {/* biografia */}
        <p className="bio">
          Hola me llamo Gustavo, me fascinan los libros de fantasía y mi mayor sueño es poder realizar mi propio libro que trate del medio ambiente!
        </p>

        {/* cantidad de seguidores, seguidos y reseñas del usuario */}
        <div className="stats">
          <div className="stat-item">
            <div className="stat-number">8</div>
            <div className="stat-label">Reseñas</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">7</div>
            <div className="stat-label">Seguidores</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">4</div>
            <div className="stat-label">Seguidos</div>
          </div>
        </div>
      </div>
    </div>
  );
}