import axios from "axios";

const API_URL = 'http://192.168.38.13:8084/contribuintes';

const listarContribuintes = () => {
    return axios.get(API_URL);
}

export default {
    listarContribuintes
}