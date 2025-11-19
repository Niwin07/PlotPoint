import { useState, useEffect } from 'react';
import axios from 'axios';
import { Route, Link, useRoute, useLocation } from "wouter";
import MeGustas from '/src/componentes/perfil/MeGustas.jsx';
import PerfilVista from '/src/componentes/perfil/PerfilVista.jsx';
import ListaReseñas from '/src/componentes/perfil/ListaReseñas.jsx';
import EditarPerfil from '/src/componentes/perfil/EditarPerfil.jsx';
import ModalNoCuenta from '/src/componentes/modals/usuario/ModalNoCuenta';
import '/src/componentes/perfil/PerfilPag.css';

const BACKEND_URL = 'http://localhost:3000';

export default function Main() {
    // Estados principales
    const [perfil, setPerfil] = useState(null);
    const [siguiendo, setSiguiendo] = useState(false);


    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Obtener la ubicación actual para detectar cambios de ruta
    const [location] = useLocation();
    
    // Estados para subcomponentes
    const [reseñas, setReseñas] = useState([]);
    const [libros, setLibros] = useState([]);

    const [loadingReseñas, setLoadingReseñas] = useState(false);
    const [loadingLibros, setLoadingLibros] = useState(false);

    const [showModalCuenta, setShowModalCuenta] = useState(false);

    // Obtener el token y el ID del usuario actual
    const token = localStorage.getItem("token");
    const miId = JSON.parse(localStorage.getItem("usuario"))?.id;

    // Obtener el ID del usuario del perfil desde la URL
    const [, paramsBase] = useRoute("/perfil/:id");
    const [, paramsMeGustas] = useRoute("/perfil/:id/megustas");
    const [, paramsResenas] = useRoute("/perfil/:id/reseñas");
    const [, paramsEditar] = useRoute("/perfil/:id/editarperfil");

    // Priorizar el ID del perfil base, luego megustas, reseñas y editarperfil
    const usuarioId = paramsBase?.id || paramsMeGustas?.id || paramsResenas?.id || paramsEditar?.id;

    // Rutas para resaltar el menú de navegación
    const [matchPerfil] = useRoute("/perfil/:id");
    const [matchReseñas] = useRoute("/perfil/:id/reseñas");
    const [matchMeGustas] = useRoute("/perfil/:id/megustas");
    

    // Determinar si es mi propio perfil
    const esMiPerfil = (miId === parseInt(usuarioId));

    const obtenerPerfil = async () => {
        // Validar que tenemos un ID de usuario
        if (!usuarioId) {
            setError("No se especificó un ID de usuario.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Obtener datos del perfil
            let perfilData;
    
            if (esMiPerfil) {
                // Obtener mi propio perfil
                const response = await axios.get(`${BACKEND_URL}/api/usuarios/perfil`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                perfilData = response.data.user ?? response.data;
            } else {
                // Obtener el perfil de otro usuario
                const perfilPromise = axios.get(`${BACKEND_URL}/api/usuarios/publico/${usuarioId}`);
                const promesas = [perfilPromise];

                if (token) {
                    // Verificar si lo sigo
                    promesas.push(
                        axios.get(`${BACKEND_URL}/api/seguidores/check/${usuarioId}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        })
                    );
                }
                // Ejecutar promesas en paralelo
                const [perfilRes, sigueRes] = await Promise.all(promesas);
                // Asignar datos del perfil
                perfilData = perfilRes.data;
                // Asignar estado de seguimiento
                if (sigueRes) {
                    setSiguiendo(sigueRes.data.siguiendo);
                }
            }
            // Actualizar el estado del perfil
            setPerfil(perfilData);
        } catch (err) {
            console.error("Error cargando perfil:", err);
            setError(err.response?.data?.message || "Error al cargar el perfil");
        } finally {
            setLoading(false);
        }
    };

    // Función para obtener reseñas del usuario
    const obtenerReseñas = async () => {
        setLoadingReseñas(true);
        //Si no hay usuarioId, salir
        if (!usuarioId) return;

        try {
            // Obtener reseñas del usuario
            const url = `${BACKEND_URL}/api/resenas?usuario_id=${usuarioId}`;
            const response = await axios.get(url);
            // Actualizar estado de reseñas
            setReseñas(response.data.resenas);
        } catch (error) {
            console.error("Error cargando reseñas:", error);
        } finally {
            setLoadingReseñas(false);
        }
    };

    // Función para obtener libros que le gustan al usuario
    const obtenerMeGustas = async () => {
        setLoadingLibros(true);
        // Si no hay usuarioId, salir
        if (!usuarioId) return;

        try {
            // Obtener libros favoritos del usuario
            const url = `${BACKEND_URL}/api/likes/usuario/${usuarioId}`;
            const response = await axios.get(url);
            // Actualizar estado de libros
            setLibros(response.data.libros_favoritos || []);
        } catch (error) {
            console.error("Error al cargar favoritos:", error);
        } finally {
            setLoadingLibros(false);
        }
    };

    const toggleSeguir = async () => {
        // Si no hay token, mostrar modal de que debes iniciar sesion o registrarte
        if (!token) {
            setShowModalCuenta(true);
            return;
        }

        try {
            if (siguiendo) {
                // Dejar de seguir
                await axios.delete(`${BACKEND_URL}/api/seguidores/${usuarioId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Cambiar estado a no siguiendo (false)
                setSiguiendo(false);
                // Disminuir contador de seguidores en el perfil
                setPerfil(p => ({ ...p, seguidores: p.seguidores - 1 }));
            } else {
                // Seguir
                await axios.post(
                    `${BACKEND_URL}/api/seguidores`,
                    { seguido_id: parseInt(usuarioId) },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                //cambiar estado a siguiendo (true)
                setSiguiendo(true);
                //Aumentar contador de seguidores en el perfil
                setPerfil(p => ({ ...p, seguidores: p.seguidores + 1 }));
            }
        } catch (error) {
            console.error("Error al seguir/dejar de seguir:", error);
            alert(error.response?.data?.message || "Error al actualizar seguimiento.");
        }
    };

    useEffect(() => {
        // Cargar el perfil cuando cambie el usuarioId o el token
        obtenerPerfil();
    }, [usuarioId, token, location]);

    useEffect(() => {
        // Cargar reseñas cuando estamos en la ruta de reseñas
        if (location.includes('/reseñas')) {
            obtenerReseñas();
        }
    }, [location, usuarioId]);

    useEffect(() => {
        // Cargar me gustas cuando estamos en la ruta de me gustas
        if (location.includes('/megustas')) {
            obtenerMeGustas();
        }
    }, [location, usuarioId]);

    
    // Renderizado condicional según el estado de carga y error
    if (loading && !perfil) {
        return <div className="container" style={{ padding: '20px' }}>Cargando perfil...</div>;
    }

    if (error) {
        return <div className="container" style={{ padding: "20px", color: "red" }}>Error: {error}</div>;
    }

    if (!perfil) {
        return <div className="container" style={{ padding: '20px' }}>Usuario no encontrado.</div>;
    }

    return (
        <>
            <nav className="nav">
                <Link href={`/perfil/${usuarioId}`}>
                    <div className={`nav-item ${matchPerfil && !matchReseñas && !matchMeGustas ? "nav-item-active" : ""}`}>
                        Perfil
                    </div>
                </Link>

                <Link href={`/perfil/${usuarioId}/reseñas`}>
                    <div className={`nav-item ${matchReseñas ? "nav-item-active" : ""}`}>
                        Reseñas
                    </div>
                </Link>

                <Link href={`/perfil/${usuarioId}/megustas`}>
                    <div className={`nav-item ${matchMeGustas ? "nav-item-active" : ""}`}>
                        Me gustas
                    </div>
                </Link>
            </nav>

            <Route path="/perfil/:id">
                <PerfilVista
                    perfil={perfil}
                    esMiPerfil={esMiPerfil}
                    siguiendo={siguiendo}
                    onFollowToggle={toggleSeguir}
                    token={token}
                />
            </Route>

            <Route path="/perfil/:id/editarperfil">
                <EditarPerfil 
                    obtenerPerfil={obtenerPerfil}
                />
            </Route>

            <Route path="/perfil/:id/reseñas">
                <ListaReseñas 
                    reseñas={reseñas}
                    loading={loadingReseñas}
                    miId={miId}
                    obtenerReseñas={obtenerReseñas}
                />
            </Route>

            <Route path="/perfil/:id/megustas">
                <MeGustas 
                    libros={libros}
                    loading={loadingLibros}
                />
            </Route>
            {showModalCuenta && <ModalNoCuenta onClose={() => setShowModalCuenta(false)} />}
        </>
    );
}