import React from 'react'
import { HashRouter,Navigate,Route, Routes } from 'react-router-dom'
import Main from '../views/main/Main'
import Login from '../views/login/Login'

export default function indexRouter() {
  return (
    <HashRouter>
        <Routes >
          {/* <Route path='/*' element={<Main/>}></Route> */}
          <Route path='/login'   element={<Login/>}></Route>
          <Route path='/*'   element={localStorage.getItem('token') ? <Main /> : < Navigate replace   to="/login" /> }></Route>
        </Routes>
    </HashRouter>
  )
}
