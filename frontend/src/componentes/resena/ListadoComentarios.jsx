import { Link } from "wouter";

function TarjetaComentario({ comentario, miId, backendUrl, eliminarComentario }) {
    return (
        <div className="comentario-card">
            <div className="review-header">
                <Link href={`/perfil/${comentario.usuario_id}`}>
                    <img
                        src={comentario.url_avatar ? `${backendUrl}${comentario.url_avatar}` : '/path/to/default/avatar.png'}
                        alt={comentario.nombre_usuario}
                        className="foto-perfil"
                    />
                </Link>
                <p className="review-usuario">{comentario.nombre_usuario}</p>
                {Number(comentario.usuario_id) === Number(miId) && (
                    <button
                        className="eliminar-comentario-btn"
                        onClick={() => eliminarComentario(comentario.id)}
                    >
                        Eliminar
                    </button>
                )}
            </div>
            <p className="review-text">{comentario.contenido}</p>
        </div>
    );
}

export default function ListadoComentarios({ comentarios, miId, backendUrl, eliminarComentario }) {
    return (
        <div className="reviews-list">
            {comentarios.length === 0 && (
                <p>No hay comentarios aún. ¡Sé el primero!</p>
            )}

            {comentarios.map((comentario) => (
                <TarjetaComentario
                    key={comentario.id}
                    comentario={comentario}
                    miId={miId}
                    backendUrl={backendUrl}
                    eliminarComentario={(id) => eliminarComentario(id)}
                />
            ))}
        </div>
    );
}