import React from 'react';
import '/src/componentes/administracion/admin.css';


const Generos = () => {

     const generos = [
        {
            "id": 1,
            "nombre": "Ficcion",
            "descripcion": "Donde la accion y el suspenso se roban el escenario",
        },
        {
            "id": 2,
            "nombre": "Ficcion",
            "descripcion": "Donde la accion y el suspenso se roban el escenario",
        },
        {
            "id": 3,
            "nombre": "Ficcion",
            "descripcion": "Donde la accion y el suspenso se roban el escenario",
        },
        {
            "id": 4,
            "nombre": "Ficcion",
            "descripcion": "Donde la accion y el suspenso se roban el escenario",
        },
      



    ]
    return (
        <>
            <table id="t01">
                <tr>
                    <th>ID</th>
                    <th>GENERO</th>
                    <th>DESCRIPCION</th>
                    <th>ACCIONES</th>
                </tr>
                {generos.map((genero) => (
                    <tr>
                        <td>{genero.id}</td>
                        <td>
                            <p>{genero.nombre}</p>
                        </td>
                        <td>{genero.descripcion}</td>
                        
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
export default Generos;