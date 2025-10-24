// ModalEditarAutor.jsx
import React, { useState } from 'react';
import '/src/componentes/modals/ModalAutor.css';

export default function ModalEditarAutor({ autor, alCerrar, alGuardar }) {
  const [datosFormulario, setDatosFormulario] = useState({
    nombre: autor?.nombre || '',
    apellido: autor?.apellido || '',
    nacionalidad: autor?.nacionalidad || ''
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
      alert('El nombre es obligatorio');
      return;
    }
    if (!datosFormulario.apellido.trim()) {
      alert('El apellido es obligatorio');
      return;
    }
    if (!datosFormulario.nacionalidad.trim()) {
      alert('La nacionalidad es obligatoria');
      return;
    }

    alGuardar(datosFormulario);
  };

  return (
    <div className="modal-overlay-autor" onClick={alCerrar}>
      <div className="modal-autor-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-autor" onClick={alCerrar}>×</button>
        
        <button className="boton-volver-autor" onClick={alCerrar}>VOLVER</button>

        <form onSubmit={manejarEnvio} className="formulario-autor">
          <h2 className="titulo-campo-autor">Nombre</h2>
          <input
            type="text"
            name="nombre"
            value={datosFormulario.nombre}
            onChange={manejarCambioInput}
            className="campo-input-autor"
            placeholder="Juan"
          />

          <h2 className="titulo-campo-autor">Apellido</h2>
          <input
            type="text"
            name="apellido"
            value={datosFormulario.apellido}
            onChange={manejarCambioInput}
            className="campo-input-autor"
            placeholder="Perez"
          />

          <h2 className="titulo-campo-autor">Nacionalidad</h2>
          <input
            type="text"
            name="nacionalidad"
            value={datosFormulario.nacionalidad}
            onChange={manejarCambioInput}
            className="campo-input-autor"
            placeholder="Argentino"
          />

          <button type="submit" className="boton-editar-autor">
            Editar
          </button>
        </form>
      </div>
    </div>
  );
}