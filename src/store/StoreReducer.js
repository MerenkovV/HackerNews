import axios from 'axios'
import Store from './Store'

export const changeKidElements = async(RootIdArray, isRoot, commentsCopy = Store.state.currentComments) => {
        commentsCopy = commentsCopy.map(kid=>{
            if(RootIdArray.includes(kid.id)){
                if(kid.id !== RootIdArray[RootIdArray.length - 1]){
                    changeKidElements(RootIdArray, false, kid.kidElements)
                    .then(array=>array)
                }else{
                    getKidsCommentsById(RootIdArray[RootIdArray.length - 1], kid)
                        .then(array=>array)
                }
            }else{
                return kid
            }
            if(isRoot){
                Store.setComments(commentsCopy)
            }else{
                return commentsCopy
            }
        })
}

const getKidsCommentsById = async(RootId, rootElement) => {
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