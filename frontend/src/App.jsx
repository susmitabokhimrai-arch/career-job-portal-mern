import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './components/shared/Navbar'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Home from './components/Home'
import Browse from './components/Browse'
import Jobs from './components/Jobs'
import Profile from './components/Profile'
import JobDescription from './components/JobDescription'
import Companies from './components/admin/Companies'
import CompanyCreate from './components/admin/CompanyCreate'
import CompanySetup from './components/admin/CompanySetup'
import AdminJobs from "./components/admin/AdminJobs";
import PostJob from './components/admin/PostJob'
import Applicants from './components/admin/Applicants'
import ProtectedRoute from './components/admin/ProtectedRoute'
import SavedJobs from './components/SavedJobs'
import { Toaster } from 'sonner';
import AdminRoute from './components/admin/AdminRoute'
import ManageRecruiter from './components/admin/ManageRecruiter'
import RecruiterProfile from './components/Recruiterprofile'
import ForgotPassword from './components/auth/ForgotPassword'
import ResetPassword from './components/auth/ResetPassword'
import CareerAdvice from './components/CareerAdvice'
import ResumeTips from './components/ResumeTips'
import BlogDetail from './components/BlogDetail'
import AdminBlog from './components/admin/AdminBlog'

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
    path:'/forgot-password',
    element:<ForgotPassword/>
  },
  {
    path:'/reset-password/:token',
    element:<ResetPassword/>
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
    path:'/description/:id',
    element:<JobDescription />
  },
  {
    path:'/profile',
    element:<Profile/>
  },
  {
    path: '/saved-jobs',       // added
    element: <SavedJobs />     // added
  },
  //admin part here start
  {
    path:"/admin/companies",
    element:<ProtectedRoute><Companies/></ProtectedRoute>
  },
  {
    path:"/admin/companies/create",
    element:<ProtectedRoute><CompanyCreate/></ProtectedRoute>
  },
  {
    path:"/admin/companies/:id",
    element:<ProtectedRoute><CompanySetup/></ProtectedRoute>
  },
  {
    path:"/admin/jobs",
    element:<ProtectedRoute><AdminJobs/></ProtectedRoute>
  },
  {
    path:"/admin/jobs/create",
    element:<ProtectedRoute><PostJob/></ProtectedRoute>
  },
  {
    path:"/admin/jobs/:id",
    element:<ProtectedRoute><PostJob/></ProtectedRoute>
  },
  {
    path:"/admin/jobs/:id/applicants",
    element:<ProtectedRoute><Applicants/></ProtectedRoute>
  },
// admin only
  { 
    path: '/admin/manage-recruiter',
     element: <AdminRoute><ManageRecruiter /></AdminRoute> 
    },
    {
      path :"/recruiter/profile",
      element:<ProtectedRoute><RecruiterProfile/></ProtectedRoute>
    },
    {
    path: '/career-advice',
    element: <CareerAdvice />
},
{
    path: '/resume-tips',
    element: <ResumeTips />
},
{
    path: '/blog/:id',
    element: <BlogDetail />
},
{
    path: '/admin/blog',
    element: <AdminRoute><AdminBlog /></AdminRoute>
}
])

function App() {
  return (
    <>
    
        <Toaster 
        position="bottom-right"
        richColors
        closeButton
      />
     <RouterProvider router ={appRouter} />
      
    </>
  )
}

export default App;