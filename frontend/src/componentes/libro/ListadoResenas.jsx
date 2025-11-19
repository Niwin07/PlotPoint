import Rating from "react-rating";
import { Link } from "wouter";

function TarjetaResena({ resena, backendUrl }) {
    return (
        <div className="review-card">
            <Link href={`/resenalibro/${resena.id || resena._id}`}>
                <div className="review-header">
                    <div className="avatar-foto">
                        <img
                            src={resena.url_avatar ? `${backendUrl}${resena.url_avatar}` : ''}
                            alt={resena.nombre_usuario}
                        />
                    </div>
                    <p className="review-user">{resena.nombre_usuario}</p>
                    <div className="review-stars">
                        <Rating
                            initialRating={resena.rating ?? resena.puntuacion}
                            fractions={2}
                            readonly
                            emptySymbol={<span className="star empty">☆</span>}
                            fullSymbol={<span className="star full">★</span>}
                        />
                    </div>
                </div>
                <p className="review-text">{resena.opinion ?? resena.contenido}</p>
            </Link>
        </div>
    );
}

export default function ListadoResenas({ resenas, backendUrl }) {
    return (
        <div className="reviews2">
            <h2>Reseñas</h2>
            {resenas.length === 0 && <p>No hay reseñas aún</p>}
            {resenas.map((resena) => (
                <TarjetaResena
                    key={resena.id || resena._id}
                    resena={resena}
                    backendUrl={backendUrl}
                />
            ))}
        </div>
    );
}