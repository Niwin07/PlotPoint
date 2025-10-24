// ModalEditarUsuario.jsx
import React, { useState } from 'react';
import '/src/componentes/modals/ModalUsuario.css';

export default function ModalEditarUsuario({ usuario, alCerrar, alGuardar }) {
  const [datosFormulario, setDatosFormulario] = useState({
    nombreUsuario: usuario?.nombreUsuario || '',
    correo: usuario?.correo || ''
  });

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
            placeholder="Juan Perez"
          />

          <h2 className="titulo-campo">Correo</h2>
          <input
            type="email"
            name="correo"
            value={datosFormulario.correo}
            onChange={manejarCambioInput}
            className="campo-input"
            placeholder="juanperez@gmail.com"
          />

          <button type="submit" className="boton-editar-usuario">
            Editar
          </button>
        </form>
      </div>
    </div>
  );
}