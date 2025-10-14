import React, { useState } from 'react';
import useUsuario from '../hooks/useUsuario';

import '../css/crearcuenta.css';

const Signup = () => {
    const [usuario, setDato] = useUsuario();
    const [terminos, setTerminos] = useState(false);
    const [errores, setErrores] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'terminos') {
            setTerminos(checked);
        } else {
            setDato(name, value);
        }
    };

    const validarValores = (e) => {
        e.preventDefault();
        let erroresTemp = {};

        if (!usuario.nombres.trim() || usuario.nombres.length < 6) {
            erroresTemp.nombres = 'El nombre de usuario debe tener al menos 6 caracteres';
        }
        if (!usuario.emails.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/)) {
            erroresTemp.emails = 'Correo electrónico inválido';
        }
        if (usuario.contraseñas.length < 6) {
            erroresTemp.contraseñas = 'La contraseña debe tener al menos 6 caracteres';
        }
        if (!terminos) {
            erroresTemp.terminos = 'Debes aceptar los términos y condiciones';
        }

        setErrores(erroresTemp);

        if (Object.keys(erroresTemp).length === 0) {
            // Aquí puedes enviar los datos al backend
            window.location.href = '/inicio'; 
            console.log('Datos válidos:', { ...usuario, terminos });
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
                                name="nombres"
                                placeholder="Nombre de usuario"
                                className="input"
                                value={usuario.nombres}
                                onChange={handleChange}
                                required
                            />
                            {errores.nombres && <span className="error">{errores.nombres}</span>}
                            <input
                                type="email"
                                name="emails"
                                placeholder="Correo electronico"
                                className="input"
                                value={usuario.emails}
                                onChange={handleChange}
                                required
                            />
                            {errores.emails && <span className="error">{errores.emails}</span>}
                            <input
                                type="password"
                                name="contraseñas"
                                placeholder="Contraseña"
                                className="input"
                                value={usuario.contraseñas}
                                onChange={handleChange}
                                required
                            />
                            {errores.contraseñas && <span className="error">{errores.contraseñas}</span>}
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