import { useState, useMemo } from "react";
import Input from "../../../components/global/Input";
import Button from "../../../components/global/Button";
import Message from "../../../components/global/Message";
import emprestimoService from "../../../service/emprestimo/emprestimoService";

export default function CreateLoan() {
  const [cpf, setCpf] = useState("");
  const [valorTotal, setValorTotal] = useState("");
  const [quantidadeParcelas, setQuantidadeParcelas] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [warningMsg, setWarningMsg] = useState("");
  const [resultado, setResultado] = useState(null);

  const rawCpf = useMemo(() => cpf.replace(/\D/g, ""), [cpf]);
  const numericValor = parseFloat(valorTotal.replace(",", "."));
  const numericParcelas = parseInt(quantidadeParcelas, 10);

  const isCpfValid = rawCpf.length === 11;
  const isValorValid = !isNaN(numericValor) && numericValor > 0;
  const isParcelasValid = !isNaN(numericParcelas) && numericParcelas > 0;
  const isFormValid = isCpfValid && isValorValid && isParcelasValid;

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
    } catch {
      setErrorMsg("Erro ao solicitar empréstimo. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <main id="main-content" className="container-lg my-5">
        <div className="row justify-content-center">
          <div className="col-sm-10 col-md-8 col-lg-6">
            <div className="br-card">
              <div className="card-header text-center">
                <h2>Criar Empréstimo</h2>
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
                  <Message
                    type="warning"
                    title="Atenção. "
                    className="mt-4"
                    onClose={() => setWarningMsg("")}
                  >
                    {warningMsg}
                  </Message>
                )}

                {/* erro genérico → DANGER */}
                {errorMsg && (
                  <Message
                    type="danger"
                    title="Erro. "
                    className="mt-4"
                    onClose={() => setErrorMsg("")}
                  >
                    {errorMsg}
                  </Message>
                )}

                {/* resultados aprovados */}
                {resultado && resultado.status === "APROVADO" && (
                  <>
                    <div className="br-row gutter mt-4">
                      {/* Valor da Parcela */}
                      <div className="br-col-xs-12 md-4 mb-4">
                        <div className="br-info-card">
                          <div className="info-card__content">
                            <strong>Valor da Parcela:</strong>&nbsp;
                            {resultado.valorParcela.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </div>
                        </div>
                      </div>
                      {/* Total a Pagar */}
                      <div className="br-col-xs-12 md-4 mb-4">
                        <div className="br-info-card">
                          <div className="info-card__content">
                            <strong>Total a Pagar:</strong>&nbsp;
                            {(resultado.valorParcela * numericParcelas).toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </div>
                        </div>
                      </div>
                      {/* Margem Disponível */}
                      <div className="br-col-xs-12 md-4 mb-4">
                        <div className="br-info-card">
                          <div className="info-card__content">
                            <strong>Margem Disponível:</strong>&nbsp;
                            {resultado.margemDisponivel.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* mensagem de sucesso → SUCCESS */}
                    <Message
                      type="success"
                      title="Sucesso. "
                      className="mt-4"
                      onClose={resetForm}
                    >
                      Empréstimo aprovado!
                    </Message>
                  </>
                )}

                {/* rejeição → WARNING */}
                {resultado && resultado.status === "REJEITADO" && (
                  <Message
                    type="warning"
                    title="Empréstimo Recusado. "
                    className="mt-4"
                    onClose={resetForm}
                  >
                    {resultado.justificativaRejeicao}
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