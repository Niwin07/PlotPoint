import React from 'react';
import '../css/inicio.css';
import portadaHP from '/src/img/libro.webp'


const Inicio = () => {

    //simulacion de datos
    const populares = [
        {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 1,
            portada: portadaHP,
            texto: "An unforgettable experience that blends emotion, tension, and beauty in perfect harmony. The characters feel alive, their choices meaningful, and the world richly detailed. Every twist adds weight to the story, creating a rhythm that never loses momentum. It’s the kind of book that leaves you quiet afterward, lost in thought, replaying moments and lines long after the final page is turned.",
            color: "blue",
        },
        {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 2,
            portada: portadaHP,
            texto: "so heartbreaking i lowkey started to feel bad for watching sitting down",
            color: "magenta",
        },
        {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 3,
            portada: portadaHP,
            texto: "so heartbreaking i lowkey started to feel bad for watching sitting down",
            color: "limegreen",
        },
        {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 4,
            portada: portadaHP,
            texto: "so heartbreaking i lowkey started to feel bad for watching sitting down",
            color: "goldenrod",
        },
        {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 5,
            portada: portadaHP,
            texto: "so heartbreaking i lowkey started to feel bad for watching sitting down",
            color: "goldenrod",
        },
    ];

    const leidos = [
        {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 1,
            portada: portadaHP,
            texto: "An unforgettable experience that blends emotion, tension, and beauty in perfect harmony. The characters feel alive, their choices meaningful, and the world richly detailed. Every twist adds weight to the story, creating a rhythm that never loses momentum. It’s the kind of book that leaves you quiet afterward, lost in thought, replaying moments and lines long after the final page is turned.",
            color: "blue",
        },
        {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 2,
            portada: portadaHP,
            texto: "so heartbreaking i lowkey started to feel bad for watching sitting down",
            color: "magenta",
        },
        {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 3,
            portada: portadaHP,
            texto: "so heartbreaking i lowkey started to feel bad for watching sitting down",
            color: "limegreen",
        },
        {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 4,
            portada: portadaHP,
            texto: "so heartbreaking i lowkey started to feel bad for watching sitting down",
            color: "goldenrod",
        },
        {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 5,
            portada: portadaHP,
            texto: "so heartbreaking i lowkey started to feel bad for watching sitting down",
            color: "goldenrod",
        },
          {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 6,
            portada: portadaHP,
            texto: "so heartbreaking i lowkey started to feel bad for watching sitting down",
            color: "goldenrod",
        }
    ];

    const favoritos = [
        {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 1,
            portada: portadaHP,
            texto: "An unforgettable experience that blends emotion, tension, and beauty in perfect harmony. The characters feel alive, their choices meaningful, and the world richly detailed. Every twist adds weight to the story, creating a rhythm that never loses momentum. It’s the kind of book that leaves you quiet afterward, lost in thought, replaying moments and lines long after the final page is turned.",
            color: "blue",
        },
        {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 2,
            portada: portadaHP,
            texto: "so heartbreaking i lowkey started to feel bad for watching sitting down",
            color: "magenta",
        },
        {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 3,
            portada: portadaHP,
            texto: "so heartbreaking i lowkey started to feel bad for watching sitting down",
            color: "limegreen",
        },
        {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 4,
            portada: portadaHP,
            texto: "so heartbreaking i lowkey started to feel bad for watching sitting down",
            color: "goldenrod",
        },
        {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 5,
            portada: portadaHP,
            texto: "so heartbreaking i lowkey started to feel bad for watching sitting down",
            color: "goldenrod",
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
                                <img src="/src/img/libro.webp" alt="Harry Potter and the Deathly Hallows"></img>
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
                                <img src="/src/img/libro.webp" alt="Harry Potter and the Deathly Hallows"></img>
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
                                <img src="/src/img/libro.webp" alt="Harry Potter and the Deathly Hallows"></img>
                            </a>
                        </div>
                    ))}
                </div>
            </section>
        </div >



    );
};
export default Inicio;