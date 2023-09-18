import React from 'react'
import Store from '../../store/Store'
import { observer } from 'mobx-react-lite'
import CommentElement from './CommentElement'
import { changeKidElements, getPostById } from '../../store/StoreReducer'
import { Link } from 'react-router-dom/cjs/react-router-dom'
import { Button, Collapse, Layout, Spin } from 'antd'
import { contentStyle, headerStyle, siderStyle } from '../common/AntStyle'
import { Typography } from 'antd';
import { ClockCircleOutlined, LeftOutlined, LoadingOutlined, UndoOutlined, UserOutlined } from '@ant-design/icons';
import styles from "./PostPage.module.css"
const { Title } = Typography;
const { Header, Sider, Content } = Layout

const PostPage = observer(() => {
  const queryParameters = new URLSearchParams(window.location.search)
  const id = queryParameters.get('id')
  Store.state.currentPost.length === 0 && getPostById(id)

  let Comments = Store.state.currentComments.map(comment => {
    let isLeaf = (comment.kids && comment.kids.length > 0) ? true : false
    return <Collapse key={comment.id}
      items={[
        {
          showArrow: isLeaf,
          key: comment.id,
          label: comment.text,
          children: <>{comment.isOpened && CommentElement({
            comment: comment,
            parents: [comment.id]
          })}</>,
        }
      ]}
      collapsible={!isLeaf && "icon"}
      onChange={() => { changeKidElements([comment.id], true) }}
    />
  })

  return (
    <Layout>
      <Header style={headerStyle}></Header>
      <Layout hasSider>
        <Sider width="50" style={siderStyle}><Link style={{ lineHeight: "10px" }} to={'/'}><Button type="primary" shape="circle" icon={<LeftOutlined />} /></Link></Sider>
        <Content style={contentStyle}>
          <div className={styles.topBar}>
            <span><UserOutlined /> {Store.state.currentPost.by}</span>
            <span className={styles.time}><ClockCircleOutlined /> {Store.state.currentPost.time}</span>
          </div>
          <Title style={{ lineHeight: "20px" }}>{Store.state.isFetchingPost ? "Loading..." : Store.state.currentPost.title}</Title>
          <Button href={Store.state.currentPost.url} target='_blank' className={styles.source} type="primary">Source</Button>
          <div><Button style={{ marginBottom: "20px" }} disabled={Store.state.isFetchingComments} onClick={() => { getPostById(Store.state.currentPost.id, true) }} type="dashed" shape="circle" icon={<UndoOutlined />} /><span style={{ paddingLeft: "20px" }}>comments: {Store.state.currentPost.descendants}</span></div>

          <div>
            {Store.state.isFetchingComments ? <Spin indicator={<LoadingOutlined
              style={{fontSize: 35, marginTop:"15px"}} spin/>} /> : Comments}
          </div>
        </Content>
      </Layout>
    </Layout>
  )
})

export default PostPage