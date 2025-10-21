import React from 'react';
import '../css/inicio.css';


const Inicio = () => {

    //simulacion de datos
    const populares = [
        {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 1,
            portada: "/src/img/libro.webp",
        },
        {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 2,
            portada: "/src/img/libro.webp",
        },
        {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 3,
            portada: "/src/img/libro.webp",
        },
        {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 4,
            portada: "/src/img/libro.webp",
        },
        {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 5,
            portada: "/src/img/libro.webp",
        },
    ];

    const leidos = [
        {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 1,
            portada: "/src/img/libro.webp",
        },
        {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 2,
            portada: "/src/img/libro.webp",
        },
        {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 3,
            portada: "/src/img/libro.webp",
        },
        {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 4,
            portada: "/src/img/libro.webp",
        },
        {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 5,
            portada: "/src/img/libro.webp",
        },
          {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 6,
            portada: "/src/img/libro.webp",
        }
    ];

    const favoritos = [
        {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 1,
            portada:"/src/img/libro.webp",
        },
        {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 2,
            portada: "/src/img/libro.webp",
        },
        {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 3,
            portada: "/src/img/libro.webp",
        },
        {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 4,
            portada: "/src/img/libro.webp",
        },
        {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 5,
            portada: "/src/img/libro.webp",
        },
    ];
    return (
        <div class="container">
            <section class="section">
                <h1>Lo popular esta semana</h1>
                <div class="book-grid">

                    {/*imprimimos el array de libros mas populares */}
                    {populares.map((popular) => (
                        <div key={popular.id} className="book-item">
                            <a href='/libro'>
                                <img src={popular.portada} alt={popular.titulo}></img>
                            </a>
                        </div>
                    ))}

                </div>


            </section >

            <section class="section">
                <h1>Mas leídos</h1>
                <div class="book-grid">

                    {/*imprimimos el array de libros mas leidos */}
                    {leidos.map((leido) => (
                        <div key={leido.id} className="book-item">
                            <a href='/libro'>
                                <img src={leido.portada} alt={leido.titulo}></img>
                            </a>
                        </div>
                    ))}
                </div>
            </section>

            <section class="section">
                <h1>Favoritos de tus amigos</h1>
                <div class="book-grid">

                    {/*imprimimos el array de los libros favoritos de tus amigos (gente que sigues)*/}
                    {favoritos.map((favorito) => (
                        <div key={favorito.id} className="book-item">
                            <a href='/libro'>
                                <img src={favorito.portada} alt={favorito.titulo}></img>
                            </a>
                        </div>
                    ))}
                </div>
            </section>
        </div >



    );
};
export default Inicio;