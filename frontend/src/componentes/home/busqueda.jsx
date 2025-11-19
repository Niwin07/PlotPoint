import React, { useState, useEffect } from "react";
import "/src/componentes/home/busqueda.css";

const Busqueda = () => {
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("");
  const [generos, setGeneros] = useState([]);
  const [resultados, setResultados] = useState([]);

  useEffect(() => {
    cargarGeneros();
  }, []);

  const cargarGeneros = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/busqueda/libros/generos');
      const data = await response.json();
      
      if (data.status === 'ok') {
        setGeneros(data.generos);
      }
    } catch (err) {
      console.error('Error al cargar géneros:', err);
    }
  };

  const manejarBusqueda = async () => {
    const termino = busqueda.trim();

    if (categoria !== "") {
      try {
        const params = new URLSearchParams({ genero: categoria });
        if (termino) {
          params.append('q', termino);
        }
        
        const response = await fetch(`http://localhost:3000/api/busqueda/libros?${params}`);
        const data = await response.json();
        
        if (data.status === 'ok') {
          setResultados([{ tipo: "libros", data: data.libros }]);
        }
      } catch (err) {
        console.error('Error en búsqueda por género:', err);
        setResultados([]);
      }
      return;
    }

    if (termino === "") {
      setResultados([]);
      return;
    }


    try {
      const response = await fetch(`http://localhost:3000/api/busqueda?q=${encodeURIComponent(termino)}`);
      
      if (!response.ok) {
        console.error('Error HTTP:', response.status, response.statusText);
        setResultados([]);
        return;
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error('La respuesta no es JSON. Content-Type:', contentType);
        const text = await response.text();
        console.error('Contenido recibido:', text.substring(0, 200));
        setResultados([]);
        return;
      }

      const data = await response.json();
      
      if (data.status === 'ok') {
         console.log('Datos recibidos:', data); 
         console.log('Usuarios:', data.usuarios); 
        setResultados([
          { tipo: "usuarios", data: data.usuarios || [] },
          { tipo: "libros", data: data.libros || [] }
        ]);
      }
    } catch (err) {
      console.error('Error en búsqueda general:', err);
      setResultados([]);
    }
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
          {generos.map((genero) => (
            <option key={genero.id} value={genero.nombre}>
              {genero.nombre}
            </option>
          ))}
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
                      <a href={`/perfil/${usuario.id}`} key={usuario.id}>
                        <div className="usuario">
                          <img 
                            src={`${usuario.url_avatar}`} 
                            alt={usuario.nombre_usuario}
                          />
                          <p>{usuario.nombre_usuario}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="book-grid2">
                    {grupo.data.map((libro) => (
                      <div className="book-item2" key={libro.id}>
                        <a href={`/libro/${libro.id}`}>
                          <img 
                            src={libro.url_portada || "/src/img/libro.webp"} 
                            alt={libro.titulo}
                            onError={(e) => {
                              e.target.src = "/src/img/libro.webp";
                            }}
                          />
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