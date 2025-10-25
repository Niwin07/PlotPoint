import React, { useState } from 'react';
import useUsuario from '/src/hooks/useUsuario';
import '/src/componentes/auth/iniciarsesion.css';


const IniciarSesion = () => {
    const [usuario, setDato] = useUsuario();
    const [errores, setErrores] = useState({});
    const [mensaje, setMensaje] = useState('');

    //setea el valor que estas agregando/cambiando 

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name)
        setDato(name, value);
    };

    //realiza una breve validacion en el frontend antes de verificar si los datos existen en el backend, esto es para que no se realizen consultas innecesarias

    const validar = (e) => {
        e.preventDefault();
        let erroresTemp = {};

        //verifica si los valores no sean nulos o si no cumplen con los 6 caracteres minimos
        if (!usuario.nombreUsuario.trim() || usuario.nombreUsuario.length < 6) erroresTemp.nombreUsuario = 'Usuario requerido';
        if (!usuario.contrasenaHash || usuario.contrasenaHash.length < 6) erroresTemp.contrasenaHash = 'Contraseña requerida';
        //imprime el error para que el usuario se entere
        setErrores(erroresTemp);

        if (Object.keys(erroresTemp).length === 0) {
            // Aquí iría la petición al backend para validar usuario y contraseña
            console.log('Intentando iniciar sesión con:', usuario);
             window.location.href = '/inicio'; 
        }
    };

    return (
        <div className="login" id="login">
            <div className="row">
                <form className="formulario" onSubmit={validar}>
                    <div className="box">
                        <h3>Iniciar sesion</h3>
                        <div className="secciones">
                            <input
                                type="text"
                                name="nombreUsuario"
                                placeholder="Nombre de usuario"
                                className="input"
                                value={usuario.nombreUsuario}
                                onChange={handleChange}
                            />
                            {errores.nombreUsuario && <span className="error">{errores.nombreUsuario}</span>}
                            <input
                                type="password"
                                name="contrasenaHash"
                                placeholder="Contraseña"
                                className="input"
                                value={usuario.contrasenaHash}
                                onChange={handleChange}
                            />
                            {errores.contrasenaHash && <span className="error">{errores.contrasenaHash}</span>}
                        </div>
                        <input type="submit" value="Continuar" className="btn" />
                        {mensaje && <p>{mensaje}</p>}
                        <p>¿No tienes una cuenta? <span><a href="/registro">Crear cuenta</a></span></p>
                    </div>
                </form>
                <div className="imagen-form">
                    <img src="/src/img/ilustracion.webp" alt="" />
                </div>
            </div>
        </div>
    );
};

export default IniciarSesion;