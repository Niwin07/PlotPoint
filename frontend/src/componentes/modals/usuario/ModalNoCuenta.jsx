import React, { useState } from "react";
import "/src/componentes/modals/usuario/ModalNoCuenta.css";
import { Link } from "wouter";

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

        <Link href="/iniciarsesion" className="login-btn">Iniciar sesión</Link>

        <p className="create-text">
          ¿No tienes cuenta?{" "}
          <Link href="/registro" className="create-link">
            Crear cuenta
          </Link>
        </p>
      </div>
    </div>
  );
}
