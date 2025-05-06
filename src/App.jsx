import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ContribuintePage from './Pages/ContribuintePage';
import BeneficiosPage from './Pages/BeneficiosPage';
import Header from './components/Header';
import Footer from './components/Footer';
import NavigationRoutes from './components/NavigationRoutes';

function App() {
  
  return (
    /* Acho que só é preciso o header aqui */
    <Router>
          <Header/>
          <div className='container my-5'>
          <Routes>
                    <Route path="/" element={<ContribuintePage />} />
                    <Route path="/beneficios" element={<BeneficiosPage />} />
                  </Routes>             
          </div>   
        <Footer />
        <div className="br-cookiebar default d-none" tabIndex="-1"></div>   
    </Router>
  );
}

export default App;

