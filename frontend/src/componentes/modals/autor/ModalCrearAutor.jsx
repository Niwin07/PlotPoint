import React from 'react';
import './ModalAutor.css';
import useAutor from '/src/hooks/useAutor';

export default function ModalCrearAutor({ alCerrar, alGuardar }) {
  const [datos, setDato] = useAutor();

  const manejarEnvio = (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!datos.nombre.trim()) {
      alert('El nombre es obligatorio');
      return;
    }
    if (!datos.apellido.trim()) {
      alert('El apellido es obligatorio');
      return;
    }
    if (!datos.nacionalidad.trim()) {
      alert('La nacionalidad es obligatoria');
      return;
    }

    alGuardar(datos);
  };

  return (
    <div className="modal-overlay-autor" onClick={alCerrar}>
      <div className="modal-autor-container" onClick={(e) => e.stopPropagation()}>
        
        
        <button className="boton-volver-autor" onClick={alCerrar}>VOLVER</button>

        <form onSubmit={manejarEnvio} className="formulario-autor">
          <h2 className="titulo-campo-autor">Nombre</h2>
          <input
            type="text"
            value={datos.nombre}
            onChange={(e) => setDato('nombre', e.target.value)}
            className="campo-input-autor"
            placeholder="Nombre"
          />

          <h2 className="titulo-campo-autor">Apellido</h2>
          <input
            type="text"
            value={datos.apellido}
            onChange={(e) => setDato('apellido', e.target.value)}
            className="campo-input-autor"
            placeholder="Apellido"
          />

          <h2 className="titulo-campo-autor">Nacionalidad</h2>
          <input
            type="text"
            value={datos.nacionalidad}
            onChange={(e) => setDato('nacionalidad', e.target.value)}
            className="campo-input-autor"
            placeholder="Nacionalidad"
          />

          <button type="submit" className="boton-crear-autor">
            Crear
          </button>
        </form>
      </div>
    </div>
  );
}