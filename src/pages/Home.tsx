import { Navigate } from 'react-router-dom'

const Home = () => {
  return (
    // add conditional on user logged in
    <Navigate to="/login" />
  )
}

export default Home
