import { useState } from 'react';

export default function useGenero() {
    // definimos los estados
    const [id, setId] = useState(null);
    const [nombre, setNombre] = useState('');      
    const [descripcion, setDescripcion] = useState('');

    // recibe QUE cambiar (campo) y su NUEVO VALOR (valor).
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

    // devolvemos todo en un array
    return [
        { id, nombre, descripcion },
        setDato
    ];
}