import React, { useState } from "react";
import Header from "../../../components/global/Header";
import NavigationRoutes from "../../../components/global/NavigationRoutes";
import Footer from "../../../components/global/Footer";
import Table from "../../../components/global/Table";
import Button from "../../../components/global/Button";
import emprestimoService from "../../../service/emprestimo/emprestimoService";

export default function LoanList() {
  const [cpf, setCpf] = useState("");
  const [emprestimos, setEmprestimos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchedOnce, setFetchedOnce] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");    // danger
  const [warningMsg, setWarningMsg] = useState(""); // warning (404)

  const columns = [
    { header: "Status", accessor: "status" },
    { header: "Valor Total (R$)", accessor: "valorTotal" },
    { header: "Valor da Parcela (R$)", accessor: "valorParcela" },
    { header: "Qtd. Parcelas", accessor: "quantidadeParcelas" },
    { header: "Status Financeiro", accessor: "statusFinanceiro" },
  ];

  // Formata e limita a entrada do CPF a 11 dígitos enquanto digita
  function handleCpfChange(e) {
    let raw = e.target.value.replace(/\D/g, "").slice(0, 11);
    let formatted = raw;
    if (raw.length > 9) {
      formatted = raw.replace(
        /(\d{3})(\d{3})(\d{3})(\d{2})/,
        "$1.$2.$3-$4"
      );
    } else if (raw.length > 6) {
      formatted = raw.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
    } else if (raw.length > 3) {
      formatted = raw.replace(/(\d{3})(\d{1,3})/, "$1.$2");
    }
    setCpf(formatted);
  }

  // Extrai apenas os dígitos para validação/enviá-los à API
  const rawCpf = cpf.replace(/\D/g, "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rawCpf.length !== 11) return;

    // limpa estado anterior
    setFetchedOnce(false);
    setLoading(true);
    setErrorMsg("");
    setWarningMsg("");
    setEmprestimos([]);

    try {
      const res = await emprestimoService.listarEmprestimosPorCpf(rawCpf);

      // warning se retornar array vazio
      if (Array.isArray(res.data) && res.data.length === 0) {
        setWarningMsg("Nenhum empréstimo encontrado para o CPF informado.");
        return;
      }

      // caso normal: formata e seta empréstimos
      const dadosFormatados = res.data.map((item) => ({
        ...item,
        dataInicio: new Date(item.dataInicio).toLocaleDateString("pt-BR"),
      }));
      setEmprestimos(dadosFormatados);
    } catch (err) {
      const resp = err.response;
      const status = resp?.status;
      const { mensagem, erros } = resp?.data || {};

      if (status === 404 && Array.isArray(erros) && erros.length === 0) {
        setWarningMsg(
          mensagem || "Nenhum empréstimo encontrado para o CPF informado."
        );
      } else {
        setErrorMsg(
          mensagem || "Ocorreu um erro inesperado. Tente novamente mais tarde."
        );
      }
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
                <form onSubmit={handleSubmit} className="row mb-4 align-items-end">
                  <div className="col-8">
                    <div className="br-input mb-0">
                      <label htmlFor="cpfBusca">CPF</label>
                      <input
                        id="cpfBusca"
                        type="text"
                        inputMode="numeric"
                        placeholder="000.000.000-00"
                        className="w-100"
                        value={cpf}
                        onChange={handleCpfChange}
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div className="col-4 d-flex justify-content-end">
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={loading || rawCpf.length !== 11}
                      className="block"
                    >
                      {loading ? "Carregando…" : "Buscar"}
                    </Button>
                  </div>
                </form>

                {/* erro geral → danger */}
                {errorMsg && (
                  <div className="br-message danger mb-4">
                    <div className="icon">
                      <i className="fas fa-times-circle fa-lg" aria-hidden="true" />
                    </div>
                    <div className="content" role="alert" aria-label={errorMsg}>
                      <span className="message-title">Erro.</span>
                      <span className="message-body"> {errorMsg}</span>
                    </div>
                    <div className="close">
                      <button
                        className="br-button circle small"
                        type="button"
                        aria-label="Fechar alerta"
                        onClick={() => {
                          setErrorMsg("");
                          setFetchedOnce(false);
                          setEmprestimos([]);
                        }}
                      >
                        <i className="fas fa-times" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                )}

                {/* nenhum resultado → warning */}
                {fetchedOnce && !loading && warningMsg && (
                  <div className="br-message warning mb-4">
                    <div className="icon">
                      <i className="fas fa-exclamation-triangle fa-lg" aria-hidden="true" />
                    </div>
                    <div className="content" role="alert" aria-label={warningMsg}>
                      <span className="message-title">Atenção.</span>
                      <span className="message-body"> {warningMsg}</span>
                    </div>
                    <div className="close">
                      <button
                        className="br-button circle small"
                        type="button"
                        aria-label="Fechar alerta"
                        onClick={() => {
                          setWarningMsg("");
                          setFetchedOnce(false);
                          setEmprestimos([]);
                        }}
                      >
                        <i className="fas fa-times" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                )}

                {/* tabela de resultados */}
                {fetchedOnce && !loading && !errorMsg && !warningMsg && (
                  <Table
                    title=""
                    density="medium"
                    columns={columns}
                    data={emprestimos}
                  />
                )}

                {/* instrução inicial */}
                {!fetchedOnce && !errorMsg && !warningMsg && (
                  <p className="text-center text-down-01">
                    Informe um CPF válido e clique em Buscar para ver seus empréstimos.
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