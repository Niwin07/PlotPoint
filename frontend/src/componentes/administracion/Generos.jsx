import React, { useState, useEffect } from 'react';
import '/src/componentes/administracion/admin.css';

import ModalEditarGenero from '/src/componentes/modals/genero/ModalEditarGenero.jsx';
import ModalCrearGenero from '/src/componentes/modals/genero/ModalCrearGenero.jsx';

import usePaginacion from "/src/hooks/usePaginacion.jsx";

export default function Generos({
    generos,
    loading,
    crearGenero,
    actualizarGenero,
    eliminarGenero,
    fetchGeneros
}) {

    // estados para manejar el input de busqueda y la lista filtrada
    const [buscador, setBuscador] = useState("");
    const [listaProcesada, setListaProcesada] = useState([]);

    // conectamos la paginacion a la lista filtrada, no a la original.
    // asi la paginacion se adapta a los resultados de busqueda.
    const pag = usePaginacion(listaProcesada, 10);

    // filtra por nombre o descripcion
    const Buscar = () => {
        const q = buscador.toLowerCase();

        const filtrados = generos.filter(g =>
            (g.nombre || "").toLowerCase().includes(q) ||
            (g.descripcion || "").toLowerCase().includes(q)
        );

        setListaProcesada(filtrados);
        pag.setPaginaActual(0); // reseteamos a la pagina 1
    };

    // si limpian el buscador (texto vacio), mostramos todo de nuevo
    useEffect(() => {
        if (buscador.trim() === "") {
            setListaProcesada(generos);
            pag.setPaginaActual(0);
        }
    }, [buscador]);

    // si cambia la data original en el padre,
    // actualizamos nuestra lista local para reflejar los cambios
    useEffect(() => {
        setListaProcesada(generos);
        pag.setPaginaActual(0);
    }, [generos]);

    const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
    const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
    const [generoSeleccionado, setGeneroSeleccionado] = useState(null);

    const Editar = (genero) => {
        setGeneroSeleccionado(genero);
        setMostrarModalEditar(true);
    };

    const cerrarModalEditar = () => setMostrarModalEditar(false);
    const cerrarModalCrear = () => setMostrarModalCrear(false);

    const Nuevo = () => setMostrarModalCrear(true);

    const Borrar = async (id) => {
        if (!confirm("¿Seguro deseas eliminar este género?")) return;

        const res = await eliminarGenero(id);
        if (res.success) fetchGeneros();
    };

    return (
        <div>

            <div className="acciones">
                <input
                    type="text"
                    placeholder="Buscar género..."
                    value={buscador}
                    onChange={(e) => setBuscador(e.target.value)}
                    className="InputAdmin"
                />

                <button className="Buscar" onClick={Buscar}>Buscar</button>

                <button className="Refrescar" onClick={fetchGeneros}>
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
                        <th>GÉNERO</th>
                        <th>DESCRIPCIÓN</th>
                        <th>ACCIONES</th>
                    </tr>
                </thead>

                <tbody>
                    {pag.paginaItems.map(genero => (
                        <tr key={genero.id}>
                            <td>{genero.id}</td>

                            <td style={{ fontWeight: "bold" }}>
                                {genero.nombre}
                            </td>

                            <td style={{ maxWidth: "300px" }}>
                                {genero.descripcion}
                            </td>

                            <td>
                                <button className="Editar" onClick={() => Editar(genero)}>Editar</button>
                                <button className="Borrar" onClick={() => Borrar(genero.id)}>Borrar</button>
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

            {mostrarModalEditar && generoSeleccionado && (
                <ModalEditarGenero
                    genero={generoSeleccionado}
                    alCerrar={cerrarModalEditar}
                    alGuardar={actualizarGenero}
                />
            )}

            {mostrarModalCrear && (
                <ModalCrearGenero
                    alCerrar={cerrarModalCrear}
                    alGuardar={crearGenero}
                />
            )}
        </div>
    );
}