import { useState } from 'react';

export default function useLibro() {
    // define el useState para cada campo de la bd
    const [id, setId] = useState(null);
    const [titulo, setTitulo] = useState('');
    const [isbn, setIsbn] = useState('');
    const [sinopsis, setSinopsis] = useState('');
    const [urlPortada, setUrlPortada] = useState(null);
    const [paginas, setPaginas] = useState('');
    const [anioPublicacion, setAnioPublicacion] = useState('');
    const [editorialId, setEditorialId] = useState(null);
    const [autorId, setAutorId] = useState(null);
    const [generos, setGeneros] = useState([]);


    // recibe QUE cambiar (campo) y su NUEVO VALOR (valor), ironico xd.

    const setDato = (campo, valor) => {
        switch (campo) {
            case 'id':
                setId(valor); // si el campo es 'id', usa la herramienta setId
                break;
            case 'titulo':
                setTitulo(valor); // si es 'titulo', usa setTitulo
                break;            //y asi seguimos con cada uno xd
            case 'isbn':
                setIsbn(valor);
                break;
            case 'sinopsis':
                setSinopsis(valor);
                break;
            case 'urlPortada':
                setUrlPortada(valor);
                break;
            case 'paginas':
                setPaginas(valor);
                break;
            case 'anioPublicacion':
                setAnioPublicacion(valor);
                break;
            case 'editorialId':
                setEditorialId(valor);
                break;
            case 'autorId':
                setAutorId(valor);
                break;
            case 'generos':
                setGeneros(valor);
                break;
            default:
                break; //si se envia uno que no exite entre los casos, no hace nada
        }
    };

    return [
        // devolvemos un objeto con todos los datos limpitos listos para leer o enviar a la bd
        { id, titulo, isbn, sinopsis, urlPortada, paginas, anioPublicacion, editorialId, autorId, generos },
        // y la función única para modificar cualquier dato de arriba
        setDato
    ];
}