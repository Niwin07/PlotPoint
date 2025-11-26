import React, { useEffect, useState } from 'react';
import './ModalEditorial.css';
import useEditorial from '/src/hooks/useEditorial';

export default function ModalEditarEditorial({ editorial, alCerrar, alGuardar }) {
  const [datos, setDato] = useEditorial();
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (editorial) {
      setDato('id', editorial.id);
      setDato('nombre', editorial.nombre);
      setDato('pais', editorial.pais);
    }
  }, [editorial]);

  const manejarEnvio = async (e) => {
  e.preventDefault();

  if (!datos.nombre.trim()) {
    alert('El nombre de la editorial es obligatorio');
    return;
  }
  if (!datos.pais.trim()) {
    alert('El país es obligatorio');
    return;
  }

  setEnviando(true);

  try {
    const res = await alGuardar(datos.id, datos);
    if (res && res.success) {
      alCerrar();
    }
  } catch (error) {
    alert("Ocurrió un error al editar la editorial");
  } finally {
    setEnviando(false);
  }
};

  return (
    <div className="modal-overlay-editorial" onClick={alCerrar}>
      <div className="modal-editorial-container" onClick={(e) => e.stopPropagation()}>
        
        <button className="boton-volver-editorial" onClick={alCerrar} disabled={enviando}>VOLVER</button>

        <form onSubmit={manejarEnvio} className="formulario-editorial">
          <h2 className="titulo-campo-editorial">Editorial</h2>
          <input
            type="text"
            value={datos.nombre}
            onChange={(e) => setDato('nombre', e.target.value)}
            className="campo-input-editorial"
            placeholder="LibroTeca"
            disabled={enviando}
          />

          <h2 className="titulo-campo-editorial">Pais</h2>
          <input
            type="text"
            value={datos.pais}
            onChange={(e) => setDato('pais', e.target.value)}
            className="campo-input-editorial"
            placeholder="Argentino"
            disabled={enviando}
          />

          <button 
            type="submit" 
            className="boton-editar-editorial"
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