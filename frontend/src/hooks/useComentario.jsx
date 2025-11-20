import { useState } from 'react';

export default function useComentario() {
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