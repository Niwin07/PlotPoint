import React, { useEffect } from 'react';
import './ModalUsuario.css';
import useUsuario from '/src/hooks/useUsuario';

export default function ModalEditarUsuario({ usuario, alCerrar, alGuardar }) {
  const [datos, setDato] = useUsuario();

  // Cargar datos del usuario seleccionado al abrir el modal
  useEffect(() => {
    if (usuario) {
      setDato('id', usuario.id);
      setDato('nombre', usuario.nombre || '');                  // Nombre real
      setDato('nombreUsuario', usuario.nombre_usuario || '');  // Username
      setDato('correo', usuario.correo || '');
    }
  }, [usuario]);

  const manejarEnvio = (e) => {
    e.preventDefault();

    if (!datos.nombre.trim()) return alert('El nombre real es obligatorio');
    if (!datos.nombreUsuario.trim()) return alert('El nombre de usuario es obligatorio');
    if (!datos.correo.trim()) return alert('El correo es obligatorio');

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(datos.correo)) return alert('Correo inválido');

    // Enviar los datos traducidos al backend
    alGuardar({
      nombre: datos.nombre.trim(),
      nombre_usuario: datos.nombreUsuario.trim(),
      correo: datos.correo.trim()
    });
  };

  return (
    <div className="modal-overlay" onClick={alCerrar}>
      <div className="modal-usuario-simple" onClick={(e) => e.stopPropagation()}>
        <button className="boton-volver" onClick={alCerrar}>VOLVER</button>

        <form onSubmit={manejarEnvio} className="formulario-usuario">
          <h2 className="titulo-campo">Nombre real</h2>
          <input
            type="text"
            value={datos.nombre}
            onChange={(e) => setDato('nombre', e.target.value)}
            className="campo-input"
            placeholder="Ej: Juan Pérez"
          />

          <h2 className="titulo-campo">Nombre de usuario</h2>
          <input
            type="text"
            value={datos.nombreUsuario}
            onChange={(e) => setDato('nombreUsuario', e.target.value)}
            className="campo-input"
            placeholder="Ej: juanPerez_01"
          />

          <h2 className="titulo-campo">Correo</h2>
          <input
            type="email"
            value={datos.correo}
            onChange={(e) => setDato('correo', e.target.value)}
            className="campo-input"
            placeholder="correo@ejemplo.com"
          />

          <button type="submit" className="boton-editar-usuario">
            Actualizar
          </button>
        </form>
      </div>
    </div>
  );
}
