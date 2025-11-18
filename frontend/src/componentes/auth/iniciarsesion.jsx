import useUsuario from "../../hooks/useUsuario";
import { useState } from "react";
import './iniciarsesion.css';
import { Link } from "wouter";
export default function IniciarSesion({ login, mensaje }) {
  const [usuario, setUsuario] = useUsuario();
  const [errores, setErrores] = useState({});

  const validar = (e) => {
    e.preventDefault();

    let temp = {};

    if (!usuario.nombreUsuario.trim())
      temp.nombreUsuario = "Ingresa tu usuario";

    if (!usuario.contrasenaHash || usuario.contrasenaHash.length < 6)
      temp.contrasenaHash = "La contraseña debe tener mínimo 6 caracteres";

    setErrores(temp);

    if (Object.keys(temp).length === 0) login(usuario);
  };

  return (


    <div className="login" id="login">
      <div className="row">
        <form className="formulario" onSubmit={validar}>
          <div className="box">
            <h3>Iniciar sesión</h3>
            <div className="secciones">
              <input
                type="text"
                name="nombreUsuario"
                placeholder="Nombre de usuario"
                className="input"
                value={usuario.nombreUsuario}
                onChange={(e) => setUsuario('nombreUsuario', e.target.value)}
              />
              {errores.nombreUsuario && <span className="error">{errores.nombreUsuario}</span>}

              <input
                type="password"
                name="contrasenaHash"
                placeholder="Contraseña"
                className="input"
                value={usuario.contrasenaHash}
                onChange={(e) => setUsuario('contrasenaHash', e.target.value)}
              />
              {errores.contrasenaHash && <span className="error">{errores.contrasenaHash}</span>}
            </div>

            <input type="submit" value="Continuar" className="btn" />
            {mensaje && <p className="error">{mensaje}</p>}

            <p>¿No tienes una cuenta? <span><Link href={"/registro"}>Crear cuenta</Link></span></p>
          </div>
        </form>
        <div className="imagen-form">
          <img src="/src/img/ilustracion.webp" alt="" />
        </div>
      </div>
    </div>

  )
}
