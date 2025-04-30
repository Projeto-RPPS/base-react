import React, { useEffect, useState } from "react"; // Formulário para empréstimos
import Header from "./Header";
import Footer from "./Footer";
import NavigationRoutes from "./NavigationRoutes";
import emprestimoService from "../service/emprestimoService";  // Serviço de empréstimos

export default function HeaderGov() {
  const [emprestimos, setEmprestimos] = useState([]);  // Estado para armazenar a lista de empréstimos

  useEffect(() => {
    // Alterando a chamada para o serviço de empréstimos
    emprestimoService.listarEmprestimos()
      .then(response => {
        setEmprestimos(response.data);  // Armazenando a lista de empréstimos
      })
      .catch(error => {
        console.error("Erro ao buscar empréstimos:", error);
      });
  }, []);

  console.log(emprestimos);  // Para depuração

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

                  <h5>Lista de Empréstimos:</h5>
                  <ul>
                    {emprestimos.map((e) => (
                      <li key={e.idEmprestimo}>
                        <strong>ID:</strong> {e.idEmprestimo}<br />
                        <strong>Status:</strong> {e.status}<br />
                        <strong>Valor Total:</strong> R$ {e.valorTotal}<br />
                        <strong>Valor da Parcela:</strong> R$ {e.valorParcela}<br />
                        <strong>Quantidade de Parcelas:</strong> {e.quantidadeParcelas}<br />
                        <strong>Data de Início:</strong> {new Date(e.dataInicio).toLocaleDateString()}<br />
                        <strong>Status Financeiro:</strong> {e.statusFinanceiro}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
        <div className="br-cookiebar default d-none" tabIndex="-1"></div>
      </div>
      <script src="../../../core-init.js"></script>
    </>
  );
}