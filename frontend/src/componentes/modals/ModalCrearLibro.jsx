import React, { useState } from 'react';
import './ModalLibro.css';
import useLibro from '/src/hooks/useLibro';

export default function ModalCrearLibro({ alCerrar, alGuardar }) {
  const [datos, setDato] = useLibro();
  const [mostrarDropdownGeneros, setMostrarDropdownGeneros] = useState(false);

  const generosDisponibles = [
    'Ficción',
    'Terror',
    'Humor',
    'Romance',
    'Fantasía',
    'Ciencia Ficción',
    'Misterio',
    'Thriller',
    'Histórico',
    'Aventura',
    'Drama',
    'Biografía',
    'Poesía',
    'Ensayo',
    'Autoayuda',
    'Distopía',
    'Policial',
    'Juvenil'
  ];

  const autoresDisponibles = [
    { id: 1, nombre: 'Gabriel García Márquez' },
    { id: 2, nombre: 'J.K. Rowling' },
    { id: 3, nombre: 'Stephen King' },
    { id: 4, nombre: 'Isabel Allende' },
    { id: 5, nombre: 'Paulo Coelho' },
    { id: 6, nombre: 'Mario Vargas Llosa' },
    { id: 7, nombre: 'Julio Cortázar' },
    { id: 8, nombre: 'Jorge Luis Borges' },
    { id: 9, nombre: 'Laura Esquivel' },
    { id: 10, nombre: 'Carlos Ruiz Zafón' }
  ];

  const editorialesDisponibles = [
    { id: 1, nombre: 'LibroTeca' },
    { id: 2, nombre: 'Penguin Random House' },
    { id: 3, nombre: 'Planeta' },
    { id: 4, nombre: 'Alfaguara' },
    { id: 5, nombre: 'Anagrama' },
    { id: 6, nombre: 'Salamandra' },
    { id: 7, nombre: 'Tusquets' },
    { id: 8, nombre: 'Ediciones B' },
    { id: 9, nombre: 'Destino' },
    { id: 10, nombre: 'Santillana' }
  ];

  const manejarCambioImagen = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      const lector = new FileReader();
      lector.onloadend = () => {
        setDato('urlPortada', lector.result);
      };
      lector.readAsDataURL(archivo);
    }
  };

  const alternarGenero = (genero) => {
    const generosActuales = datos.generos;
    const estaSeleccionado = generosActuales.includes(genero);
    
    if (estaSeleccionado) {
      if (generosActuales.length === 1) {
        alert('Debe seleccionar al menos 1 género');
        return;
      }
      setDato('generos', generosActuales.filter(g => g !== genero));
    } else {
      if (generosActuales.length >= 5) {
        alert('Puede seleccionar máximo 5 géneros');
        return;
      }
      setDato('generos', [...generosActuales, genero]);
    }
  };

  const eliminarGenero = (genero) => {
    if (datos.generos.length === 1) {
      alert('Debe seleccionar al menos 1 género');
      return;
    }
    setDato('generos', datos.generos.filter(g => g !== genero));
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!datos.titulo.trim()) {
      alert('El título es obligatorio');
      return;
    }
    if(!datos.urlPortada){
      alert('La portada es obligatoria');
      return;
    }
    if(!datos.autorId){
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
    if(!datos.editorialId){
      alert('La editorial es obligatoria')
      return;
    }


    alGuardar(datos);
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
                {autoresDisponibles.map(autor => (
                  <option key={autor.id} value={autor.id}>
                    {autor.nombre}
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
                        {datos.generos.map(genero => (
                          <span key={genero} className="etiqueta-genero">
                            {genero}
                            <button
                              type="button"
                              className="boton-eliminar-genero"
                              onClick={(e) => {
                                e.stopPropagation();
                                eliminarGenero(genero);
                              }}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <span className="flecha-dropdown">˅</span>
                    </div>
                    
                    {mostrarDropdownGeneros && (
                      <div className="dropdown-generos">
                        {generosDisponibles.map(genero => (
                          <label key={genero} className="opcion-genero">
                            <input
                              type="checkbox"
                              checked={datos.generos.includes(genero)}
                              onChange={() => alternarGenero(genero)}
                            />
                            <span>{genero}</span>
                          </label>
                        ))}
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
                    {editorialesDisponibles.map(editorial => (
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