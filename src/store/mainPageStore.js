import axios from "axios"
import { makeAutoObservable } from "mobx"

const pageUsers = 50;

class mainPageStore {

    state = {
        newsInfo: [],
        isFetching: false,
        isAdding: false
    }

    constructor() {
        makeAutoObservable(this)
        this.getUpdatedNews(1, true)
        setInterval(() => { this.getUpdatedNews(1, true) }, 60000)
    }

    getUpdatedNews = (page, reset) => {
        let obj = []
        if (reset) this.state.isFetching = true
        else {
            this.state.isAdding = true
            this.state.newsInfo.map(item=>{
                obj.push(item)
            })
        }

        
        axios.get('https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty')
            .then((info) => {
                let pageElements = info.data.slice(pageUsers * (page - 1), pageUsers * page)
                console.log(pageElements);
                let length = pageElements.length
                if(!reset) length = pageElements.length + obj.length
                pageElements.map(id => {
                    axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`)
                        .then((info) => {
                            obj.push({ title: info.data.title, id, by: info.data.by, time: info.data.time, score: info.data.score })
                            obj.length === length - 1 && this.setPostInfo(obj)
                        })
                })
            })
    }

    setPostInfo = (obj) => {
        obj.sort((a, b)=>{
            return b.id - a.id
        })
        this.state.newsInfo = obj
        console.log(this.state)
        this.state.isFetching = false
        this.state.isAdding = false
    }

}


export default new mainPageStore