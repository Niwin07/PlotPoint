import React, { useState } from 'react';
import useUsuario from '/src/hooks/useUsuario';
import '/src/componentes/auth/iniciarsesion.css';

const IniciarSesion = () => {
  const [usuario, setDato] = useUsuario();
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
      const response = await fetch('http://localhost:3000/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_usuario: usuario.nombreUsuario.trim(),
          contrasena: usuario.contrasenaHash.trim()
        })
      });

      const data = await response.json();
      console.log("🔍 Respuesta del backend:", data);

      if (!response.ok || data.status !== 'ok') {
        setMensaje(data.message || 'Credenciales incorrectas');
        return;
      }

      // Guardar sesión
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));

      // Redirección según rol
      if (data.usuario.rol === 'admin') {
        alert(`Bienvenido administrador ${data.usuario.nombre_usuario}`);
        window.location.href = '/admin/*';
      } else {
        alert(`Bienvenido ${data.usuario.nombre_usuario}`);
        window.location.href = '/inicio';
      }

    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setMensaje('Error de conexión con el servidor');
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
                placeholder="Usuario o correo"
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
