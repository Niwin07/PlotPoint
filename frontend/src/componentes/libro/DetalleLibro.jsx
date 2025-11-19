import Rating from "react-rating";
import './libro.css'

export default function DetalleLibro({ libro, isFavorite, toggleFavorite, abrirModal, backendUrl }) {
    return (
        <>
            <div className="book-header">
                <div className="book-cover-container">
                    <img
                        src={libro.urlPortada || libro.url_portada || ""}
                        alt={libro.titulo}
                        className="book-cover"
                    />
                    <span
                        className={`heart-${isFavorite ? 'active' : ''}`}
                        onClick={toggleFavorite}
                        title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
                    >
                        ♥
                    </span>
                </div>

                <h1 className="book-title">{libro.titulo}</h1>
                <p className="book-info">
                    {(libro.anioPublicacion ?? libro.anio_publicacion) || "—"} - Escrito por {libro.autor_nombre} {libro.autor_apellido}
                </p>
                <p className="book-info">{libro.paginas ?? "—"} páginas</p>
                <p className="book-info">
                    Género: {libro.generos?.map(genero => genero.nombre).join(', ') || '—'}
                </p>
                <p className="book-info">Editorial: {libro.editorial_nombre}</p>
                <p className="book-description">{libro.sinopsis}</p>
            </div>

            <div className="book-rating">
                <div className="rating-score">
                    <p className="score">{libro.promedio ?? libro.promedio_rating ?? 0}</p>
                    <div className="stars">
                        <Rating
                            initialRating={libro.promedio ?? libro.promedio_rating ?? 0}
                            fractions={2}
                            readonly
                            emptySymbol={<span className="star empty medium">☆</span>}
                            fullSymbol={<span className="star full medium">★</span>}
                        />
                    </div>
                    <button className="rate-button" onClick={abrirModal}>
                        CALIFICAR LIBRO
                    </button>
                </div>
            </div>
        </>
    );
}