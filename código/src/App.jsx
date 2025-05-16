import CreateLoan from './forms/emprestimoApi/emprestimo/CreateLoan'
import LoanList from './forms/emprestimoApi/emprestimo/LoanList'
import SimulateLoan from './forms/emprestimoApi/emprestimo/SimulateLoan'
import Fatura from './forms/emprestimoApi/parcela/Fatura'
import SimulateMargin from './forms/emprestimoApi/margemCosignavel/SimulateMargin'
import ContribuinteData from './forms/contribuinteApi/ContribuinteData'
import Header from './components/global/Header'
import Footer from './components/global/Footer'
import FormularioCategoria from './forms/contribuinteApi/FormularioCategoria'
import FormularioContribuinte from './forms/contribuinteApi/FormularioContribuinte'
import FazerContribuicao from './forms/contribuinteApi/FazerContribuicao'
import ContribuicaoData from './forms/contribuinteApi/ContribuicaoData'
import EditCategoriaForm from './forms/contribuinteApi/EditCategoriaForm'
import LoginPage from './forms/LoginPage';
import HomeContent from './forms/HomePage'
import { Routes, Route, Navigate } from 'react-router-dom'

export default function App() {
  return (
    <div className="template-base">
      <Header />
 
      <main id="main-content" className="d-flex flex-fill mb-5">
        <div className="container-fluid d-flex">
          <div className="col mb-5">
            <div className="main-content pl-sm-3 mt-4">
              <Routes>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<HomeContent />} />
                <Route path="/emprestimos" element={<LoanList />} />
                <Route path="/emprestimos/criar" element={<CreateLoan />} />
                <Route path="/emprestimos/simular" element={<SimulateLoan />} />
                <Route path="/margem" element={<SimulateMargin />} />
                <Route path="/fatura/:idEmprestimo" element={<Fatura />} />
                {/*<Route path="/fatura/:idEmprestimo" element={<Fatura />} />*/}
                
                {/* Rotas do sistema de contribuintes */}
                <Route path="/contribuintes" element={<ContribuinteData />} />
                <Route path="/contribuintes/cadastrar" element={<FormularioContribuinte formDataInitial={{
                       nomeCivil: "",
                       nomeSocial: "",
                       cpf: "",
                       idCategoria: "",
                       listaEmails: [{ email: "" }],
                       listaEnderecos: [{ cep: "", numeroMoradia: "", estado: "" }],
                       listaTelefones: [{ numeroTelefone: "", tipoTelefone: "" }],
                       listaParentes: [{ nomeParente: "", cpfParente: "", idTipoParentesco: "" }],
                     }} />} />
                <Route path="/contribuintes/categorias" element={<FormularioCategoria formIncial={{
                    nomeCategoria: "",
                    percentualContribuicao: ""
                }} />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/contribuintes/categorias/editar" element={<EditCategoriaForm editFormInitial={{
                    idCategoria: "",
                    nomeCategoria: "",
                    percentualContribuicaoAntesDeSalvar: "",
                    percentualContribuicao: ""
                }} />} />
                <Route path="/contribuicoes" element={<FazerContribuicao />} />
                <Route path="/contribuicoes/historico" element={<ContribuicaoData />} />
              </Routes>
            </div>
          </div>
        </div>
      </main>
      <br />
      <br />
      <Footer />
      <div className="br-cookiebar default d-none" tabIndex="-1" />
    </div>
  )
}
