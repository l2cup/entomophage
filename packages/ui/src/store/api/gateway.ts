import axios from 'axios';

const gatewayApi = axios.create({
  baseURL: 'http://localhost:5070',
});

if (gatewayApi.defaults.headers['x-jwt-token'] == null) {
  if (localStorage.getItem('jwt') != null) {
    gatewayApi.defaults.headers['x-jwt-token'] = localStorage.getItem('jwt');
  }
}

export default gatewayApi;
