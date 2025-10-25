import React, { useState } from 'react';
import '/src/componentes/modals/ModalEditorial.css';

export default function ModalEditarEditorial({ editorial, alCerrar, alGuardar }) {
  const [datosFormulario, setDatosFormulario] = useState({
    nombre: editorial?.nombre || '',
    pais: editorial?.pais || ''
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
      alert('El nombre de la editorial es obligatorio');
      return;
    }
    if (!datosFormulario.pais.trim()) {
      alert('El país es obligatorio');
      return;
    }

    alGuardar(datosFormulario);
  };

  return (
    <div className="modal-overlay-editorial" onClick={alCerrar}>
      <div className="modal-editorial-container" onClick={(e) => e.stopPropagation()}>
       
        
        <button className="boton-volver-editorial" onClick={alCerrar}>VOLVER</button>

        <form onSubmit={manejarEnvio} className="formulario-editorial">
          <h2 className="titulo-campo-editorial">Editorial</h2>
          <input
            type="text"
            name="nombre"
            value={datosFormulario.nombre}
            onChange={manejarCambioInput}
            className="campo-input-editorial"
            placeholder="LibroTeca"
          />

          <h2 className="titulo-campo-editorial">Pais</h2>
          <input
            type="text"
            name="pais"
            value={datosFormulario.pais}
            onChange={manejarCambioInput}
            className="campo-input-editorial"
            placeholder="Argentino"
          />

          <button type="submit" className="boton-editar-editorial">
            Editar
          </button>
        </form>
      </div>
    </div>
  );
}