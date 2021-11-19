import React, {useContext, useState, useEffect, useRef} from 'react'
import { useParams, useLocation } from 'react-router-dom'
import Header from '../components/Header/Header'
import WrapBlogTovars from '../components/WrapBlogTovars/WrapBlogTovars'
import {AuthContext, CategoriesContext, MenuContext} from '../context'
import {useFetching} from '../hooks/useFetching'
import PostService from '../API/PostService'
import Loader from '../components/Loader/Loader'
import clad from '../styles/Admin.module.css'
import AdminModal from '../components/AdminModal/AdminModal'


export default function Admin_DetailCategory(props) {
    const {menuSwitch, setMenuSwitch} = useContext(MenuContext)
    const {user} = useContext(AuthContext)
    const params = useParams()
    const location = useLocation();
    const [catsTovars, setCatsTovars] = useState([])
    // koke ---------------------------------------------------------------------------------
    const [adminModal, setAdminModal] = useState(false)
    const [newTov, setNewTov] = useState({name:'', descr:'', cena:''})
    const [objMess, setObjMess] = useState({mess:'', err:''})
    const fileInputRef = useRef(); 
    var formData = new FormData();

    const [fetchSendCat, isLoadingSendCat, ErrorSendCat] = useFetching(async(formdata)=>{
        const res = await PostService.createNewCat(formdata)
        setObjMess({mess:res.mess, err:res.err})
        if(res.mess){
            setCatsTovars([res.tovar, ...catsTovars])
            setNewTov({name:'', descr:'', cena:''})
        }
    });
    const sendNewCatToDb = (e)=>{
        e.preventDefault()
        setObjMess({mess:'', err:''})
        if(newTov.name.trim()=='' || newTov.descr.trim()=='' || newTov.cena.trim()=='' || !fileInputRef.current.files[0]){
            setObjMess({...objMess, err:'Заполните все поля!!!'})
            return
        }
        formData.append("createNewTovar", newTov.name)
        formData.append("descr", newTov.descr)
        formData.append("token", user.login)
        formData.append("file", fileInputRef.current.files[0])
        formData.append("cena", newTov.cena)
        formData.append("cat_id", params.cat_id)

        fetchSendCat(formData)
        // console.log(fileInputRef.current.files[0].name)
    }
    // Окно Редактирования
    const [modalEditCat, setModalEditCat] = useState(false)
    const [objCat, setObjCat] = useState({name:'', descr:''})
    const [objMess2, setObjMess2] = useState({mess:'', err:''})
    const fileInputRef2 = useRef(); 
    var formData2 = new FormData();
    const {categories, setCats} = useContext(CategoriesContext)

    const [fetchEditCat, isLoadingEditCat, ErrorEditCat] = useFetching(async(formdata2)=>{
        const res = await PostService.createNewCat(formdata2)
        setObjMess2({mess:res.mess, err:res.err})
        if(res.mess){
            setCats(res.cat)
            setObjCat({name:'', descr:''})
        }
    });
    const editCat = (e)=>{
        e.preventDefault()
        setObjMess2({mess:'', err:''})
        if(objCat.name.trim()=='' && objCat.descr.trim()=='' && !fileInputRef2.current.files[0]){
            setObjMess2({...objMess2, err:'Заполните минимум одно поле!!!'})
            return
        }
        formData2.append("editCatOfId", '1')
        if(objCat.name.trim()!='')
            formData2.append("name", objCat.name.trim())
        if(objCat.descr.trim()!='')
            formData2.append("descr", objCat.descr.trim())
        if(fileInputRef2.current.files[0])
            formData2.append("file", fileInputRef2.current.files[0])
        formData2.append("token", user.login)
        formData2.append("cat_id", params.cat_id)
        fetchEditCat(formData2)
    }
    // koke ---------------------------------------------------------------------------------
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
            <div className={clad.edit_main}>
                <div className={clad.btn_edit_main} onClick={()=>setAdminModal(true)}>Добавить товар</div>
                <div className={clad.btn_edit_main} onClick={()=>setModalEditCat(true)}>Редактировать категорию</div>
            </div>
            <AdminModal adminModal={adminModal} setAdminModal={setAdminModal}>
                <h1>Добавление категории</h1>
                <form onSubmit={sendNewCatToDb} >
                    {/* enctype="multipart/form-data" */}
                    <p>Название товара</p>
                    <input type="text" placeholder="Введите название товара" value={newTov.name} onChange={(e)=>setNewTov({...newTov, name:e.target.value})}/>
                    <p>Описание товара</p>
                    <input type="text" placeholder="Введите описание товара" value={newTov.descr} onChange={(e)=>setNewTov({...newTov, descr:e.target.value})}/>
                    <p>Цена товара</p>
                    <input type="text" placeholder="Введите цену товара" value={newTov.cena} onChange={(e)=>setNewTov({...newTov, cena:e.target.value})}/>
                    <p>Выберите картинку товара</p>
                    <input type="file" ref={fileInputRef}/>
                    <span className={clad.pMess}>{objMess.mess}</span>
                    <span className={clad.pError}>{objMess.err}</span>
                    <span className={clad.pError}>{ErrorSendCat}</span>
                    {isLoadingSendCat
                        ?<p>Отправка данных...</p>
                        :<button>Добавить</button>
                    }
                </form>
            </AdminModal>
            <AdminModal adminModal={modalEditCat} setAdminModal={setModalEditCat}>
                <h1>Редактирование категории</h1>
                <form onSubmit={editCat} >
                {/* enctype="multipart/form-data" */}
                    <p>Новое название категории</p>
                    <input type="text" placeholder="*необязательно" value={objCat.name} onChange={(e)=>setObjCat({...objCat, name:e.target.value})}/>
                    <p>Новое описание категории</p>
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
            {LoadingTovar
                ?<Loader/>
                :<WrapBlogTovars catsTovars={catsTovars} cat_id={params.cat_id} ErrorTovar={ErrorTovar}/>
            }
        </div>
    )
}
