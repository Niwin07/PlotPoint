import React, { useState } from "react";
import "/src/componentes/modals/ModalNoCuenta.css";

export default function ModalNoCuenta({ onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Botón volver */}
        <button className="volver-btn" onClick={onClose}>
          VOLVER
        </button>

        {/* Contenido */}
        <h2 className="modal-title">Registrarse/iniciarsesion</h2>

        <p className="modal-text">
          Antes de realizar esta acción debes estar con una cuenta de{" "}
          <strong>Plotpoint</strong>, haz clic para iniciar sesión
        </p>

        <a href="/iniciarsesion" className="login-btn">Iniciar sesión</a>

        <p className="create-text">
          ¿No tienes cuenta?{" "}
          <a href="/registro" className="create-link">
            Crear cuenta
          </a>
        </p>
      </div>
    </div>
  );
}
