import { Link } from 'wouter';
import '/src/componentes/perfil/PerfilPag.css';

const BACKEND_URL = 'http://localhost:3000';

export default function PerfilVista({ perfil, esMiPerfil, siguiendo, onFollowToggle, token }) {
    if (!perfil) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="containerperfil">
            <div className="profile-content">
                <div className="avatar-container">
                    <img 
                        className="perfil-foto" 
                        src={perfil.url_avatar ? `${perfil.url_avatar}` : '/src/img/perfil.webp'} 
                        alt={perfil.nombre_usuario ?? perfil.nombre}
                    />
                    <div className="dot-decoration"></div>
                </div>
                

                {/* Nombre con o sin ícono de editar */}
                {esMiPerfil ? (
                    <div className="editar">
                        <h2 className="nombre">{perfil.nombre ?? perfil.nombre_real ?? ''}</h2>
                        <Link href={`/perfil/${perfil.id}/editarperfil`}>
                            <img src="/src/img/editar.webp" alt="Editar Perfil" />
                        </Link>
                    </div>
                ) : (
                    <h2 className="nombre">{perfil.nombre}</h2>
                )}

                <h2 className='username'>{perfil.nombre_usuario ?? perfil.nombreUsuario ?? ''}</h2>

                {/* Botón según el contexto */}
                {!esMiPerfil && (
                    <button
                        className="follow-button"
                        onClick={onFollowToggle}
                        style={{
                            backgroundColor: siguiendo ? "var(--secundario2)" : "var(--secundario1)",
                        }}
                    >
                        {siguiendo ? "Seguido" : "Seguir"}
                    </button>
                )}

                {/* Estadísticas */}
                <div className="stats">
                    <div className="stat-item">
                        <div className="stat-number">{perfil.reseñas ?? perfil.reviews ?? 0}</div>
                        <div className="stat-label">Reseñas</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">{perfil.seguidores ?? perfil.followers ?? 0}</div>
                        <div className="stat-label">Seguidores</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">{perfil.seguidos ?? perfil.following ?? 0}</div>
                        <div className="stat-label">Seguidos</div>
                    </div>
                </div>

                {/* Biografía */}
                <p className="bio">
                    {perfil.biografia ?? perfil.bio ?? "Este usuario no tiene biografía."}
                </p>
            </div>
        </div>
    );
}