import axios from 'axios'

export default axios.create({
    baseURL: process.env.NODE_ENV === "production" ? process.env.BACKEND_URL : 'http://localhost:3000/',
})