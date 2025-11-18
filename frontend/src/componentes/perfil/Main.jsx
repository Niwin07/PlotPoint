import { useState, useEffect } from 'react';
import axios from 'axios';
import { Route, Link, useRoute, useLocation } from "wouter";
import MeGustas from '/src/componentes/perfil/MeGustas.jsx';
import PerfilVista from '/src/componentes/perfil/PerfilVista.jsx';
import ListaReseñas from '/src/componentes/perfil/ListaReseñas.jsx';
import EditarPerfil from '/src/componentes/perfil/EditarPerfil.jsx';
import '/src/componentes/perfil/PerfilPag.css';

const BACKEND_URL = 'http://localhost:3000';

export default function Main() {
    const [perfil, setPerfil] = useState(null);
    const [siguiendo, setSiguiendo] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [location] = useLocation();
    
    // Estados para subcomponentes
    const [reseñas, setReseñas] = useState([]);
    const [libros, setLibros] = useState([]);
    const [loadingReseñas, setLoadingReseñas] = useState(false);
    const [loadingLibros, setLoadingLibros] = useState(false);
    
    const token = localStorage.getItem("token");
    const miId = JSON.parse(localStorage.getItem("usuario"))?.id;

    const [, paramsBase] = useRoute("/perfil/:id");
    const [, paramsMeGustas] = useRoute("/perfil/:id/megustas");
    const [, paramsResenas] = useRoute("/perfil/:id/reseñas");
    const [, paramsEditar] = useRoute("/perfil/:id/editarperfil");

    const usuarioId = paramsBase?.id || paramsMeGustas?.id || paramsResenas?.id || paramsEditar?.id;

    const [matchPerfil] = useRoute("/perfil/:id");
    const [matchReseñas] = useRoute("/perfil/:id/reseñas");
    const [matchMeGustas] = useRoute("/perfil/:id/megustas");
    

    const esMiPerfil = (miId === parseInt(usuarioId));

    const obtenerPerfil = async () => {
        if (!usuarioId) {
            setError("No se especificó un ID de usuario.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            let perfilData;
    
            if (esMiPerfil) {
                const response = await axios.get(`${BACKEND_URL}/api/usuarios/perfil`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                perfilData = response.data.user ?? response.data;
            } else {
                const perfilPromise = axios.get(`${BACKEND_URL}/api/usuarios/publico/${usuarioId}`);
                const promesas = [perfilPromise];

                if (token) {
                    promesas.push(
                        axios.get(`${BACKEND_URL}/api/seguidores/check/${usuarioId}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        })
                    );
                }

                const [perfilRes, sigueRes] = await Promise.all(promesas);
                perfilData = perfilRes.data;

                if (sigueRes) {
                    setSiguiendo(sigueRes.data.siguiendo);
                }
            }

            setPerfil(perfilData);
        } catch (err) {
            console.error("Error cargando perfil:", err);
            setError(err.response?.data?.message || "Error al cargar el perfil");
        } finally {
            setLoading(false);
        }
    };

    const obtenerReseñas = async () => {
        setLoadingReseñas(true);
        if (!usuarioId) return;

        try {
            const url = `${BACKEND_URL}/api/resenas?usuario_id=${usuarioId}`;
            const response = await axios.get(url);
            setReseñas(response.data.resenas);
        } catch (error) {
            console.error("Error cargando reseñas:", error);
        } finally {
            setLoadingReseñas(false);
        }
    };

    const obtenerMeGustas = async () => {
        setLoadingLibros(true);
        if (!usuarioId) return;

        try {
            const url = `${BACKEND_URL}/api/likes/usuario/${usuarioId}`;
            const response = await axios.get(url);
            setLibros(response.data.libros_favoritos || []);
        } catch (error) {
            console.error("Error al cargar favoritos:", error);
        } finally {
            setLoadingLibros(false);
        }
    };

    const toggleSeguir = async () => {
        if (!token) {
            alert("Necesitas iniciar sesión para seguir a usuarios.");
            return;
        }

        try {
            if (siguiendo) {
                await axios.delete(`${BACKEND_URL}/api/seguidores/${usuarioId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSiguiendo(false);
                setPerfil(p => ({ ...p, seguidores: p.seguidores - 1 }));
            } else {
                await axios.post(
                    `${BACKEND_URL}/api/seguidores`,
                    { seguido_id: parseInt(usuarioId) },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setSiguiendo(true);
                setPerfil(p => ({ ...p, seguidores: p.seguidores + 1 }));
            }
        } catch (error) {
            console.error("Error al seguir/dejar de seguir:", error);
            alert(error.response?.data?.message || "Error al actualizar seguimiento.");
        }
    };

    useEffect(() => {
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
        </>
    );
}