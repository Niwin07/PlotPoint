import React from 'react';
import './ModalGenero.css';
import useGenero from '/src/hooks/useGenero';

export default function ModalCrearGenero({ alCerrar, alGuardar }) {
  const [datos, setDato] = useGenero();

  const manejarEnvio = (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!datos.nombre.trim()) {
      alert('El nombre del género es obligatorio');
      return;
    }
    if (!datos.descripcion.trim()) {
      alert('La descripción es obligatoria');
      return;
    }

    alGuardar(datos);
  };

  return (
    <div className="modal-overlay-genero" onClick={alCerrar}>
      <div className="modal-genero-container" onClick={(e) => e.stopPropagation()}>
        
        
        <button className="boton-volver-genero" onClick={alCerrar}>VOLVER</button>

        <form onSubmit={manejarEnvio} className="formulario-genero">
          <h2 className="titulo-campo-genero">Genero</h2>
          <input
            type="text"
            value={datos.nombre}
            onChange={(e) => setDato('nombre', e.target.value)}
            className="campo-input-genero"
            placeholder="Genero"
          />

          <h2 className="titulo-campo-genero">Descripcion</h2>
          <textarea
            value={datos.descripcion}
            onChange={(e) => setDato('descripcion', e.target.value)}
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