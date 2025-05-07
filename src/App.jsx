import React from 'react'
import ContribuintePage from './Pages/ContribuintePage'
import CategoriaPage from './Pages/CategoriaPage'
import LoanList from './forms/emprestimoApi/emprestimo/LoanList'

export default function App() {
  return (
    <>
      <CategoriaPage />
      <ContribuintePage />
      <LoanList />
    </>
  )
}

