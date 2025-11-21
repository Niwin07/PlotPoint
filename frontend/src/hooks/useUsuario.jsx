import { useState } from 'react';

export default function useUsuario() {
    // definimos los estados
    // definimos un valor por defecto para rol, pequeña medida de seguridad  
    const [id, setId] = useState(null);
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasenaHash, setContrasenaHash] = useState(''); // guardamos el hash, no la contraseña
    const [nombre, setNombre] = useState('');
    const [biografia, setBiografia] = useState('');
    const [urlAvatar, setUrlAvatar] = useState('');
    const [rol, setRol] = useState('usuario'); 
    const [fechaCreacion, setFechaCreacion] = useState('');

    //  recibe QUE cambiar (campo) y su NUEVO VALOR (valor) y acorde al caso llama al set correspondiente
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
                setRol(valor); // esto esta al cohete, solo cuando se inicia sesion el rol cambia, pero en admin no se cambia el rol
                break;
            case 'fechaCreacion':
                setFechaCreacion(valor);
                break;
            default:
                break;
        }
    };

    // mandamos todo en un array
    // posicion 0: objeto con datos. posición 1: Función para actualizar.
    return [
        { id, nombreUsuario, correo, contrasenaHash, nombre, biografia, urlAvatar, rol, fechaCreacion },
        setDato
    ];
}