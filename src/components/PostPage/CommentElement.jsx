import React from 'react'
import { changeKidElements } from '../../store/StoreReducer';

export default function CommentElement({comment, parents}) {
    let comments = []
    if(comment.isOpened) comments = comment.kidElements.map(kidComment=><div style={kidComment.kids && kidComment.kids.length > 0 ? {margin: "20px 20px", backgroundColor: 'gray'} : {margin: "20px 20px", backgroundColor: 'white'}} onClick={(e)=>{e.stopPropagation(); changeKidElements([...parents,kidComment.id], true)}}> {kidComment.text} {kidComment.isOpened && CommentElement({
        comment:kidComment,
        parents:[...parents,kidComment.id]})}</div>)
  return (
    <div>
        {comments}
    </div>
  )
}
