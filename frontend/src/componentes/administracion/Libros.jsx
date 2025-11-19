import React, { useState, useEffect } from 'react';
import '/src/componentes/administracion/admin.css';

import ModalEditarLibro from '/src/componentes/modals/libro/ModalEditarLibro.jsx';
import ModalCrearLibro from '/src/componentes/modals/libro/ModalCrearLibro.jsx';

import usePaginacion from "/src/hooks/usePaginacion.jsx";

export default function Libros({
    libros,
    autores,
    editoriales,
    generos,
    loading,
    crearLibro,
    actualizarLibro,
    eliminarLibro,
    fetchLibros,
    api
}) {

    const [buscador, setBuscador] = useState("");
    const [filtroCategoria, setFiltroCategoria] = useState("");
    const [ordenFecha, setOrdenFecha] = useState("");
    const [ordenLetra, setOrdenLetra] = useState("a-z");

    const [listaProcesada, setListaProcesada] = useState([]);

    const pag = usePaginacion(listaProcesada, 10);

    const aplicarFiltros = (base) => {
        const toNum = (x) => Number(x) || 0;

        let temp = [...base];

        if (filtroCategoria !== "") {
            temp = temp.filter(l =>
                l.generos?.some(g => g.id === parseInt(filtroCategoria))
            );
        }

        if (ordenFecha === "recientes") {
            temp.sort((a, b) => toNum(b.anio_publicacion) - toNum(a.anio_publicacion));
        } else if (ordenFecha === "antiguos") {
            temp.sort((a, b) => toNum(a.anio_publicacion) - toNum(b.anio_publicacion));
        }

        if (ordenLetra === "a-z") {
            temp.sort((a, b) => a.titulo.localeCompare(b.titulo));
        } else if (ordenLetra === "z-a") {
            temp.sort((a, b) => b.titulo.localeCompare(a.titulo));
        }

        return temp;
    };

    const buscarLibros = () => {
        const q = buscador.toLowerCase();
        let base = libros.filter(l =>
            (l.titulo || "").toLowerCase().includes(q) ||
            (l.autor_nombre || "").toLowerCase().includes(q) ||
            (l.autor_apellido || "").toLowerCase().includes(q) ||
            (l.isbn || "").toLowerCase().includes(q)
        );

        const procesada = aplicarFiltros(base);
        setListaProcesada(procesada);
        pag.setPaginaActual(0);
    };

    useEffect(() => {
        if (buscador.trim() === "") {
            const procesada = aplicarFiltros(libros);
            setListaProcesada(procesada);
            pag.setPaginaActual(0);
        }
    }, [filtroCategoria, ordenFecha, ordenLetra]);

    useEffect(() => {
        if (buscador.trim() === "") {
            const procesada = aplicarFiltros(libros);
            setListaProcesada(procesada);
            pag.setPaginaActual(0);
        }
    }, [buscador]);

    useEffect(() => {
        const procesada = aplicarFiltros(libros);
        setListaProcesada(procesada);
        pag.setPaginaActual(0);
    }, [libros]);

    const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
    const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
    const [libroSeleccionado, setLibroSeleccionado] = useState(null);

    const Editar = (libro) => {
        setLibroSeleccionado(libro);
        setMostrarModalEditar(true);
    };

    const Nuevo = () => {
        if (!autores.length) return alert("Primero crea un autor");
        if (!editoriales.length) return alert("Primero crea una editorial");
        if (!generos.length) return alert("Primero crea un género");
        setMostrarModalCrear(true);
    };

    const cerrarModalEditar = () => setMostrarModalEditar(false);
    const cerrarModalCrear = () => setMostrarModalCrear(false);

    const Borrar = async (id) => {
        if (!confirm("¿Seguro deseas eliminar este libro?")) return;
        const res = await eliminarLibro(id);
        if (res.success) fetchLibros();
    };

    return (
        <div>
            <div className="acciones">

                <input
                    type="text"
                    placeholder="Buscar libro..."
                    value={buscador}
                    onChange={e => setBuscador(e.target.value)}
                    className="InputAdmin"
                />

                <select value={ordenFecha} onChange={e => setOrdenFecha(e.target.value)} className="InputAdmin">
                    <option value="">Fecha</option>
                    <option value="recientes">Más recientes</option>
                    <option value="antiguos">Más antiguos</option>
                </select>

                <select value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value)} className="InputAdmin">
                    <option value="">Género (todos)</option>
                    {generos.map(g => (
                        <option key={g.id} value={g.id}>{g.nombre}</option>
                    ))}
                </select>

                <select value={ordenLetra} onChange={e => setOrdenLetra(e.target.value)} className="InputAdmin">
                    <option value="a-z">A - Z</option>
                    <option value="z-a">Z - A</option>
                </select>

                <button className="Buscar" onClick={buscarLibros}>Buscar</button>

                <button className="Refrescar" onClick={fetchLibros}>
                    {loading ? "Cargando..." : "Refrescar"}
                </button>

                <button className="Nuevo" onClick={Nuevo}>Nuevo Libro</button>
            </div>

            <table id="t01">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>LIBRO</th>
                        <th>GÉNEROS</th>
                        <th>ISBN</th>
                        <th>PUBLICADO</th>
                        <th>ACCIONES</th>
                    </tr>
                </thead>

                <tbody>
                    {pag.paginaItems.map(libro => (
                        <tr key={libro.id}>
                            <td>{libro.id}</td>

                            <td>
                                <p style={{ margin: 0, fontWeight: "bold" }}>{libro.titulo}</p>
                                <span style={{ fontSize: "13px", color: "#666" }}>
                                    {libro.autor_nombre} {libro.autor_apellido}
                                </span>
                            </td>

                            <td>
                                {libro.generos?.map((g, i) => (
                                    <span key={g.id}>
                                        {g.nombre}{i < libro.generos.length - 1 ? ", " : ""}
                                    </span>
                                ))}
                            </td>

                            <td>{libro.isbn}</td>
                            <td>{libro.anio_publicacion}</td>

                            <td>
                                <button className="Editar" onClick={() => Editar(libro)}>Editar</button>
                                <button className="Borrar" onClick={() => Borrar(libro.id)}>Borrar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {listaProcesada.length > 0 && (
                <div style={{ textAlign: "center", marginTop: 20 }}>
                    <button className="Editar" onClick={pag.paginaAnterior} disabled={pag.paginaActual === 0}>
                        ← Anterior
                    </button>

                    <span style={{ margin: "0 15px" }}>
                        Página {pag.paginaActual + 1} de {pag.totalPaginas}
                    </span>

                    <button
                        className="Editar"
                        onClick={pag.siguientePagina}
                        disabled={pag.paginaActual + 1 >= pag.totalPaginas}
                    >
                        Siguiente →
                    </button>
                </div>
            )}

            {mostrarModalEditar && libroSeleccionado && (
                <ModalEditarLibro
                    libro={{
                        ...libroSeleccionado,
                        generos: libroSeleccionado.generos.map(g => g.id)
                    }}
                    autores={autores}
                    editoriales={editoriales}
                    generosDisponibles={generos}
                    alCerrar={cerrarModalEditar}
                    alGuardar={actualizarLibro}
                    libroId={libroSeleccionado.id}
                    api={api}
                />
            )}

            {mostrarModalCrear && (
                <ModalCrearLibro
                    autores={autores}
                    editoriales={editoriales}
                    generosDisponibles={generos}
                    alCerrar={cerrarModalCrear}
                    alGuardar={crearLibro}
                />
            )}
        </div>
    );
}
