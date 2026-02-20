import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './components/shared/Navbar'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Home from './components/Home'
import Browse from './components/Browse'
import Jobs from './components/Jobs'
import Profile from './components/Profile'
const appRouter = createBrowserRouter([
  {
    path:'/',
    element:<Home/>
  },
  {
    path:'/login',
    element:<Login/>
  },
  {
    path:'/signup',
    element:<Signup/>
  },
  {
    path:'/browse',
    element:<Browse/>
  },
  {
    path:'/jobs',
    element:<Jobs/>
  },
  {
    path:'/profile',
    element:<Profile/>
  },
]
)

function App() {
  

  return (
    <div>
    
     <RouterProvider router ={appRouter} />
      
    </div>
  )
}

export default App
