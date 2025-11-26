import React, { useState } from 'react';
import './ModalUsuario.css';
import useUsuario from '/src/hooks/useUsuario';

export default function ModalCrearUsuario({ alCerrar, alGuardar }) {
  const [datos, setDato] = useUsuario();
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const manejarEnvio = async (e) => {
    e.preventDefault();

    if (!datos.nombre.trim()) return alert('El nombre real es obligatorio');
    if (!datos.nombreUsuario.trim()) return alert('El nombre de usuario es obligatorio');
    if (!datos.correo.trim()) return alert('El correo es obligatorio');
    if (!datos.contrasenaHash.trim()) return alert('La contraseña es obligatoria');

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(datos.correo)) return alert('Correo inválido');

    if (datos.contrasenaHash.length < 6) {
      return alert('La contraseña debe tener mínimo 6 caracteres');
    }

    setEnviando(true);

    try {
      const res = await alGuardar({
        nombre: datos.nombre.trim(),
        nombreUsuario: datos.nombreUsuario.trim(),
        correo: datos.correo.trim(),
        contrasenaHash: datos.contrasenaHash.trim(),
      });
      if (res && res.success) {
        alCerrar();
      }
    } catch (error) {
      alert("Ocurrió un error al crear el usuario");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={alCerrar}>
      <div className="modal-usuario-simple" onClick={(e) => e.stopPropagation()}>

        <button className="boton-volver" onClick={alCerrar} disabled={enviando}>VOLVER</button>

        <form onSubmit={manejarEnvio} className="formulario-usuario">

          <h2 className="titulo-campo">Nombre real</h2>
          <input
            type="text"
            value={datos.nombre}
            onChange={(e) => setDato('nombre', e.target.value)}
            className="campo-input"
            placeholder="Ej: Juan Pérez"
            disabled={enviando}
          />

          <h2 className="titulo-campo">Nombre de usuario</h2>
          <input
            type="text"
            value={datos.nombreUsuario}
            onChange={(e) => setDato('nombreUsuario', e.target.value)}
            className="campo-input"
            placeholder="Ej: juan_123"
            disabled={enviando}
          />

          <h2 className="titulo-campo">Correo</h2>
          <input
            type="email"
            value={datos.correo}
            onChange={(e) => setDato('correo', e.target.value)}
            className="campo-input"
            placeholder="correo@ejemplo.com"
            disabled={enviando}
          />

          <h2 className="titulo-campo">Contraseña</h2>
          <div className="contenedor-contrasena">
            <input
              type={mostrarContrasena ? "text" : "password"}
              value={datos.contrasenaHash}
              onChange={(e) => setDato('contrasenaHash', e.target.value)}
              className="campo-input"
              placeholder="Contraseña"
              disabled={enviando}
            />
            <button
              type="button"
              className="boton-mostrar-contrasena"
              onClick={() => setMostrarContrasena(!mostrarContrasena)}
              disabled={enviando}
            >
              {mostrarContrasena ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>

          <button 
            type="submit" 
            className="boton-crear-usuario"
            disabled={enviando}
            style={{ opacity: enviando ? 0.7 : 1, cursor: enviando ? 'not-allowed' : 'pointer' }}
          >
            {enviando ? "Guardando..." : "Crear Usuario"}
          </button>
        </form>
      </div>
    </div>
  );
}