import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://3.236.141.104:5000',
  timeout: 1000000000000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export default axiosInstance;