import { Link } from 'wouter';
import '/src/componentes/home/inicio.css';

export default function MeGustas({ libros, loading }) {
    if (loading) {
        return <div style={{ padding: '20px', color: 'white' }}>Cargando 'Me Gustas'...</div>;
    }

    if (libros.length === 0) {
        return <div style={{ padding: '20px', color: 'white' }}>A este usuario todavía no le gusta ningún libro.</div>;
    }

    return (
        <div className="container">
            <section className="section">
                <div className="book-grid">
                    {libros.map((libro) => (
                        <div key={libro.libro_id} className="book-item">
                            <Link href={`/libro/${libro.libro_id}`}>
                                <img src={libro.url_portada} alt={libro.titulo} />
                            </Link>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}