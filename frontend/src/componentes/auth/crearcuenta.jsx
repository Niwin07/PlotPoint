import useUsuario from "../../hooks/useUsuario";
import { useState } from "react";
import { Link } from "wouter";
import './crearcuenta.css';
export default function CrearCuenta({ registrar, mensaje }) {
    const [usuario, setUsuario] = useUsuario();
    const [terminos, setTerminos] = useState(false);
    const [errores, setErrores] = useState({});


    const handleCheck = (e) => {
        const { name, checked } = e.target;
        console.log(name)
        if (name === 'terminos') {
            setTerminos(checked);
        }
    };

    const validar = (e) => {
        e.preventDefault();

        let temp = {};

        if (!usuario.nombreUsuario.trim() || usuario.nombreUsuario.length < 6)
            temp.nombreUsuario = "El nombre de usuario debe tener al menos 6 caracteres";

        if (!usuario.correo.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/))
            temp.correo = "Correo electrónico inválido";

        if (usuario.contrasenaHash.length < 6)
            temp.contrasenaHash = "La contraseña debe tener al menos 6 caracteres";

        if (!terminos)
            temp.terminos = "Debes aceptar los términos y condiciones";

        setErrores(temp);

        if (Object.keys(temp).length === 0) {
            console.log('Datos válidos:', usuario);
            registrar(usuario);
        }
    };

    return (

        <div className="signup" id="login">
            <div className="row">
                <form className="formulario" onSubmit={validar}>
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
                            Acepto los <Link href={"/terminosycondiciones"}>términos y condiciones</Link>
                        </label>
                        {errores.terminos && <span className="error">{errores.terminos}</span>}

                        {mensaje && <span className="error">{mensaje}</span>}

                        <input type="submit" className="btn" value="REGISTRARSE" />
                        <p>¿Ya tienes una cuenta? <span><Link href={"/iniciarsesion"}>Iniciar sesión</Link></span></p>
                    </div>
                </form>
                <div className="imagen-form">
                    <img src="src/img/ilustracion.webp" alt="" />
                </div>
            </div>
        </div>

    )
}
