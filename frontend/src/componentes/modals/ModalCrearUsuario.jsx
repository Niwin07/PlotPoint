import React, { useState } from 'react';
import '/src/componentes/modals/ModalUsuario.css';

export default function ModalCrearUsuario({ alCerrar, alGuardar }) {
  const [datosFormulario, setDatosFormulario] = useState({
    nombreUsuario: '',
    correo: '',
    contrasena: ''
  });

  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setDatosFormulario(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!datosFormulario.nombreUsuario.trim()) {
      alert('El nombre de usuario es obligatorio');
      return;
    }
    if (!datosFormulario.correo.trim()) {
      alert('El correo es obligatorio');
      return;
    }
    
    // Validar formato de correo
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(datosFormulario.correo)) {
      alert('Por favor ingrese un correo válido');
      return;
    }

    if (!datosFormulario.contrasena.trim()) {
      alert('La contraseña es obligatoria');
      return;
    }

    if (datosFormulario.contrasena.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    alGuardar(datosFormulario);
  };

  return (
    <div className="modal-overlay" onClick={alCerrar}>
      <div className="modal-usuario-simple" onClick={(e) => e.stopPropagation()}>
  
        
        <button className="boton-volver" onClick={alCerrar}>VOLVER</button>

        <form onSubmit={manejarEnvio} className="formulario-usuario">
          <h2 className="titulo-campo">Nombre de usuario</h2>
          <input
            type="text"
            name="nombreUsuario"
            value={datosFormulario.nombreUsuario}
            onChange={manejarCambioInput}
            className="campo-input"
            placeholder="Nombre de usuario"
          />

          <h2 className="titulo-campo">Correo</h2>
          <input
            type="email"
            name="correo"
            value={datosFormulario.correo}
            onChange={manejarCambioInput}
            className="campo-input"
            placeholder="Correo electronico"
          />

          <h2 className="titulo-campo">Contraseña</h2>
          <div className="contenedor-contrasena">
            <input
              type={mostrarContrasena ? "text" : "password"}
              name="contrasena"
              value={datosFormulario.contrasena}
              onChange={manejarCambioInput}
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