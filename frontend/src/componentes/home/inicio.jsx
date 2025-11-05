import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import '/src/componentes/home/inicio.css';

const Inicio = () => {

    const [mejoresCalificados, setMejoresCalificados] = useState([]);

    useEffect(() => {
        const fetchMejoresCalificados = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/libros?promedio=true');
                
                if (response.data.status === 'ok') {
                    console.log(response.data.libros)
                    setMejoresCalificados(response.data.libros); 
                }
            } catch (error) {
                console.error('Error al cargar libros más gustados:', error);
            }
        };

        fetchMejoresCalificados();
    }, []); 

    const gustados = [
        {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 1,
            urlPortada: "/src/img/libro.webp",
        },
    ];

    const favoritos = [
        {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 1,
            urlPortada: "/src/img/libro.webp",
        },
    ];

    return (
        <div class="container">
            <section class="section">
                <h1>Los mejores calificados </h1>
                <div class="book-grid">
                    {mejoresCalificados.map((libro) => (
                        <div key={libro.id} className="book-item">
                            <a href='/libro'>
                                <img src={libro.url_portada} alt={libro.titulo}></img>
                            </a>
                        </div>
                    ))}

                </div>
            </section >

            <section class="section">
                <h1>Mas gustados</h1>
                <div class="book-grid">
                    {gustados.map((gustado) => (
                        <div key={gustado.id} className="book-item">
                            <a href='/libro'>
                                <img src={gustado.urlPortada} alt={gustado.titulo}></img>
                            </a>
                        </div>
                    ))}
                </div>
            </section>

            <section class="section">
                <h1>Favoritos de tus amigos</h1>
                <div class="book-grid">
                    {favoritos.map((favorito) => (
                        <div key={favorito.id} className="book-item">
                            <a href='/libro'>
                                <img src={favorito.urlPortada} alt={favorito.titulo}></img>
                            </a>
                        </div>
                    ))}
                </div>
            </section>
        </div >
    );
};
export default Inicio;