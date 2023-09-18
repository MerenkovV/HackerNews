import React from 'react'
import { changeKidElements } from '../../store/StoreReducer';
import { Collapse } from 'antd';

export default function CommentElement({comment, parents}) {
    let comments = []
    if(comment.isOpened) comments = comment.kidElements.map(kidComment=>{
    let isLeaf = (kidComment.kids && kidComment.kids.length > 0) ? true : false
    return <Collapse key={kidComment.id}
        items={[
         {
           showArrow: isLeaf,
           key: kidComment.id,
           label: kidComment.text,
           children: <>{kidComment.isOpened && CommentElement({
            comment:kidComment,
            parents:[...parents,kidComment.id]})}</>,
         }
       ]}
       collapsible={!isLeaf && "icon"}
       onChange={()=>{changeKidElements([...parents,kidComment.id], true)}}
     />})
  return (
    <div>
        {comments}
    </div>
  )
}
