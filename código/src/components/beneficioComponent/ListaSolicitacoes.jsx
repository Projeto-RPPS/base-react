import React from 'react';

const ListaSolicitacoes = ({ solicitacoes }) => {
  if (!solicitacoes || solicitacoes.length === 0) {
    return (
      <div className="br-message warning mt-4">
        <div className="icon">
          <i className="fas fa-exclamation-circle" aria-hidden="true"></i>
        </div>
        <div className="content">
          <span className="message-title">Nenhuma solicitação encontrada</span>
          <span className="message-body">Não há solicitações de benefícios registradas.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="br-card mt-4">
      <div className="card-header">
        <h2 className="text-center">Solicitações de Benefícios</h2>
      </div>
      <div className="card-content p-4">
        <ul className="br-list">
          {solicitacoes.map((s) => (
            <li key={s.idSolicitacao} className="br-list-item d-flex justify-content-between align-items-center mb-4">
              <div>
                <strong>CPF:</strong> {s.cpf} <br />
                <strong>Tipo:</strong> {s.tipoBeneficio} <br />
                <strong>Status:</strong> {s.status} <br />
                {/* <strong>Mensagem:</strong> {s.mensagem} <br /> */}
                <strong>Tempo de Contribuição:</strong> {s.tempoContribuicaoCalculado} meses <br />
                <strong>Valor Médio das Contribuições:</strong> R$ {s.valorMedioContribuicoes} <br />
                <strong>Valor Concedido:</strong> R$ {s.valorConcedido} <br />
                <strong>Total de Benefícios:</strong> R$ {s.totalBeneficios} <br />
                {/* <strong>Ativo:</strong> {s.ativo ? "Sim" : "Não"} */}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ListaSolicitacoes;

