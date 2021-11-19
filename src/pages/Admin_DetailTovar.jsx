import React, {useContext, useState, useEffect, useRef} from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header/Header'
import TovarDetail from '../components/TovarDetail/TovarDetail'
import {AuthContext, CategoriesContext, MenuContext} from '../context'
import {useFetching} from '../hooks/useFetching'
import PostService from '../API/PostService'
import Loader from '../components/Loader/Loader'
import clad from '../styles/Admin.module.css'
import AdminModal from '../components/AdminModal/AdminModal'
const Admin_DetailTovar = () => {
    const {menuSwitch, setMenuSwitch} = useContext(MenuContext)
    const {user} = useContext(AuthContext)
    const params = useParams();
    const [tovar, setTovar] = useState('')
    const [myOcenka, setMyOcenka] = useState(0) 
    const [LoadTovar, isLoadingTovar, ErrorTovar] = useFetching(async(id, token)=>{
        console.log('16: '+token);
        const res = await PostService.getTovarOfId(id, token);
        setTovar(res)
        setTovarOn(parseInt(res.turnOn))
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
    // koke-------------------------------------------------------------------------------------------
    const [modalEditCat, setModalEditCat] = useState(false)
    const [objCat, setObjCat] = useState({name:'', descr:'', cena:''})
    const [objMess2, setObjMess2] = useState({mess:'', err:''})
    const fileInputRef2 = useRef(); 
    var formData2 = new FormData();
    const [tovarOn, setTovarOn] = useState(true);
    const navigate = useNavigate()

    const [fetchEditCat, isLoadingEditCat, ErrorEditCat] = useFetching(async(formdata2)=>{
        const res = await PostService.createNewCat(formdata2)
        setObjMess2({mess:res.mess, err:res.err})
        if(res.mess){
            setTovar(res.tovar)
            setObjCat({name:'', descr:'', cena:''})
        }
    });
    const [turnSwitch, isTurning, errorTurn] = useFetching(async(token, id, valSwitch)=>{
        const res = await PostService.turnSwitchTovar(token, id, valSwitch)
        if(res.err) alert(res.err)
        if(res.mess){
            setTovarOn(res.valSwitch)
        }
    });
    const [removeFetchingTovar, isRemoving, errorRemove] = useFetching(async(token, id)=>{
        const res = await PostService.removeTovar(token, id)
        if(res.err) alert(res.err)
        if(res.mess){
            alert(res.mess)
            navigate('/')
        }
    });
    const editCat = (e)=>{
        e.preventDefault()
        setObjMess2({mess:'', err:''})
        if(objCat.name.trim()==''&& objCat.cena.trim()=='' && objCat.descr.trim()=='' && !fileInputRef2.current.files[0]){
            setObjMess2({...objMess2, err:'Заполните минимум одно поле!!!'})
            return
        }
        formData2.append("editTovarOfId", '1')
        if(objCat.name.trim()!='')
            formData2.append("name", objCat.name.trim())
        if(objCat.cena.trim()!='')
            formData2.append("cena", objCat.cena.trim())
        if(objCat.descr.trim()!='')
            formData2.append("descr", objCat.descr.trim())
        if(fileInputRef2.current.files[0])
            formData2.append("file", fileInputRef2.current.files[0])
        formData2.append("token", user.login)
        formData2.append("tovar_id", params.tov_id)
        fetchEditCat(formData2)
    }
    const onClickTurnSwitch=(v)=>{
        turnSwitch(user.login, params.tov_id, v)
    }
    // koke--------------------------------------------------------------------------------------------
    return (
        <div className="App">
            <Header bigTitle="Товар" littleTitle="egoist" showMenu={setMenuSwitch}/>
            <div className={clad.edit_main}>
                {tovarOn
                    ?
                    <div className={clad.btn_edit_main} onClick={()=>onClickTurnSwitch(false)}>Отключить</div>
                    :
                    <div className={clad.btn_edit_main} onClick={()=>onClickTurnSwitch(true)}>Включить</div>
                }
                <div className={clad.btn_edit_main} onClick={()=>setModalEditCat(true)}>Редактировать</div>
                <div className={clad.btn_edit_main} onClick={()=>removeFetchingTovar(user.login, params.tov_id)}>Удалить</div>
            </div>
            <AdminModal adminModal={modalEditCat} setAdminModal={setModalEditCat}>
                <h1>Редактирование категории</h1>
                <form onSubmit={editCat} >
                {/* enctype="multipart/form-data" */}
                    <p>Новое название товара</p>
                    <input type="text" placeholder="*необязательно" value={objCat.name} onChange={(e)=>setObjCat({...objCat, name:e.target.value})}/>
                    <p>Новая цена товара</p>
                    <input type="number" placeholder="*необязательно" value={objCat.cena} onChange={(e)=>setObjCat({...objCat, cena:e.target.value})}/>
                    <p>Новое описание товара</p>
                    <input type="text" placeholder="*необязательно" value={objCat.descr} onChange={(e)=>setObjCat({...objCat, descr:e.target.value})}/>
                    <p>Выберите новую картинку категории</p>
                    <input type="file" ref={fileInputRef2}/>
                    <span className={clad.pMess}>{objMess2.mess}</span>
                    <span className={clad.pError}>{objMess2.err}</span>
                    <span className={clad.pError}>{ErrorEditCat}</span>
                    {isLoadingEditCat
                        ?<p>Отправка данных...</p>
                        :<button>Редактировать</button>
                    }
                </form>
            </AdminModal>
            <AdminModal adminModal={isTurning} setAdminModal={(b)=>console.log('НЕт не можем закрыть окно:'+b)}><Loader title="Переключение видимости товара..."/></AdminModal>
            <AdminModal adminModal={isRemoving} setAdminModal={(b)=>console.log('НЕт не можем закрыть окно:'+b)}><Loader title="Удаление товара..."/></AdminModal>
            {errorTurn || errorRemove
                ?<p style={{color:'tomato', width:'100vh', margin:'1rem'}}>{errorRemove} {errorTurn}</p>
                :''
            }
            {isLoadingTovar
                ?<Loader/>
                :<TovarDetail tovar={tovar} myOcenka={myOcenka} setMyOcenka = {setMyOcenka} sendOcenka={sendOcenka} isLoadingSendOcenka={isLoadingSendOcenka} errorOcenka={errorOcenka} ErrorTovar={ErrorTovar}/>
            }
        </div>
    )
}

export default Admin_DetailTovar
