import axios from "axios"
import mainPageStore from "../store/mainPageStore"

let connection = axios.create({
    baseURL: 'https://hacker-news.firebaseio.com/v0/'
})

export const apiFunctions = {
    updatePosts: connection.get('newstories.json?print=pretty')
        .then(newPosts => {
            console.log("newPosts.data.slice(0, 100)");       
        })
}