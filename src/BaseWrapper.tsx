import { Route, Routes } from 'react-router-dom'

import App from './pages/App'
import Home from './pages/Home'
import Login from './pages/Login'
import Over from './pages/Over'
import Result from './pages/Result'

const BaseWrapper = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/login" element={<Login />} />
      <Route path="/game" element={<App />} />
      <Route path="/over" element={<Over />} />
      <Route path="/result" element={<Result />} />
    </Routes>
  )
}

export default BaseWrapper
