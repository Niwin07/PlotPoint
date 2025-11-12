
import { useState } from 'react';
import { Route, Switch, useLocation } from 'wouter';

import './App.css';

//  Componentes comunes
import Header from './componentes/common/header';
import HeaderAdmin from './componentes/administracion/HeaderAdmin'

import Footer from './componentes/common/footer';

//  Páginas principales
import Inicio from './componentes/home/inicio';
import Busqueda from './componentes/home/busqueda';
import ListaReseñasInicio from './componentes/home/ListaReseñasInicio';

//  Libros y reseñas
import Libro from './componentes/libro/libro';
import ReviewDetail from './componentes/libro/ReviewDetail';

//  Usuario / Perfil
import Perfil from './componentes/perfil/Perfil';
import EditarPerfil from './componentes/perfil/EditarPerfil'
import Usuario from './componentes/perfil/Usuario';

//  Autenticación
import Iniciarsesion from './componentes/auth/iniciarsesion';
import Crearcuenta from './componentes/auth/crearcuenta';

// ℹ Información y soporte
import SobreNosotros from './componentes/info/sobrenosotros';
import Soporte from './componentes/info/soporte';
import Tyc from './componentes/info/terminosycondiciones';

//  Modales
import ModalNoCuenta from './componentes/modals/usuario/ModalNoCuenta';


function App() {
  const [location] = useLocation();
  const [showModal, setShowModal] = useState(false);

  // Ocultar Header y Footer en estas rutas
  const ocultarLayout = ["/iniciarsesion", "/registro", "/terminosycondiciones"].includes(location);

  return (
    <section className="appBase">
      {!ocultarLayout && <Header />}

      <main>
        <Switch>

          {/*  Páginas principales */}
          <Route path="/" component={Inicio} />
          <Route path="/inicio" component={Inicio} />
          <Route path="/busqueda" component={Busqueda} />
          <Route path="/reseñasinicio" component={ListaReseñasInicio} />

          {/*  Libros y reseñas */}
          <Route path="/libro/:id" component={Libro} />
          <Route path="/reseñalibro/:id" component={ReviewDetail} />

          {/*  Usuario / Perfil */}
          <Route path="/usuario/:id" component={Usuario} />
          <Route path="/usuario/:id/megustas" component={Usuario} />
          <Route path="/usuario/:id/reseñas" component={Usuario} />
          <Route path="/perfil/:id" component={Perfil} />
          <Route path="/perfil/:id/megustas" component={Perfil} />
          <Route path="/perfil/:id/reseñas" component={Perfil} />
          <Route path="/perfil/:id/editarperfil" component={EditarPerfil} />

          {/*  Autenticación */}
          <Route path="/iniciarsesion" component={Iniciarsesion} />
          <Route path="/registro" component={Crearcuenta} />

          {/*  Información y soporte */}
          <Route path="/sobrenosotros" component={SobreNosotros} />
          <Route path="/soporte" component={Soporte} />
          <Route path="/terminosycondiciones" component={Tyc} />

          {/* Admin seccion*/}
          <Route path="/admin/*" component={HeaderAdmin}/>

          {/*  Página no encontrada */}
          <Route><h1>Página no existente :(</h1></Route>

        </Switch>

        {/* Este modal debe activarse si realizas una accion que requiera cuenta de Plotpoint */}
        {/* 
        <button onClick={() => setShowModal(true)}>Abrir modal</button>
        {showModal && <ModalNoCuenta onClose={() => setShowModal(false)} />} 
        */}
      </main>

      {!ocultarLayout && <Footer />}
    </section>
  );
}

export default App;

