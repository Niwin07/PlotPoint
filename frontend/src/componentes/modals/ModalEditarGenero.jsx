import React, { useState } from 'react';
import '/src/componentes/modals/ModalGenero.css';

export default function ModalEditarGenero({ genero, alCerrar, alGuardar }) {
  const [datosFormulario, setDatosFormulario] = useState({
    nombre: genero?.nombre || '',
    descripcion: genero?.descripcion || ''
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
            placeholder="Terror"
          />

          <h2 className="titulo-campo-genero">Descripcion</h2>
          <textarea
            name="descripcion"
            value={datosFormulario.descripcion}
            onChange={manejarCambioInput}
            className="campo-textarea-genero"
            rows="6"
            placeholder="Donde el miedo y el suspendo unen fuerzas para auyentar a los mas valientes"
          />

          <button type="submit" className="boton-editar-genero">
            Editar
          </button>
        </form>
      </div>
    </div>
  );
}