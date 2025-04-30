// HeaderGov.jsx
import React, { useEffect, useState } from "react";
import FormularioContribuinte from "../forms/FormularioContribuinte";
import Header from "../components/Header";
import Footer from "../components/Footer";
import NavigationRoutes from "../components/NavigationRoutes";
import contribuinteService from "../service/contribuinteService";

export default function ContribuintePage() {
  const [contribuintes, setContribuintes] = useState([]);

  useEffect(() => {
    contribuinteService.listarContribuintes()
      .then(response => {
        setContribuintes(response.data);
      })
      .catch(error => {
        console.error("Erro ao buscar contribuintes:", error);
      });
  }, []);

  console.log(contribuintes);
  return (
    <>
      <div className="template-base">
        <Header />
        <main className="d-flex flex-fill mb-5" id="main">
          <div className="container-fluid d-flex">
            <div className="row">
                
              <div className="col mb-5">
                <NavigationRoutes />
                <div className="main-content pl-sm-3 mt-4" id="main-content">
                  <h1>Título h1</h1>
                  <p>Parágrafo de exemplo <a href="">link de exemplo</a>.</p>
                  <h2>Título h2</h2>
                  <h3>Título h3</h3>
                  <h4>Título h4</h4>
                  <h5>Título h5</h5>
                  <h6>Título h6</h6>

                  {/* Aqui mostramos os dados vindos da API */}
                  <h5>Lista de Contribuintes:</h5>
                  <ul>
                    {contribuintes.map((c) => (
                      <li key={c.idContribuinte}>{c.nomeCivil}</li>
                    ))}
                  </ul>

                  <FormularioContribuinte />
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
