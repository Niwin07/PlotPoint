import React, { useState } from 'react';
import '/src/componentes/modals/ModalLibro.css';

export default function ModalEditarLibro({ libro, alCerrar, alGuardar }) {
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

  const [datosFormulario, setDatosFormulario] = useState({
    titulo: libro?.titulo || '',
    isbn: libro?.isbn || '',
    sinopsis: libro?.sinopsis || '',
    urlPortada: libro?.urlPortada || null,
    paginas: libro?.paginas || '',
    anioPublicacion: libro?.anioPublicacion || '',
    editorialId: libro?.editorialId || editorialesDisponibles[0].id,
    autorId: libro?.autorId || autoresDisponibles[0].id,
    generos: libro?.generos || ['Ficción']
  });

  const [mostrarDropdownGeneros, setMostrarDropdownGeneros] = useState(false);

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;
    setDatosFormulario(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const manejarCambioImagen = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      const lector = new FileReader();
      lector.onloadend = () => {
        setDatosFormulario(prev => ({
          ...prev,
          urlPortada: lector.result
        }));
      };
      lector.readAsDataURL(archivo);
    }
  };

  const alternarGenero = (genero) => {
    setDatosFormulario(prev => {
      const generosActuales = prev.generos;
      const estaSeleccionado = generosActuales.includes(genero);
      
      if (estaSeleccionado) {
        if (generosActuales.length === 1) {
          alert('Debe seleccionar al menos 1 género');
          return prev;
        }
        return {
          ...prev,
          generos: generosActuales.filter(g => g !== genero)
        };
      } else {
        if (generosActuales.length >= 5) {
          alert('Puede seleccionar máximo 5 géneros');
          return prev;
        }
        return {
          ...prev,
          generos: [...generosActuales, genero]
        };
      }
    });
  };

  const eliminarGenero = (genero) => {
    if (datosFormulario.generos.length === 1) {
      alert('Debe seleccionar al menos 1 género');
      return;
    }
    setDatosFormulario(prev => ({
      ...prev,
      generos: prev.generos.filter(g => g !== genero)
    }));
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!datosFormulario.titulo.trim()) {
      alert('El título es obligatorio');
      return;
    }
    if (!datosFormulario.isbn.trim()) {
      alert('El ISBN es obligatorio');
      return;
    }
    if (!datosFormulario.paginas) {
      alert('Las páginas son obligatorias');
      return;
    }
    if (!datosFormulario.anioPublicacion) {
      alert('El año de publicación es obligatorio');
      return;
    }
    if (datosFormulario.generos.length === 0) {
      alert('Debe seleccionar al menos 1 género');
      return;
    }
    if (!datosFormulario.sinopsis.trim()) {
      alert('La sinopsis es obligatoria');
      return;
    }

    alGuardar(datosFormulario);
  };

  return (
    <div className="modal-overlay-libro" onClick={alCerrar}>
      <div className="modal-libro-container" onClick={(e) => e.stopPropagation()}>
        
        
        <button className="boton-volver-libro" onClick={alCerrar}>VOLVER</button>

        <form onSubmit={manejarEnvio}>
          <div className="contenido-modal-libro">
            <div className="seccion-izquierda-libro">
              <div className="portada-libro">
                {datosFormulario.urlPortada ? (
                  <img src={datosFormulario.urlPortada} alt="Portada" />
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
                name="titulo"
                value={datosFormulario.titulo}
                onChange={manejarCambioInput}
                className="campo-input-libro"
                placeholder="Ingrese el título del libro"
              />

              <h2 className="titulo-campo-libro">Autor</h2>
              <select
                name="autorId"
                value={datosFormulario.autorId}
                onChange={manejarCambioInput}
                className="campo-input-libro campo-select-libro"
              >
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
                    type="text"
                    name="anioPublicacion"
                    value={datosFormulario.anioPublicacion}
                    onChange={manejarCambioInput}
                    className="campo-input-libro campo-pequeno"
                    placeholder="2024"
                  />
                </div>
                <div className="columna-libro">
                  <h2 className="titulo-campo-libro">Páginas</h2>
                  <input
                    type="text"
                    name="paginas"
                    value={datosFormulario.paginas}
                    onChange={manejarCambioInput}
                    className="campo-input-libro campo-pequeno"
                    placeholder="123"
                  />
                </div>
                <div className="columna-libro">
                  <h2 className="titulo-campo-libro">ISBN</h2>
                  <input
                    type="text"
                    name="isbn"
                    value={datosFormulario.isbn}
                    onChange={manejarCambioInput}
                    className="campo-input-libro"
                    placeholder="978-xxx-xxx-xxx-x"
                  />
                </div>
              </div>

              <div className="dos-columnas-libro">
                <div className="columna-libro">
                  <h2 className="titulo-campo-libro">
                    Genero ({datosFormulario.generos.length}/5)
                  </h2>
                  <div className="selector-generos">
                    <div 
                      className="display-generos"
                      onClick={() => setMostrarDropdownGeneros(!mostrarDropdownGeneros)}
                    >
                      <div className="generos-seleccionados">
                        {datosFormulario.generos.map(genero => (
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
                              checked={datosFormulario.generos.includes(genero)}
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
                    name="editorialId"
                    value={datosFormulario.editorialId}
                    onChange={manejarCambioInput}
                    className="campo-input-libro campo-select-libro"
                  >
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
                name="sinopsis"
                value={datosFormulario.sinopsis}
                onChange={manejarCambioInput}
                className="campo-textarea-libro"
                rows="5"
                placeholder="Ingrese la sinopsis del libro"
              />

              <button type="submit" className="boton-editar-libro">
                Editar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}