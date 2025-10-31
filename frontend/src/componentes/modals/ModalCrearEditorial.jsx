import React from 'react';
import './ModalEditorial.css';
import useEditorial from '/src/hooks/useEditorial';

export default function ModalCrearEditorial({ alCerrar, alGuardar }) {
  const [datos, setDato] = useEditorial();

  const manejarEnvio = (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!datos.nombre.trim()) {
      alert('El nombre de la editorial es obligatorio');
      return;
    }
    if (!datos.pais.trim()) {
      alert('El país es obligatorio');
      return;
    }
  
    alGuardar(datos);
  };

  return (
    <div className="modal-overlay-editorial" onClick={alCerrar}>
      <div className="modal-editorial-container" onClick={(e) => e.stopPropagation()}>
        
        
        <button className="boton-volver-editorial" onClick={alCerrar}>VOLVER</button>

        <form onSubmit={manejarEnvio} className="formulario-editorial">
          <h2 className="titulo-campo-editorial">Editorial</h2>
          <input
            type="text"
            value={datos.nombre}
            onChange={(e) => setDato('nombre', e.target.value)}
            className="campo-input-editorial"
            placeholder="Editorial"
          />

          <h2 className="titulo-campo-editorial">Pais</h2>
          <input
            type="text"
            value={datos.pais}
            onChange={(e) => setDato('pais', e.target.value)}
            className="campo-input-editorial"
            placeholder="Pais"
          />

          <button type="submit" className="boton-crear-editorial">
            Crear
          </button>
        </form>
      </div>
    </div>
  );
}