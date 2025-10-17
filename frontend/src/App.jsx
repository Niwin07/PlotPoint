import { useState } from 'react';
import Header from './componentes/header';
import Footer from './componentes/footer';
import SobreNosotros from './componentes/sobrenosotros';
import Prueba from './componentes/prueba';
import Inicio from './componentes/inicio';
import Soporte from './componentes/soporte';
import Tyc from './componentes/terminosycondiciones';
import Iniciarsesion from './componentes/iniciarsesion';
import Crearcuenta from './componentes/crearcuenta';
import Busqueda from './componentes/busqueda';
import libro from './componentes/libro';
import { Route, Switch, useLocation } from "wouter";

import './App.css'



function App() {

  const [location] = useLocation();

  const ocultarLayout = ["/iniciarsesion", "/registro", "/terminosycondiciones"].includes(location);

  return (
    <section className='appBase'>
      {!ocultarLayout && <Header />}

      <main>
        <Switch>
          <Route path="/iniciarsesion" component={Iniciarsesion} />
          <Route path="/" ></Route>
          <Route path="/soporte" component={Soporte} />
          <Route path="/prueba" component={Prueba} />
          <Route path="/sobrenosotros" component={SobreNosotros} />
          <Route path="/inicio" component={Inicio} />
          <Route path="/terminosycondiciones" component={Tyc} />
          <Route path="/registro" component={Crearcuenta} />
          <Route path="/busqueda" component={Busqueda} />
          <Route path="/libro" component={libro} />
          <Route><h1>Pagina no existente :(</h1></Route>
        </Switch>

      </main>

      {!ocultarLayout && <Footer />}





    </section>
  )
}

export default App
