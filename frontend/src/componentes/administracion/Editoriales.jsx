import React from 'react';
import '/src/componentes/administracion/admin.css';


const Editoriales = () => {

    const editoriales = [
        {
            "id": 1,
            "nombre": "LibroTeca",
            "pais": "Ecuador",
        },
        {
            "id": 2,
            "nombre": "LibroTeca",
            "pais": "Ecuador",
        },
        {
            "id": 3,
            "nombre": "LibroTeca",
            "pais": "Ecuador",
        },
        {
            "id": 4,
            "nombre": "LibroTeca",
            "pais": "Ecuador",
        },



    ]
    return (
        <>
            <table id="t01">
                <tr>
                    <th>ID</th>
                    <th>EDITORIAL</th>
                    <th>PAIS</th>
                    <th>ACCIONES</th>
                </tr>
                {editoriales.map((editorial) => (
                    <tr>
                        <td>{editorial.id}</td>
                        <td>
                            <p>{editorial.nombre}</p>
                        </td>
                        <td>{editorial.pais}</td>
                        
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
export default Editoriales;