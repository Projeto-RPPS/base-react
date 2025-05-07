import React, { useState } from "react";
import Header from "../components/global/Header";
import Footer from "../components/global/Footer";
import NavigationRoutes from "../components/global/NavigationRoutes";
import SecondaryButton from "../components/global/SecundaryButton";
import FormularioCategoria from "../forms/contribuinteApi/FormularioCategoria";
import EditCategoria from "../forms/contribuinteApi/EditCategoriaForm";

export default function CategoriaPage() {
  const [showForm, setShowForm] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const [showEdit, setShowEdit] = useState(false);

  const handleCadastrarClick = () => {
    setShowForm(true);
    setShowButton(false);
  };

  const handlePesquisarClick = () => {
    setShowForm(false);
    setShowButton(false);
    setShowEdit(true);
    // Lógica de pesquisa aqui (se necessário)
  };

  const handleRefreshPage = () => {
    setShowForm(false);
    setShowEdit(false);
    setShowButton(true);
    // Lógica de pesquisa aqui (se necessário)
  };
   return (
    <>
      <div className="template-base">
        <Header titulo={"RPPS"} subtitulo={"Categorias"}/>
        <main className="d-flex flex-fill mb-5" id="main">
          <div className="container-fluid d-flex">
            <div className="row">
              <div className="col mb-5">
                <NavigationRoutes />
                <div className="main-content pl-sm-3 mt-4" id="main-content">
                {showButton && (
                  <><h1>Categorias</h1><div className="col mb-3">
                       <SecondaryButton
                         label={"Cadastrar nova Categoria"}
                         onClick={handleCadastrarClick} />
                       <SecondaryButton
                         label={"Editar Categorias"}
                         onClick={handlePesquisarClick} />
                     </div></>)}

                   {showEdit && (
                      
                <><h1>Editar Categoria</h1>
                <EditCategoria editFormInitial={{
                    idCategoria: "",
                    nomeCategoria: "",
                    percentualContribuicaoAntesDeSalvar: "",
                    percentualContribuicao: ""
                }} />
                <br></br>
                <SecondaryButton
                    label={"Voltar ao menu de Categorias"}
                    onClick={handleRefreshPage} /></>  
                  )}

                  {showForm && (
                      
                <><h1>Cadastrar Categoria</h1>
                <FormularioCategoria formIncial={{
                    nomeCategoria: "",
                    percentualContribuicao: ""
                }} />
                <br></br>
                <SecondaryButton
                    label={"Voltar ao menu de Categorias"}
                    onClick={handleRefreshPage} /></>  
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