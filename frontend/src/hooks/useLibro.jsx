import { useState } from 'react';

export default function useLibro() {
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

    const setDato = (campo, valor) => {
        switch (campo) {
            case 'id':
                setId(valor);
                break;
            case 'titulo':
                setTitulo(valor);
                break;
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
                break;
        }
    };

    return [
        { id, titulo, isbn, sinopsis, urlPortada, paginas, anioPublicacion, editorialId, autorId, generos },
        setDato
    ];
}