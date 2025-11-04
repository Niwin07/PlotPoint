import { useState } from 'react';

export default function useUsuario() {
    const [id, setId] = useState(null);
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasenaHash, setContrasenaHash] = useState('');
    const [nombre, setNombre] = useState('');
    const [biografia, setBiografia] = useState('');
    const [urlAvatar, setUrlAvatar] = useState('');
    const [rol, setRol] = useState('usuario');
    const [fechaCreacion, setFechaCreacion] = useState('');

    const setDato = (campo, valor) => {
        switch (campo) {
            case 'id':
                setId(valor);
                break;
            case 'nombreUsuario':
                setNombreUsuario(valor);
                break;
            case 'correo':
                setCorreo(valor)
                break
            case 'contrasenaHash':
                setContrasenaHash(valor);
                break;
            case 'nombre':
                setNombre(valor);
                break;
            case 'biografia':
                setBiografia(valor);
                break;
            case 'urlAvatar':
                setUrlAvatar(valor);
                break;
            case 'rol':
                setRol(valor);
                break;
            case 'fechaCreacion':
                setFechaCreacion(valor);
                break;
            default:
                break;
        }
    };

    return [
        { id, nombreUsuario,correo, contrasenaHash, nombre, biografia, urlAvatar, rol, fechaCreacion },
        setDato
    ];
}