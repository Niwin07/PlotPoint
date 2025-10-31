import React, { useState } from 'react';
import useUsuario from '../../hooks/useUsuario';
import '/src/componentes/auth/crearcuenta.css';

const Signup = () => {
    const [usuario, setDato] = useUsuario();
    const [terminos, setTerminos] = useState(false);
    const [errores, setErrores] = useState({});
    const [mensaje, setMensaje] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        console.log(name)
        if (name === 'terminos') {
            setTerminos(checked);
        } else {
            setDato(name, value);
        }
    };

    const validarValores = async (e) => {
        e.preventDefault();
        let erroresTemp = {};

        if (!usuario.nombreUsuario.trim() || usuario.nombreUsuario.length < 6) {
            erroresTemp.nombreUsuario = 'El nombre de usuario debe tener al menos 6 caracteres';
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

        // Si hay errores, cancelar
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

            const response = await fetch('http://localhost:3000/api/usuarios/registro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosAEnviar)
            });

            const data = await response.json();

            if (!response.ok) {
                setMensaje(data.message || 'Error al registrar usuario');
                return;
            }

            alert('✅ Registro exitoso. Ahora puedes iniciar sesión.');
            window.location.href = '/iniciarsesion';

        } catch (error) {
            console.error('Error en registro:', error);
            setMensaje('Error de conexión con el servidor');
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
                                onChange={handleChange}
                                required
                            />
                            {errores.nombreUsuario && <span className="error">{errores.nombreUsuario}</span>}

                            <input
                                type="email"
                                name="correo"
                                placeholder="Correo electronico"
                                className="input"
                                value={usuario.correo}
                                onChange={handleChange}
                                required
                            />
                            {errores.correo && <span className="error">{errores.correo}</span>}

                            <input
                                type="password"
                                name="contrasenaHash"
                                placeholder="Contraseña"
                                className="input"
                                value={usuario.contrasenaHash}
                                onChange={handleChange}
                                required
                            />
                            {errores.contrasenaHash && <span className="error">{errores.contrasenaHash}</span>}
                        </div>

                        <input
                            type="checkbox"
                            id="acepto-terminos"
                            name="terminos"
                            checked={terminos}
                            onChange={handleChange}
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
