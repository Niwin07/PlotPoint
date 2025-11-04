import React, { useState, useEffect, useMemo } from 'react'; 
import '/src/componentes/administracion/admin.css';
import ModalEditarLibro from '/src/componentes/modals/ModalEditarLibro.jsx';
import ModalCrearLibro from '/src/componentes/modals/ModalCrearLibro.jsx';
import axios from 'axios';

const ITEMS_POR_PAGINA = 10;

const Libros = () => {
    const [masterLibros, setMasterLibros] = useState([]); 
    const [loading, setLoading] = useState(false);
    
    const [autores, setAutores] = useState([]);
    const [editoriales, setEditoriales] = useState([]);
    const [generos, setGeneros] = useState([]);

    const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
    const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
    const [libroSeleccionado, setLibroSeleccionado] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);

    const [buscador, setBuscador] = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState('');
    const [ordenFecha, setOrdenFecha] = useState(''); 
    const [ordenLetra, setOrdenLetra] = useState('a-z');

    const token = localStorage.getItem('token');
    const api = axios.create({
        baseURL: 'http://localhost:3000/api',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    useEffect(() => {
        fetchLibros();
        fetchDatosParaModales();
    }, []);

    const fetchLibros = async () => {
        setLoading(true);
        setBuscador('');
        setFiltroCategoria('');
        setOrdenFecha('');
        setOrdenLetra('a-z');
        setCurrentPage(0);
        try {
            const res = await api.get('/libros'); 
            if (res.data.status === 'ok') {
                console.log(res.data)
                setMasterLibros(res.data.libros);
            }
        } catch (err) {
            alert(`Error al cargar libros: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };


    const fetchDatosParaModales = async () => {
        try {
            const [autoresRes, editorialesRes, generosRes] = await Promise.all([
                api.get('/autores'),
                api.get('/editoriales'),
                api.get('/generos')
            ]);
            setAutores(autoresRes.data.autores || []);
            setEditoriales(editorialesRes.data.editoriales || []);
            setGeneros(generosRes.data.generos || []);
        } catch (err) { console.error("Error cargando datos para modales:", err); }
    };

    const Refrescar = () => {
        fetchLibros();
    };

    const Nuevo = () => setMostrarModalCrear(true);
    const Editar = (libro) => { setLibroSeleccionado(libro); setMostrarModalEditar(true); };
    const cerrarModalEditar = () => { setMostrarModalEditar(false); setLibroSeleccionado(null); };
    const cerrarModalCrear = () => setMostrarModalCrear(false);
    
    const crearLibro = async (datosNuevoLibro) => {
        try {
            const formData = new FormData();
            formData.append('titulo', datosNuevoLibro.titulo);
            formData.append('isbn', datosNuevoLibro.isbn);
            formData.append('sinopsis', datosNuevoLibro.sinopsis);
            formData.append('paginas', datosNuevoLibro.paginas);
            formData.append('anio_publicacion', datosNuevoLibro.anio_publicacion);
            formData.append('autor_id', datosNuevoLibro.autor_id);
            formData.append('editorial_id', datosNuevoLibro.editorial_id);
            if (datosNuevoLibro.portadaFile) { formData.append('portada', datosNuevoLibro.portadaFile); }
            if (Array.isArray(datosNuevoLibro.generos)) { datosNuevoLibro.generos.forEach(id => formData.append('generos[]', id)); }

            const res = await api.post('/libros', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            if (res.data.status === 'ok') { alert(' Libro creado'); cerrarModalCrear(); fetchLibros(); } 
            else { throw new Error(res.data.message); }
        } catch (err) { alert(`Error al crear libro: ${err.response?.data?.message || err.message}`); }
    };
    const guardarLibro = async (datosActualizados) => {
        try {
            const res = await api.put(`/libros/${libroSeleccionado.id}`, datosActualizados);
            if (res.data.status === 'ok') { alert(' Libro actualizado'); cerrarModalEditar(); fetchLibros(); } 
            else { throw new Error(res.data.message); }
        } catch (err) { alert(`Error al guardar libro: ${err.response?.data?.message || err.message}`); }
    };
    const Borrar = async (id) => {
        if (window.confirm('¿Seguro deseas eliminar?')) {
            try {
                const res = await api.delete(`/libros/${id}`);
                if (res.data.status === 'ok') { alert('Libro eliminado'); fetchLibros(); } 
                else { throw new Error(res.data.message); }
            } catch (err) { alert(`Error al eliminar: ${err.response?.data?.message || err.message}`); }
        }
    };



    const librosFiltrados = useMemo(() => {
        let tempLibros = [...masterLibros];
        const lowerBuscador = buscador.toLowerCase().trim();
        tempLibros = tempLibros.filter(libro => {
            const busquedaMatch = lowerBuscador === '' ||
                (libro.titulo && libro.titulo.toLowerCase().includes(lowerBuscador)) ||
                (libro.autor_nombre && libro.autor_nombre.toLowerCase().includes(lowerBuscador)) ||
                (libro.autor_apellido && libro.autor_apellido.toLowerCase().includes(lowerBuscador));

            const categoriaMatch = !filtroCategoria ||
                (libro.generos && libro.generos.some(g => g.id === parseInt(filtroCategoria, 10)));
            
            return busquedaMatch && categoriaMatch;
        });

        if (ordenFecha === 'recientes') {
            tempLibros.sort((a, b) => (b.anio_publicacion || 0) - (a.anio_publicacion || 0));
        } else if (ordenFecha === 'antiguos') {
            tempLibros.sort((a, b) => (a.anio_publicacion || 0) - (b.anio_publicacion || 0));
        } else if (ordenLetra === 'a-z') {
            tempLibros.sort((a, b) => a.titulo.localeCompare(b.titulo));
        } else if (ordenLetra === 'z-a') {
            tempLibros.sort((a, b) => b.titulo.localeCompare(a.titulo));
        }

        return tempLibros;
    }, [masterLibros, buscador, filtroCategoria, ordenFecha, ordenLetra]);

    useEffect(() => {
        setCurrentPage(0);
    }, [librosFiltrados]); 


    const totalPaginas = Math.ceil(librosFiltrados.length / ITEMS_POR_PAGINA);
    const librosPaginaActual = librosFiltrados.slice(
        currentPage * ITEMS_POR_PAGINA,
        (currentPage + 1) * ITEMS_POR_PAGINA
    );
    const siguientePagina = () => {
        if ((currentPage + 1) * ITEMS_POR_PAGINA < librosFiltrados.length) {
            setCurrentPage(currentPage + 1);
        }
    };
    const paginaAnterior = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div>
            <div className='acciones'>
                <input
                    type="text"
                    placeholder="Buscar libro por nombre..."
                    value={buscador}
                    onChange={(e) => setBuscador(e.target.value)} 
                    className='InputAdmin'
                />
                <select
                    value={ordenFecha}
                    onChange={(e) => setOrdenFecha(e.target.value)} 
                    className='InputAdmin'
                >
                    <option value="">Fecha de creación</option>
                    <option value="recientes">Mas Recientes (Año)</option>
                    <option value="antiguos">Mas Antiguos (Año)</option>
                </select>
                <select
                    value={filtroCategoria}
                    onChange={(e) => setFiltroCategoria(e.target.value)}
                    className='InputAdmin'
                >
                    <option value="">Categoría (Todas)</option>
                    {generos.map(g => (
                        <option key={g.id} value={g.id}>{g.nombre}</option>
                    ))}
                </select>
                <select
                    value={ordenLetra}
                    onChange={(e) => setOrdenLetra(e.target.value)} 
                    className='InputAdmin'
                    disabled={ordenFecha !== ''} 
                >
                    <option value="a-z">A - Z</option>
                    <option value="z-a">Z - A</option>
                </select>
                <button className='Nuevo' onClick={Refrescar}>
                    Refrescar Datos
                </button>
                <button className='Nuevo' onClick={Nuevo}>
                    Nuevo
                </button>
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
                    {loading && (
                        <tr><td colSpan="6">Cargando libros...</td></tr>
                    )}
                    {!loading && masterLibros.length === 0 && (
                         <tr><td colSpan="6">No se encontraron libros.</td></tr>
                    )}
                    {!loading && librosFiltrados.length === 0 && masterLibros.length > 0 && (
                         <tr><td colSpan="6">No hay resultados para los filtros aplicados.</td></tr>
                    )}
                    

                    {!loading && librosPaginaActual.map((libro) => (
                        <tr key={libro.id}>
                            <td>{libro.id}</td>
                            <td>
                                <p style={{ margin: 0, fontWeight: 'bold' }}>{libro.titulo}</p>
                                <span style={{ fontSize: '13px', color: '#666' }}>
                                    {libro.autor_nombre} {libro.autor_apellido}
                                </span>
                            </td>
                            <td>
                                {libro.generos && libro.generos.map((g, index) => (
                                    <span key={g.id}>
                                        {g.nombre}
                                        {index < libro.generos.length - 1 ? ', ' : ''}
                                    </span>
                                ))}
                            </td>
                            <td>{libro.isbn}</td>
                            <td>{libro.anio_publicacion}</td>
                            <td>
                                <button className='Borrar' onClick={() => Borrar(libro.id)}>
                                    Borrar
                                </button>
                                <button className='Editar' onClick={() => Editar(libro)}>
                                    Editar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="paginacion-controles" style={{ textAlign: 'center', margin: '20px 0' }}>
                <button 
                    className="Editar"
                    onClick={paginaAnterior} 
                    disabled={currentPage === 0}
                >
                    &larr; Anterior
                </button>
                <span style={{ margin: '0 15px', fontSize: '14px' }}>
                    Página {currentPage + 1} de {totalPaginas > 0 ? totalPaginas : 1}
                </span>
                <button 
                    className="Editar"
                    onClick={siguientePagina} 
                    disabled={(currentPage + 1) * ITEMS_POR_PAGINA >= librosFiltrados.length}
                >
                    Siguiente &rarr;
                </button>
            </div>

            {mostrarModalEditar && (
                <ModalEditarLibro
                    libro={{
                        ...libroSeleccionado,
                        generos: libroSeleccionado.generos.map(g => g.id), 
                        paginas: String(libroSeleccionado.paginas || ''),
                        anio_publicacion: String(libroSeleccionado.anio_publicacion || ''),
                    }}
                    autores={autores}
                    editoriales={editoriales}
                    generosDisponibles={generos}
                    alCerrar={cerrarModalEditar}
                    alGuardar={guardarLibro}
                    api={api}
                    libroId={libroSeleccionado.id}
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
};

export default Libros;