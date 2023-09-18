import React from 'react'
import Store from '../../store/Store'
import { observer } from 'mobx-react-lite'
import {Link} from "react-router-dom"
import { getPostById, getUpdatedNews } from '../../store/StoreReducer';

let page = 1;
if(!Store.newsInfo) getUpdatedNews(1, "reset")

const nextPage = () => {
  page++
  getUpdatedNews(page, "add")
}

const MainPage = observer(() => {

  let postsElements = Store.state.newsInfo.map(post => {

    return <Link to={"/article?id=" + post.id} style={{display: "block", marginTop: "5px", color: "black", textDecoration: "none"}} key={post.id} onClick={() => {getPostById(post.id); Store.setComments([])}}>{post.title}___{post.by}___{post.score}======={post.time}</Link>
  })
  return (
    <div>
      <button disabled={Store.state.isFetchingMain || Store.state.isFetchingMain} onClick={() => { getUpdatedNews(1, "reset"); page = 1 }}>Reload</button>

      {!Store.state.isFetchingMain && postsElements}
      {(Store.state.isFetchingMain || Store.state.isAdding) && <p>Loading</p>}
      {(!Store.state.isFetchingMain) &&
        <button disabled={Store.state.isFetchingMain || Store.state.isAdding} onClick={() => { nextPage() }}>More</button>}
        
    </div>
  )
})

export default MainPage
