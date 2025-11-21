import { useState } from 'react';

export default function useComentario() { 
    // definimos el estado para el contenido del comentario
    const [contenido, setContenido] = useState('');

    // dejamos el switch por si en algun momento de la vida de esto los comentarios llegasen a tener mas campos
    const setDato = (campo, valor) => {
        switch (campo) {
            case 'contenido':
                setContenido(valor);
                break;
            default:
                break;
        }
    };

    // devolvemos todo en un array  
    return [
        { contenido },
        setDato
    ];
}