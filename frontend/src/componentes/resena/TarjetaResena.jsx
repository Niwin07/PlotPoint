import Rating from "react-rating";
import { Link } from "wouter";
import '/src/componentes/libro/ReviewDetail.css';

export default function TarjetaResena({ resena }) {
    return (
        <div className="main-card">
            <div className="usuario-reseña">
                <Link href={`/perfil/${resena.usuario_id}`}>
                    <img
                        src={resena.url_avatar ? `${resena.url_avatar}` : '/path/to/default/avatar.png'}
                        alt={resena.nombre_usuario}
                        className="foto-perfil"
                    />
                </Link>
                <p className="user-name">{resena.nombre_usuario}</p>
            </div>

            <div className="content">
                <div className="book-info">
                    <p className="book-titulo">{resena.libro_titulo}</p>
                    <div className="estrellas">
                        <Rating
                            initialRating={resena.puntuacion}
                            readonly
                            emptySymbol={<span className="star empty">☆</span>}
                            fullSymbol={<span className="star full">★</span>}
                        />
                    </div>
                    <p className="review">{resena.contenido}</p>
                </div>
                <Link href={`/libro/${resena.libro_id}`}>
                    <img
                        src={resena.url_portada || ''}
                        alt={resena.libro_titulo}
                        className="book-portada"
                    />
                </Link>
            </div>
        </div>
    );
}