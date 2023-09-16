import React from 'react'
import Store from '../../store/Store'
import { observer } from 'mobx-react-lite'
import {Link} from "react-router-dom"

let page = 1;

const nextPage = () => {
  page++
  Store.getUpdatedNews(page, false)
}

const MainPage = observer(() => {

  let postsElements = Store.state.newsInfo.map(post => {
    
    let d = new Date(post.time * 1000);
    let timeStampCon = d.getDate() + '/' + (d.getMonth()) + '/' + d.getFullYear() 
    + " " + ("0" + d.getHours()).slice(-2) + ':' + ("0" + d.getMinutes()).slice(-2);

    return <Link to={"/article?id=" + post.id} style={{display: "block", marginTop: "5px", color: "black", textDecoration: "none"}} key={post.id} onClick={() => {Store.getPostById(post.id)}}>{post.title}___{post.by}___{post.score}======={timeStampCon}</Link>
  })
  return (
    <div>
      <button disabled={Store.state.isFetching} onClick={() => { Store.getUpdatedNews(1, true); page = 1 }}>Reload</button>

      {!Store.state.isFetching && postsElements}
      {(Store.state.isFetching || Store.state.isAdding) && <p>Loading</p>}
      {(!Store.state.isFetching && !Store.state.isAdding) &&
        <button onClick={() => { nextPage() }}>More</button>}
    </div>
  )
})

export default MainPage
