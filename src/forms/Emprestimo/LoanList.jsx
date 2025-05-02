// src/pages/LoanList.jsx
import React, { useState } from "react";
import Header from "../../components/Header";
import NavigationRoutes from "../../components/NavigationRoutes";
import Footer from "../../components/Footer";
import Table from "../../components/Table";
import Button from "../../components/Button";
import emprestimoService from "../../service/emprestimoService";

export default function LoanList() {
  const [cpf, setCpf] = useState("");
  const [emprestimos, setEmprestimos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchedOnce, setFetchedOnce] = useState(false);

  const columns = [
    { header: "ID", accessor: "idEmprestimo" },
    { header: "Status", accessor: "status" },
    { header: "Valor Total (R$)", accessor: "valorTotal" },
    { header: "Valor da Parcela (R$)", accessor: "valorParcela" },
    { header: "Qtd. Parcelas", accessor: "quantidadeParcelas" },
    { header: "Data de Início", accessor: "dataInicio" },
    { header: "Status Financeiro", accessor: "statusFinanceiro" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cpf.trim()) return;
    setLoading(true);
    try {
      const res = await emprestimoService.listarEmprestimosPorCpf(cpf);
      const dadosFormatados = res.data.map((e) => ({
        ...e,
        dataInicio: new Date(e.dataInicio).toLocaleDateString("pt-BR"),
      }));
      setEmprestimos(dadosFormatados);
    } catch (err) {
      console.error("Erro ao buscar empréstimos:", err);
      setEmprestimos([]);
    } finally {
      setFetchedOnce(true);
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main id="main-content" className="container-lg my-5">
        <NavigationRoutes />

        <div className="row justify-content-center">
          <div className="col-sm-12 col-md-10 col-lg-8">
            <div className="br-card">

              <div className="card-header text-center">
                <h2 style={{ color: "var(--interactive)" }}>Meus Empréstimos</h2>
              </div>

              <div className="card-content p-4">
                {/* formulário de CPF */}
                <form
                  onSubmit={handleSubmit}
                  className="row mb-4 align-items-end"
                >
                  <div className="col-8">
                    <div className="br-input mb-0">
                      <label htmlFor="cpfBusca">CPF do Contribuinte</label>
                      <input
                        id="cpfBusca"
                        type="text"
                        placeholder="00000000000"
                        className="w-100"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div className="col-4 d-flex justify-content-end">
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={loading || !cpf.trim()}
                      className="block"
                    >
                      {loading ? "Carregando…" : "Buscar"}
                    </Button>
                  </div>
                </form>

                {/* exibição da tabela ou mensagem */}
                {fetchedOnce ? (
                  emprestimos.length > 0 ? (
                    <Table
                      title=""
                      density="medium"
                      columns={columns}
                      data={emprestimos}
                    />
                  ) : (
                    <p className="text-center text-down-01">
                      Nenhum empréstimo encontrado para o CPF {cpf}.
                    </p>
                  )
                ) : (
                  <p className="text-center text-down-01">
                    Informe um CPF e clique em Buscar para ver seus empréstimos.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}