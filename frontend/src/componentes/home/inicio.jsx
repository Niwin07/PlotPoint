import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { Link } from "wouter";
import '/src/componentes/home/inicio.css';


const Inicio = () => {

    const [mejoresCalificados, setMejoresCalificados] = useState([]);
    const [masGustados, setMasGustados] = useState([]);
    const [seleccionParaTi, setSeleccion] = useState([]);
    useEffect(() => {
        
        const fetchDatosInicio = async () => {
            try {
                const peticionMejores = axios.get('http://localhost:3000/api/libros?promedio=true');
                const peticionGustados = axios.get('http://localhost:3000/api/likes/libro/gustados');
                const peticionSeleccion = axios.get('http://localhost:3000/api/libros?random=true')
                const [resMejores, resGustados, resSeleccion] = await Promise.all([
                    peticionMejores,
                    peticionGustados,
                    peticionSeleccion
                ]);

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
        <div class="container">
            <section class="section">
                <h1>Los mejores calificados </h1>
                <div class="book-grid">
                    {mejoresCalificados.map((libro) => (
                        <div key={libro.id} className="book-item">
                            <Link href={`/libro/${libro.id}`}>
                                <img src={libro.url_portada} alt={libro.titulo}></img>
                            </Link>
                        </div>
                    ))}
                </div>
            </section >

            <section class="section">
                <h1>Mas gustados</h1>
                <div class="book-grid">
                    {masGustados.map((gustado) => (
                        <div key={gustado.id} className="book-item">
                            <Link href={`/libro/${gustado.id}`}>
                                <img src={gustado.url_portada} alt={gustado.titulo}></img>
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            <section class="section">
                <h1>Nuestra seleccion para ti</h1>
                <div class="book-grid">
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