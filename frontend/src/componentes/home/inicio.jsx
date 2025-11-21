import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { Link } from "wouter";
import '/src/componentes/home/inicio.css';

const Inicio = () => {

    // definimos los estados para cada sección
    const [mejoresCalificados, setMejoresCalificados] = useState([]);
    const [masGustados, setMasGustados] = useState([]);
    const [seleccionParaTi, setSeleccion] = useState([]);

    // useEffect con []: se ejecuta UNA sola vez cuando se carga la pagina
    useEffect(() => {
        
        const fetchDatosInicio = async () => {
            try {
                // con Promise.all: mandamos las 3 peticiones en paralelo
                const [resMejores, resGustados, resSeleccion] = await Promise.all([
                    axios.get('http://localhost:3000/api/libros?promedio=true'),
                    axios.get('http://localhost:3000/api/likes/libro/gustados'),
                    axios.get('http://localhost:3000/api/libros?random=true')
                ]);

                // verificamos antes de setear los datos 
                if (resMejores.data.status === 'ok') {
                    console.log(resMejores.data.libros);
                    setMejoresCalificados(resMejores.data.libros);
                }

                if (resGustados.data.status === 'ok') {
                    console.log(resGustados.data.libros);
                    setMasGustados(resGustados.data.libros);
                }

                if (resSeleccion.data.status === 'ok'){
                    console.log(resSeleccion.data.libros);
                    setSeleccion(resSeleccion.data.libros);
                }

            } catch (error) {
                console.error('Error al cargar datos de inicio:', error);
            }
        };

        fetchDatosInicio();
    }, []);


    return (
        <div className="container">
            <section className="section">
                <h1>Los mejores calificados </h1>
                <div className="book-grid">
                    {/* .map recorre el array y crea un div por cada libro */}
                    {mejoresCalificados.map((libro) => (
                        // 'key' ayuda a React a identificar cada item como uno unico
                        <div key={libro.id} className="book-item">
                            <Link href={`/libro/${libro.id}`}>
                                <img src={libro.url_portada} alt={libro.titulo}></img>
                            </Link>
                        </div>
                    ))}
                </div>
            </section >

            <section className="section">
                <h1>Mas gustados</h1>
                <div className="book-grid">
                    {masGustados.map((gustado) => (
                        <div key={gustado.id} className="book-item">
                            <Link href={`/libro/${gustado.id}`}>
                                <img src={gustado.url_portada} alt={gustado.titulo}></img>
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            <section className="section">
                <h1>Nuestra seleccion para ti</h1>
                <div className="book-grid">
                    {seleccionParaTi.map((favorito) => (
                        <div key={favorito.id} className="book-item">
                            <Link href={`/libro/${favorito.id}`}>
                                <img src={favorito.url_portada} alt={favorito.titulo}></img>
                            </Link>
                        </div>
                    ))}
                </div>
            </section>
        </div >
    );
};
export default Inicio;