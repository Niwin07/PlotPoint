import { useState } from 'react';

export default function useReseña() {
    const [puntuacion, setPuntuacion] = useState(0);
    const [contenido, setContenido] = useState('');

    const setDato = (campo, valor) => {
        switch (campo) {
            case 'puntuacion':
                setPuntuacion(valor);
                break;
            case 'contenido':
                setContenido(valor);
                break;
            
            default:
                break;
        }
    };

    return [
        { puntuacion, contenido },
        setDato
    ];
}