import { useState } from "react";
import Button from "../../../components/global/Button";
import Message from "../../../components/global/Message";
import emprestimoService from "../../../service/emprestimo/emprestimoService";

export default function SimulateMargin() {
  const [cpf, setCpf] = useState("");
  const [margem, setMargem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchedOnce, setFetchedOnce] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Formata e limita a entrada do CPF para 11 dígitos
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

  // Extrai apenas os dígitos
  const rawCpf = cpf.replace(/\D/g, "");
  const isCpfValid = rawCpf.length === 11;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isCpfValid) return;

    setLoading(true);
    setErrorMsg("");
    setMargem(null);

    try {
      const res = await emprestimoService.consultarMargem(rawCpf);
      const data = res.data;

      // “Sem benefício” vindo do back
      if (
        data.status === 200 &&
        Array.isArray(data.erros) &&
        data.erros.length === 0 &&
        typeof data.mensagem === "string" &&
        data.mensagem.includes("Benefício não foi concedido")
      ) {
        // não faz nada aqui — margem fica null ⇒ cai no warning abaixo
      } else {
        // simulação normal: exibe valores
        setMargem({
          valorBeneficio: data.valorBeneficio,
          margemTotal: data.margemTotal,
          valorEmUso: data.valorEmUso,
          margemDisponivel: data.margemDisponivel,
        });
      }
    } catch (err) {
      const resp = err.response;
      if (resp?.data?.mensagem) {
        setErrorMsg(resp.data.mensagem);
      } else {
        setErrorMsg("Ocorreu um erro inesperado. Tente novamente mais tarde.");
      }
    } finally {
      setFetchedOnce(true);
      setLoading(false);
    }
  }

  return (
    <>
      <main id="main-content" className="container-lg my-5">

        <div className="row justify-content-center">
          <div className="col-sm-12 col-md-8 col-lg-6">
            <div className="br-card">
              <div className="card-header text-center">
                <h2>
                  Simular Margem Consignável
                </h2>
              </div>
              <div className="card-content p-4">
                <form
                  onSubmit={handleSubmit}
                  className="row mb-3 align-items-end"
                  noValidate
                >
                  <div className="col-9">
                    <div className="br-input mb-0">
                      <label htmlFor="cpfContribuinte">
                        CPF
                      </label>
                      <input
                        id="cpfContribuinte"
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
                  <div className="col-3 d-flex justify-content-end">
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={loading || !isCpfValid}
                      className="block"
                    >
                      {loading ? "Carregando…" : "Buscar"}
                    </Button>
                  </div>
                </form>

                {/* Erro de API / validação geral */}
                {errorMsg && (
                  <Message
                    type="danger"
                    title="Erro. "
                    className="mb-4"
                    onClose={() => setErrorMsg("")}
                    >
                      {errorMsg}
                  </Message>
                )}

                {/* Cards de resultado */}
                {fetchedOnce && margem && !errorMsg && (
                  <div className="br-row gutter mt-4">
                    <div className="br-col-xs-6 md-3 mb-4">
                      <div className="br-info-card">
                        <div className="info-card__content">
                          <strong>Valor do Benefício:</strong>&nbsp;
                          {margem.valorBeneficio.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="br-col-xs-6 md-3 mb-4">
                      <div className="br-info-card">
                        <div className="info-card__content">
                          <strong>Margem Total:</strong>&nbsp;
                          {margem.margemTotal.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="br-col-xs-6 md-3 mb-4">
                      <div className="br-info-card">
                        <div className="info-card__content">
                          <strong>Valor em Uso:</strong>&nbsp;
                          {margem.valorEmUso.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="br-col-xs-6 md-3 mb-4">
                      <div className="br-info-card">
                        <div className="info-card__content">
                          <strong>Margem Disponível:</strong>&nbsp;
                          {margem.margemDisponivel.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}


                {/* “Nenhum benefício encontrado” em amarelo */}
                {fetchedOnce &&
                  !loading &&
                  !errorMsg &&
                  margem === null && (
                    <Message
                    type="warning"
                    title="Atenção. "
                    className="mt-4"
                    onClose={() => setFetchedOnce(false)}
                  >
                    Benefício não foi concedido para este CPF.
                  </Message>
                  )}

              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}