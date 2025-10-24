import React, { useState } from 'react';
import '/src/componentes/administracion/admin.css';


const Generos = () => {
    const [buscador, setBuscador] = useState('');
     const [generos, setGeneros] = useState([
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
    ])

    const Borrar = (id) => {
        setGeneros(generos.filter(genero => genero.id !== id));
    };

    const Editar = (id) => {
        alert(`Editar genero ${id}`);
    };

    const Buscar = () => {
        alert(`Buscando: ${buscador}`);
    };

    const Nuevo = () => {
        alert('Crear nuevo genero');
    };

    return (
        <div>
            <div className='acciones'>
                <input
                    type="text"
                    placeholder="Buscar genero"
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
                            <button className='Borrar' onClick={() => Borrar(genero.id)}>Borrar</button>
                            <button className='Editar' onClick={() => Editar(genero.id)}>Editar</button>
                        </td>
                    </tr>

                ))}

            </table>
        </div>
    );
};
export default Generos;