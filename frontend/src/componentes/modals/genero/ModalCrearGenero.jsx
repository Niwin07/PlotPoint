import React, { useState } from 'react';
import './ModalGenero.css';
import useGenero from '/src/hooks/useGenero';

export default function ModalCrearGenero({ alCerrar, alGuardar }) {
  const [datos, setDato] = useGenero();
  const [enviando, setEnviando] = useState(false);

  const manejarEnvio = async (e) => {
    e.preventDefault();
    
    if (!datos.nombre.trim()) {
      alert('El nombre del género es obligatorio');
      return;
    }
    if (!datos.descripcion.trim()) {
      alert('La descripción es obligatoria');
      return;
    }

    setEnviando(true);

    try {
      const res = await alGuardar(datos);
      if (res && res.success) {
        alCerrar();
      }
    } catch (error) {
      alert("Ocurrió un error al crear el género");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="modal-overlay-genero" onClick={alCerrar}>
      <div className="modal-genero-container" onClick={(e) => e.stopPropagation()}>
        
        <button className="boton-volver-genero" onClick={alCerrar} disabled={enviando}>VOLVER</button>

        <form onSubmit={manejarEnvio} className="formulario-genero">
          <h2 className="titulo-campo-genero">Genero</h2>
          <input
            type="text"
            value={datos.nombre}
            onChange={(e) => setDato('nombre', e.target.value)}
            className="campo-input-genero"
            placeholder="Genero"
            disabled={enviando}
          />

          <h2 className="titulo-campo-genero">Descripcion</h2>
          <textarea
            value={datos.descripcion}
            onChange={(e) => setDato('descripcion', e.target.value)}
            className="campo-textarea-genero"
            rows="6"
            placeholder="Descripcion"
            disabled={enviando}
          />

          <button 
            type="submit" 
            className="boton-crear-genero"
            disabled={enviando}
            style={{ opacity: enviando ? 0.7 : 1, cursor: enviando ? 'not-allowed' : 'pointer' }}
          >
            {enviando ? "Guardando..." : "Crear"}
          </button>
        </form>
      </div>
    </div>
  );
}