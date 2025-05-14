import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Profile from './pages/Profile';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import Createlisting from './pages/Createlisting';


const App = () => {
  return (
    <>
    
      <BrowserRouter>
      <Header/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/signin" element={<Signin/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route  element={<PrivateRoute/>}>
        <Route path="/profile" element={<Profile/>} />
        <Route path="/create-listing" element={<Createlisting/>}/>
        </Route>
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
