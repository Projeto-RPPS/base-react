import axios from "axios";

const API_URL = 'http://192.168.38.13:8085/emprestimos';

const listarEmprestimos = () => {
    const cpf = '51798139988';  
    const url = `${API_URL}/${cpf}`;
    return axios.get(url);
}

export default {
    listarEmprestimos
}