import React from 'react';
import '/src/componentes/administracion/admin.css';


const Autores = () => {

    const autores = [
        {
            "id": 1,
            "nombre": "Jorge Borges",
            "libros": 123,
            "nacionalidad": "Argentino",
            "fechaRegistro": "2023-01-23",
        },
        {
            "id": 2,
            "nombre": "Jorge Borges",
            "libros": 123,
            "nacionalidad": "Argentino",
            "fechaRegistro": "2023-01-23",
        },
        {
            "id": 3,
            "nombre": "Jorge Borges",
            "libros": 123,
            "nacionalidad": "Argentino",
            "fechaRegistro": "2023-01-23",
        },
        {
            "id": 4,
            "nombre": "Jorge Borges",
            "libros": 123,
            "nacionalidad": "Argentino",
            "fechaRegistro": "2023-01-23",
        }


    ]
    return (
        <>
            <table id="t01">
                <tr>
                    <th>ID</th>
                    <th>AUTOR</th>
                    <th>LIBROS</th>
                    <th>NACIONALIDAD</th>
                    <th>FECHA REGISTRO</th>
                    <th>ACCIONES</th>
                </tr>
                {autores.map((autor) => (
                    <tr>
                        <td>{autor.id}</td>
                        <td>
                            <p>{autor.nombre}</p>
                        </td>
                        <td>{autor.libros}</td>
                        <td>{autor.nacionalidad}</td>
                        <td>{autor.fechaRegistro}</td>
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
export default Autores;