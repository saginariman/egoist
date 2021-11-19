import React, {useContext, useState, useEffect} from 'react'
import { useParams, useLocation } from 'react-router-dom'
import Header from '../components/Header/Header'
import WrapBlogTovars from '../components/WrapBlogTovars/WrapBlogTovars'
import {AuthContext, MenuContext} from '../context'
import {useFetching} from '../hooks/useFetching'
import PostService from '../API/PostService'
import Loader from '../components/Loader/Loader';

export default function DetailCategory(props) {
    const {menuSwitch, setMenuSwitch} = useContext(MenuContext)
    const {user} = useContext(AuthContext)
    const params = useParams()
    const location = useLocation();
    const [catsTovars, setCatsTovars] = useState([])
    const [LoadTovars, LoadingTovar, ErrorTovar] = useFetching(async(id, token)=>{
        const res = await PostService.getTovarsofCatId(id, token);
        setCatsTovars(res)
    });

    useEffect(() => {
        LoadTovars(params.cat_id, user.login)
    }, [params.cat_id])
    return (
        <div className="App">
            <Header bigTitle={location.state} littleTitle="egoist" showMenu={setMenuSwitch}/>
            {LoadingTovar
                ?<Loader/>
                :<WrapBlogTovars catsTovars={catsTovars} cat_id={params.cat_id} ErrorTovar={ErrorTovar}/>
            }
        </div>
    )
}
