import React from 'react'
import CreateLoan from './forms/emprestimoApi/emprestimo/CreateLoan'
import LoanList from './forms/emprestimoApi/emprestimo/LoanList'
import SimulateLoan from './forms/emprestimoApi/emprestimo/SimulateLoan'
import Fatura from './forms/emprestimoApi/parcela/Fatura'
import SimulateMargin from './forms/emprestimoApi/margemCosignavel/SimulateMargin'
import Header from './components/global/Header'
import Footer from './components/global/Footer'
import NavigationRoutes from './components/global/NavigationRoutes'
import { Routes, Route, Navigate } from 'react-router-dom'

export default function App() {
  return (
    <div className="template-base">
      <Header />

      <main id="main-content" className="d-flex flex-fill mb-5">
        <div className="container-fluid d-flex">
          <div className="col mb-5">
            <NavigationRoutes />
            <div className="main-content pl-sm-3 mt-4">
              <Routes>
                <Route path="/" element={<Navigate to="/emprestimos" replace />} />
                <Route path="/emprestimos" element={<LoanList />} />
                <Route path="/emprestimos/criar" element={<CreateLoan />} />
                <Route path="/emprestimos/simular" element={<SimulateLoan />} />
                <Route path="/margem" element={<SimulateMargin />} />
                <Route path="/fatura/:idEmprestimo" element={<Fatura />} />
              </Routes>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <div className="br-cookiebar default d-none" tabIndex="-1" />
    </div>
  )
}