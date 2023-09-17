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

    return <Link to={"/article?id=" + post.id} style={{display: "block", marginTop: "5px", color: "black", textDecoration: "none"}} key={post.id} onClick={() => {Store.getPostById(post.id); Store.setComments([])}}>{post.title}___{post.by}___{post.score}======={post.time}</Link>
  })
  return (
    <div>
      <button disabled={Store.state.isFetchingMain} onClick={() => { Store.getUpdatedNews(1, true); page = 1 }}>Reload</button>

      {!Store.state.isFetchingMain && postsElements}
      {(Store.state.isFetchingMain || Store.state.isAdding) && <p>Loading</p>}
      {(!Store.state.isFetchingMain && !Store.state.isAdding) &&
        <button onClick={() => { nextPage() }}>More</button>}
        
    </div>
  )
})

export default MainPage
