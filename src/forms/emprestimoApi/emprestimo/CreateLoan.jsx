// src/pages/CreateLoan.jsx
import React, { useState, useMemo } from "react";
import Header from "../../../components/global/Header";
import NavigationRoutes from "../../../components/global/NavigationRoutes";
import Footer from "../../../components/global/Footer";
import Input from "../../../components/global/Input";
import Button from "../../../components/global/Button";
import emprestimoService from "../../../service/emprestimo/emprestimoService";

export default function CreateLoan() {
  // estados de formulário
  const [cpf, setCpf] = useState("");
  const [valorTotal, setValorTotal] = useState("");
  const [quantidadeParcelas, setQuantidadeParcelas] = useState("");

  // submissão e resultados
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");      // para erros vermelhos
  const [warningMsg, setWarningMsg] = useState("");  // para “sem benefício” amarelo
  const [resultado, setResultado] = useState(null);

  // CPF numérico
  const rawCpf = useMemo(() => cpf.replace(/\D/g, ""), [cpf]);
  const numericValor = parseFloat(valorTotal.replace(",", "."));
  const numericParcelas = parseInt(quantidadeParcelas, 10);

  // validações
  const isCpfValid = rawCpf.length === 11;
  const isValorValid = !isNaN(numericValor) && numericValor > 0;
  const isParcelasValid = !isNaN(numericParcelas) && numericParcelas > 0;
  const isFormValid = isCpfValid && isValorValid && isParcelasValid;

  // formata CPF na digitação
  function handleCpfChange(e) {
    let v = e.target.value.replace(/\D/g, "").slice(0, 11);
    if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
    else if (v.length > 3) v = v.replace(/(\d{3})(\d{1,3})/, "$1.$2");
    setCpf(v);
  }

  function handleValorChange(e) {
    let v = e.target.value.replace(/[^0-9,\.]/g, "");
    const parts = v.split(/[,.]/);
    if (parts.length > 2) v = parts.shift() + "." + parts.join("");
    setValorTotal(v);
  }

  function handleParcelasChange(e) {
    setQuantidadeParcelas(e.target.value.replace(/\D/g, ""));
  }

  function resetForm() {
    setCpf("");
    setValorTotal("");
    setQuantidadeParcelas("");
    setErrorMsg("");
    setWarningMsg("");
    setResultado(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    setErrorMsg("");
    setWarningMsg("");
    setResultado(null);

    const payload = {
      cpfContribuinte: rawCpf,
      valorTotal: numericValor,
      quantidadeParcelas: numericParcelas,
    };

    try {
      const res = await emprestimoService.criarEmprestimo(payload);
      const data = res.data;

      // “sem benefício” vindo do back → warning amarelo
      if (
        data.status === 200 &&
        Array.isArray(data.erros) &&
        data.erros.length === 0 &&
        typeof data.mensagem === "string" &&
        data.mensagem.includes("Benefício não foi concedido")
      ) {
        setWarningMsg("Benefício não foi concedido para este CPF.");
      } else {
        setResultado(data);
      }
    } catch (err) {
      // erro genérico → vermelho
      setErrorMsg("Erro ao solicitar empréstimo. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <main id="main-content" className="container-lg my-5">
        <NavigationRoutes />

        <div className="row justify-content-center">
          <div className="col-sm-10 col-md-8 col-lg-6">
            <div className="br-card">
              <div className="card-header text-center">
                <h2 style={{ color: "var(--interactive)" }}>Criar Empréstimo</h2>
              </div>
              <div className="card-content p-4">

                <form onSubmit={handleSubmit} noValidate>
                  <fieldset className="br-fieldset mb-4">
                    <legend>Dados do Contribuinte</legend>
                    <Input
                      id="cpfContribuinte"
                      label="CPF"
                      type="text"
                      placeholder="000.000.000-00"
                      data-mask="999.999.999-99"
                      inputMode="numeric"
                      value={cpf}
                      onChange={handleCpfChange}
                      className="col-12"
                    />
                  </fieldset>

                  <fieldset className="br-fieldset mb-4">
                    <legend>Detalhes do Empréstimo</legend>
                    <Input
                      id="valorTotal"
                      label="Valor (R$)"
                      type="text"
                      inputMode="decimal"
                      placeholder="0,00"
                      value={valorTotal}
                      onChange={handleValorChange}
                      className="col-12 mb-3"
                    />
                    <Input
                      id="quantidadeParcelas"
                      label="N° Parcelas"
                      type="text"
                      inputMode="numeric"
                      placeholder="Ex: 12"
                      value={quantidadeParcelas}
                      onChange={handleParcelasChange}
                      className="col-12"
                    />
                  </fieldset>

                  <div className="d-flex justify-content-end">
                    <Button
                      variant="secondary"
                      type="button"
                      onClick={resetForm}
                      disabled={loading}
                      className="mr-2"
                    >
                      <i className="fas fa-eraser mr-1" aria-hidden="true" />
                      Limpar
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={loading || !isFormValid}
                    >
                      {loading ? "Enviando…" : "Solicitar Empréstimo"}
                    </Button>
                  </div>
                </form>

                {/* sem benefício → WARNING */}
                {warningMsg && (
                  <div className="br-message warning mt-4">
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
                        onClick={() => setWarningMsg("")}
                      >
                        <i className="fas fa-times" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                )}

                {/* erro genérico → DANGER */}
                {errorMsg && (
                  <div className="br-message danger mt-4">
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
                        onClick={() => setErrorMsg("")}
                      >
                        <i className="fas fa-times" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                )}

                {/* resultados aprovados */}
                {resultado && resultado.status === "APROVADO" && (
                  <>
                    <div className="br-row gutter mt-4">
                      {/* Valor da Parcela */}
                      <div className="br-col-xs-12 md-4 mb-4">
                        <div className="br-info-card">
                          <div className="info-card__icon">
                            <i className="fas fa-dollar-sign" aria-hidden="true" />
                          </div>
                          <div className="info-card__content">
                            <div className="info-card__value">
                              {resultado.valorParcela.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}
                            </div>
                            <div className="info-card__label">Valor da Parcela</div>
                          </div>
                        </div>
                      </div>
                      {/* Total a Pagar */}
                      <div className="br-col-xs-12 md-4 mb-4">
                        <div className="br-info-card">
                          <div className="info-card__icon">
                            <i className="fas fa-receipt" aria-hidden="true" />
                          </div>
                          <div className="info-card__content">
                            <div className="info-card__value">
                              {(resultado.valorParcela * numericParcelas).toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}
                            </div>
                            <div className="info-card__label">Total a Pagar</div>
                          </div>
                        </div>
                      </div>
                      {/* Margem Disponível */}
                      <div className="br-col-xs-12 md-4 mb-4">
                        <div className="br-info-card">
                          <div className="info-card__icon">
                            <i className="fas fa-wallet" aria-hidden="true" />
                          </div>
                          <div className="info-card__content">
                            <div className="info-card__value">
                              {resultado.margemDisponivel.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}
                            </div>
                            <div className="info-card__label">Margem Disponível</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* mensagem de sucesso → SUCCESS */}
                    <div className="br-message success mt-4">
                      <div className="icon">
                        <i className="fas fa-check-circle fa-lg" aria-hidden="true" />
                      </div>
                      <div
                        className="content"
                        role="alert"
                        aria-label="Empréstimo aprovado com sucesso!"
                      >
                        <span className="message-title">Sucesso. </span>
                        <span className="message-body">
                          Empréstimo aprovado !
                        </span>
                      </div>
                      <div className="close">
                        <button
                          className="br-button circle small"
                          type="button"
                          aria-label="Fechar alerta"
                          onClick={resetForm}
                        >
                          <i className="fas fa-times" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* rejeição → WARNING */}
                {resultado && resultado.status === "REJEITADO" && (
                  <div className="br-message warning mt-4">
                    <div className="icon">
                      <i className="fas fa-exclamation-triangle fa-lg" aria-hidden="true" />
                    </div>
                    <div className="content" role="alert" aria-label="Empréstimo rejeitado">
                      <span className="message-title">Empréstimo Recusado.</span>
                      <span className="message-body"> {resultado.justificativaRejeicao}</span>
                    </div>
                    <div className="close">
                      <button
                        className="br-button circle small"
                        type="button"
                        aria-label="Fechar alerta"
                        onClick={resetForm}
                      >
                        <i className="fas fa-times" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
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