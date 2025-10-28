import React, { useState } from "react";
import "/src/componentes/modals/ModalContraseña.css";

export default function ChangePasswordModal({ onClose }) {
  const [oldPassword, setOldPassword] = useState("");
  const [repeatNewPassword, setRepeatNewPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChangePassword = () => {
    if (!oldPassword || !repeatNewPassword || !newPassword) {
      alert("Por favor completa todos los campos.");
      return;
    }

    if( oldPassword.length <= 5 || repeatNewPassword.length  <= 5 || newPassword.length  <= 5){
        alert("Las contraseñas deben tener como minimo 6 caracteres")
        return;
    }

    if (newPassword !== repeatNewPassword) {
      alert("Las nueva contraseña no coincide.");
      return;
    }

    alert("Contraseña cambiada correctamente (simulado).");
    onClose(); // cerrar modal
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="back-button" onClick={onClose}>Volver</button>
        <h2>Cambiar contraseña</h2>

        <input
          type="password"
          placeholder="Contraseña actual"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Nueva Contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirmar nueva contraseña"
          value={repeatNewPassword}
          onChange={(e) => setRepeatNewPassword(e.target.value)}
        />

        <button className="change-button" onClick={handleChangePassword}>
          Cambiar contraseña
        </button>
      </div>
    </div>
  );
}
