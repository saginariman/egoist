import React, {useContext, useState, useEffect} from 'react'
import Header from '../components/Header/Header'
import {AuthContext, MenuContext} from '../context'
import userSt from '../styles/Users.module.css'
import {useFetching} from '../hooks/useFetching'
import PostService from '../API/PostService'
import Loader from '../components/Loader/Loader'
import clad from '../styles/Admin.module.css'
import AdminModal from '../components/AdminModal/AdminModal'
export default function Users() {
    const {menuSwitch, setMenuSwitch} = useContext(MenuContext)
    const {user} = useContext(AuthContext)
    const [users, setUsers] = useState([])
    const [objMess, setObjMess] = useState({mess:'', err:''})

    const [LoadUsers, isLoadingUsers, ErrorUsers] = useFetching(async(token)=>{
        const res = await PostService.getUsers(token);
        setObjMess({mess:res.mess, err:res.err})
        setUsers(res.users)
    });
    const [admissUser, isLoadingAdmiss, ErrorAdmiss] = useFetching(async(token, id, valAdmiss)=>{
        const res = await PostService.admissUser(token, id, valAdmiss);
        setObjMess({mess:res.mess, err:res.err})
        setUsers(res.users)
    });
    useEffect(() => {
        LoadUsers(user.token)
    }, [])
    return (
        <div className="App">
            <Header bigTitle="Пользователи" littleTitle="egoist" showMenu={setMenuSwitch}/>
            {isLoadingUsers || isLoadingAdmiss
                ?<Loader/>
                :
                <div className={userSt.wrapper}>
                    <h2 style={{color:'teal'}}>{objMess.mess} {ErrorUsers} {ErrorAdmiss}</h2>
                    <h2 style={{color:'tomato'}}>{objMess.err}</h2>
                    {users.map((item, index)=>
                        <div key={index} className={userSt.blog}>
                            <div className={userSt.login}>{item.login}</div>
                            <div className={userSt.btn__group}>
                                {parseInt(item.admission)
                                    ?<div className={userSt.btn} onClick={()=>admissUser(user.token, item.id, false)}>Забанить</div>
                                    :<div className={userSt.btn__ban} onClick={()=>admissUser(user.token, item.id, true)}>Разбанить</div>
                                }
                            </div>
                        </div>
                    )}
                </div>
                
            }
        </div>
    )
}
