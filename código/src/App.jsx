import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/global/Header';
import Footer from './components/global/Footer';
import NavigationRoutes from './components/global/NavigationRoutes';

// Páginas de Benefícios
import BeneficiosPage from './pages/BeneficiosPage';

export default function App() {
  return (
    <Router>
      <div className="template-base">
        <Header />
        <main id="main-content" className="d-flex flex-fill mb-5">
          <div className="container-fluid d-flex">
            <div className="col mb-5">
              <NavigationRoutes />
              <div className="main-content pl-sm-3 mt-4" id="main-content">
                <Routes>
                  <Route path="/beneficios" element={<BeneficiosPage />} />
                </Routes>
              </div>
            </div>
          </div>
        </main>
        <Footer />
        <div className="br-cookiebar default d-none" tabIndex="-1"></div>
      </div>
    </Router>
  );
}