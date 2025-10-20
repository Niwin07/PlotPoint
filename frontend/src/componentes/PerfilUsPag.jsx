
import React from 'react';
import '../css/PerfilPag.css';

export default function ProfilePageUs() {
  return (
    <div className="containerperfil">
      

      {/* Profile Content */}
      <div className="profile-content">
       
       

        {/* Profile Avatar */}
        <div className="avatar-container">
          <img className="perfil-foto" src="/src/img/perfil.webp"></img>
          <div className="dot-decoration"></div>
        </div>

        <div className='editar'>
            <h2 className="username">tu_perfil</h2>
            <a href="editarperfil">
                <img src="/src/img/editar.webp" alt="" />
            </a>

        </div>
        

        
        {/* Bio */}
        <p className="bio">
          Hola me llamo Gustavo, me fascinan los libros de fantasía y mi mayor sueño es poder realizar mi propio libro que trate del medio ambiente!
        </p>

        {/* Stats */}
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