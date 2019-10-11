import axios from 'axios';
import { SERVER_ENDPOINT } from './constants';

const axiosInstance = axios.create({
  baseURL: SERVER_ENDPOINT,
});

export default axiosInstance
