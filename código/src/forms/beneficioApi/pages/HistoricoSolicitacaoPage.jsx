import { useEffect, useState } from "react";
import { listarSolicitacoes, listarSolicitacoesAtivas } from "../../../service/beneficio/solicitacaoService";
import ListaSolicitacoes from "../../../components/beneficioComponent/ListaSolicitacoes";
import solicitacaoService from "../../../service/beneficio/solicitacaoService";

export default function HistoricoSolicitacoesPage() {
  const [solicitacoes, setSolicitacoes] = useState([]);

  useEffect(() => {
    const carregar = async () => {
      const dados = await listarSolicitacoesAtivas();
      setSolicitacoes(dados);
    };
    carregar();
  }, []);


  const handleDesativar = async (id) => {
  try {
    await solicitacaoService.desativarSolicitacao(id);
    setSolicitacoes((prev) => prev.filter((s) => s.idSolicitacao !== id)); // remove da lista
  } catch (error) {
    console.error("Erro ao desativar solicitação:", error);
  }
};


  return (
    <div className="container mt-4">
      <h1>Solicitações Ativas</h1>
      <ListaSolicitacoes solicitacoes={solicitacoes} onDesativar={handleDesativar} />
    </div>
  );
}
