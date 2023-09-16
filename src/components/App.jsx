import React from 'react'
import { BrowserRouter, Route } from "react-router-dom";
import MainPage from './MainPage/MainPage';
import PostPage from './PostPage/PostPage';
import { Switch } from 'react-router-dom/cjs/react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/article">
          <PostPage />
        </Route>
        <Route path="/">
          <MainPage />
        </Route>
      </Switch>
    </BrowserRouter>
  )
}