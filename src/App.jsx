import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Login from './Login'
import ConsumerPage from './ConsumerPage'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/portal" element={<ConsumerPage />} />

    </Routes>
  )
}

export default App;