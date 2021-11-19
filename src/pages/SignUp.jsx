import React, {useContext, useState, useEffect} from 'react'
import Header from '../components/Header/Header'
import {MenuContext} from '../context'
import ls from '../styles/Login.module.css'
import { useFetching } from '../hooks/useFetching'
import PostService from '../API/PostService'
import {AuthContext} from '../context'
import { MdAccountCircle } from 'react-icons/md'
import { useNavigate } from 'react-router'

export default function SignUp() {
    const {setMenuSwitch, menu_items, setMenuItems} = useContext(MenuContext)
    const {user, setUser, setLogged} = useContext(AuthContext)
    const [userD, setUserD] = useState({login:'', pass:'', pass2:''})
    const [mess, setMess] = useState({error:'', succes:''})
    const navigate = useNavigate();

    const [fetchLogin, isLodaingLogin, errorLogin] = useFetching(async(login, pass)=>{
        const res = await PostService.signUpUser(login, pass)
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
        setMess({error:'', succes:''})
        if(userD.login.trim()=="" || userD.pass.trim()=="" || userD.pass2.trim()==""){
            setMess({...mess, error:'заполните все поля!'})
            return
        }
        if(userD.pass.trim() != userD.pass2.trim()){
            setMess({...mess, error:'Пароли не совпадают!'})
            return
        }
        fetchLogin(userD.login, userD.pass)
    }
    useEffect(() => {
        if(mess.succes){
            setLogged(mess.succes)
        }
        return () => {
            setMess({...mess, succes: false})
        }
    }, [mess.succes])
    return (
        <div className="App">
            <Header bigTitle="Регистрация" littleTitle="egoist" showMenu={setMenuSwitch}/>
            <div className={ls.main}>
              <div className={ls.center__container}>
                <h1>Регистрация</h1>
                <form onSubmit={Login}>
                    <input value={userD.login} onChange={ e=>setUserD({...userD, login: e.target.value}) } type='text' placeholder="Введите ваш логин" />
                    <input value={userD.pass} onChange={ e=>setUserD({...userD, pass: e.target.value}) } type='password' placeholder="Введите ваш пароль"/>
                    <input value={userD.pass2} onChange={ e=>setUserD({...userD, pass2: e.target.value}) } type='password' placeholder="Подтвердите ваш пароль"/>
                    <span className={ls.sp__error}>{mess.error} {errorLogin}</span>
                    <span className={ls.sp__succes}>{mess.succes}</span>  
                    {isLodaingLogin ? 'Отправка данных...' : ''}
                    <button disabled={isLodaingLogin ? true : false}>Зарегистрироваться</button>
                </form>
              </div>
            </div>
        </div>
    )
}
