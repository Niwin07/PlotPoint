import React, { useState } from 'react';
import '/src/componentes/modals/ModalLibro.css';

export default function BookEditModal({ book, onClose, onSave }) {
  const availableGenres = [
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

  const availableAuthors = [
    'Gabriel García Márquez',
    'J.K. Rowling',
    'Stephen King',
    'Isabel Allende',
    'Paulo Coelho',
    'Mario Vargas Llosa',
    'Julio Cortázar',
    'Jorge Luis Borges',
    'Laura Esquivel',
    'Carlos Ruiz Zafón',
    'Haruki Murakami',
    'Jane Austen',
    'George Orwell',
    'Agatha Christie',
    'Ernest Hemingway'
  ];

  const availablePublishers = [
    'LibroTeca',
    'Penguin Random House',
    'Planeta',
    'Alfaguara',
    'Anagrama',
    'Salamandra',
    'Tusquets',
    'Ediciones B',
    'Destino',
    'Santillana',
    'HarperCollins',
    'Editorial Sudamericana',
    'Paidós',
    'Crítica',
    'Seix Barral'
  ];

  const [formData, setFormData] = useState({
    title: book?.title || 'Harry Potter',
    author: book?.author || 'J.K. Rowling',
    year: book?.year || '2025',
    pages: book?.pages || '123',
    isbn: book?.isbn || '978-030-563-636-3',
    genres: book?.genres || ['Fantasía'],
    publisher: book?.publisher || 'LibroTeca',
    synopsis: book?.synopsis || 'adwdawbdiwabdawbudlhawudawodawdwaoudbawudlawodubawodubawodubawdouawbdouawbdowudlawondbawoudbawoudbawoubdawoudbawodubawoubdawoudbawodbawoudl...',
    coverImage: book?.coverImage || null
  });

  const [showGenreDropdown, setShowGenreDropdown] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          coverImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenreToggle = (genre) => {
    setFormData(prev => {
      const currentGenres = prev.genres;
      const isSelected = currentGenres.includes(genre);
      
      if (isSelected) {
        if (currentGenres.length === 1) {
          alert('Debe seleccionar al menos 1 género');
          return prev;
        }
        return {
          ...prev,
          genres: currentGenres.filter(g => g !== genre)
        };
      } else {
        if (currentGenres.length >= 5) {
          alert('Puede seleccionar máximo 5 géneros');
          return prev;
        }
        return {
          ...prev,
          genres: [...currentGenres, genre]
        };
      }
    });
  };

  const handleRemoveGenre = (genre) => {
    if (formData.genres.length === 1) {
      alert('Debe seleccionar al menos 1 género');
      return;
    }
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.filter(g => g !== genre)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.genres.length === 0) {
      alert('Debe seleccionar al menos 1 género');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="modal-overlay-edit" onClick={onClose}>
      <div className="modal-container-edit" onClick={(e) => e.stopPropagation()}>
        
        <button className="back-button" onClick={onClose}>VOLVER</button>

        <form onSubmit={handleSubmit}>
          <div className="modal-content">
            <div className="left-section">
              <div className="book-cover">
                {formData.coverImage ? (
                  <img src={formData.coverImage} alt="Portada" />
                ) : (
                  <div className="cover-placeholder">Sin imagen</div>
                )}
              </div>
              <label className="change-cover-btn">
                Cambiar portada
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  hidden
                />
              </label>
            </div>

            <div className="right-section">
              <h2 className="section-title">Título</h2>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="input-field"
              />

              <h2 className="section-title">Autor</h2>
              <select
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                className="input-field select-field"
              >
                {availableAuthors.map(author => (
                  <option key={author} value={author}>
                    {author}
                  </option>
                ))}
              </select>

              <div className="three-column">
                <div className="column">
                  <h2 className="section-title">Año</h2>
                  <input
                    type="text"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="input-field small"
                  />
                </div>
                <div className="column">
                  <h2 className="section-title">Páginas</h2>
                  <input
                    type="text"
                    name="pages"
                    value={formData.pages}
                    onChange={handleInputChange}
                    className="input-field small"
                  />
                </div>
                <div className="column">
                  <h2 className="section-title">ISBN</h2>
                  <input
                    type="text"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="two-column">
                <div className="column">
                  <h2 className="section-title">
                    Genero ({formData.genres.length}/5)
                  </h2>
                  <div className="genre-selector">
                    <div 
                      className="genre-display"
                      onClick={() => setShowGenreDropdown(!showGenreDropdown)}
                    >
                      <div className="selected-genres">
                        {formData.genres.map(genre => (
                          <span key={genre} className="genre-tag">
                            {genre}
                            <button
                              type="button"
                              className="remove-genre"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveGenre(genre);
                              }}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <span className="dropdown-arrow">˅</span>
                    </div>
                    
                    {showGenreDropdown && (
                      <div className="genre-dropdown">
                        {availableGenres.map(genre => (
                          <label key={genre} className="genre-option">
                            <input
                              type="checkbox"
                              checked={formData.genres.includes(genre)}
                              onChange={() => handleGenreToggle(genre)}
                            />
                            <span>{genre}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="column">
                  <h2 className="section-title">Editorial</h2>
                  <select
                    name="publisher"
                    value={formData.publisher}
                    onChange={handleInputChange}
                    className="input-field select-field"
                  >
                    {availablePublishers.map(publisher => (
                      <option key={publisher} value={publisher}>
                        {publisher}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <h2 className="section-title">Sinopsis</h2>
              <textarea
                name="synopsis"
                value={formData.synopsis}
                onChange={handleInputChange}
                className="textarea-field"
                rows="5"
              />

              <button type="submit" className="edit-button">
                Editar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}