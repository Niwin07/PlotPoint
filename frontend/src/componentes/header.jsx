import React, { useEffect } from 'react';
import '../css/header.css';


const Header = () => {
     useEffect(() => {
        let header = document.querySelector('.header');
        let navbar = document.querySelector('.header .flex .navbar');
        let menuBtn = document.getElementById('menu-btn');

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

        // Limpieza
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
                    <a href="/perfil/">Perfil</a>
                    <a href="/busqueda">Busqueda</a>
                    <a href="/reseñasinicio">Reseñas</a>
                </nav>

                <div id="menu-btn" class="fas fa-bars-staggered"></div>
            </section>

        </header>

    );
};
export default Header;