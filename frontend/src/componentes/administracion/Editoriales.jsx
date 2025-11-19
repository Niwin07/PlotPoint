import React, { useState, useEffect } from 'react';
import '/src/componentes/administracion/admin.css';

import ModalEditarEditorial from '/src/componentes/modals/editorial/ModalEditarEditorial.jsx';
import ModalCrearEditorial from '/src/componentes/modals/editorial/ModalCrearEditorial.jsx';

import usePaginacion from "/src/hooks/usePaginacion.jsx";

export default function Editoriales({
    editoriales,
    loading,
    crearEditorial,
    actualizarEditorial,
    eliminarEditorial,
    fetchEditoriales
}) {

    const [buscador, setBuscador] = useState("");
    const [listaProcesada, setListaProcesada] = useState([]);

    const pag = usePaginacion(listaProcesada, 10);

    const Buscar = () => {
        const q = buscador.toLowerCase();

        const filtrados = editoriales.filter(e =>
            (e.nombre || "").toLowerCase().includes(q) ||
            (e.pais || "").toLowerCase().includes(q)
        );

        setListaProcesada(filtrados);
        pag.setPaginaActual(0);
    };

    useEffect(() => {
        if (buscador.trim() === "") {
            setListaProcesada(editoriales);
            pag.setPaginaActual(0);
        }
    }, [buscador]);

    useEffect(() => {
        setListaProcesada(editoriales);
        pag.setPaginaActual(0);
    }, [editoriales]);

    const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
    const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
    const [editorialSeleccionada, setEditorialSeleccionada] = useState(null);

    const Editar = (editorial) => {
        setEditorialSeleccionada(editorial);
        setMostrarModalEditar(true);
    };

    const cerrarModalEditar = () => setMostrarModalEditar(false);
    const cerrarModalCrear = () => setMostrarModalCrear(false);

    const Nuevo = () => setMostrarModalCrear(true);

    const Borrar = async (id) => {
        if (!confirm("¿Seguro deseas eliminar esta editorial?")) return;

        const res = await eliminarEditorial(id);
        if (res.success) fetchEditoriales();
    };

    return (
        <div>

            <div className="acciones">
                <input
                    type="text"
                    placeholder="Buscar editorial..."
                    value={buscador}
                    onChange={(e) => setBuscador(e.target.value)}
                    className="InputAdmin"
                />

                <button className="Buscar" onClick={Buscar}>Buscar</button>

                <button className="Refrescar" onClick={fetchEditoriales}>
                    {loading ? "Cargando..." : "Refrescar"}
                </button>

                <button className="Nuevo" onClick={Nuevo}>
                    Nueva
                </button>
            </div>

            <table id="t01">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>NOMBRE</th>
                        <th>PAÍS</th>
                        <th>ACCIONES</th>
                    </tr>
                </thead>

                <tbody>
                    {pag.paginaItems.map(editorial => (
                        <tr key={editorial.id}>
                            <td>{editorial.id}</td>

                            <td><strong>{editorial.nombre}</strong></td>

                            <td>{editorial.pais}</td>

                            <td>
                                <button className="Editar" onClick={() => Editar(editorial)}>Editar</button>
                                <button className="Borrar" onClick={() => Borrar(editorial.id)}>Borrar</button>
                            </td>
                        </tr>
                    ))}

                    {!loading && pag.paginaItems.length === 0 && (
                        <tr><td colSpan="4">No hay resultados.</td></tr>
                    )}
                </tbody>
            </table>

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

            {mostrarModalEditar && editorialSeleccionada && (
                <ModalEditarEditorial
                    editorial={editorialSeleccionada}
                    alCerrar={cerrarModalEditar}
                    alGuardar={actualizarEditorial}
                />
            )}

            {mostrarModalCrear && (
                <ModalCrearEditorial
                    alCerrar={cerrarModalCrear}
                    alGuardar={crearEditorial}
                />
            )}
        </div>
    );
}
