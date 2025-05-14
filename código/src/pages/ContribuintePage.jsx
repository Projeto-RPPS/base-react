import React, { useState } from "react";
import FormularioContribuinte from "../forms/contribuinteApi/FormularioContribuinte";
import Header from "../components/global/Header";
import Footer from "../components/global/Footer";
import NavigationRoutes from "../components/global/NavigationRoutes";
import SecondaryButton from "../components/global/SecundaryButton";

export default function ContribuintePage() {
  const [showForm, setShowForm] = useState(false);
  const [showButton, setShowButton] = useState(true);

  const handleCadastrarClick = () => {
    setShowForm(true);
    setShowButton(false);
  };

  const handlePesquisarClick = () => {
    setShowForm(false);
    setShowButton(false);
    // Lógica de pesquisa aqui (se necessário)
  };

  const handleRefreshPage = () => {
    setShowForm(false);
    setShowButton(true);
    // Lógica de pesquisa aqui (se necessário)
  };
   return (
    <>
      <div className="template-base">
        <Header titulo={"RPPS"} subtitulo={"Contribuintes"}/>
        <main className="d-flex flex-fill mb-5" id="main">
          <div className="container-fluid d-flex">
            <div className="row">
              <div className="col mb-5">
                <NavigationRoutes />
                <div className="main-content pl-sm-3 mt-4" id="main-content">
                {showButton && (
                  <><h1>Sobre os Contribuintes</h1><div className="col mb-3">
                       <SecondaryButton
                         label={"Cadastrar novo Contribuinte"}
                         onClick={handleCadastrarClick} />
                       <SecondaryButton
                         label={"Pesquisar Contribuinte pelo CPF"}
                         onClick={handlePesquisarClick} />
                     </div></>)}
                  
                  {showForm && (
                        <><h1>Cadastrar Contribuinte</h1><FormularioContribuinte formDataInitial={{
                       nomeCivil: "",
                       nomeSocial: "",
                       cpf: "",
                       idCategoria: "",
                       listaEmails: [{ email: "" }],
                       listaEnderecos: [{ cep: "", numeroMoradia: "", estado: "" }],
                       listaTelefones: [{ numeroTelefone: "", tipoTelefone: "" }],
                       listaParentes: [{ nomeParente: "", cpfParente: "", idTipoParentesco: "" }],
                     }} />
                     <br></br>
                         <SecondaryButton
                           label={"Voltar ao menu de contribuintes"}
                           onClick={handleRefreshPage} />
                      </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
        <div className="br-cookiebar default d-none" tabIndex="-1"></div>
      </div>
    </>
  );
}