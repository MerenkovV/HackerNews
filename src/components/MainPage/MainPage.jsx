import React from 'react'
import Store from '../../store/Store'
import { observer } from 'mobx-react-lite'
import { Link } from "react-router-dom"
import { getPostById, getUpdatedNews } from '../../store/StoreReducer';
import { contentStyle, headerStyle, siderStyle } from '../common/AntStyle'
import { Button, Card, Layout, Spin } from 'antd'
import styles from './MainPage.module.css'
import { ClockCircleOutlined, LoadingOutlined, StarOutlined, UndoOutlined, UserOutlined } from '@ant-design/icons';
const { Header, Sider, Content } = Layout

let page = 1;
if (!Store.newsInfo) getUpdatedNews(1, "reset")

const nextPage = () => {
  page++
  getUpdatedNews(page, "add")
}

const MainPage = observer(() => {

  let postsElements = Store.state.newsInfo.map(post => <Card key={post.id} size="small"
      title={<Link onClick={() => { getPostById(post.id); Store.setComments([]) }}
        to={"/article?id=" + post.id}>{post.title}</Link>}>
      <div>
        <span style={{marginRight: "13px"}}><UserOutlined /> {post.by}</span>
        <span style={{marginRight: "13px"}}><ClockCircleOutlined /> {post.time}</span>
        <span><StarOutlined /> {post.score}</span>
      </div>
      </Card>)
return (
  <Layout>
    <Header style={headerStyle}></Header>
    <Layout hasSider>
      <Sider width="50" style={siderStyle}><Button className={styles.reload} disabled={Store.state.isFetchingMain || Store.state.isFetchingMain} onClick={() => { getUpdatedNews(1, "reset"); page = 1 }} type="dashed" shape="circle" icon={<UndoOutlined />} /></Sider>
      <Content style={contentStyle}>
        {!Store.state.isFetchingMain && postsElements}
        {(Store.state.isFetchingMain || Store.state.isAdding) && <Spin className={styles.loading} indicator={<LoadingOutlined
          style={{ fontSize: 35, marginTop: "15px" }} spin />} />}
        {(!Store.state.isFetchingMain) &&
        <Button style={{margin:"10px 0 15px 0"}} disabled={Store.state.isFetchingMain || Store.state.isAdding} onClick={() => { nextPage() }} type="primary">More</Button>}
      </Content>
    </Layout>
  </Layout>
)
})

export default MainPage
