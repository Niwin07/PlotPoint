import React, { useState, useEffect } from 'react';
import '/src/componentes/administracion/admin.css';

import ModalEditarUsuario from '/src/componentes/modals/usuario/ModalEditarUsuario.jsx';
import ModalCrearUsuario from '/src/componentes/modals/usuario/ModalCrearUsuario.jsx';
import ModalNoCuenta from '/src/componentes/modals/usuario/ModalNoCuenta.jsx';

import usePaginacion from "/src/hooks/usePaginacion.jsx";

export default function Usuarios({
    usuarios, // la data que viene de headerAdmin
    loading,
    fetchUsuarios, 
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
}) {

    const [buscador, setBuscador] = useState("");
    

    // no mostramos 'usuarios' directamente. Usamos este estado intermedio
    // para guardar la lista ya filtrada por el buscador.
    const [listaProcesada, setListaProcesada] = useState([]);

    // integracion del hook de paginacion:
    // le pasamos la 'listaProcesada' (filtrada), no la original.
    // asi, si buscas "Juan", la paginación se recalcula solo para los "Juanes".
    const pag = usePaginacion(listaProcesada, 10);

    // funcionalidad del buscador
    const Buscar = () => {
        const q = buscador.toLowerCase();

        // filtramos si el texto coincide con Nombre, Usuario, Correo o Rol (rol ta al cohete).
        const filtrados = usuarios.filter(u =>
            (u.nombre || "").toLowerCase().includes(q) ||
            (u.nombre_usuario || "").toLowerCase().includes(q) ||
            (u.correo || "").toLowerCase().includes(q) ||
            (u.rol || "").toLowerCase().includes(q)
        );

        setListaProcesada(filtrados);
        pag.setPaginaActual(0); // vuelve a la pagina 1 dsps de filtrar
    };

    //si se borra el texto del buscador, se restaura la lista completa
    useEffect(() => {
        if (buscador.trim() === "") {
            setListaProcesada(usuarios);
            pag.setPaginaActual(0);
        }
    }, [buscador]);

    // setup inicial de la listaProcesada   
    // si 'usuarios' cambia en el padre (ej: se editó un usuario y se recargó la API),
    // actualizamos nuestra lista local para que se vea el cambio.
    useEffect(() => {
        setListaProcesada(usuarios);
        pag.setPaginaActual(0);
    }, [usuarios]);


    const [modalEditar, setModalEditar] = useState(false);
    const [modalCrear, setModalCrear] = useState(false);
    const [modalSinCuenta, setModalSinCuenta] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

    const Editar = (usuario) => {
        setUsuarioSeleccionado(usuario); // guarda CUAL usuario vamos a editar
        setModalEditar(true);            // abre el modal
    };

    const Nuevo = () => setModalCrear(true);

    const cerrarEditar = () => setModalEditar(false);
    const cerrarCrear = () => setModalCrear(false);
    const cerrarNoCuenta = () => setModalSinCuenta(false);

    const Borrar = async (id) => {
        if (!confirm("¿Seguro deseas eliminar este usuario?")) return;

        const res = await eliminarUsuario(id);
        // si se borró bien, pedimos al padre que recargue los datos
        if (res.success) fetchUsuarios(); 
    };

    return (
        <div>
            <div className="acciones">
                <input
                    type="text"
                    placeholder="Buscar usuario..."
                    value={buscador}
                    onChange={(e) => setBuscador(e.target.value)}
                    className="InputAdmin"
                />

                <button className="Buscar" onClick={Buscar}>Buscar</button>

                <button className="Refrescar" onClick={fetchUsuarios}>
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
                        <th>NOMBRE USUARIO</th>
                        <th>NOMBRE</th>
                        <th>CORREO</th>
                        <th>ROL</th>
                        <th>ACCIONES</th>
                    </tr>
                </thead>

                <tbody>
                    {/* Solo mapeamos 'pag.paginaItems' (los 10 de la página actual),
                        no la lista completa. */}
                    {pag.paginaItems.map(usuario => (
                        <tr key={usuario.id}>
                            <td>{usuario.id}</td>
                            <td style={{ fontWeight: "bold" }}>{usuario.nombre_usuario}</td>
                            <td>{usuario.nombre}</td>
                            <td>{usuario.correo}</td>
                            <td>{usuario.rol}</td>
                            <td>
                                <button className="Editar" onClick={() => Editar(usuario)}>Editar</button>
                                <button className="Borrar" onClick={() => Borrar(usuario.id)}>Borrar</button>
                            </td>
                        </tr>
                    ))}

                    {!loading && pag.paginaItems.length === 0 && (
                        <tr><td colSpan="6">No hay resultados.</td></tr>
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

            {modalEditar && usuarioSeleccionado && (
                <ModalEditarUsuario
                    usuario={usuarioSeleccionado}
                    alCerrar={cerrarEditar}
                    alGuardar={actualizarUsuario}
                />
            )}

            {modalCrear && (
                <ModalCrearUsuario
                    alCerrar={cerrarCrear}
                    alGuardar={crearUsuario}
                />
            )}

            {modalSinCuenta && (
                <ModalNoCuenta
                    alCerrar={cerrarNoCuenta}
                />
            )}
        </div>
    );
}