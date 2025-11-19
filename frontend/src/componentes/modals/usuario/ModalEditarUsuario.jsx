import React, { useState, useEffect } from "react";
import "./ModalUsuario.css";
import useUsuario from "/src/hooks/useUsuario";

export default function ModalEditarUsuario({ usuario, alCerrar, alGuardar }) {
  
  const [error, setError] = useState("");
  const [datos, setDato] = useUsuario();
  const [contrasena2, setContrasena2] = useState("");

  useEffect(() => {
    if (usuario) {
      setDato('nombre', usuario.nombre || "");
      setDato('nombreUsuario', usuario.nombre_usuario || "");
      setDato('correo', usuario.correo || "");
      setDato('contrasenaHash', ""); 
      setContrasena2("");
    }
  }, [usuario]); 


  const manejarEnvio = async (e) => {
    e.preventDefault();
    setError("");

    if (!datos.nombre.trim()) return setError("El nombre real es obligatorio");
    if (!datos.nombreUsuario.trim()) return setError("El nombre de usuario es obligatorio");
    if (!datos.correo.trim()) return setError("El correo es obligatorio");

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(datos.correo)) return setError("Correo inválido");

    const datosParaEnviar = {
      nombre: datos.nombre.trim(),
      nombre_usuario: datos.nombreUsuario.trim(), 
      correo: datos.correo.trim(),
    };

    if (datos.contrasenaHash.trim() !== "") {
        if (datos.contrasenaHash.length < 6) {
            return setError("La nueva contraseña debe tener al menos 6 caracteres.");
        }
        if (datos.contrasenaHash !== contrasena2) {
            return setError("Las nuevas contraseñas no coinciden.");
        }
        datosParaEnviar.contrasena = datos.contrasenaHash;
    }
    
    const res = await alGuardar(usuario.id, datosParaEnviar);
    if (res.success) {
      alert("Usuario actualizado correctamente");
      alCerrar();
    } else {
      setError(res.message || "Error al actualizar el usuario");
    }
  };

  return (
    <div className="modal-overlay" onClick={alCerrar}>
      <div className="modal-usuario-simple" onClick={(e) => e.stopPropagation()}>

        <button className="boton-volver" onClick={alCerrar}>VOLVER</button>

        <form onSubmit={manejarEnvio} className="formulario-usuario">
          
          <h2 style={{textAlign: "center", marginBottom: 15, marginTop: 0}}>
            Editar Usuario
          </h2>

          {error && (
            <p style={{ color: "red", textAlign: "center", marginBottom: 15 }}>
              {error}
            </p>
          )}

          <label className="titulo-campo">Nombre real</label>
          <input
            type="text"
            value={datos.nombre}
            onChange={(e) => setDato("nombre", e.target.value)}
            className="campo-input"
          />

          <label className="titulo-campo">Nombre de usuario</label>
          <input
            type="text"
            value={datos.nombreUsuario}
            onChange={(e) => setDato("nombreUsuario", e.target.value)}
            className="campo-input"
          />

          <label className="titulo-campo">Correo</label>
          <input
            type="email"
            value={datos.correo}
            onChange={(e) => setDato("correo", e.target.value)}
            className="campo-input"
          />

          <label className="titulo-campo">Nueva Contraseña</label>
          <input
            type="password"
            placeholder="(dejar vacío para no cambiar)"
            value={datos.contrasenaHash}
            onChange={(e) => setDato("contrasenaHash", e.target.value)}
            className="campo-input"
            autoComplete="new-password"
          />

          <label className="titulo-campo">Repetir Nueva Contraseña</label>
          <input
            type="password"
            value={contrasena2}
            onChange={(e) => setContrasena2(e.target.value)}
            className="campo-input"
            autoComplete="new-password"
          />

          <button type="submit" className="boton-crear-usuario">
            Guardar cambios
          </button>

        </form>
      </div>
    </div>
  );
}