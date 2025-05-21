// src/service/beneficio/solicitacaoService.js
import axios from "axios";

// URL base da API de solicitação de benefícios
const API_URL = 'http://192.168.38.13:8087/beneficios/solicitacao';

// Função para criar uma nova solicitação de benefício
export const criarSolicitacao = (dados) => {
  return axios.post(API_URL, dados)
    .then(response => response.data)
    .catch(error => {
      throw error.response ? error.response.data : "Erro ao conectar com o servidor.";
    });
};

// Função para listar todas as solicitações
export const listarSolicitacoes = () => {
  return axios.get(API_URL)
    .then(response => response.data)
    .catch(error => {
      throw error.response ? error.response.data : "Erro ao conectar com o servidor.";
    });
};

// Função para listar solicitações por CPF
export const listarSolicitacoesPorCpf = (cpf) => {
  return axios.get(`${API_URL}/cpf/${cpf}/total`)
    .then(response => response.data)
    .catch(error => {
      throw error.response ? error.response.data : "Erro ao conectar com o servidor.";
    });
};

// Função para desativar uma solicitação
export const desativarSolicitacao = (id) => {
  return axios.patch(`${API_URL}/desativar/${id}`)
    .then(response => response.data)
    .catch(error => {
      throw error.response ? error.response.data : "Erro ao conectar com o servidor.";
    });
};

export const listarSolicitacoesAtivas = () => {
  return axios.get(`${API_URL}/ativas`)
    .then(response => response.data)
    .catch(error => {
      throw error.response ? error.response.data : "Erro ao conectar com o servidor.";
    });
};



export default {

  listarSolicitacoesAtivas,
  criarSolicitacao,
  listarSolicitacoes,
  listarSolicitacoesPorCpf,
  desativarSolicitacao
};