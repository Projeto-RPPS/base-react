// src/service/beneficio/beneficioService.js
import axios from "axios";

// URL base da API de Benefícios
const API_URL = "http://localhost:8087/beneficios";

// Função para listar todos os benefícios ativos
export const listarBeneficios = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Erro ao listar benefícios.";
  }
};

// Função para criar um novo benefício
export const criarBeneficio = async (beneficioData) => {
  try {
    const response = await axios.post(API_URL, beneficioData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Erro ao criar benefício.";
  }
};

// Função para atualizar um benefício
export const atualizarBeneficio = async (id, beneficioData) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}`, beneficioData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Erro ao atualizar benefício.";
  }
};

// Função para desativar um benefício
export const desativarBeneficio = async (id) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}/desativar`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Erro ao desativar benefício.";
  }
};