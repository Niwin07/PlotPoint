import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '/src/componentes/perfil/PerfilPag.css';
import MeGustas from '/src/componentes/perfil/MeGustas.jsx';
import PerfilPag from '/src/componentes/perfil/PerfilPag.jsx';
import ListaReseñas from '/src/componentes/perfil/ListaReseñas.jsx';
import { Route, Link, useRoute } from "wouter";

export default function Usuario() {
    const BACKEND_URL = 'http://localhost:3000';
    const token = localStorage.getItem("token"); // Necesario para saber si "sigues" al usuario
    const miId = localStorage.getItem("usuario_id"); // Para no mostrar "seguir" en tu propio perfil

    // 1. Obtener el ID del usuario de la URL
    const [match, params] = useRoute("/usuario/:id");
    const usuarioId = params ? params.id : null;

    // 2. Estados para los datos del perfil y seguimiento
    const [perfil, setPerfil] = useState(null);
    const [siguiendo, setSiguiendo] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 3. Comprobar si el perfil que vemos es nuestro propio perfil
    const esMiPerfil = (miId === usuarioId);

    // 4. Cargar datos del perfil (info + stats + estado de seguimiento)
    useEffect(() => {
        if (!usuarioId) {
            setError("No se especificó un ID de usuario.");
            setLoading(false);
            return;
        }
        
        // Resetear estados al cambiar de perfil
        setLoading(true);
        setError(null);
        setPerfil(null);

        const fetchDatosPerfil = async () => {
            try {
                // Preparamos las peticiones
                const perfilPromise = axios.get(`${BACKEND_URL}/api/usuarios/publico/${usuarioId}`);
                const promesas = [perfilPromise];

                // Si estamos logueados Y NO es nuestro perfil, verificamos si lo seguimos
                if (token && !esMiPerfil) {
                    promesas.push(axios.get(`${BACKEND_URL}/api/seguidores/check/${usuarioId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }));
                }

                // Ejecutamos las peticiones
                const [perfilRes, sigueRes] = await Promise.all(promesas);

                // Asignamos datos del perfil (esto siempre se ejecuta)
                setPerfil(perfilRes.data);
                
                // Asignamos estado de seguimiento (si aplica)
                if (sigueRes) {
                    setSiguiendo(sigueRes.data.siguiendo);
                }

            } catch (err) {
                console.error("Error cargando perfil:", err);
                setError(err.response?.data?.message || "Error al cargar el perfil");
            } finally {
                setLoading(false);
            }
        };

        fetchDatosPerfil();
    }, [usuarioId, token, esMiPerfil]); // Recargar si el ID de la URL cambia

    // 5. Función para Seguir / Dejar de Seguir
    const handleFollowToggle = async () => {
        if (!token) {
            alert("Necesitas iniciar sesión para seguir a usuarios.");
            return;
        }
        // No permitir seguirse a uno mismo (aunque la API ya lo impide)
        if (esMiPerfil) return; 

        try {
            if (siguiendo) {
                // Dejar de seguir
                await axios.delete(`${BACKEND_URL}/api/seguidores/${usuarioId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSiguiendo(false);
                setPerfil(p => ({ ...p, seguidores: p.seguidores - 1 })); // Actualización optimista
            } else {
                // Empezar a seguir
                await axios.post(`${BACKEND_URL}/api/seguidores`, 
                    { seguido_id: parseInt(usuarioId) },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setSiguiendo(true);
                setPerfil(p => ({ ...p, seguidores: p.seguidores + 1 })); // Actualización optimista
            }
        } catch (error) {
            console.error("Error al seguir/dejar de seguir:", error);
            alert(error.response?.data?.message || "Error al actualizar seguimiento.");
        }
    };

    // 6. Hooks para las rutas dinámicas (con el ID)
    const [matchPerfil] = useRoute("/usuario/:id");
    const [matchReseñas] = useRoute("/usuario/:id/reseñas");
    const [matchMeGustas] = useRoute("/usuario/:id/megustas");

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
                {/* 7. Links actualizados para usar el ID de la URL */}
                <Link href={`/usuario/${usuarioId}`}>
                    <div className={`nav-item ${matchPerfil && !matchReseñas && !matchMeGustas ? "nav-item-active" : ""}`}>
                        Perfil
                    </div>
                </Link>

                <Link href={`/usuario/${usuarioId}/reseñas`}>
                    <div className={`nav-item ${matchReseñas ? "nav-item-active" : ""}`}>
                        Reseñas
                    </div>
                </Link>

                <Link href={`/usuario/${usuarioId}/megustas`}>
                    <div className={`nav-item ${matchMeGustas ? "nav-item-active" : ""}`}>
                        Me gustas
                    </div>
                </Link>
            </nav>

            {/* 8. Rutas actualizadas que pasan los datos como props */}
            
            <Route path="/usuario/:id">
                <PerfilPag 
                    perfil={perfil}
                    esMiPerfil={esMiPerfil} // Lo pasamos para saber si mostrar "Editar" o "Seguir"
                    siguiendo={siguiendo}
                    onFollowToggle={handleFollowToggle}
                    token={token} // Pasamos el token para saber si mostrar el botón seguir (si no está logueado)
                />
            </Route>

            <Route path="/usuario/:id/reseñas">
                {/* Este componente solo necesita el ID del perfil que está viendo */}
                <ListaReseñas 
                    usuarioId={usuarioId} 
                />
            </Route>

            <Route path="/usuario/:id/megustas">
                 {/* Este componente solo necesita el ID del perfil que está viendo */}
                <MeGustas 
                    usuarioId={usuarioId} 
                />
            </Route>
        </>
    );
}
