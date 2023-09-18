import { makeAutoObservable } from "mobx"
import { getUpdatedNews } from "./StoreReducer";

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
        setInterval(() => { getUpdatedNews(this.state.currentPage, "check") }, 60000)
    }

    setFetchingPost = () => {
        this.state.isFetchingPost = true
    }

    setFetchingComments = () => {
        this.state.isFetchingComments = true
    }

    setComments = (commentsArray) => {
        this.state.currentComments = commentsArray
        this.state.isFetchingComments = false
    }

    setPost = (info) => {
        this.state.currentPost = info
        this.state.isFetchingPost = false
    }

    setFetchingMain = (flag) => {
        this.state.isFetchingMain = flag
    }

    setPage = (page) => {
        this.state.currentPage = page
    }

    setAdding = (flag) => {
        this.state.isAdding = flag
    }

    setPostsInfo = (arrayWithPosts) => {
        arrayWithPosts.sort((a, b) => b.id - a.id)
        this.state.newsInfo = arrayWithPosts
        this.state.isFetchingMain = false
        this.state.isAdding = false
    }

}


export default new Store