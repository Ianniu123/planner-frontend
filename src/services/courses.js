import axios from 'axios'
const baseUrl = "/api/courses"

const getAll = () => {
    return axios.get(baseUrl)
}

const get = (term) => {
    return axios.get(`${baseUrl}/${term}`)
}

export default {getAll, get}