import axios from "axios"

let connection = axios.create({
    baseURL: 'https://hacker-news.firebaseio.com/v0/'
})

export const apiFunctions = {
    getItems(id) {
        return connection.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`)
        .then(info=>info.data)
    },
    getNewsId() {
        return axios.get('https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty')
        .then(info=>info.data)
    }
}