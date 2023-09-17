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
                this.getRootCommentsById(info.data.kids)
            })
    }

    changeKidElements2 = async(RootIdArray, isRoot, commentsCopy = this.state.currentComments) => {
        //for(let currentId = 0; currentId !== RootIdArray[RootIdArray.length - 1]; currentId++){
            commentsCopy = commentsCopy.map(kid=>{
                if(RootIdArray.includes(kid.id)){
                    if(kid.id !== RootIdArray[RootIdArray.length - 1]){
                        this.changeKidElements(RootIdArray, false, kid.kidElements)
                        .then(array=>array)
                    }else{
                        this.getKidsCommentsById(RootIdArray[RootIdArray.length - 1], kid)
                            .then(array=>array)
                    }
                }else{
                    return kid
                }
                    return commentsCopy
            })}

    changeKidElements = (RootIdArray, isRoot, commentsCopy = this.state.currentComments) => {
        //for(let currentId = 0; currentId !== RootIdArray[RootIdArray.length - 1]; currentId++){
            commentsCopy = commentsCopy.map(kid=>{
                if(RootIdArray.includes(kid.id)){
                    if(kid.id !== RootIdArray[RootIdArray.length - 1]){
                        this.changeKidElements2(RootIdArray, false, kid.kidElements)
                        .then(array=>array)
                    }else{
                        this.getKidsCommentsById(RootIdArray[RootIdArray.length - 1], kid)
                            .then(array=>array)
                    }
                }else{
                    return kid
                }
                if(isRoot){
                    this.state.currentComments = commentsCopy
                }else{
                    return commentsCopy
                }
            })


            // commentsCopy.map(element => {
            //     element.id === RootIdArray[currentId] ? 
            // }) = this.state.currentComments.find(element => element.id === RootIdArray[currentId])
        //}
    }

    getKidsCommentsById = async(RootId, rootElement) => {
        let commentsArray = []
            if(rootElement.kids === undefined) return rootElement
            rootElement.kids.map(id=>{
            axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`)
            .then((info) => {
                commentsArray.push({...info.data})
                if(rootElement.kids.length === commentsArray.length) {
                    rootElement.kidElements = commentsArray
                    rootElement.isOpened = true
                    return rootElement
                }
            })
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