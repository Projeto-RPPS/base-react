import axios from "axios";

const API_URL = 'http://192.168.38.13:8087/beneficios';

// get para listar benefcios ativos
export const listarBeneficios = () => axios.get(API_URL);


export const criarBeneficio = (dados) => {
  return axios.post(API_URL, dados);
}


