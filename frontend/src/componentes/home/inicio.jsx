import React from 'react';
import '/src/componentes/home/inicio.css';


const Inicio = () => {

    //simulacion de datos
    const populares = [
        {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 1,
            urlPortada: "https://books.google.com/books/content?id=mnf9mixwzBAC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
        },
        {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 2,
            urlPortada: "/src/img/libro.webp",
        },
        {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 3,
            urlPortada: "/src/img/libro.webp",
        },
        {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 4,
            urlPortada: "/src/img/libro.webp",
        },
        {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 5,
            urlPortada: "/src/img/libro.webp",
        },
    ];

    const leidos = [
        {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 1,
            urlPortada: "/src/img/libro.webp",
        },
        {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 2,
            urlPortada: "/src/img/libro.webp",
        },
        {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 3,
            urlPortada: "/src/img/libro.webp",
        },
        {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 4,
            urlPortada: "/src/img/libro.webp",
        },
        {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 5,
            urlPortada: "/src/img/libro.webp",
        },
        {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 6,
            urlPortada: "/src/img/libro.webp",
        }
    ];

    const favoritos = [
        {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 1,
            urlPortada: "/src/img/libro.webp",
        },
        {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 2,
            urlPortada: "/src/img/libro.webp",
        },
        {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 3,
            urlPortada: "/src/img/libro.webp",
        },
        {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 4,
            urlPortada: "/src/img/libro.webp",
        },
        {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 5,
            urlPortada: "/src/img/libro.webp",
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
                                <img src={popular.urlPortada} alt={popular.titulo}></img>
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
                                <img src={leido.urlPortada} alt={leido.titulo}></img>
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