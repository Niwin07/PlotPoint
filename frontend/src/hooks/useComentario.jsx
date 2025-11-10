import { useState } from 'react';

export default function useReseña() {
    const [contenido, setContenido] = useState('');

    const setDato = (campo, valor) => {
        switch (campo) {
            
            case 'contenido':
                setContenido(valor);
                break;
            
            default:
                break;
        }
    };

    return [
        { contenido },
        setDato
    ];
}