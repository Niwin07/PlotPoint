import React, { useState } from 'react';
import '../css/crearcuenta.css';

const Signup = () => {
    const [datos, setDatos] = useState({
        nombres: '',
        emails: '',
        contraseñas: '',
        terminos: false
    }); // Estado para los datos del formulario
    const [errores, setErrores] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setDatos({
            ...datos,
            [name]: type === 'checkbox' ? checked : value
        });
    }; // Maneja los cambios en los inputs

    const validarValores = (e) => {
        e.preventDefault();
        let erroresTemp = {};

        if (!datos.nombres.trim() || datos.nombres.length < 6) {
            erroresTemp.nombres = 'El nombre de usuario debe tener al menos 6 caracteres';
        }
        if (!datos.emails.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/)) {
            erroresTemp.emails = 'Correo electrónico inválido';
        }
        if (datos.contraseñas.length < 6) {
            erroresTemp.contraseñas = 'La contraseña debe tener al menos 6 caracteres';
        }
        if (!datos.terminos) {
            erroresTemp.terminos = 'Debes aceptar los términos y condiciones';
        }

        setErrores(erroresTemp);

        if (Object.keys(erroresTemp).length === 0) {
            // Aquí puedes enviar los datos al backend
            console.log('Datos válidos:', datos);
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
                                value={datos.nombres}
                                onChange={handleChange}
                                required
                            />
                            {errores.nombres && <span className="error">{errores.nombres}</span>}
                            <input
                                type="email"
                                name="emails"
                                placeholder="Correo electronico"
                                className="input"
                                value={datos.emails}
                                onChange={handleChange}
                                required
                            />
                            {errores.emails && <span className="error">{errores.emails}</span>}
                            <input
                                type="password"
                                name="contraseñas"
                                placeholder="Contraseña"
                                className="input"
                                value={datos.contraseñas}
                                onChange={handleChange}
                                required
                            />
                            {errores.contraseñas && <span className="error">{errores.contraseñas}</span>}
                        </div>
                        <input
                            type="checkbox"
                            id="acepto-terminos"
                            name="terminos"
                            checked={datos.terminos}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="acepto-terminos">
                            Acepto los <a href="/terminosycondiciones">términos y condiciones</a>
                        </label>
                        {errores.terminos && <span className="error">{errores.terminos}</span>}
                        <input type="submit" className="btn" value="Registrarse" />
                        <p>¿Ya tienes una cuenta? <span><a href="/iniciarsesion">Iniciar sesión</a></span></p>
                    </div>
                </form>
                <div className="imagen-form">
                    <img src="https://i.ibb.co/wZtxms8j/Agregar-un-t-tulo-20251011-032943-0000.png" alt="" />
                </div>
            </div>
        </div>
    );
};

export default Signup;