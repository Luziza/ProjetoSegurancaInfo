import axios from 'axios'

const api = axios.create({
  baseURL: 'http://34.39.242.145:3606', // troca pelo IP da API quando for para produção
  headers: {
    'Content-Type': 'application/json'
  }
})

export default api