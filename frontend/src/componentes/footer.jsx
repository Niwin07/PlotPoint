import React from 'react';
import '../css/footer.css';


const Footer = () => {
    return (
        <footer>
            <section class="footer">
                <div class="box-footer">


                    <div class="box-info">
                        <h3>Links Extras</h3>
                        <a href="/sobrenosotros"><i class="fas fa-arrow-right"></i>Sobre Nosotros</a>
                        <a href="/soporte"><i class="fas fa-arrow-right"></i>Soporte </a>
                        <a href="/terminosycondiciones"><i class="fas fa-arrow-right"></i>Terminos y Condiciones</a>
                    </div>




                </div>
                <div class="redes">
                    <a href="https://www.facebook.com/people/Firetechush/61553078863305/?sk=reels_tab" class="fab fa-facebook-f"></a>
                    <a href="#" class="fab fa-twitter"></a>
                    <a href="https://www.instagram.com/firetechush/" class="fab fa-instagram"></a>
                    <a href="#" class="fab fa-linkedin"></a>
                </div>
                <div class="credito">Creado por <span>David y Nehuen</span> | Todos los derechos reservados!</div>

            </section>

        </footer >


    );
};
export default Footer;