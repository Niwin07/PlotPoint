import { useState } from 'react';

export default function useReseña() {
    // definimos estados para puntuación (estrellas) y el texto de la opinión
    const [puntuacion, setPuntuacion] = useState(0); // numeros desde el 0.5 hasta 5 
    const [contenido, setContenido] = useState('');

    // recibe QUE cambiar (campo) y su NUEVO VALOR (valor).
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

    // devolvemos todo en un array
    return [
        { puntuacion, contenido },
        setDato
    ];
}