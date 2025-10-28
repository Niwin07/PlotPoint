import React, { useState } from 'react';
import useUsuario from '../../hooks/useUsuario';

import '/src/componentes/auth/crearcuenta.css';

const Signup = () => {
    const [usuario, setDato] = useUsuario();
    const [terminos, setTerminos] = useState(false);
    const [errores, setErrores] = useState({});

    //setea el valor que estas agregando/cambiando 

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        console.log(name)
        if (name === 'terminos') {
            setTerminos(checked);
        } else {
            setDato(name, value);
        }
    };

    //realiza una breve validacion de los datos ingresados

    const validarValores = (e) => {
        e.preventDefault();
        let erroresTemp = {};

        if (!usuario.nombreUsuario.trim() || usuario.nombreUsuario.length < 6) {
            //por si nombre incumple (esta vacio o tiene menos de 6 caracteres)
            erroresTemp.nombreUsuario = 'El nombre de usuario debe tener al menos 6 caracteres';
        }
        if (!usuario.correo.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/)) {
            //por si el correo incumple (no cumple con la estructura de un correo, "@" ".")
            erroresTemp.correo = 'Correo electrónico inválido';
        }
        if (usuario.contrasenaHash.length < 6) {
            //por si la contraseña incumple  (esta vacio o tiene menos de 6 caracteres)
            erroresTemp.contrasenaHash = 'La contraseña debe tener al menos 6 caracteres';
        }
        if (!terminos) {
            //por si no aprobaste los terminos y condiciones (check)
            erroresTemp.terminos = 'Debes aceptar los términos y condiciones';
        }

        //imprime el error en el componente para que el usuario lo vea

        setErrores(erroresTemp);

        if (Object.keys(erroresTemp).length === 0) {
            // Aquí ya puedes enviar los datos al backend
            localStorage.setItem("usuario", JSON.stringify({ nombre: "Cristian", rol: "usuario" }));
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