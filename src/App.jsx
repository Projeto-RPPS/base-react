import React from 'react'
import CreateLoan from './forms/emprestimoApi/emprestimo/CreateLoan'
import LoanList from './forms/emprestimoApi/emprestimo/LoanList'
import SimulateLoan from './forms/emprestimoApi/emprestimo/SimulateLoan'
import SimulateMargin from './forms/emprestimoApi/margemCosignavel/SimulateMargin'
import Header from './components/global/Header'
import Footer from './components/global/Footer'
import NavigationRoutes from './components/global/NavigationRoutes'

export default function App() {
  return (
    <div className="template-base">
      <Header />

      <main id="main-content" className="d-flex flex-fill mb-5">
        <div className="container-fluid d-flex">
          <div className="col mb-5">
            <NavigationRoutes />
            <div className="main-content pl-sm-3 mt-4" id="main-content">
                  <LoanList/>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <div className="br-cookiebar default d-none" tabIndex="-1"></div>
    </div>
  )
}