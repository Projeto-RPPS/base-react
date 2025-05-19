import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/global/Input";
import AlertaErro from "../components/contribuinteComponent/messageComponent/AlertaErro";
import authService from "../service/login/authService";

const LoginPage = () => {
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(null);
  const navigate = useNavigate();

  const formatCPF = (value) => {
    const numericValue = value.replace(/\D/g, "");
    let formattedValue = numericValue;
    if (numericValue.length > 3) {
      formattedValue = `${numericValue.substring(0, 3)}.${numericValue.substring(3)}`;
    }
    if (numericValue.length > 6) {
      formattedValue = `${formattedValue.substring(0, 7)}.${formattedValue.substring(7)}`;
    }
    if (numericValue.length > 9) {
      formattedValue = `${formattedValue.substring(0, 11)}-${formattedValue.substring(11, 13)}`;
    }
    return formattedValue;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!cpf || !senha) {
      setErro("CPF e senha são obrigatórios");
      return;
    }
    try {
      await authService.login({
        cpf: cpf.replace(/\D/g, ""),
        password: senha,
      });
      const me = await authService.me();
      console.log("Usuário logado:", me); // { cpf, role }
      navigate("/home");
    } catch (err) {
      setErro(err.response?.data?.message || "Falha na autenticação");
    }
  };

  const handleCadastroClick = () => {
    navigate("/contribuintes/cadastrar");
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center mt-5">
        <div className="col-sm-10 col-md-8 col-lg-6">
          <div className="br-card">
            <div className="card-header text-center">
              <h1 className="mb-4">Acesse sua conta</h1>
            </div>
            <div className="card-content p-4">
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <Input
                    id="cpf"
                    label="CPF"
                    value={cpf}
                    onChange={(e) => setCpf(formatCPF(e.target.value))}
                    placeholder="000.000.000-00"
                    required
                    maxLength={14}
                  />
                </div>
                
                <div className="mb-3">
                  <Input
                    id="senha"
                    type="password"
                    label="Senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Digite sua senha"
                    required
                  />
                </div>

                {erro && (
                  <AlertaErro
                    nomeClasse={"ao fazer login"}
                    erro={erro}
                    onClose={() => setErro(null)}
                  />
                )}

                <div className="d-flex justify-content-between align-items-center mt-4">
                  <div>
                    <span className="mr-2">Não tem uma conta?</span>
                    <button 
                      type="button" 
                      className="br-button secondary small" 
                      onClick={handleCadastroClick}
                    >
                      Cadastre-se
                    </button>
                  </div>
                  
                  <button
                    type="submit"
                    className="br-button primary small"
                    disabled={!cpf || !senha}
                  >
                    Fazer Login
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-small">
              Ao continuar, você concorda com nossos <a href="#">Termos de Uso</a> e a nossa <a href="#">Política de Privacidade</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;