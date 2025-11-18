import React, { useEffect, useState } from 'react';
import '/src/componentes/common/header.css';
import { Route, Link, useRoute } from "wouter";
import Usuario from '../perfil/Usuario';


const Header = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLogged, setIsLogged] = useState(false);
    const [miId, setMiId] = useState(null);
    


    const cerrarSesion = () => {
        localStorage.removeItem("usuario");
        localStorage.removeItem("token");
        setIsLogged(false);    
        setIsAdmin(false);
        window.location.href = "/iniciarsesion";
    };
    useEffect(() => {

        let header = document.querySelector('.header');
        let navbar = document.querySelector('.header .flex .navbar');
        let menuBtn = document.getElementById('menu-btn');



        const usuario = JSON.parse(localStorage.getItem("usuario"));
        const miId = usuario?.id;

        if (usuario) {
            setIsLogged(true);
            if (usuario.rol === "admin") {
                setIsAdmin(true);
                setMiId(usuario.id);
            }else{
                setMiId(usuario.id);
            }
        }


        const handleMenuClick = () => {
            navbar.classList.toggle('active');
            menuBtn.classList.toggle('fa-times');
        };



        const handleScroll = () => {
            navbar.classList.remove('active');
            menuBtn.classList.remove('fa-times');
            if (window.scrollY > 0) {
                header.classList.add('active');
            } else {
                header.classList.remove('active');
            }
        };

        if (menuBtn) menuBtn.onclick = handleMenuClick;
        window.addEventListener('scroll', handleScroll);

        return () => {
            if (menuBtn) menuBtn.onclick = null;
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    return (
        <header class="header">
            <section class="flex">
                <h1>Plotpoint</h1>


                <nav class="navbar">
                    <a href="/inicio">Inicio</a>
                    <a href="/reseñasinicio">Reseñas</a>
                    <a href="/busqueda">Busqueda</a>
                    <Link href={`/perfil/${miId}`}>Perfil</Link>
                    {isAdmin && <a href="/admin/">Admin</a>}

                    {isLogged ? (
                        <a href="#" onClick={cerrarSesion}>Cerrar sesión</a>
                    ) : (
                        <a href="/iniciarsesion">Iniciar sesión</a>
                    )}
                </nav>

                <div id="menu-btn" class="fas fa-bars-staggered"></div>
            </section>

        </header>

    );
};
export default Header;