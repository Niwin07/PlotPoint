import React from 'react';
import '/src/componentes/home/inicio.css';



const MeGustas = () => {

    //simula un array de libros a las cuales TE GUSTARON A TI o a UN USUARIO en especifico

    const libros = [
        {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 1,
            urlPortada: '/src/img/libro.webp',
            
        },
        {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 2,
            urlPortada: '/src/img/libro.webp',
            
        },
        {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 3,
            urlPortada: '/src/img/libro.webp',
            
        },
        {
            titulo: "Harry Potter and the Deathly Hallows",
            id: 4,
            urlPortada: '/src/img/libro.webp',
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
                                <img src={libro.urlPortada} alt={libro.titulo}></img>
                            </a>
                        </div>
                    ))}
                    
                   
                </div>
            </section>
        </div >



    );
};
export default MeGustas;