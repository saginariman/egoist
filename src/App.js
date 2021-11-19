import React,{useState, useEffect} from 'react'
import './styles/App.css'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import { MdAccountCircle, MdHome, MdBusinessCenter } from 'react-icons/md';
import Menu from './components/Menu/Menu';
import {MenuContext, CategoriesContext, AuthContext} from './context'
import { adminRoutes, privateRoutes, publicRoutes } from './router'
import {useFetching} from './hooks/useFetching'
import PostService from './API/PostService'
import Footer from './components/Footer/Footer';
import Loader from './components/Loader/Loader';
import Logged from './components/Logged/Logged';

export default function App() {
  const [socials, setSocials] = useState([])
  const [categories, setCats] = useState([])
  const [menu_items, setMenuItems] = useState([
    {icon:<MdAccountCircle/>,name:'Вход/Регистрация', url:'/login'},
    {icon:<MdHome/>,name:'Главная', url:'/main'},
    {icon:<MdBusinessCenter/>,name:'О нас', url:'/about_us'},
  ])
  const [menuSwitch, setMenuSwitch] = useState(false)
  const [user, setUser] = useState(false)
  const [isWaitingCheckLocalStorage, setWaitingCheckLocalStorage] = useState(true);
  const [logged, setLogged] = useState(false)

  const [fetching, isLoading, error] = useFetching(async()=>{
    const res = await PostService.getCats();
    setCats(res) // res.mess ? alert(res.mess) : setCats(res)
  })
  const [fetcSocials, isLoadingSocailas, errorSocials] = useFetching(async()=>{
    const res = await PostService.getSoacials();
    setSocials(res)
  })

  useEffect(async() => {
    let local_user = localStorage.getItem('user')
    if(local_user){
      console.log(local_user);
      local_user = await JSON.parse(local_user)
      setUser(local_user)
      setMenuItems([
        {icon:<MdAccountCircle/>,name:`Привет, ${local_user.login}! выйти?`, url:'/logout'},
        menu_items[1],
        menu_items[2],
      ])
    }
    setWaitingCheckLocalStorage(false)
    fetching()
    fetcSocials()
  }, [])

  useEffect(() => {
    if(logged){
      setTimeout(() => {
        setLogged(false)
      }, 2000);
    }
  }, [logged])

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      isWaitingCheckLocalStorage, 
      setWaitingCheckLocalStorage,
      logged, 
      setLogged
    }}>
      <MenuContext.Provider value={{
        menuSwitch,
        setMenuSwitch,
        menu_items, 
        setMenuItems,
        socials, 
        setSocials
      }}>
        <CategoriesContext.Provider value={{
          categories,
          setCats,
          isLoading,
          error
        }}>
          <BrowserRouter>
            {logged ? <Logged title={logged}/> : ''}
            <Menu menuSwitch={menuSwitch} setMenuSwitch={setMenuSwitch} menu_items={menu_items} categories={categories}/>
            {isWaitingCheckLocalStorage
              ?
              <Loader title="Проверка аутенфикации"/>
              :
              <Routes>
                {parseInt(user.admin)
                  ?
                  adminRoutes.map((route)=>
                    <Route
                      exact={route.exact}
                      key={route.path}
                      path={route.path}
                      element={route.element}
                    />
                  )
                  :user
                    ?
                    privateRoutes.map((route)=>
                      <Route
                        exact={route.exact}
                        key={route.path}
                        path={route.path}
                        element={route.element}
                      />
                    )
                    :
                    publicRoutes.map((route)=>
                      <Route
                        exact={route.exact}
                        key={route.path}
                        path={route.path}
                        element={route.element}
                      />
                    )
                }
              </Routes>
            }
            <Footer socials={socials} isLoadingSocailas={isLoadingSocailas} errorSocials={errorSocials}/>
          </BrowserRouter>
        </CategoriesContext.Provider>
      </MenuContext.Provider>
    </AuthContext.Provider>
  )
}
