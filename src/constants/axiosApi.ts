import axios from 'axios';

export const API_URL = '/api';

const axiosApi = axios.create({
  baseURL: API_URL,
});

export default axiosApi;