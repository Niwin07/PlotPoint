import React from 'react';
import '/src/componentes/administracion/admin.css';


const Usuarios = () => {
    const usuarios = [
        {
            "id": 1,
            "nombre": "Maria_Jose_Rodriguez2006",
            "correo": "podroso@gmail.com",
            "actividad": 23,
            "seguidores": 12,
            "fechaRegistro": "2023-01-23",
        },
        {
            "id": 2,
            "nombre": "Maria_Jose_Rodriguez2006",
            "correo": "podroso@gmail.com",
            "actividad": 23,
            "seguidores": 12,
            "fechaRegistro": "2023-01-23",
        },
        {
            "id": 3,
            "nombre": "Maria_Jose_Rodriguez2006",
            "correo": "podroso@gmail.com",
            "actividad": 23,
            "seguidores": 12,
            "fechaRegistro": "2023-01-23",
        },
        {
            "id": 4,
            "nombre": "Maria_Jose_Rodriguez2006",
            "correo": "podroso@gmail.com",
            "actividad": 23,
            "seguidores": 12,
            "fechaRegistro": "2023-01-23",
        },
       
    ]
    return (
        <>
            <table id="t01">
                <tr>
                    <th>ID</th>
                    <th>USUARIO</th>
                    <th>ACTIVIDAD</th>
                    <th>SEGUIDORES</th>
                    <th>FECHA REGISTRO</th>
                    <th>ACCIONES</th>
                </tr>
                {usuarios.map((usuario) => (
                    <tr>
                        <td>{usuario.id}</td>
                        <td>
                            <p>{usuario.nombre}</p>
                            {usuario.correo}
                        </td>
                        <td>{usuario.actividad} reseñas</td>
                        <td>{usuario.seguidores}</td>
                        <td>{usuario.fechaRegistro}</td>
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
export default Usuarios;