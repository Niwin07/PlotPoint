import React, { useState } from 'react';
import useUsuario from '../../hooks/useUsuario';
import '/src/componentes/auth/crearcuenta.css';
import axios from 'axios'; 

const Signup = () => {
    const [usuario, setUsuario] = useUsuario();
    const [terminos, setTerminos] = useState(false);
    const [errores, setErrores] = useState({});
    const [mensaje, setMensaje] = useState('');

    const handleCheck = (e) => {
        const { name, checked } = e.target;
        console.log(name)
        if (name === 'terminos') {
            setTerminos(checked);
        } 
    };

    const validarValores = async (e) => {
        e.preventDefault();
        let erroresTemp = {};

        if (!usuario.nombreUsuario.trim() || usuario.nombreUsuario.length < 6) {
            erroresTemp.nombreUsuario = 'El nombre de usuario debe tener al menos 6 caracteres';
        }
        if(usuario.nombreUsuario.length > 20){
            erroresTemp.nombreUsuario = 'El nombre de usuario no puede exceder los 20 caracteres';
        }
        if (!usuario.correo.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/)) {
            erroresTemp.correo = 'Correo electrónico inválido';
        }
        if (usuario.contrasenaHash.length < 6) {
            erroresTemp.contrasenaHash = 'La contraseña debe tener al menos 6 caracteres';
        }
        if (!terminos) {
            erroresTemp.terminos = 'Debes aceptar los términos y condiciones';
        }

        setErrores(erroresTemp);

        if (Object.keys(erroresTemp).length > 0) return;

        try {
            const datosAEnviar = {
                nombre: usuario.nombreUsuario.trim(), 
                nombre_usuario: usuario.nombreUsuario.trim(),
                correo: usuario.correo.trim(),
                contrasena: usuario.contrasenaHash.trim(),
                biografia: "", 
                url_avatar: "" 
            };

            const response = await axios.post('http://localhost:3000/api/usuarios/registro', datosAEnviar);

            alert(' Registro exitoso. Ahora puedes iniciar sesión.');
            window.location.href = '/iniciarsesion';

        } catch (error) {
            console.error('Error en registro:', error);
            if (error.response) {
                setMensaje(error.response.data.message || 'Error al registrar usuario');
            } else if (error.request) {
                setMensaje('Error de conexión con el servidor');
            } else {
                setMensaje('Error inesperado al preparar la solicitud');
            }
        }
    };

    return (
        <div className="signup" id="login">
            <div className="row">
                <form className="formulario" onSubmit={validarValores}>
                    <div className="box">
                        <h3>Unete a Plotpoint</h3>
                        <div className="secciones">
                            <input
                                type="text"
                                name="nombreUsuario"
                                placeholder="Nombre de usuario"
                                className="input"
                                value={usuario.nombreUsuario}
                                onChange={(e) => setUsuario('nombreUsuario', e.target.value)}
                                required
                            />
                            {errores.nombreUsuario && <span className="error">{errores.nombreUsuario}</span>}

                            <input
                                type="email"
                                name="correo"
                                placeholder="Correo electronico"
                                className="input"
                                value={usuario.correo}
                                onChange={(e) => setUsuario('correo', e.target.value)}
                                required
                            />
                            {errores.correo && <span className="error">{errores.correo}</span>}

                            <input
                                type="password"
                                name="contrasenaHash"
                                placeholder="Contraseña"
                                className="input"
                                value={usuario.contrasenaHash}
                                onChange={(e) => setUsuario('contrasenaHash', e.target.value)}
                                required
                            />
                            {errores.contrasenaHash && <span className="error">{errores.contrasenaHash}</span>}
                        </div>

                        <input
                            type="checkbox"
                            id="acepto-terminos"
                            name="terminos"
                            checked={terminos}
                            onChange={handleCheck}
                            required
                        />
                        <label htmlFor="acepto-terminos">
                            Acepto los <a href="/terminosycondiciones">términos y condiciones</a>
                        </label>
                        {errores.terminos && <span className="error">{errores.terminos}</span>}

                        {mensaje && <span className="error">{mensaje}</span>}

                        <input type="submit" className="btn" value="REGISTRARSE" />
                        <p>¿Ya tienes una cuenta? <span><a href="/iniciarsesion">Iniciar sesión</a></span></p>
                    </div>
                </form>
                <div className="imagen-form">
                    <img src="src/img/ilustracion.webp" alt="" />
                </div>
            </div>
        </div>
    );
};

export default Signup;
