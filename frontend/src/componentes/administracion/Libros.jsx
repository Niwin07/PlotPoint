import React from 'react';
import '/src/componentes/administracion/admin.css';


const Libros = () => {
    const libros = [
        {
            "id": 1,
            "Titulo": "Harry Potter",
            "Autor": "Jw .Holling",
            "Generos": ["Accion", "Ficcion"],
            "Reseñas": 13,
            "Calificacion": 4.5,
        },
        {
            "id": 2,
            "Titulo": "Harry Potter",
            "Autor": "Jw .Holling",
            "Generos": ["Accion", "Ficcion"],
            "Reseñas": 13,
            "Calificacion": 4.5,
        },
        {
            "id": 3,
            "Titulo": "Harry Potter",
            "Autor": "Jw .Holling",
            "Generos": ["Accion", "Ficcion", "Terror"],
            "Reseñas": 13,
            "Calificacion": 4.5,
        },
        {
            "id": 4,
            "Titulo": "Harry Potter",
            "Autor": "Jw .Holling",
            "Generos": ["Accion", "Ficcion"],
            "Reseñas": 13,
            "Calificacion": 4.5,
        },
    ]
    return (
        <>
            <table id="t01">
                <tr>
                    <th>ID</th>
                    <th>LIBRO</th>
                    <th>GENEROS</th>
                    <th>RESEÑAS</th>
                    <th>CALIFICACION</th>
                    <th>ACCIONES</th>
                </tr>
                {libros.map((libro) => (
                    <tr>
                        <td>{libro.id}</td>
                        <td>
                            <p>{libro.Titulo}</p>
                            {libro.Autor}
                        </td>
                        <td>{libro.Generos[0]} {libro.Generos[1]} {libro.Generos[2]}</td>
                        <td>{libro.Reseñas}</td>
                        <td>{libro.Calificacion}</td>
                        <td>
                            <button className='Borrar'>Borrar</button>
                            <button className='Editar'>Editar</button>
                        </td>
                    </tr>

                ))}
               
            </table>
        </>
    );
};
export default Libros;