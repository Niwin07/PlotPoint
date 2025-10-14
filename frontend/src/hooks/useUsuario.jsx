import { useState } from 'react';
export default function useUsuario() {
    const [emails, setEmails] = useState('');
    const [nombres, setNombres] = useState('');
    const [contraseñas, setContraseñas] = useState('');
   

    const setDato = (campo, valor) => {
        switch (campo) {
            case 'nombres':
                setNombres(valor);
                break;
            case 'emails':
                setEmails(valor);
                break;

            case 'contraseñas':
                setContraseñas(valor);
                break;
            
            default:
                break;

        }
    }
    return [{nombres, emails, contraseñas}, setDato]

}