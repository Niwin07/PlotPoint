import React, { useState } from 'react';
import './ModalGenero.css';

export default function ModalCrearGenero({ alCerrar, alGuardar }) {
  const [datosFormulario, setDatosFormulario] = useState({
    nombre: '',
    descripcion: ''
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
    if (!datosFormulario.nombre.trim()) {
      alert('El nombre del género es obligatorio');
      return;
    }
    if (!datosFormulario.descripcion.trim()) {
      alert('La descripción es obligatoria');
      return;
    }

    alGuardar(datosFormulario);
  };

  return (
    <div className="modal-overlay-genero" onClick={alCerrar}>
      <div className="modal-genero-container" onClick={(e) => e.stopPropagation()}>
        
        <button className="boton-volver-genero" onClick={alCerrar}>VOLVER</button>

        <form onSubmit={manejarEnvio} className="formulario-genero">
          <h2 className="titulo-campo-genero">Genero</h2>
          <input
            type="text"
            name="nombre"
            value={datosFormulario.nombre}
            onChange={manejarCambioInput}
            className="campo-input-genero"
            placeholder="Genero"
          />

          <h2 className="titulo-campo-genero">Descripcion</h2>
          <textarea
            name="descripcion"
            value={datosFormulario.descripcion}
            onChange={manejarCambioInput}
            className="campo-textarea-genero"
            rows="6"
            placeholder="Descripcion"
          />

          <button type="submit" className="boton-crear-genero">
            Crear
          </button>
        </form>
      </div>
    </div>
  );
}