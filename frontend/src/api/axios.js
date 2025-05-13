import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // kendi backend adresini yaz
  withCredentials: true, // CSRF ve cookie için önemli
})

export default API
