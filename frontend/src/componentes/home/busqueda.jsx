import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "wouter";
import "/src/componentes/home/busqueda.css";

const Busqueda = () => {
  // estados
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("");
  const [generos, setGeneros] = useState([]);
  const [resultados, setResultados] = useState([]);

  // cuando se carga la página, mandamos a traer los generos para llenar el <select> de los filtros
  useEffect(() => {
    cargarGeneros();
  }, []);

  const cargarGeneros = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/busqueda/libros/generos');
      if (response.data.status === 'ok') {
        setGeneros(response.data.generos);
      }
    } catch (err) {
      console.error('Error al cargar géneros:', err);
    }
  };

  // esta es la funcion principal, es la que ve que tipo de busqueda hacer y la solicita
  const manejarBusqueda = async () => {
    const termino = busqueda.trim();

    // en este caso si el user escoge una categoria se hace la busqueda filtrada por ele genero escogido
    if (categoria !== "") {
      try {
        // añadimos el filtro y el texto que ingreso el user (si es que metio algo)
        const params = { genero: categoria };
        if (termino) params.q = termino;
        
        const response = await axios.get('http://localhost:3000/api/busqueda/libros', { params });
        
        // solo guardamos libros, usuarios no traemos por que estamos filtrando por genero
        if (response.data.status === 'ok') {
          setResultados([{ tipo: "libros", data: response.data.libros }]);
        }
      } catch (err) {
        console.error('Error en búsqueda por género:', err);
        setResultados([]);
      }
      return;
    }

    // validamos que el termino no este pelado
    if (termino === "") {
      setResultados([]);
      return;
    }

    // busqueda general, aca traemos tanto usuarios como libros
    try {
      const response = await axios.get('http://localhost:3000/api/busqueda', {
        params: { q: termino }
      });
      
      const data = response.data;

      if (data.status === 'ok') {
        // creamos un array con dos grupos para poder mostrarlos separados
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
    <div className="containe"> {/* en su momento creia que lo habias escrito mal y rompi toda la busqueda xd */}
    
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
          {/* mapeamos los generos que tragimos al cargar la pag */}
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
          // mapeamos los grupos de resultados (usuarios y libros) el condicional se ejecuta hasta que se agote el array de cada grupo
          resultados.map((grupo, i) =>
            grupo.data.length > 0 ? (
              <div key={i}>
                {/* render condicional, en este caso renderiza si la lista que recibe es de users */}
                {grupo.tipo === "usuarios" ? (
                  <div className="usuarios">
                    {grupo.data.map((usuario) => (
                      <Link href={`/perfil/${usuario.id}`} key={usuario.id}>
                        <div className="usuario" style={{ cursor: "pointer" }}>
                          <img 
                            src={`${usuario.url_avatar}`} 
                            alt={usuario.nombre_usuario}
                          />
                          <p>{usuario.nombre_usuario}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : ( // este es el operador que renderiza acorde al caso (miralo como un if else)
                  // y en este caso si es de libros
                  <div className="book-grid2">
                    {grupo.data.map((libro) => (
                      <div className="book-item2" key={libro.id}>
                        <Link href={`/libro/${libro.id}`}>
                            <img 
                              src={libro.url_portada || "/src/img/libro.webp"} 
                              alt={libro.titulo}
                              style={{ cursor: "pointer" }}
                              onError={(e) => {
                                e.target.src = "/src/img/libro.webp";
                              }}
                            />
                        </Link>
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