import React, {useContext, useEffect} from 'react'
import { MdAccountCircle } from 'react-icons/md'
import { useNavigate } from 'react-router'
import { AuthContext } from '../context'
import { MenuContext } from '../context'
const Logout = () => {
    const {setUser} = useContext(AuthContext)
    const {menu_items, setMenuItems} = useContext(MenuContext)
    const navigate = useNavigate()
    useEffect(() => {
        setUser(false)
        localStorage.removeItem('user')
        setMenuItems([
            {icon:<MdAccountCircle/>,name:'Вход/Регистрация', url:'/login'},
            menu_items[1],
            menu_items[2],
        ])
        navigate('/')
    }, [])
    return (
        <div>
            
        </div>
    )
}

export default Logout
