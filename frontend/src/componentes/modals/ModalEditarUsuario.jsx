
import React, { useEffect } from 'react';
import './ModalUsuario.css';
import useUsuario from '/src/hooks/useUsuario';

export default function ModalEditarUsuario({ usuario, alCerrar, alGuardar }) {
  const [datos, setDato] = useUsuario();

  // Cargar los datos del usuario cuando el modal se abre
  useEffect(() => {
    if (usuario) {
      setDato('id', usuario.id);
      setDato('nombreUsuario', usuario.nombreUsuario);
      setDato('correo', usuario.correo); 
    }
  }, [usuario]);

  const manejarEnvio = (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!datos.nombreUsuario.trim()) {
      alert('El nombre de usuario es obligatorio');
      return;
    }
    if (!datos.correo.trim()) {
      alert('El correo es obligatorio');
      return;
    }
    
    // Validar formato de correo
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(datos.correo)) {
      alert('Por favor ingrese un correo válido');
      return;
    }

    // Enviamos los datos con la estructura correcta
    alGuardar({
      nombreUsuario: datos.nombreUsuario,
      correo: datos.correo
    });
  };

  return (
    <div className="modal-overlay" onClick={alCerrar}>
      <div className="modal-usuario-simple" onClick={(e) => e.stopPropagation()}>
        
        
        <button className="boton-volver" onClick={alCerrar}>VOLVER</button>

        <form onSubmit={manejarEnvio} className="formulario-usuario">
          <h2 className="titulo-campo">Nombre de usuario</h2>
          <input
            type="text"
            value={datos.nombreUsuario}
            onChange={(e) => setDato('nombreUsuario', e.target.value)}
            className="campo-input"
            placeholder=""
          />

          <h2 className="titulo-campo">Correo</h2>
          <input
            type="email"
            value={datos.correo}
            onChange={(e) => setDato('correo', e.target.value)}
            className="campo-input"
            placeholder=""
          />

          <button type="submit" className="boton-editar-usuario">
            Editar
          </button>
        </form>
      </div>
    </div>
  );
}