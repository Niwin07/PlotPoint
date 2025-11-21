import { useState } from 'react';

export default function useEditorial() {
    // estados de la editorial
    const [id, setId] = useState(null);
    const [nombre, setNombre] = useState('');
    const [pais, setPais] = useState('');

    // recibe QUE cambiar (campo) y su NUEVO VALOR (valor) y acorde al caso llama al set correspondiente
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

    // devolvemos toodo en un array
    return [
        { id, nombre, pais },
        setDato
    ];
}