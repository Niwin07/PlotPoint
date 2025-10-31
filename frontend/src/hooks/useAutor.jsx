import { useState } from 'react';

export default function useAutor() {
    const [id, setId] = useState(null);
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [nacionalidad, setNacionalidad] = useState('');

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

    return [
        { id, nombre, apellido, nacionalidad },
        setDato
    ];
}