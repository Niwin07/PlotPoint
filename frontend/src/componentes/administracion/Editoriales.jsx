import React, { useState } from 'react';
import '/src/componentes/administracion/admin.css';


const Editoriales = () => {
    const [buscador, setBuscador] = useState('');
    const [editoriales, setEditoriales] = useState([
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
    ])
    const Borrar = (id) => {
        setEditoriales(editoriales.filter(editorial => editorial.id !== id));
    };

    const Editar = (id) => {
        alert(`Editar editorial ${id}`);
    };

    const Buscar = () => {
        alert(`Buscando: ${buscador}`);
    };

    const Nuevo = () => {
        alert('Crear nueva editorial');
    };


    return (
        <div>
             <div className='acciones'>
                <input
                    type="text"
                    placeholder="Buscar editorial"
                    value={buscador}
                    onChange={(e) => setBuscador(e.target.value)}
                    className='InputAdmin'
                />

                <button className='Buscar' onClick={Buscar}>
                    Buscar
                </button>
                <button className='Nuevo' onClick={Nuevo}>
                    Nuevo
                </button>
            </div>
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
                            <button className='Borrar' onClick={() => Borrar(editorial.id)}>Borrar</button>
                            <button className='Editar' onClick={() => Editar(editorial.id)}>Editar</button>
                        </td>
                    </tr>

                ))}

            </table>
        </div>
    );
};
export default Editoriales;