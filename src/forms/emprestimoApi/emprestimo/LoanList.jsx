// src/pages/LoanList.jsx
import React, { useState } from "react";
import Header from "../../../components/global/Header";
import NavigationRoutes from "../../../components/global/NavigationRoutes";
import Footer from "../../../components/global/Footer";
import Button from "../../../components/global/Button";
import Message from "../../../components/global/Message";
import emprestimoService from "../../../service/emprestimo/emprestimoService";

export default function LoanList() {
  const [cpf, setCpf] = useState("");
  const [emprestimos, setEmprestimos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchedOnce, setFetchedOnce] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [warningMsg, setWarningMsg] = useState("");

  const [expandedId, setExpandedId] = useState(null);
  const [parcelas, setParcelas] = useState([]);
  const [loadingParcelas, setLoadingParcelas] = useState(false);
  const [erroParcelas, setErroParcelas] = useState("");

  function handleCpfChange(e) {
    let raw = e.target.value.replace(/\D/g, "").slice(0, 11);
    let fmt = raw;
    if (raw.length > 9) fmt = raw.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    else if (raw.length > 6) fmt = raw.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
    else if (raw.length > 3) fmt = raw.replace(/(\d{3})(\d{1,3})/, "$1.$2");
    setCpf(fmt);
  }
  const rawCpf = cpf.replace(/\D/g, "");

  async function handleSubmit(e) {
    e.preventDefault();
    if (rawCpf.length !== 11) return;

    setExpandedId(null);
    setParcelas([]);
    setErroParcelas("");

    setFetchedOnce(false);
    setLoading(true);
    setErrorMsg("");
    setWarningMsg("");
    setEmprestimos([]);

    try {
      const res = await emprestimoService.listarEmprestimosPorCpf(rawCpf);
      const data = Array.isArray(res.data) ? res.data : [];
      if (data.length === 0) {
        setWarningMsg("Nenhum empréstimo encontrado para o CPF informado.");
      } else {
        setEmprestimos(
          data.map(i => ({
            ...i,
            dataInicio: new Date(i.dataInicio).toLocaleDateString("pt-BR"),
          }))
        );
      }
    } catch (err) {
      const resp = err.response;
      if (resp?.status === 404 && Array.isArray(resp.data.erros)) {
        setWarningMsg(resp.data.mensagem || "Nenhum empréstimo encontrado para o CPF informado.");
      } else {
        setErrorMsg(resp?.data?.mensagem || "Ocorreu um erro inesperado. Tente novamente mais tarde.");
      }
    } finally {
      setFetchedOnce(true);
      setLoading(false);
    }
  }

  async function toggleParcelas(loan) {
    const id = loan.idEmprestimo;
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);
    setParcelas([]);
    setErroParcelas("");
    setLoadingParcelas(true);

    try {
      const res = await emprestimoService.listarParcelas(id);
      setParcelas(
        res.data.map(p => ({
          ...p,
          dataVencimento: new Date(p.dataVencimento).toLocaleDateString("pt-BR"),
          dataPagamento: p.dataPagamento
            ? new Date(p.dataPagamento).toLocaleDateString("pt-BR")
            : "--",
          statusPagamento: p.paga ? "Paga" : "Pendente",
        }))
      );
    } catch {
      setErroParcelas("Erro ao carregar parcelas. Tente novamente mais tarde.");
    } finally {
      setLoadingParcelas(false);
    }
  }

  return (
    <>
      <Header />
      <main id="main-content" className="container my-5">
        <NavigationRoutes />

        {/* Card de busca um pouco maior */}
        <div className="row justify-content-center mb-5">
          <div className="col-12 col-md-10 col-lg-6">
            <div className="br-card">
              <div className="card-header text-center">
                <h2>Buscar Empréstimos</h2>
              </div>
              <div className="card-content p-4">
                <form onSubmit={handleSubmit} className="row align-items-end mb-4">
                  <div className="col-9">
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
                  <div className="col-3 text-right">
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

                {errorMsg && (
                  <Message
                    type="danger"
                    title="Erro."
                    className="mt-4"
                    onClose={() => {
                      setErrorMsg("");
                      setFetchedOnce(false);
                      setEmprestimos([]);
                    }}
                  >
                    {errorMsg}
                  </Message>
                )}
                {fetchedOnce && !loading && warningMsg && (
                  <Message
                    type="warning"
                    title="Atenção. "
                    className="mt-4"
                    onClose={() => {
                      setWarningMsg("");
                      setFetchedOnce(false);
                      setEmprestimos([]);
                    }}
                  >
                    {warningMsg}
                  </Message>
                )}

                {/* Mensagem inicial */}
                {!fetchedOnce && !errorMsg && !warningMsg && (
                  <p className="text-center text-down-01">
                    Informe um CPF e clique em Buscar para ver seus empréstimos.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {fetchedOnce && !loading && !errorMsg && !warningMsg && (
          <div className="row justify-content-center">
            <div className="col-12 col-md-10">
              <table className="br-table">
                <colgroup>
                  <col style={{ width: "14%" }} />
                  <col style={{ width: "14%" }} />
                  <col style={{ width: "14%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "14%" }} />
                  <col style={{ width: "14%" }} />
                  <col style={{ width: "20%" }} />
                </colgroup>
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Total</th>
                    <th>Parcela</th>
                    <th>Quantidade</th>
                    <th>Financeiro</th>
                    <th>Início</th>
                    <th className="text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {emprestimos.map(loan => (
                    <React.Fragment key={loan.idEmprestimo}>
                      <tr>
                        <td className="align-middle">{loan.status}</td>
                        <td className="text-right align-middle">
                          {loan.valorTotal.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL"
                          })}
                        </td>
                        <td className="text-right align-middle">
                          {loan.valorParcela.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL"
                          })}
                        </td>
                        <td className="text-center align-middle">{loan.quantidadeParcelas}</td>
                        <td className="text-center align-middle">{loan.statusFinanceiro}</td>
                        <td className="text-center align-middle">{loan.dataInicio}</td>
                        <td className="text-center align-middle">
                          <Button
                            variant="tertiary"
                            size="small"
                            style={{ padding: "0.25rem 0.5rem", fontSize: "0.875rem" }}
                            onClick={() => toggleParcelas(loan)}
                          >
                            {expandedId === loan.idEmprestimo ? "Ocultar" : "Ver Mais"}
                          </Button>
                        </td>
                      </tr>

                      {expandedId === loan.idEmprestimo && (
                        <tr>
                          <td colSpan={7} className="p-0">
                            {erroParcelas && (
                              <Message
                                type="danger"
                                title="Erro."
                                className="m-3"
                                onClose={() => setErroParcelas("")}
                              >
                                {erroParcelas}
                              </Message>
                            )}
                            {loadingParcelas ? (
                              <p className="m-3">Carregando parcelas…</p>
                            ) : (
                              <div style={{ width: "70%", margin: "1rem auto" }}>
                                <table className="br-table">
                                  <colgroup>
                                    <col style={{ width: "20%" }} />
                                    <col style={{ width: "20%" }} />
                                    <col style={{ width: "20%" }} />
                                    <col style={{ width: "20%" }} />
                                    <col style={{ width: "20%" }} />
                                  </colgroup>
                                  <thead>
                                    <tr>
                                      <th className="text-center">N°</th>
                                      <th className="text-center">Vencimento</th>
                                      <th className="text-right">Valor</th>
                                      <th className="text-center">Status</th>
                                      <th className="text-center">Pago em</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {parcelas.map(p => (
                                      <tr key={p.numeroParcela}>
                                        <td className="text-center align-middle">{p.numeroParcela}</td>
                                        <td className="text-center align-middle">{p.dataVencimento}</td>
                                        <td className="text-right align-middle">
                                          {p.valor.toLocaleString("pt-BR", {
                                            style: "currency",
                                            currency: "BRL"
                                          })}
                                        </td>
                                        <td className="text-center align-middle">{p.statusPagamento}</td>
                                        <td className="text-center align-middle">{p.dataPagamento}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}