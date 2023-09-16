import React from 'react'
import mainPageStore from '../../store/mainPageStore'
import { observer } from 'mobx-react-lite'

let page = 1;

const nextPage = () => {
  page++
  mainPageStore.getUpdatedNews(page, false)
}

const MainPage = observer(() => {

  let postsElements = mainPageStore.state.newsInfo.map(post => {
    let d = new Date(post.time * 1000);
    let timeStampCon = d.getDate() + '/' + (d.getMonth()) + '/' + d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ':' + ("0" + d.getMinutes()).slice(-2);
    return <p key={post.id}>{post.title}___{post.by}___{post.score}======={timeStampCon}</p>
  })
  return (
    <div>
      <button disabled={mainPageStore.state.isFetching} onClick={() => { mainPageStore.getUpdatedNews(1, true); page = 1 }}>Reload</button>

      {!mainPageStore.state.isFetching && postsElements}
      {(mainPageStore.state.isFetching || mainPageStore.state.isAdding) && <p>Loading</p>}
      {(!mainPageStore.state.isFetching && !mainPageStore.state.isAdding) &&
        <button onClick={() => { nextPage() }}>More</button>}
    </div>
  )
})

export default MainPage
