import React, { useEffect } from 'react';
import '/src/componentes/common/header.css';
import '/src/componentes/administracion/admin.css'
//para reutilizar el navegador de perfil
import '/src/componentes/perfil/PerfilPag.css';

//tablas y acciones
import Libros from '/src/componentes/administracion/Libros.jsx'
import Autores from '/src/componentes/administracion/Autores.jsx'
import Usuarios from '/src/componentes/administracion/Usuarios.jsx'
import Editoriales from '/src/componentes/administracion/Editoriales.jsx'
import Generos from '/src/componentes/administracion/Generos.jsx'
import { Route, Link, useRoute } from "wouter";


const HeaderAdmin = () => {
    const [matchLibros] = useRoute("/admin/");
    const [matchUsuarios] = useRoute("/admin/usuarios");
    const [matchAutores] = useRoute("/admin/autores");
    const [matchGeneros] = useRoute("/admin/generos");
    const [matchEditoriales] = useRoute("/admin/editoriales");
    




    return (
        <>
            {/*
            <header class="header">
                <section class="flex">
                    <h1>Plotpoint</h1>


                    <nav class="navbar">
                        <Link href="/admin/">Libros</Link>
                        <Link href="/admin/usuarios">Usuarios</Link>
                        <Link href="/admin/autores">Autores</Link>
                        <Link href="/admin/editoriales">Editoriales</Link>
                        <Link href="/admin/generos">Generos</Link>
                        <a href="/iniciarsesion">Cerrar sesion</a>
                    </nav>

                    <div id="menu-btn" class="fas fa-bars-staggered"></div>
                </section>

            </header>
         */}

            <nav className="nav">
                <Link href="/admin/">

                    {/* activa la clase */}


                    <div className={`nav-item ${matchLibros ? "nav-item-active" : ""}`}>
                        Libros
                    </div>
                </Link>

                <Link href="/admin/usuarios">
                    <div className={`nav-item ${matchUsuarios ? "nav-item-active" : ""}`}>
                        Usuarios
                    </div>
                </Link>

                <Link href="/admin/autores">
                    <div className={`nav-item ${matchAutores ? "nav-item-active" : ""}`}>
                        Autores
                    </div>
                </Link>
                <Link href="/admin/generos">
                    <div className={`nav-item ${matchGeneros ? "nav-item-active" : ""}`}>
                        Generos
                    </div>
                </Link>
                <Link href="/admin/editoriales">
                    <div className={`nav-item ${matchEditoriales ? "nav-item-active" : ""}`}>
                        Editoriales
                    </div>
                </Link>

            </nav>

            {/* renderiza el componente seleccionado en el navegador de perfil */}

            <Route path="/admin/">
                <Libros />
            </Route>

            <Route path="/admin/usuarios">
                <Usuarios />
            </Route>

            <Route path="/admin/autores">
                <Autores />
            </Route>

            <Route path="/admin/editoriales">
                <Editoriales />
            </Route>

            <Route path="/admin/generos">
                <Generos />
            </Route>

        </>

    );
};
export default HeaderAdmin;