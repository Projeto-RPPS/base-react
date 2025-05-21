// src/service/beneficio/beneficioService.js
import axios from "axios";

const API_URL = "http://192.168.38.13:8087/beneficios"
const listarBeneficios = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const criarBeneficio = async (beneficioData) => {
  const response = await axios.post(API_URL, beneficioData);
  return response.data;
};

const atualizarBeneficio = async (id, beneficioData) => {
  const response = await axios.patch(`${API_URL}/${id}`, beneficioData);
  return response.data;
};

const desativarBeneficio = async (id) => {
  const response = await axios.patch(`${API_URL}/${id}/desativar`);
  return response.data;
};

export default {
  listarBeneficios,
  criarBeneficio,
  atualizarBeneficio,
  desativarBeneficio,
};