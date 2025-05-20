import { useState, useMemo, useEffect } from "react";
import Input from "../../../components/global/Input";
import Button from "../../../components/global/Button";
import Message from "../../../components/global/Message";
import emprestimoService from "../../../service/emprestimo/emprestimoService";
import { useNavigate } from "react-router-dom";
import authService from "../../../service/login/authService";

export default function SimulateLoan() {
  const [cpf, setCpf] = useState("");
  const [valorTotal, setValorTotal] = useState("");
  const [quantidadeParcelas, setQuantidadeParcelas] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");     // erros vermelhos
  const [warningMsg, setWarningMsg] = useState(""); // “sem benefício”
  const [resultado, setResultado] = useState(null);
  const navigate = useNavigate();

  // máscara e validações de front
  const rawCpf = useMemo(() => cpf.replace(/\D/g, ""), [cpf]);
  const numericValor = useMemo(
    () => parseFloat(valorTotal.replace(",", ".")),
    [valorTotal]
  );
  const numericParcelas = useMemo(
    () => parseInt(quantidadeParcelas, 10),
    [quantidadeParcelas]
  );

  const isCpfValid = rawCpf.length === 11;
  const isValorValid = !isNaN(numericValor) && numericValor > 0;
  const isParcelasValid = !isNaN(numericParcelas) && numericParcelas > 0;
  const isFormValid = isCpfValid && isValorValid && isParcelasValid;

  useEffect(() => {
      authService
        .me()
        .then(({ cpf: raw }) => {
          const formatted = raw.replace(
            /(\d{3})(\d{3})(\d{3})(\d{2})/,
            "$1.$2.$3-$4"
          );
          setCpf(formatted);
        })
        .catch(() => {
          // não está logado
          navigate("/home");
        });
    }, [navigate]);

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

    try {
      const res = await emprestimoService.simularEmprestimo({
        cpfContribuinte: rawCpf,
        valorTotal: numericValor,
        quantidadeParcelas: numericParcelas,
      });
      const data = res.data;

      // “sem benefício” vindo do back → warning
      if (
        data.status === 200 &&
        Array.isArray(data.erros) &&
        data.erros.length === 0 &&
        typeof data.mensagem === "string" &&
        data.mensagem.includes("Benefício não foi concedido")
      ) {
        setWarningMsg("Benefício não foi concedido para este CPF.");
      } else {
        // normaliza margens
        const margemDisponivel = data.margemDisponivel ?? data.margenDisponivel;
        setResultado({
          poderiaSerAprovado: data.poderiaSerAprovado,
          margemDisponivel,
          margemNecessaria: data.margemNecessaria,
        });
      }
    } catch (err) {
      const status = err.response?.status;
      if (status === 404) {
        setErrorMsg("Não encontramos simulação para esses dados.");
      } else if (status === 422) {
        setErrorMsg("Dados inválidos. Verifique os campos.");
      } else {
        setErrorMsg("Erro ao simular empréstimo. Tente novamente mais tarde.");
      }
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
                <h2>Simular Empréstimo</h2>
              </div>
              <div className="card-content p-4">
                <form onSubmit={handleSubmit} noValidate>
                  <fieldset className="br-fieldset mb-4">
                    <legend>Dados da Simulação</legend>
                    <div className="col-7 mb-3">
                        <div className="br-input">
                          <label htmlFor="cpf-disabled">CPF</label>
                          <input
                            id="cpf-disabled"
                            type="text"
                            value={cpf}        
                            disabled                      
                            className="form-control"
                          />
                        </div>
                      </div>
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
                      disabled={!isFormValid || loading}
                    >
                      {loading ? "Simulando…" : "Simular Empréstimo"}
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

                {/* cards de resultado */}
                {resultado && (
                  <>
                    <div className="br-row gutter mt-4">
                      <div className="br-col-xs-12 md-6 mb-4">
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
                      <div className="br-col-xs-12 md-6 mb-4">
                        <div className="br-info-card">
                          <div className="info-card__content">
                            <strong>Margem Necessária:</strong>&nbsp;
                            {resultado.margemNecessaria.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    {resultado.poderiaSerAprovado ? (
                      <Message
                        type="success"
                        title="Simulação Aprovada. "
                        className="mt-4"
                        onClose={resetForm}
                      >
                        Você tem margem suficiente para este empréstimo.
                      </Message>
                    ) : (
                      <Message
                        type="warning"
                        title="Simulação Reprovada. "
                        className="mt-4"
                        onClose={resetForm}
                      >
                        Margem necessária excede a disponível.
                      </Message>
                    )}
                  </>
                )}

              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}