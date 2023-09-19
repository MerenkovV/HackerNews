import Store from './Store'
import { apiFunctions } from '../DAL/apiFunctions'

export const changeKidElements = async (RootIdArray, isRoot, commentsCopy = Store.state.currentComments) => {
    commentsCopy = commentsCopy.map(kid => {
        if (RootIdArray.includes(kid.id)) {
            if (kid.id !== RootIdArray[RootIdArray.length - 1]) {
                changeKidElements(RootIdArray, false, kid.kidElements)
                    .then(array => array)
                    .catch(() => { console.error("Error on changeKidElements"); })
            } else {
                getKidsCommentsById(kid)
                    .then(array => array)
                    .catch(() => { console.error("Error on getKidsCommentsById"); })
            }
        } else {
            return kid
        }
        if (isRoot) {
            Store.setComments(commentsCopy.sort((a, b) => a.id - b.id))
        } else {
            return commentsCopy.sort((a, b) => a.id - b.id)
        }
    })
}

const getKidsCommentsById = async (rootElement) => {
    let commentsArray = []
    if (rootElement.kids === undefined) return rootElement
    rootElement.kids.map(id => {
        apiFunctions.getItems(id)
            .then((info) => {
                commentsArray.push({ ...info })
                if (rootElement.kids.length === commentsArray.length) {
                    rootElement.kidElements = commentsArray.sort((a, b) => a.id - b.id)
                    rootElement.isOpened = true
                    return rootElement
                }
            })
            .catch(() => { console.error("Error on getKidsCommentsById - getItems"); })
    })
}

export const getPostById = (id, getDescendants = false) => {
    !getDescendants && Store.setFetchingPost()
    apiFunctions.getItems(id)
        .then((info) => {
            Store.setPost({
                by: info.by,
                descendants: info.descendants,
                id: info.id,
                kids: info.kids,
                score: info.score,
                time: convertTime(info.time),
                title: info.title,
                type: info.type,
                url: info.url
            })
            info.kids && getRootComments(info.kids)
        })
        .catch(() => { console.error("Error on getPostById - getItems"); })
}

export const getRootComments = (kids) => {
    let commentsArray = []
    Store.setFetchingComments()
    kids.map((id) => {
        apiFunctions.getItems(id)
            .then((info) => {
                commentsArray.push({
                    id: info.id, text: info.text,
                    kids: info.kids, isOpened: false
                })
                if (commentsArray.length === kids.length) Store.setComments(commentsArray.sort((a, b) => a.id - b.id))
            })
            .catch(() => { console.error("Error on getRootComments - getItems"); })
    })
}

export const getUpdatedNews = (page, mode) => {
    const pageUsers = 100;
    let arrayWithPosts = []
    if (mode === "reset" && page === 1) {
        Store.setFetchingMain(true)
        Store.setPage(1)
    } else if (mode === "add") {
        Store.setAdding(true)
        Store.setPage(page)
        Store.state.newsInfo.map(item => {
            arrayWithPosts.push(item)
        })
    } else if (mode === "check") {
        Store.setAdding(true)
    }
    apiFunctions.getNewsId()
        .then((info) => {
            if (mode === "check") {
                if (info[0] === Store.state.newsInfo[0].id) {
                    Store.setAdding(false)
                    return false
                }
            }
            let pageElements = info.slice(mode === "check" ? 0 : (pageUsers * (page - 1)), pageUsers * page)
            let length = pageElements.length
            if (mode !== "reset") length = pageElements.length + arrayWithPosts.length
            pageElements.map(id => {
                apiFunctions.getItems(id)
                    .then((info) => {
                        let time = convertTime(info.time)
                        arrayWithPosts.push({
                            title: info.title,
                            id,
                            by: info.by,
                            time,
                            score: info.score
                        })
                        arrayWithPosts.length === length - 1 && Store.setPostsInfo(arrayWithPosts)
                    })
                    .catch(() => { console.error("Error on getUpdatedNews - getItems"); })
            })
        })
        .catch(() => { console.error("Error on getUpdatedNews - getNewsId"); })
}

const convertTime = (time) => {
    let date = new Date(time * 1000);
    let convertedTime = date.getDate() + '/' + (date.getMonth()) + '/' + date.getFullYear()
        + " " + ("0" + date.getHours()).slice(-2) + ':' + ("0" + date.getMinutes()).slice(-2);
    return convertedTime
}