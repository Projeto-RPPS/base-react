// src/pages/fatura/Fatura.jsx
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

  // agora interfere no número da parcela selecionada
  const [anticipateCount, setAnticipateCount] = useState(null);
  const [parcelasTouched, setParcelasTouched] = useState(false);
  const [availableCount, setAvailableCount] = useState(0);

  // valores para cálculo
  const [firstValue, setFirstValue] = useState(0);
  const [standardValue, setStandardValue] = useState(0);

  // ** detecta se há atraso (juros) **
  const hasOverdue = firstValue > standardValue;

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
        setAnticipateCount(null);
        setParcelasTouched(false);
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

        const all = await emprestimoService.listarParcelas(idEmprestimo);
        const pendentes = all.data.filter(
          (p) => !p.paga && p.numeroParcela >= data.numeroParcela
        );

        setAvailableCount(pendentes.length);
        setAnticipateCount(data.numeroParcela);
        setParcelasTouched(false);
        setFirstValue(data.valor);
        setStandardValue(pendentes[1]?.valor ?? data.valor);
      }
      setErrorMsg("");
    } catch (err) {
      if (err.response?.status === 404) {
        setParcela(null);
        setAvailableCount(0);
        setAnticipateCount(null);
        setParcelasTouched(false);
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
    if (!parcela || anticipateCount === null) return;
    setActionLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    // converte número da parcela selecionada em quantidade a antecipar
    const startAt = parcela.numeroParcela;
    const parcelasToAntecipate = anticipateCount - startAt + 1;

    try {
      await emprestimoService.anteciparParcelas(
        idEmprestimo,
        parcelasToAntecipate
      );
      setSuccessMsg(
        `Antecipadas ${parcelasToAntecipate} parcela(s) com sucesso!`
      );
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
                style={{
                  borderBottom: "none",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <ul style={{ display: "flex", margin: 0, padding: 0 }}>
                  <li className={`tab-item ${activeTab === "pagar" ? "is-active" : ""}`}>
                    <button type="button" onClick={() => setActiveTab("pagar")}>
                      Pagar
                    </button>
                  </li>
                  <li className={`tab-item ${activeTab === "antecipar" ? "is-active" : ""}`}>
                    <button type="button" onClick={() => setActiveTab("antecipar")}>
                      Antecipar
                    </button>
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
              ) : !parcela ? (
                <>
                  <div className="d-flex justify-content-center mb-3">
                    <Button variant="secondary" onClick={() => navigate(-1)}>
                      Voltar
                    </Button>
                  </div>
                  {successMsg && (
                    <Message
                      type="success"
                      title="Sucesso. "
                      className="mx-auto mt-2 w-75"
                      onClose={() => setSuccessMsg("")}
                    >
                      {successMsg}
                    </Message>
                  )}
                  <Message
                    type="info"
                    title="Informação. "
                    className="mx-auto mt-2 w-75"
                    onClose={() => setSuccessMsg("")}
                  >
                    Não há parcelas pendentes para este empréstimo.
                  </Message>
                  {errorMsg && (
                    <Message
                      type="danger"
                      title="Erro. "
                      className="mx-auto mt-2 w-75"
                      onClose={() => setErrorMsg("")}
                    >
                      {errorMsg}
                    </Message>
                  )}
                </>
              ) : (
                <>
                  <div className="br-row gutter mb-4">
                    <div className="br-col-xs-12 mb-2">
                      <strong>Parcela pendente:</strong> {parcela.numeroParcela}
                    </div>
                    <div className="br-col-xs-12 mb-2">
                      <strong>Vencimento:</strong> {parcela.dataVencimento}
                    </div>
                    <div className="br-col-xs-12 mb-2">
                      <strong>Valor:</strong> {parcela.valor}
                    </div>
                  </div>

                  {activeTab === "pagar" && (
                    <div className="d-flex justify-content-between mb-3">
                      <Button variant="secondary" onClick={() => navigate(-1)}>
                        Voltar
                      </Button>
                      <Button
                        variant="primary"
                        disabled={actionLoading}
                        onClick={handlePagar}
                      >
                        {actionLoading ? "…" : "Pagar"}
                      </Button>
                    </div>
                  )}

                  {activeTab === "antecipar" && (
                    <>
                      <div className="mb-4">
                        <SelectParcelas
                          value={anticipateCount}
                          onChange={(count) => {
                            setAnticipateCount(count);
                            setParcelasTouched(true);
                          }}
                          disabled={actionLoading}
                          firstValue={firstValue}
                          standardValue={standardValue}
                          startAt={parcela.numeroParcela}
                          totalInstallments={
                            parcela.numeroParcela + availableCount - 1
                          }
                        />
                      </div>
                      <div className="d-flex justify-content-between mb-3">
                        <Button variant="secondary" onClick={() => navigate(-1)}>
                          Voltar
                        </Button>
                        <Button
                          variant="primary"
                          disabled={actionLoading || hasOverdue || !parcelasTouched}
                          onClick={handleAntecipar}
                        >
                          {actionLoading ? "…" : "Antecipar"}
                        </Button>
                      </div>
                      {hasOverdue && (
                        <Message type="warning" title="Atenção. " className="mt-3">
                          Existem parcelas em atraso. Pague-as primeiro.
                        </Message>
                      )}
                    </>
                  )}

                  {successMsg && (
                    <Message
                      type="success"
                      title="Sucesso. "
                      className="w-100 mb-0"
                      onClose={() => setSuccessMsg("")}
                    >
                      {successMsg}
                    </Message>
                  )}
                  {errorMsg && (
                    <Message
                      type="danger"
                      title="Erro. "
                      className="w-100 mb-0"
                      onClose={() => setErrorMsg("")}
                    >
                      {errorMsg}
                    </Message>
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