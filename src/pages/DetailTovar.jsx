import React, {useContext, useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import Header from '../components/Header/Header'
import TovarDetail from '../components/TovarDetail/TovarDetail'
import {AuthContext, MenuContext} from '../context'
import {useFetching} from '../hooks/useFetching'
import PostService from '../API/PostService'
import Loader from '../components/Loader/Loader';
const DetailTovar = () => {
    const {menuSwitch, setMenuSwitch} = useContext(MenuContext)
    const {user} = useContext(AuthContext)
    const params = useParams();
    const [tovar, setTovar] = useState('')
    const [myOcenka, setMyOcenka] = useState(0) 
    const [LoadTovar, isLoadingTovar, ErrorTovar] = useFetching(async(id, token)=>{
        console.log('16: '+token);
        const res = await PostService.getTovarOfId(id, token);
        setTovar(res)
        console.log('19: '+res);
    });
    const [fetchOcenitt, isLoadingSendOcenka, errorOcenka] = useFetching(async(ocenka, id, token)=>{
        const res = await PostService.sendOcenkaTovaru(ocenka, id, token);
        res.mess 
            ? alert(res.mess)
            :setTovar(res)
    });
    const sendOcenka = ()=>{
        if(myOcenka==0){
            alert('Вы не выбрали оценку')
            return
        }
        fetchOcenitt(myOcenka, params.tov_id, user.login)
    }
    useEffect(() => {
        LoadTovar(params.tov_id, user.login)
    }, [params.tov_id])
    return (
        <div className="App">
            <Header bigTitle="Товар" littleTitle="egoist" showMenu={setMenuSwitch}/>
            {isLoadingTovar
                ?<Loader/>
                :<TovarDetail tovar={tovar} myOcenka={myOcenka} setMyOcenka = {setMyOcenka} sendOcenka={sendOcenka} isLoadingSendOcenka={isLoadingSendOcenka} errorOcenka={errorOcenka} ErrorTovar={ErrorTovar}/>
            }
        </div>
    )
}

export default DetailTovar
