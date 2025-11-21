import { useState } from 'react';

export default function useAutor() {
    // definimos los estados
    const [id, setId] = useState(null);
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [nacionalidad, setNacionalidad] = useState('');

    // recibe QUE cambiar (campo) y su NUEVO VALOR (valor) y acorde al caso llama al set correspondiente
    const setDato = (campo, valor) => {
        switch (campo) {
            case 'id':
                setId(valor);
                break;
            case 'nombre':
                setNombre(valor);
                break;
            case 'apellido':
                setApellido(valor);
                break;
            case 'nacionalidad':
                setNacionalidad(valor);
                break;
            default:
                break;
        }
    };

    // devolvemos todo en un array
    return [
        { id, nombre, apellido, nacionalidad },
        setDato
    ];
}