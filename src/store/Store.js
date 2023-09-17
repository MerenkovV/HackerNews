import axios from "axios"
import { makeAutoObservable } from "mobx"

const pageUsers = 50;

class Store {

    state = {
        currentComments: [],
        currentPost: [],
        currentPage: 1,
        newsInfo: [],
        isFetchingMain: false,
        isFetchingPost: false,
        isFetchingComments: false,
        isAdding: false
    }

    constructor() {
        makeAutoObservable(this)
        this.getUpdatedNews(1, true)
        setInterval(() => { this.getUpdatedNews(this.state.currentPage, true) }, 60000)
    }

    getPostById = (id) => {
        this.state.isFetchingPost = true
        axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`)
            .then((info) => {
                this.setPost({
                    by:info.data.by, 
                    descendants:info.data.descendants, 
                    id:info.data.id,
                    kids:info.data.kids,
                    score:info.data.score,
                    time:this.convertTime(info.data.time),
                    title:info.data.title,
                    type:info.data.type,
                    url:info.data.url
                })
                info.data.kids && this.getRootCommentsById(info.data.kids)
            })
    }

    getRootCommentsById = (kids) => {
        let commentsArray = []
        this.state.isFetchingComments = true
        kids.map((id)=>{
            axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`)
            .then((info) => {
                commentsArray.push({id: info.data.id, text: info.data.text, 
                    kids:info.data.kids, isOpened: false})
                if(commentsArray.length === kids.length) this.setComments(commentsArray)
            })
        })
    }

    setComments = (commentsArray) => {
        this.state.currentComments = commentsArray
        this.state.isFetchingComments = false
    }

    setPost = (info) => {
        this.state.currentPost = info
        this.state.isFetchingPost = false
    }

    convertTime = (time) => {
        let date = new Date(time * 1000);
        let convertedTime = date.getDate() + '/' + (date.getMonth()) + '/' + date.getFullYear() 
        + " " + ("0" + date.getHours()).slice(-2) + ':' + ("0" + date.getMinutes()).slice(-2);
        return convertedTime
    }

    getUpdatedNews = (page, isReset) => {
        let arrayWithPosts = []
        if (isReset && page === 1) {
            this.state.isFetchingMain = true
            this.state.currentPage = 1
        }else if(!isReset){
            this.state.currentPage = page
            this.state.isAdding = true
            this.state.newsInfo.map(item => {
                arrayWithPosts.push(item)
            })
        }
        axios.get('https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty')
            .then((info) => {
                let pageElements = info.data.slice(isReset ? 0 : (pageUsers * (page - 1)), pageUsers * page)
                let length = pageElements.length
                if (!isReset) length = pageElements.length + arrayWithPosts.length
                pageElements.map(id => {
                    axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`)
                        .then((info) => {
                            let time = this.convertTime(info.data.time)
                            arrayWithPosts.push({ 
                                title: info.data.title, 
                                id, 
                                by: info.data.by, 
                                time, 
                                score: info.data.score 
                            })
                            arrayWithPosts.length === length - 1 && this.setPostsInfo(arrayWithPosts)
                        })
                        .catch(() => { console.error("Error on getUpdatedNews"); })
                })
            })
    }

    setPostsInfo = (arrayWithPosts) => {
        arrayWithPosts.sort((a, b) => b.id - a.id)
        this.state.newsInfo = arrayWithPosts
        this.state.isFetchingMain = false
        this.state.isAdding = false
    }

}


export default new Store