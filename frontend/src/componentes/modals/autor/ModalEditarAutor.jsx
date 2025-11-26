import React, { useEffect, useState } from 'react';
import './ModalAutor.css';
import useAutor from '/src/hooks/useAutor';

export default function ModalEditarAutor({ autor, alCerrar, alGuardar }) {
  const [datos, setDato] = useAutor();
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (autor) {
      setDato('id', autor.id);
      setDato('nombre', autor.nombre);
      setDato('apellido', autor.apellido);
      setDato('nacionalidad', autor.nacionalidad);
    }
  }, [autor]);

  const manejarEnvio = async (e) => {
    e.preventDefault();
    
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

    setEnviando(true);

    try {
      const res = await alGuardar(datos);
      if (res && res.success) {
        alCerrar();
      }
    } catch (error) {
      alert("Ocurrió un error al editar el autor");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="modal-overlay-autor" onClick={alCerrar}>
      <div className="modal-autor-container" onClick={(e) => e.stopPropagation()}>
        
        <button className="boton-volver-autor" onClick={alCerrar} disabled={enviando}>VOLVER</button>

        <form onSubmit={manejarEnvio} className="formulario-autor">
          <h2 className="titulo-campo-autor">Nombre</h2>
          <input
            type="text"
            value={datos.nombre}
            onChange={(e) => setDato('nombre', e.target.value)}
            className="campo-input-autor"
            placeholder="Juan"
            disabled={enviando}
          />

          <h2 className="titulo-campo-autor">Apellido</h2>
          <input
            type="text"
            value={datos.apellido}
            onChange={(e) => setDato('apellido', e.target.value)}
            className="campo-input-autor"
            placeholder="Perez"
            disabled={enviando}
          />

          <h2 className="titulo-campo-autor">Nacionalidad</h2>
          <input
            type="text"
            value={datos.nacionalidad}
            onChange={(e) => setDato('nacionalidad', e.target.value)}
            className="campo-input-autor"
            placeholder="Argentino"
            disabled={enviando}
          />

          <button 
            type="submit" 
            className="boton-editar-autor"
            disabled={enviando}
            style={{ opacity: enviando ? 0.7 : 1, cursor: enviando ? 'not-allowed' : 'pointer' }}
          >
            {enviando ? "Guardando..." : "Editar"}
          </button>
        </form>
      </div>
    </div>
  );
}