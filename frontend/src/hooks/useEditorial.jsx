import { useState } from 'react';

export default function useEditorial() {
    const [id, setId] = useState(null);
    const [nombre, setNombre] = useState('');
    const [pais, setPais] = useState('');

    const setDato = (campo, valor) => {
        switch (campo) {
            case 'id':
                setId(valor);
                break;
            case 'nombre':
                setNombre(valor);
                break;
            case 'pais':
                setPais(valor);
                break;
            default:
                break;
        }
    };

    return [
        { id, nombre, pais },
        setDato
    ];
}