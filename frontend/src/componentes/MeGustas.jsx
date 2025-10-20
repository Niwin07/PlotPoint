import React from 'react';
import '../css/inicio.css';
import portadaHP from '/src/img/libro.webp'


const MeGustas = () => {

    //simula un array de libros a las cuales TE GUSTARON A TI o a UN USUARIO en especifico

    const libros = [
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
    ];
    return (
        <div class="container">
            <section class="section">



                <div class="book-grid">
                    {/* imprimimos el array para que lo vea el usuario */}


                    {libros.map((libro) => (
                        <div key={libro.id} className="book-item">
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
export default MeGustas;