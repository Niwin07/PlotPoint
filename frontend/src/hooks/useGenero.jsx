import { useState } from 'react';

export default function useGenero() {
    const [id, setId] = useState(null);
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');

    const setDato = (campo, valor) => {
        switch (campo) {
            case 'id':
                setId(valor);
                break;
            case 'nombre':
                setNombre(valor);
                break;
            case 'descripcion':
                setDescripcion(valor);
                break;
            default:
                break;
        }
    };

    return [
        { id, nombre, descripcion },
        setDato
    ];
}