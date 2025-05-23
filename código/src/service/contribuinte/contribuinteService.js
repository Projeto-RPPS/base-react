import axios from "axios";

const API_URL = 'http://192.168.38.13:8084/contribuintes';

const listarContribuintes = () => {
    return axios.get(API_URL);
}
const cadastrarContribuintes = (form) => {
    return axios.post(API_URL, form)
}

const pesquisarContribuinte = (cpf) => {
    return axios.get(`${API_URL + "/porCpf/" + cpf}`)
}

const desativarContribuinte = (cpf) => {
    return axios.delete(API_URL + "/porCpf/" + cpf);
}

export default {
    listarContribuintes,
    cadastrarContribuintes,
    pesquisarContribuinte,
    desativarContribuinte
}