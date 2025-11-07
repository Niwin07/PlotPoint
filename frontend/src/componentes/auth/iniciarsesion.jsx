import React, { useState } from 'react';
import useUsuario from '/src/hooks/useUsuario';
import '/src/componentes/auth/iniciarsesion.css';
import axios from 'axios';

const IniciarSesion = () => {
  const [usuario, setUsuario] = useUsuario();
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDato(name, value);
  };

  const validar = async (e) => {
    e.preventDefault();
    let erroresTemp = {};

    if (!usuario.nombreUsuario.trim()) erroresTemp.nombreUsuario = 'Ingresa tu usuario o email';
    if (!usuario.contrasenaHash || usuario.contrasenaHash.length < 6) erroresTemp.contrasenaHash = 'Contraseña mínima de 6 caracteres';
    
    setErrores(erroresTemp);
    if (Object.keys(erroresTemp).length > 0) return;

    try {
      const body = {
        nombre_usuario: usuario.nombreUsuario.trim(),
        contrasena: usuario.contrasenaHash.trim()
      };

      const response = await axios.post('http://localhost:3000/api/usuarios/login', body);

      const data = response.data;
      console.log(" Respuesta del backend:", data);

      if (data.status !== 'ok') {
        setMensaje(data.message || 'Credenciales incorrectas');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));

      if (data.usuario.rol === 'admin') {
        alert(`Bienvenido administrador ${data.usuario.nombre_usuario}`);
        window.location.href = '/admin/*';
      } else {
        window.location.href = '/inicio';
      }

    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      if (error.response) {
        setMensaje(error.response.data.message || 'Credenciales incorrectas');
      } else if (error.request) {
        setMensaje('Error de conexión con el servidor');
      } else {
        setMensaje('Error inesperado al preparar la solicitud');
      }
    }
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
                //onChange={handleChange}
                onChange={(e) => setUsuario('nombreUsuario', e.target.value)}
              />
              {errores.nombreUsuario && <span className="error">{errores.nombreUsuario}</span>}

              <input
                type="password"
                name="contrasenaHash"
                placeholder="Contraseña"
                className="input"
                value={usuario.contrasenaHash}
                //onChange={handleChange}
                onChange={(e) => setUsuario('contrasenaHash', e.target.value)}
              />
              {errores.contrasenaHash && <span className="error">{errores.contrasenaHash}</span>}
            </div>

            <input type="submit" value="Continuar" className="btn" />
            {mensaje && <p className="error">{mensaje}</p>}

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