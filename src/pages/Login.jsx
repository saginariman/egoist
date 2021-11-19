import React, {useContext, useState, useEffect} from 'react'
import Header from '../components/Header/Header'
import {MenuContext} from '../context'
import ls from '../styles/Login.module.css'
import { useFetching } from '../hooks/useFetching'
import PostService from '../API/PostService'
import {AuthContext} from '../context'
import { MdAccountCircle } from 'react-icons/md'
import { useNavigate } from 'react-router'

export default function Login() {
    const {setMenuSwitch, menu_items, setMenuItems} = useContext(MenuContext)
    const {user, setUser, setLogged} = useContext(AuthContext)
    const [userD, setUserD] = useState({login:'', pass:''})
    const [mess, setMess] = useState({error:'', succes:''})
    const navigate = useNavigate();
    const [fetchLogin, isLodaingLogin, errorLogin] = useFetching(async(login, pass)=>{
        const res = await PostService.loginUser(login, pass)
        setMess({error:res.error, succes:res.mess})
        if(!res.error){
            setUser(res.user)
            let user = JSON.stringify(res.user)
            localStorage.setItem('user', user)
            setMenuItems([
            {icon:<MdAccountCircle/>,name:`Привет, ${res.user.login}! выйти?`, url:'/logout'},
                menu_items[1],
                menu_items[2],
            ])
        }
    });
    const Login = (e)=>{
        e.preventDefault()
        if(userD.login.trim()=="" || userD.pass.trim()==""){
            setMess({...mess, error:'заполните все поля!'})
            return
        }
        fetchLogin(userD.login, userD.pass)
        setMess({error:'', succes:''})
    }
    useEffect(() => {
        console.log("41"+mess.succes);
        if(mess.succes){
            console.log('43'+mess.succes);
            setLogged(mess.succes)
        }
        return () => {
            setMess({...mess, succes: false})
        }
    }, [mess.succes])
    return (
        <div className="App">
            <Header bigTitle="Вход" littleTitle="egoist" showMenu={setMenuSwitch}/>
            <div className={ls.main}>
              <div className={ls.center__container}>
                <h1>Вход в систему</h1>
                <form onSubmit={Login}>
                    <input value={userD.login} onChange={ e=>setUserD({...userD, login: e.target.value}) } type='text' placeholder="Введите ваш логин" />
                    <input value={userD.pass} onChange={ e=>setUserD({...userD, pass: e.target.value}) } type='password' placeholder="Введите ваш пароль"/>
                    <span className={ls.sp__error}>{mess.error} {errorLogin}</span>
                    <span className={ls.sp__succes}>{mess.succes}</span>  
                    {isLodaingLogin ? 'Отправка данных...' : ''}
                    <button disabled={isLodaingLogin ? true : false}>Войти</button>
                    <span onClick={()=>navigate('/sign_up')} className={ls.sp__rega}>перейти к регистрации...</span>
                </form>
              </div>
            </div>
        </div>
    )
}
