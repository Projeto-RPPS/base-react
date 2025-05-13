import axios from "axios";

const API_URL = 'http://192.168.38.13:8084/contribuicoes';

const fazerContribuicao = (dadosContribuicao) => {
    return axios.post(API_URL+"/porCpf", dadosContribuicao)
}

const listarContribuicao = (cpf) => {
    return axios.get(API_URL+"/cpf/"+cpf);
}

export default {
    fazerContribuicao,
    listarContribuicao
}