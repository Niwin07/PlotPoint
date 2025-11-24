import React, { useState, useEffect } from 'react';

import '../common/header.css'; 
import './admin.css';         
import '../perfil/PerfilPag.css';


import Libros from './Libros.jsx';
import Autores from './Autores.jsx';
import Usuarios from './Usuarios.jsx';
import Editoriales from './Editoriales.jsx';
import Generos from './Generos.jsx';

import { Route, Link, useLocation, Switch } from "wouter";
import axios from 'axios';

const HeaderAdmin = () => {
    // seteamos los estados de los datos
    const [libros, setLibros] = useState([]);
    const [autores, setAutores] = useState([]);
    const [editoriales, setEditoriales] = useState([]);
    const [generos, setGeneros] = useState([]);
    const [usuarios, setUsuarios] = useState([]);

    // usamos un objeto en lugar de un simple true/false. 
    // para que en caso de que alguno no cargue los demas sigan funcionando
    const [loading, setLoading] = useState({
        libros: false,
        autores: false,
        editoriales: false,
        generos: false,
        usuarios: false,
    });


    // definimos los const del token y la api (googlear .create)
    const token = localStorage.getItem('token');

    if (!token) {
        return <Redirect to="/iniciarsesion" />;
    }

    const api = axios.create({
        baseURL: 'https://plotpoint-production.up.railway.app/api',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    // funcion extra para setear los loadings individuales
    const setLoadingState = (key, value) => {
        setLoading(prev => ({ ...prev, [key]: value }));
    };


    // fetch de datos (get), cada uno declara su propio loading   

    const fetchLibros = async () => {
        setLoadingState('libros', true);
        try {
            const res = await api.get('/libros');
            if (res.data.status === 'ok') setLibros(res.data.libros);
        } finally { setLoadingState('libros', false); }
    };

    const fetchAutores = async () => {
        setLoadingState('autores', true);
        try {
            const res = await api.get('/autores');
            if (res.data.status === 'ok') setAutores(res.data.autores);
        } finally { setLoadingState('autores', false); }
    };

    const fetchEditoriales = async () => {
        setLoadingState('editoriales', true);
        try {
            const res = await api.get('/editoriales');
            if (res.data.status === 'ok') setEditoriales(res.data.editoriales);
        } finally { setLoadingState('editoriales', false); }
    };

    const fetchGeneros = async () => {
        setLoadingState('generos', true);
        try {
            const res = await api.get('/generos');
            if (res.data.status === 'ok') setGeneros(res.data.generos);
        } finally { setLoadingState('generos', false); }
    };

    const fetchUsuarios = async () => {
        setLoadingState('usuarios', true);
        try {
            const res = await api.get('/usuarios/admin');
            if (res.data.status === 'ok') setUsuarios(res.data.usuarios);
        } finally { setLoadingState('usuarios', false); }
    };


    // metodos crud de cada una de las secciones, se actualiza con cada cambio

    const crearLibro = async (formData) => {
        try {
            // aca usamos 'multipart/form-data' porque se suben img
            const res = await api.post('/libros', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.status === 'ok') {
                await fetchLibros();
                return { success: true };
            }
        } catch { return { success: false }; }
    };

    const actualizarLibro = async (id, datos) => {
        try {
            const res = await api.put(`/libros/${id}`, datos);
            if (res.data.status === 'ok') {
                await fetchLibros();
                return { success: true };
            }
        } catch { return { success: false }; }
    };

    const eliminarLibro = async (id) => {
        try {
            const res = await api.delete(`/libros/${id}`);
            if (res.data.status === 'ok') {
                await fetchLibros();
                return { success: true };
            }
        } catch { return { success: false }; }
    };

    const crearAutor = async (datos) => {
        try {
            const res = await api.post('/autores', datos);
            if (res.data.status === 'ok') {
                await fetchAutores();
                return { success: true };
            }
        } catch { return { success: false }; }
    };

    const actualizarAutor = async (id, datos) => {
        try {
            const res = await api.put(`/autores/${id}`, datos);
            if (res.data.status === 'ok') {
                await fetchAutores();
                return { success: true };
            }
        } catch { return { success: false }; }
    };

    const eliminarAutor = async (id) => {
        try {
            const res = await api.delete(`/autores/${id}`);
            if (res.data.status === 'ok') {
                await fetchAutores();
                return { success: true };
            }
        } catch { return { success: false }; }
    };

    const crearEditorial = async (datos) => {
        try {
            const res = await api.post('/editoriales', datos);
            if (res.data.status === 'ok') {
                await fetchEditoriales();
                return { success: true };
            }
        } catch { return { success: false }; }
    };

    const actualizarEditorial = async (id, datos) => {
        try {
            const res = await api.put(`/editoriales/${id}`, datos);
            if (res.data.status === 'ok') {
                await fetchEditoriales();
                return { success: true };
            }
        } catch { return { success: false }; }
    };

    const eliminarEditorial = async (id) => {
        try {
            const res = await api.delete(`/editoriales/${id}`);
            if (res.data.status === 'ok') {
                await fetchEditoriales();
                return { success: true };
            }
        } catch { return { success: false }; }
    };

    const crearGenero = async (datos) => {
        try {
            const res = await api.post('/generos', datos);
            if (res.data.status === 'ok') {
                await fetchGeneros();
                return { success: true };
            }
        } catch { return { success: false }; }
    };

    const actualizarGenero = async (id, datos) => {
        try {
            const res = await api.put(`/generos/${id}`, datos);
            if (res.data.status === 'ok') {
                await fetchGeneros();
                return { success: true };
            }
        } catch { return { success: false }; }
    };

    const eliminarGenero = async (id) => {
        try {
            const res = await api.delete(`/generos/${id}`);
            if (res.data.status === 'ok') {
                await fetchGeneros();
                return { success: true };
            }
        } catch { return { success: false }; }
    };

    
    const crearUsuario = async (datos) => {
        try {
            const res = await api.post('/usuarios/registro', datos);
            if (res.data.status === 'ok') {
                await fetchUsuarios();
                return { success: true };
            }
        } catch { return { success: false }; }
    };

    const actualizarUsuario = async (id, datos) => {
        try {
            const res = await api.put(`/usuarios/admin/${id}`, datos);
            if (res.data.status === 'ok') {
                await fetchUsuarios();
                return { success: true };
            }
        } catch { return { success: false }; }
    };

    const eliminarUsuario = async (id) => {
        try {
            const res = await api.delete(`/usuarios/admin/${id}`);
            if (res.data.status === 'ok') {
                await fetchUsuarios();
                return { success: true };
            }
        } catch { return { success: false }; }
    };

    // se ejecuta cada vez que entramos a admin (una sola vez)
    useEffect(() => {
        fetchLibros();
        fetchAutores();
        fetchEditoriales();
        fetchGeneros();
        fetchUsuarios();
    }, []);


    // la logica visual para que se pinte de otro color la pestaña donde estás
    const [location] = useLocation();
    const isActive = (path) => {
        // Si es exacto o si empieza con el path (para subsecciones)
        return location === path || location === path + "/";
    };


    return (
        <div className="admin-container"> 
            {/* --- MENÚ DE NAVEGACIÓN (Pestañas) --- */}
            <nav className="nav">
                {/* 1. LIBROS: Usamos comprobación EXACTA (===). 
                   Solo se ilumina si estamos estrictamente en /admin o /admin/ */}
                <Link href="/admin">
                    <div className={`nav-item ${location === "/admin" || location === "/admin/" ? "nav-item-active" : ""}`}>
                        Libros
                    </div>
                </Link>

                {/* 2. LOS DEMÁS: Usamos .includes() o .startsWith().
                   Se iluminan si la ruta contiene su sección */}
                <Link href="/admin/usuarios">
                    <div className={`nav-item ${location.includes("/admin/usuarios") ? "nav-item-active" : ""}`}>
                        Usuarios
                    </div>
                </Link>

                <Link href="/admin/autores">
                    <div className={`nav-item ${location.includes("/admin/autores") ? "nav-item-active" : ""}`}>
                        Autores
                    </div>
                </Link>

                <Link href="/admin/generos">
                    <div className={`nav-item ${location.includes("/admin/generos") ? "nav-item-active" : ""}`}>
                        Géneros
                    </div>
                </Link>

                <Link href="/admin/editoriales">
                    <div className={`nav-item ${location.includes("/admin/editoriales") ? "nav-item-active" : ""}`}>
                        Editoriales
                    </div>
                </Link>
            </nav>

            {/* --- CONTENIDO DE LAS PESTAÑAS --- */}
            {/* Usamos Switch para renderizar SOLO UNO de estos componentes a la vez */}
            <Switch>
                
                <Route path="/admin/usuarios" component={() =>
                    <Usuarios
                        usuarios={usuarios}
                        loading={loading.usuarios}
                        fetchUsuarios={fetchUsuarios}
                        crearUsuario={crearUsuario}
                        actualizarUsuario={actualizarUsuario}
                        eliminarUsuario={eliminarUsuario}
                    />
                } />

                <Route path="/admin/autores" component={() =>
                    <Autores
                        autores={autores}
                        loading={loading.autores}
                        fetchAutores={fetchAutores}
                        crearAutor={crearAutor}
                        actualizarAutor={actualizarAutor}
                        eliminarAutor={eliminarAutor}
                    />
                } />

                <Route path="/admin/editoriales" component={() =>
                    <Editoriales
                        editoriales={editoriales}
                        loading={loading.editoriales}
                        fetchEditoriales={fetchEditoriales}
                        crearEditorial={crearEditorial}
                        actualizarEditorial={actualizarEditorial}
                        eliminarEditorial={eliminarEditorial}
                    />
                } />

                <Route path="/admin/generos" component={() =>
                    <Generos
                        generos={generos}
                        loading={loading.generos}
                        fetchGeneros={fetchGeneros}
                        crearGenero={crearGenero}
                        actualizarGenero={actualizarGenero}
                        eliminarGenero={eliminarGenero}
                    />
                } />

                {/* Ruta por defecto (/admin): Muestra LIBROS. 
                    Al estar al final y dentro del Switch, evita duplicados. */}
                <Route path="/admin">
                    <Libros
                        libros={libros}
                        autores={autores}
                        editoriales={editoriales}
                        generos={generos}
                        loading={loading.libros}
                        fetchLibros={fetchLibros}
                        crearLibro={crearLibro}
                        actualizarLibro={actualizarLibro}
                        eliminarLibro={eliminarLibro}
                        api={api}
                    />
                </Route>

            </Switch>
        </div>
    );
};

export default HeaderAdmin;