import React, { useState } from 'react';
import './ModalLibro.css';
import useLibro from '/src/hooks/useLibro';

export default function ModalCrearLibro({ 
  autores = [], 
  editoriales = [], 
  generosDisponibles = [], 
  alCerrar, 
  alGuardar 
}) {
  const [datos, setDato] = useLibro();
  const [mostrarDropdownGeneros, setMostrarDropdownGeneros] = useState(false);
  const [archivoPortada, setArchivoPortada] = useState(null);

  const manejarCambioImagen = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      setArchivoPortada(archivo);
      const lector = new FileReader();
      lector.onloadend = () => {
        setDato('urlPortada', lector.result);
      };
      lector.readAsDataURL(archivo);
    }
  };

  const alternarGenero = (generoId) => {
    const generosActuales = datos.generos;
    const estaSeleccionado = generosActuales.includes(generoId);
    
    if (estaSeleccionado) {
      if (generosActuales.length === 1) {
        alert('Debe seleccionar al menos 1 género');
        return;
      }
      setDato('generos', generosActuales.filter(g => g !== generoId));
    } else {
      if (generosActuales.length >= 5) {
        alert('Puede seleccionar máximo 5 géneros');
        return;
      }
      setDato('generos', [...generosActuales, generoId]);
    }
  };

  const eliminarGenero = (generoId) => {
    if (datos.generos.length === 1) {
      alert('Debe seleccionar al menos 1 género');
      return;
    }
    setDato('generos', datos.generos.filter(g => g !== generoId));
  };

  const obtenerNombreGenero = (generoId) => {
    const genero = generosDisponibles.find(g => g.id === generoId);
    return genero ? genero.nombre : 'Desconocido';
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    
    if (!datos.titulo.trim()) {
      alert('El título es obligatorio');
      return;
    }
    if (!archivoPortada) {
      alert('La portada es obligatoria');
      return;
    }
    if (!datos.autorId) {
      alert('El autor es obligatorio');
      return;
    }
    if (!datos.isbn.trim()) {
      alert('El ISBN es obligatorio');
      return;
    }
    if (!datos.paginas) {
      alert('Las páginas son obligatorias');
      return;
    }
    if (!datos.anioPublicacion) {
      alert('El año de publicación es obligatorio');
      return;
    }
    if (datos.generos.length === 0) {
      alert('Debe seleccionar al menos 1 género');
      return;
    }
    if (!datos.sinopsis.trim()) {
      alert('La sinopsis es obligatoria');
      return;
    }
    if (!datos.editorialId) {
      alert('La editorial es obligatoria');
      return;
    }

    const formData = new FormData();
    formData.append('titulo', datos.titulo.trim());
    formData.append('isbn', datos.isbn.trim());
    formData.append('sinopsis', datos.sinopsis.trim());
    formData.append('paginas', parseInt(datos.paginas));
    formData.append('anio_publicacion', parseInt(datos.anioPublicacion));
    formData.append('autor_id', parseInt(datos.autorId));
    formData.append('editorial_id', parseInt(datos.editorialId));
    formData.append('portada', archivoPortada);
    
    datos.generos.forEach(generoId => {
      formData.append('generos[]', generoId);
    });

    alGuardar(formData);
  };

  return (
    <div className="modal-overlay-libro" onClick={alCerrar}>
      <div className="modal-libro-container" onClick={(e) => e.stopPropagation()}>
        
        <button className="boton-volver-libro" onClick={alCerrar}>VOLVER</button>

        <form onSubmit={manejarEnvio}>
          <div className="contenido-modal-libro">
            <div className="seccion-izquierda-libro">
              <div className="portada-libro">
                {datos.urlPortada ? (
                  <img src={datos.urlPortada} alt="Portada" />
                ) : (
                  <div className="placeholder-portada">Sin imagen</div>
                )}
              </div>
              <label className="boton-cambiar-portada">
                Cambiar portada
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={manejarCambioImagen}
                  hidden
                />
              </label>
            </div>

            <div className="seccion-derecha-libro">
              <h2 className="titulo-campo-libro">Título</h2>
              <input
                type="text"
                value={datos.titulo}
                onChange={(e) => setDato('titulo', e.target.value)}
                className="campo-input-libro"
                placeholder="Ingrese el título del libro"
              />

              <h2 className="titulo-campo-libro">Autor</h2>
              <select
                value={datos.autorId || ''}
                onChange={(e) => setDato('autorId', e.target.value)}
                className="campo-input-libro campo-select-libro"
              >
                <option value="" disabled>Seleccionar autor</option>
                {autores.map(autor => (
                  <option key={autor.id} value={autor.id}>
                    {autor.nombre} {autor.apellido}
                  </option>
                ))}
              </select>

              <div className="tres-columnas-libro">
                <div className="columna-libro">
                  <h2 className="titulo-campo-libro">Año</h2>
                  <input
                    type="number"
                    value={datos.anioPublicacion}
                    onChange={(e) => setDato('anioPublicacion', e.target.value)}
                    className="campo-input-libro campo-pequeno"
                    placeholder="2024"
                  />
                </div>
                <div className="columna-libro">
                  <h2 className="titulo-campo-libro">Páginas</h2>
                  <input
                    type="number"
                    value={datos.paginas}
                    onChange={(e) => setDato('paginas', e.target.value)}
                    className="campo-input-libro campo-pequeno"
                    placeholder="123"
                  />
                </div>
                <div className="columna-libro">
                  <h2 className="titulo-campo-libro">ISBN</h2>
                  <input
                    type="text"
                    value={datos.isbn}
                    onChange={(e) => setDato('isbn', e.target.value)}
                    className="campo-input-libro"
                    placeholder="978-xxx-xxx-xxx-x"
                  />
                </div>
              </div>

              <div className="dos-columnas-libro">
                <div className="columna-libro">
                  <h2 className="titulo-campo-libro">
                    Genero ({datos.generos.length}/5)
                  </h2>
                  <div className="selector-generos">
                    <div 
                      className="display-generos"
                      onClick={() => setMostrarDropdownGeneros(!mostrarDropdownGeneros)}
                    >
                      <div className="generos-seleccionados">
                        {datos.generos.length === 0 ? (
                          <span style={{ color: '#999' }}>Seleccionar géneros...</span>
                        ) : (
                          datos.generos.map(generoId => (
                            <span key={generoId} className="etiqueta-genero">
                              {obtenerNombreGenero(generoId)}
                              <button
                                type="button"
                                className="boton-eliminar-genero"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  eliminarGenero(generoId);
                                }}
                              >
                                ×
                              </button>
                            </span>
                          ))
                        )}
                      </div>
                      <span className="flecha-dropdown">▼</span>
                    </div>
                    
                    {mostrarDropdownGeneros && (
                      <div className="dropdown-generos">
                        {generosDisponibles.length === 0 ? (
                          <div style={{ padding: '10px', textAlign: 'center', color: '#999' }}>
                            No hay géneros disponibles. Créalos primero en la sección Géneros.
                          </div>
                        ) : (
                          generosDisponibles.map(genero => (
                            <label key={genero.id} className="opcion-genero">
                              <input
                                type="checkbox"
                                checked={datos.generos.includes(genero.id)}
                                onChange={() => alternarGenero(genero.id)}
                              />
                              <span>{genero.nombre}</span>
                            </label>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="columna-libro">
                  <h2 className="titulo-campo-libro">Editorial</h2>
                  <select
                    value={datos.editorialId || ''}
                    onChange={(e) => setDato('editorialId', e.target.value)}
                    className="campo-input-libro campo-select-libro"
                  >
                    <option value="" disabled>Seleccionar editorial</option>
                    {editoriales.map(editorial => (
                      <option key={editorial.id} value={editorial.id}>
                        {editorial.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <h2 className="titulo-campo-libro">Sinopsis</h2>
              <textarea
                value={datos.sinopsis}
                onChange={(e) => setDato('sinopsis', e.target.value)}
                className="campo-textarea-libro"
                rows="5"
                placeholder="Ingrese la sinopsis del libro"
              />

              <button type="submit" className="boton-crear-libro">
                Crear
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}