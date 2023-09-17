import React from 'react'
import Store from '../../store/Store'

export default function CommentElement({comment, parents}) {
    let comments = []
    if(comment.isOpened) comments = comment.kidElements.map(kidComment=><div style={{margin:"20px 20px"}} onClick={(e)=>{e.stopPropagation(); Store.changeKidElements([...parents,kidComment.id], true)}}> {kidComment.text} {kidComment.isOpened && CommentElement({
        comment:kidComment,
        parents:[comment.id]})}</div>)
  return (
    <div>
        {comments}
    </div>
  )
}
