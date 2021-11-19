import About from "../pages/About";
import DetailCategory from "../pages/DetailCategory";
import DetailTovar from "../pages/DetailTovar";
import Login from "../pages/Login";
import Logout from "../pages/Logout";
import Main from "../pages/Main";
import SignUp from "../pages/SignUp";
import Admin_Main from "../pages/Admin_Main"
import Admin_DetailCategory from "../pages/Admin_DetailCategory";
import Admin_DetailTovar from "../pages/Admin_DetailTovar";
import Users from "../pages/Users";
import EmptyPage from "../pages/EmptyPage";

export const allRoutes = [
    {path: '/about_us', element: <About/>, exact:true},
    {path: '/main', element: <Main/>, exact:true},
    {path: '/cat:cat_id', element: <DetailCategory/>, exact:true},
    {path: '/cat:cat_id/tovar:tov_id', element: <DetailTovar/>, exact:true},
    {path: '/', element: <Main/>, exact:true},
]
export const privateRoutes= [
    ...allRoutes,
    {path: '/logout', element: <Logout/>, exact:true},
    {path: '*', element: <EmptyPage/>, exact:true},
]
export const publicRoutes = [
    ...allRoutes,
    {path: '/login', element: <Login/>, exact:true},
    {path: '/sign_up', element: <SignUp/>, exact:true},
    {path: '*', element: <EmptyPage/>, exact:true},
]
export const adminRoutes = [
    {path: '/about_us', element: <About/>, exact:true},
    {path: '/main', element: <Admin_Main/>, exact:true},
    {path: '/cat:cat_id', element: <Admin_DetailCategory/>, exact:true},
    {path: '/cat:cat_id/tovar:tov_id', element: <Admin_DetailTovar/>, exact:true},
    {path: '/users', element: <Users/>, exact:true},
    {path: '/', element: <Admin_Main/>, exact:true},
    {path: '*', element: <EmptyPage/>, exact:true},
    {path: '/logout', element: <Logout/>, exact:true},
]