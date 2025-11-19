import ReseñaCard from "../home/ReseñaCard";
import '/src/componentes/home/ReseñaCard.css';

export default function ListaReseñas({ reseñas, loading, miId, obtenerReseñas }) {
    if (loading) {
        return <div style={{ padding: '20px', color: 'white' }}>Cargando reseñas...</div>;
    }

    if (reseñas.length === 0) {
        return <div style={{ padding: '20px', color: 'white' }}>Este usuario aún no tiene reseñas.</div>;
    }

    return (
        <div className="lista-reseñas">
            {reseñas.map((reseña) => (
                <ReseñaCard
                    key={reseña.id}
                    id={reseña.id}
                    libro_titulo={reseña.libro_titulo}
                    nombre_usuario={reseña.nombre_usuario}
                    url_portada={reseña.url_portada}
                    contenido={reseña.contenido}
                    puntuacion={reseña.puntuacion}
                    url_avatar={reseña.url_avatar}
                    miId={miId}
                    usuario_id={reseña.usuario_id}
                    onReseñaEliminada={() => obtenerReseñas()}
                />
            ))}
        </div>
    );
}
