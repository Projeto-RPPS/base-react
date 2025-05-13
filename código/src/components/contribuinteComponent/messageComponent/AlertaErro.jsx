import React, { useEffect, useState } from 'react';

const AlertaErro = ({ nomeClasse, erro, onClose }) => {
  const [titulo, setTitulo] = useState('');
  const [mensagem, setMensagem] = useState('');
  console.log(erro)
  useEffect(() => {
    if (!erro) return;
    let tituloTemp = `Erro ${nomeClasse}`;
    let mensagemTemp = 'Algo inesperado aconteceu.';
    if (erro.response) {
      const { status, data } = erro.response;
      if (status === 400 && typeof data === 'string') {
        if (data.includes('Erro insert Contribuinte')) {
          mensagemTemp = '. Já existe um contribuinte cadastrado com este CPF.';
        } else if (data.includes('Erro ao inserir email')) {
            mensagemTemp = '. Esse email já está cadastrado no nosso sistema.';
        } else if (data.includes('Já existe uma contribuição')) {
            mensagemTemp = '. Esse contribuinte já tem contribuição registrada para este mês.';
        } else if (data.includes('Contribuinte não encontrado')) {
            mensagemTemp = '. Não há contribuinte com esse CPF.';  
        } else {
          mensagemTemp = data;
        }
      } else if (status >= 500) {
        mensagemTemp = 'Erro interno do servidor. Tente novamente mais tarde.';
      }
    } else if (erro.message === 'Network Error') {
      mensagemTemp = 'Não foi possível conectar ao servidor.';
    }

    setTitulo(tituloTemp);
    setMensagem(mensagemTemp);
  }, [nomeClasse, erro]);

  if (!erro) return null;

  return (
    <div className="br-message danger">
      <div className="icon">
        <i className="fas fa-times-circle fa-lg" aria-hidden="true"></i>
      </div>
      <div
        className="content"
        aria-label={mensagem}
        role="alert"
      >
        <span className="message-title">{titulo}</span>
        <span className="message-body"> {mensagem}</span>
      </div>
      <div className="close">
        <button
          className="br-button circle small"
          type="button"
          aria-label="Fechar a mensagem de alerta"
          onClick={onClose}
        >
          <i className="fas fa-times" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  );
};

export default AlertaErro;