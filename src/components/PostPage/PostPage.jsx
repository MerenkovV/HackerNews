import React from 'react'
import Store from '../../store/Store'
import { observer } from 'mobx-react-lite'
import CommentElement from './CommentElement'
import { changeKidElements, getPostById, getRootCommentsById } from '../../store/StoreReducer'
import { Link } from 'react-router-dom/cjs/react-router-dom'

const PostPage = observer(() => {
  const queryParameters = new URLSearchParams(window.location.search)
  const id = queryParameters.get('id')
  Store.state.currentPost.length === 0 && getPostById(id)
  let Comments = Store.state.currentComments.map(comment=><div onClick={()=>{
    changeKidElements([comment.id], true)}} style={comment.kids && comment.kids.length > 0 ? {margin: "20px 0", backgroundColor: 'gray'} : {margin: "20px 0"}} 
  key={comment.id}>{comment.text} {comment.isOpened && CommentElement({
    comment:comment,
    parents:[comment.id]})}</div>)
  return (
    <div>
      <Link to={'/'}><button>Back</button></Link>
      <br />
      {Store.state.isFetchingPost ? "Loading..." : Store.state.currentPost.title}
      <p>Comments:</p>
      <button disabled={Store.state.isFetchingComments} onClick={()=>{getRootCommentsById(Store.state.currentPost.kids)}}>Reset</button>
      <div>
        {Store.state.isFetchingComments ? <li>Loading...</li> : Comments}
      </div>
    </div>
  )
})

export default PostPage