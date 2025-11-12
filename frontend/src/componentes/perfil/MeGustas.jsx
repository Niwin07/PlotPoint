import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '/src/componentes/home/inicio.css';
import { Link } from 'wouter'; // Importar Link

const MeGustas = ({ usuarioId }) => { // Solo necesita el ID del usuario a mostrar
    const BACKEND_URL = "http://localhost:3000";
    const [libros, setLibros] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarMeGustas = async () => {
            setLoading(true);
            if (!usuarioId) return; // No hacer nada si no hay ID

            try {
                // Siempre usa el endpoint público para obtener los favoritos de un usuario
                const url = `${BACKEND_URL}/api/likes/usuario/${usuarioId}`;
                const response = await axios.get(url);
                
                setLibros(response.data.libros_favoritos || []);

            } catch (err) {
                console.error("error:", err);
            } finally {
                setLoading(false);
            }
        };

        cargarMeGustas();
    }, [usuarioId]); // Se actualiza solo si el usuarioId cambia

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
                                <img src={libro.url_portada} alt={libro.titulo}></img>
                            </Link>
                        </div>
                    ))}
                </div>
            </section>
        </div >
    );
};

export default MeGustas;