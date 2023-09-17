import React from 'react'
import Store from '../../store/Store'
import { observer } from 'mobx-react-lite'
import CommentElement from './CommentElement'

const PostPage = observer(() => {
  const queryParameters = new URLSearchParams(window.location.search)
  const id = queryParameters.get('id')
  let parents = []
  Store.state.currentPost.length === 0 && Store.getPostById(id)
  let Comments = Store.state.currentComments.map(comment=><div onClick={()=>{
    Store.changeKidElements([comment.id], true)}} style={{margin: "5px 0"}} 
  key={comment.id}>{comment.text} {comment.isOpened && CommentElement({
    comment:comment,
    parents:[comment.id]})}</div>)
  return (
    <div>
      {Store.state.isFetchingPost ? "Loading..." : Store.state.currentPost.title}
      <p>Comments:</p>
      <div>
        {Store.state.isFetchingComments ? <li>Loading...</li> : Comments}
      </div>
    </div>
  )
})

export default PostPage