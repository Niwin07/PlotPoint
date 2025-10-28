
import React, { useState } from 'react';
import './ModalUsuario.css';
import useUsuario from '/src/hooks/useUsuario';

export default function ModalCrearUsuario({ alCerrar, alGuardar }) {
  const [datos, setDato] = useUsuario();
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  const manejarEnvio = (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!datos.nombreUsuario.trim()) {
      alert('El nombre de usuario es obligatorio');
      return;
    }

    if (!datos.correo.trim()) {
      alert('El correo es obligatorio');
      return;
    }
    
    // Validar formato de correo
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(datos.correo)) {
      alert('Por favor ingrese un correo válido');
      return;
    }
    
    if (!datos.contrasenaHash.trim()) {
      alert('La contraseña es obligatoria');
      return;
    }

    if (datos.contrasenaHash.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    alGuardar(datos);
  };

  return (
    <div className="modal-overlay" onClick={alCerrar}>
      <div className="modal-usuario-simple" onClick={(e) => e.stopPropagation()}>
        
        
        <button className="boton-volver" onClick={alCerrar}>VOLVER</button>

        <form onSubmit={manejarEnvio} className="formulario-usuario">
          <h2 className="titulo-campo">Nombre de usuario</h2>
          <input
            type="text"
            value={datos.nombreUsuario}
            onChange={(e) => setDato('nombreUsuario', e.target.value)}
            className="campo-input"
            placeholder="Nombre de usuario"
          />

          <h2 className="titulo-campo">Correo</h2>
          <input
            type="email"
            value={datos.correo}
            onChange={(e) => setDato('correo', e.target.value)}
            className="campo-input"
            placeholder="Correo"
          />

          <h2 className="titulo-campo">Contraseña</h2>
          <div className="contenedor-contrasena">
            <input
              type={mostrarContrasena ? "text" : "password"}
              value={datos.contrasenaHash}
              onChange={(e) => setDato('contrasenaHash', e.target.value)}
              className="campo-input"
              placeholder="Contraseña"
            />
            <button
              type="button"
              className="boton-mostrar-contrasena"
              onClick={() => setMostrarContrasena(!mostrarContrasena)}
            >
              {mostrarContrasena ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>

          <button type="submit" className="boton-crear-usuario">
            Crear
          </button>
        </form>
      </div>
    </div>
  );
}