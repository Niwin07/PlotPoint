import React, { useState } from "react";
import "/src/componentes/home/busqueda.css";

const Busqueda = () => {
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("");
  const [resultados, setResultados] = useState([]);

  // --- Datos simulados ---
  const usuarios = [
    { id: 1, nombre: "Maria_Jose_Rodriguez2006" },
    { id: 2, nombre: "lector_apasionado"},
    { id: 3, nombre: "libromaniaco" },
    { id: 4, nombre: "usuario_diferente" },
    { id: 5, nombre: "lector_apasionado" },
    { id: 6, nombre: "libromaniaco" },
  ];

  const libros = [
    {
      id: 1,
      titulo: "It",
      autor: "Stephen King",
      genero: "terror",
      imagen: "/src/img/libro.webp",
    },
    {
      id: 2,
      titulo: "Harry Potter and the Deathly Hallows",
      autor: "J. K. Rowling",
      genero: "fantasía",
      imagen:
        "/src/img/libro.webp",
    },
    {
      id: 3,
      titulo: "Drácula",
      autor: "Bram Stoker",
      genero: "terror",
      imagen: "/src/img/libro.webp",
    },
    {
      id: 4,
      titulo: "Pride and Prejudice",
      autor: "Jane Austen",
      genero: "romance",
      imagen: "/src/img/libro.webp",
    },
     {
      id: 5,
      titulo: "It",
      autor: "Stephen King",
      genero: "terror",
      imagen: "/src/img/libro.webp",
    },
    {
      id: 6,
      titulo: "Harry Potter and the Deathly Hallows",
      autor: "J. K. Rowling",
      genero: "fantasía",
      imagen:
        "/src/img/libro.webp",
    },
    {
      id: 7,
      titulo: "Drácula",
      autor: "Bram Stoker",
      genero: "terror",
      imagen: "/src/img/libro.webp",
    },
    {
      id: 8,
      titulo: "Pride and Prejudice",
      autor: "Jane Austen",
      genero: "romance",
      imagen: "/src/img/libro.webp",
    },
  ];

  const manejarBusqueda = () => {
    const termino = busqueda.toLowerCase().trim();

    // Si selecciona una categoría (género), mostrar solo libros de ese género
    if (categoria !== "") {
      const librosFiltrados = libros.filter(
        (libro) => libro.genero.toLowerCase() === categoria.toLowerCase()
      );
      setResultados([{ tipo: "libros", data: librosFiltrados }]);
      return;
    }

    // Si no hay texto, limpiar resultados
    if (termino === "") {
      setResultados([]);
      return;
    }

    // Buscar usuarios y libros por texto
    const usuariosFiltrados = usuarios.filter((u) =>
      u.nombre.toLowerCase().includes(termino)
    );
    const librosFiltrados = libros.filter((l) =>
      l.titulo.toLowerCase().includes(termino)
    );

    setResultados([
      { tipo: "usuarios", data: usuariosFiltrados },
      { tipo: "libros", data: librosFiltrados },
    ]);
  };

  return (
    <div className="containe">
      <div className="buscador">
        <input
          type="text"
          placeholder="Buscar usuario o libro"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        >
          <option value="">Seleccionar categoría</option>
          <option value="terror">Terror</option>
          <option value="fantasía">Fantasía</option>
          <option value="romance">Romance</option>
        </select>

        <button onClick={manejarBusqueda}>BUSCAR</button>
      </div>

      <div className="resultados">
        {resultados.length === 0 ? (
          <p className="sin-resultados">Sin resultados</p>
        ) : (
          resultados.map((grupo, i) =>
            grupo.data.length > 0 ? (
              <div key={i}>
                

                {grupo.tipo === "usuarios" ? (
                  <div className="usuarios">
                    {grupo.data.map((usuario) => (
                      <a href="/usuario/">
                      <div className="usuario" key={usuario.id}>
                        <img src="/src/img/perfil.webp" alt="" />
                       
                        
                        <p>{usuario.nombre}</p>
                        
                      </div>
                      </a>

                    ))}
                  </div>
                ) : (
                  <div className="book-grid2">
                    {grupo.data.map((libro) => (
                      <div className="book-item2" key={libro.id}>
                        <a href="/libro">
                        <img src={libro.imagen} alt={libro.titulo} />
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null
          )
        )}
      </div>
    </div>
  );
};

export default Busqueda;
