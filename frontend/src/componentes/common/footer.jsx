import React from 'react';
import '/src/componentes/common/footer.css';
import { Link } from 'wouter';


const Footer = () => {
    return (
        <footer>
            <section class="footer">
                <div class="box-footer">


                    <div class="box-info">
                        <h3>Links Extras</h3>
                        <Link href={"/sobrenosotros"}><i class="fas fa-arrow-right"></i>Sobre Nosotros</Link>
                        <Link href={"/soporte"}><i class="fas fa-arrow-right"></i>Soporte </Link>
                        <Link href={"/terminosycondiciones"}><i class="fas fa-arrow-right"></i>Terminos y Condiciones</Link>
                    </div>




                </div>
                <div class="redes">
                    <a href="https://www.facebook.com/share/1FWWanWR4f/" class="fab fa-facebook-f"></a>
                    <a href="https://x.com/PlotPointt?t=ScOP7Q5U9r6Bt4FxcQFjBA&s=09" class="fab fa-twitter"></a>
                    <a href="https://www.instagram.com/plotpoint.co?igsh=MXRmZHptMW4wNnM1Nw==" class="fab fa-instagram"></a>
                    <a href="https://ar.linkedin.com/in/henry-nehuen-mesias-rios-41a756297?original_referer=https%3A%2F%2Fwww.google.com%2F" class="fab fa-linkedin"></a>
                </div>
                <div class="credito">Creado por <span>David y Nehuen</span> | Todos los derechos reservados!</div>

            </section>

        </footer >


    );
};
export default Footer;