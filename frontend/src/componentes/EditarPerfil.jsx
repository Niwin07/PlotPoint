
import React, { useState } from 'react';
import '../css/EditarPerfil.css';

export default function EditProfilePage() {
  const [formData, setFormData] = useState({
    username: 'usuario_nombre',
    email: 'santaespinacruz@gmail.com',
    bio: '...',
    photoFile: null,
    photoName: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        photoFile: file,
        photoName: file.name
      }));
    }
  };

  const handleSave = () => {
    console.log('Datos guardados:', formData);
    alert('Perfil actualizado exitosamente!');
  };

  return (
    <div className="edit-page-container">
    

      {/* Main Content */}
      <div className="edit-main-content">
        {/* Username Field */}
        <div className="field-container">
          <label className="field-label">Nombre de usuario</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="field-input"
          />
        </div>

        {/* Email Field (Disabled) */}
        <div className="field-container">
          <label className="field-label">Correo electronico</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            className="field-input field-disabled"
            disabled
          />
        </div>

        {/* Photo Upload */}
        <div className="photo-container">
          <input
            type="file"
            id="photoInput"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <label htmlFor="photoInput" className="photo-button">
            Cambiar foto de perfil
          </label>
          <span className="photo-filename">
            {formData.photoName || 'foto-de-perfil-nuevo.jpg'}
          </span>
        </div>

        {/* Biography Field */}
        <div className="field-container">
          <label className="field-label">Biografia</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="field-textarea"
            rows="8"
          />
        </div>

        {/* Action Buttons */}
        <div className="button-container">
          <button onClick={handleSave} className="save-button">
            Guardar
          </button>
          <button className="password-button">
            Cambiar contraseña
          </button>
        </div>

        {/* Logout Link */}
        <div className="logout-container">
          <a href='/iniciarsesion' className="logout-button">Cerrar sesión</a>
        </div>
      </div>
    </div>
  );
}