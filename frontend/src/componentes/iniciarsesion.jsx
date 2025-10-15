import React, { useState } from 'react';
import useUsuario from '../hooks/useUsuario';
import '../css/iniciarsesion.css';

const IniciarSesion = () => {
    const [usuario, setDato] = useUsuario();
    const [errores, setErrores] = useState({});
    const [mensaje, setMensaje] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDato(name, value);
    };

    const validar = (e) => {
        e.preventDefault();
        let erroresTemp = {};
        if (!usuario.nombres.trim() || usuario.nombres.length < 6) erroresTemp.nombres = 'Usuario requerido';
        if (!usuario.contraseñas || usuario.contraseñas.length < 6) erroresTemp.contraseñas = 'Contraseña requerida';
        setErrores(erroresTemp);

        if (Object.keys(erroresTemp).length === 0) {
            // Aquí iría la petición al backend para validar usuario y contraseña
            console.log('Intentando iniciar sesión con:', usuario);
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
                                name="nombres"
                                placeholder="Nombre de usuario"
                                className="input"
                                value={usuario.nombres}
                                onChange={handleChange}
                            />
                            {errores.nombres && <span className="error">{errores.nombres}</span>}
                            <input
                                type="password"
                                name="contraseñas"
                                placeholder="Contraseña"
                                className="input"
                                value={usuario.contraseñas}
                                onChange={handleChange}
                            />
                            {errores.contraseñas && <span className="error">{errores.contraseñas}</span>}
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