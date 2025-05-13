import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../../components/global/Button";
import Message from "../../../components/global/Message";
import emprestimoService from "../../../service/emprestimo/emprestimoService";
import SelectParcelas from "../../../components/emprestimoComponent/SelectParcelas";

export default function Fatura() {
  const { idEmprestimo } = useParams();
  const navigate = useNavigate();

  const [parcela, setParcela] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [activeTab, setActiveTab] = useState("pagar");
  const [anticipateCount, setAnticipateCount] = useState(1);
  const [availableCount, setAvailableCount] = useState(0);

  // Busca próxima parcela e conta quantas ainda podem ser antecipadas
  const fetchProxima = async () => {
    setLoading(true);
    try {
      const resp = await emprestimoService.proximaPendente(idEmprestimo);
      if (
        resp.status === 204 ||
        !resp.data ||
        typeof resp.data.numeroParcela === "undefined"
      ) {
        setParcela(null);
        setAvailableCount(0);
      } else {
        const data = resp.data;
        setParcela({
          ...data,
          dataVencimento: new Date(data.dataVencimento).toLocaleDateString("pt-BR"),
          valor: data.valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }),
        });

        // Conta somente as parcelas pendentes a partir desta
        const all = await emprestimoService.listarParcelas(idEmprestimo);
        const pendentesFuturos = all.data.filter(
          p => !p.paga && p.numeroParcela >= data.numeroParcela
        );
        setAvailableCount(pendentesFuturos.length);
        setAnticipateCount(prev => Math.min(prev, pendentesFuturos.length) || 1);
      }
      setErrorMsg("");
    } catch (err) {
      if (err.response?.status === 404) {
        setParcela(null);
        setAvailableCount(0);
      } else {
        setErrorMsg("Erro ao buscar parcela. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProxima();
  }, [idEmprestimo]);

  const handlePagar = async () => {
    if (!parcela) return;
    setActionLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await emprestimoService.pagarParcela(idEmprestimo);
      setSuccessMsg(`Parcela ${parcela.numeroParcela} paga com sucesso!`);
      await fetchProxima();
    } catch {
      setErrorMsg("Falha ao pagar a parcela. Tente novamente.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAntecipar = async () => {
    if (!parcela) return;
    const count = Math.max(1, parseInt(anticipateCount, 10) || 1);
    setActionLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await emprestimoService.anteciparParcelas(idEmprestimo, count);
      setSuccessMsg(`Antecipadas ${count} parcela(s) com sucesso!`);
      await fetchProxima();
    } catch {
      setErrorMsg("Falha ao antecipar parcela(s). Tente novamente.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <main id="main-content" className="container-lg my-5">
      <div className="row justify-content-center">
        <div className="col-sm-12 col-md-8 col-lg-6">
          <div className="br-card">
            <div className="br-tab" data-counter="false">
              <nav
                className="tab-nav"
                style={{ borderBottom: "none", display: "flex", justifyContent: "center" }}
              >
                <ul style={{ display: "flex", justifyContent: "center", margin: 0, padding: 0 }}>
                  <li className={`tab-item ${activeTab === "pagar" ? "is-active" : ""}`}>
                    <button type="button" onClick={() => setActiveTab("pagar")}>Pagar</button>
                  </li>
                  <li className={`tab-item ${activeTab === "antecipar" ? "is-active" : ""}`}>
                    <button type="button" onClick={() => setActiveTab("antecipar")}>Antecipar</button>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="card-header text-center pt-2 pb-0">
              <h2 className="mb-0">Fatura do Empréstimo</h2>
            </div>

            <div className="card-content p-4">
              {loading ? (
                <p className="text-center my-4">Carregando dados da parcela…</p>
              ) : (
                <>
                  {!parcela ? (
                    <>
                      <div className="d-flex justify-content-center mb-3">
                        <Button variant="secondary" onClick={() => navigate(-1)}>Voltar</Button>
                      </div>
                      {successMsg && (
                        <Message
                          type="success"
                          title="Sucesso. "
                          className="mx-auto mt-2 w-75"
                          onClose={() => setSuccessMsg("")}>
                          {successMsg}
                        </Message>
                      )}
                      <Message
                        type="info"
                        title="Informação. "
                        className="mx-auto mt-2 w-75"
                        onClose={() => setSuccessMsg("")}>
                        Não há parcelas pendentes para este empréstimo.
                      </Message>
                      {errorMsg && (
                        <Message
                          type="danger"
                          title="Erro. "
                          className="mx-auto mt-2 w-75"
                          onClose={() => setErrorMsg("")}>{errorMsg}
                        </Message>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="br-row gutter mb-4">
                        <div className="br-col-xs-12 mb-2"><strong>Parcela:</strong> {parcela.numeroParcela}</div>
                        <div className="br-col-xs-12 mb-2"><strong>Vencimento:</strong> {parcela.dataVencimento}</div>
                        <div className="br-col-xs-12 mb-2"><strong>Valor:</strong> {parcela.valor}</div>
                      </div>

                      {activeTab === "pagar" && (
                        <div className="d-flex justify-content-between mb-3">
                          <Button variant="secondary" onClick={() => navigate(-1)}>Voltar</Button>
                          <Button variant="primary" disabled={actionLoading} onClick={handlePagar}>
                            {actionLoading ? "…" : "Pagar"}
                          </Button>
                        </div>
                      )}

                      {activeTab === "antecipar" && (
                        <>
                          <div className="mb-4">
                            <SelectParcelas
                              value={anticipateCount}
                              onChange={setAnticipateCount}
                              availableCount={availableCount}
                              disabled={actionLoading}
                            />
                          </div>
                          <div className="d-flex justify-content-between mb-3">
                            <Button variant="secondary" onClick={() => navigate(-1)}>Voltar</Button>
                            <Button variant="primary" disabled={actionLoading} onClick={handleAntecipar}>
                              {actionLoading ? "…" : "Antecipar"}
                            </Button>
                          </div>
                        </>
                      )}

                      {successMsg && (
                        <Message
                          type="success"
                          title="Sucesso. "
                          className="w-100 mb-0"
                          onClose={() => setSuccessMsg("")}>
                          {successMsg}
                        </Message>
                      )}
                      {errorMsg && (
                        <Message
                          type="danger"
                          title="Erro. "
                          className="w-100 mb-0"
                          onClose={() => setErrorMsg("")}>
                          {errorMsg}
                        </Message>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}