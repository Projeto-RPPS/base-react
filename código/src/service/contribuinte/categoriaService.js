import axios from "axios";

const API_URL = 'http://192.168.38.13:8084/categorias';

const listarCategorias = () => {
    return axios.get(API_URL);
}

const cadastrarCategoria = (json) => {
    return axios.post(API_URL, json);
}

const buscarCategoriaPorId = (id) => {
    console.log(`${API_URL+"/"+id}`);
    return axios.get(`${API_URL+"/"+id}`, id);
}

const editarCategoria = (form) => {
    console.log(form);
    return axios.put(API_URL, form);
}

export default {
    listarCategorias,
    cadastrarCategoria,
    buscarCategoriaPorId,
    editarCategoria
}