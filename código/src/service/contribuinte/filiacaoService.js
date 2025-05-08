import axios from "axios";

const API_URL = 'http://192.168.38.13:8084/filiacoes/arvore/porCpf/';

const gerarArvore = (cpf) => {
    return axios.get(API_URL + cpf);
}

export default {
    gerarArvore
}