import React from 'react'
import Store from '../../store/Store'
import { observer } from 'mobx-react-lite'

const PostPage = observer(() => {
  const queryParameters = new URLSearchParams(window.location.search)
  const id = queryParameters.get('id')
  Store.state.currentPost.length === 0 && Store.getPostById(id)
  return (
    <div>
      {Store.state.isFetching ? "Loading" : Store.state.currentPost.title}
    </div>
  )
})

export default PostPage