import React, { useState, useEffect } from 'react';
import '/src/componentes/administracion/admin.css';

import ModalEditarAutor from '/src/componentes/modals/autor/ModalEditarAutor.jsx';
import ModalCrearAutor from '/src/componentes/modals/autor/ModalCrearAutor.jsx';

import usePaginacion from "/src/hooks/usePaginacion.jsx";

export default function Autores({
    autores,
    loading,
    crearAutor,
    actualizarAutor,
    eliminarAutor,
    fetchAutores
}) {

    // estados para manejar el input de busqueda y la lista filtrada
    const [buscador, setBuscador] = useState("");
    const [listaProcesada, setListaProcesada] = useState([]);

    // conectamos la paginacion a la lista filtrada, no a la original.
    // asi la paginacion se adapta a los resultados de busqueda.
    const pag = usePaginacion(listaProcesada, 10);

    // filtra por nombre o apellido
    const Buscar = () => {
        const q = buscador.toLowerCase();

        let filtrados = autores.filter(a =>
            (a.nombre || "").toLowerCase().includes(q) ||
            (a.apellido || "").toLowerCase().includes(q)
        );

        setListaProcesada(filtrados);
        pag.setPaginaActual(0); // reseteamos a la pagina 1
    };

    // si limpian el buscador (texto vacio), mostramos todo de nuevo
    useEffect(() => {
        if (buscador.trim() === "") {
            setListaProcesada(autores);
            pag.setPaginaActual(0);
        }
    }, [buscador]);

    // si cambia la data original en el padre (ej: creaste un autor nuevo),
    // actualizamos nuestra lista local para reflejar los cambios
    useEffect(() => {
        setListaProcesada(autores);
        pag.setPaginaActual(0);
    }, [autores]);

    const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
    const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
    const [autorSeleccionado, setAutorSeleccionado] = useState(null);

    const Editar = (autor) => {
        setAutorSeleccionado(autor);
        setMostrarModalEditar(true);
    };

    const cerrarModalEditar = () => setMostrarModalEditar(false);
    const cerrarModalCrear = () => setMostrarModalCrear(false);

    const Nuevo = () => setMostrarModalCrear(true);

    const Borrar = async (id) => {
        if (!confirm("¿Seguro deseas eliminar este autor?")) return;

        const res = await eliminarAutor(id);
        if (res.success) fetchAutores();
    };

    return (
        <div>
            <div className="acciones">
                <input
                    type="text"
                    placeholder="Buscar autor..."
                    value={buscador}
                    onChange={(e) => setBuscador(e.target.value)}
                    className="InputAdmin"
                />

                <button className="Buscar" onClick={Buscar}>Buscar</button>

                <button className="Refrescar" onClick={fetchAutores}>
                    {loading ? "Cargando..." : "Refrescar"}
                </button>

                <button className="Nuevo" onClick={Nuevo}>
                    Nuevo
                </button>
            </div>

            <table id="t01">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>AUTOR</th>
                        <th>NACIONALIDAD</th>
                        <th>ACCIONES</th>
                    </tr>
                </thead>

                <tbody>
                    {/* renderizado paginado: solo items de la pagina actual */}
                    {pag.paginaItems.map(autor => (
                        <tr key={autor.id}>
                            <td>{autor.id}</td>

                            <td>
                                <strong>{autor.nombre} {autor.apellido}</strong>
                            </td>

                            <td>{autor.nacionalidad}</td>

                            <td>
                                <button className="Editar" onClick={() => Editar(autor)}>Editar</button>
                                <button className="Borrar" onClick={() => Borrar(autor.id)}>Borrar</button>
                            </td>
                        </tr>
                    ))}

                    {!loading && pag.paginaItems.length === 0 && (
                        <tr><td colSpan="4">No hay resultados.</td></tr>
                    )}
                </tbody>
            </table>

            {/* controles de paginacion (solo si hay resultados) */}
            {listaProcesada.length > 0 && (
                <div style={{ textAlign: "center", marginTop: 20 }}>
                    <button
                        className="Editar"
                        onClick={pag.paginaAnterior}
                        disabled={pag.paginaActual === 0}
                    >
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

            {mostrarModalEditar && autorSeleccionado && (
                <ModalEditarAutor
                    autor={autorSeleccionado}
                    alCerrar={cerrarModalEditar}
                    alGuardar={actualizarAutor}
                />
            )}

            {mostrarModalCrear && (
                <ModalCrearAutor
                    alCerrar={cerrarModalCrear}
                    alGuardar={crearAutor}
                />
            )}
        </div>
    );
}