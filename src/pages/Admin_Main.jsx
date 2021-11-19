import React, {useState, useContext, useRef} from 'react';
import Header from '../components/Header/Header';
import Wrapper from '../components/Wrapper/Wrapper';
import {MenuContext, CategoriesContext, AuthContext} from '../context'
import Loader from '../components/Loader/Loader'
import AdminModal from '../components/AdminModal/AdminModal'
import clad from '../styles/Admin.module.css'
import { useFetching } from '../hooks/useFetching';
import PostService from '../API/PostService';
import { Link } from 'react-router-dom';
function Admin_Main() {
  const {menuSwitch, setMenuSwitch, socials, setSocials} = useContext(MenuContext)
  const {categories, setCats, isLoading, error} = useContext(CategoriesContext)
  const [adminModal, setAdminModal] = useState(false)
  const [newCat, setNewCat] = useState({name:'', descr:''})
  const [objMess, setObjMess] = useState({mess:'', err:''})
  const fileInputRef = useRef(); 
  var formData = new FormData();
  const {user} = useContext(AuthContext)

  const [fetchSendCat, isLoadingSendCat, ErrorSendCat] = useFetching(async(formdata)=>{
    const res = await PostService.createNewCat(formdata)
    setObjMess({mess:res.mess, err:res.err})
    if(res.mess){
      setCats([res.cat, ...categories])
      setNewCat({name:'', descr:''})
    }
  });
  const sendNewCatToDb = (e)=>{
    e.preventDefault()
    setObjMess({mess:'', err:''})
    if(newCat.name.trim()=='' || newCat.descr.trim()=='' || !fileInputRef.current.files[0]){
      setObjMess({...objMess, err:'Заполните все поля!!!'})
      return
    }
    formData.append("createNewCat", newCat.name)
    formData.append("descr", newCat.descr)
    formData.append("token", user.login)
    formData.append("file", fileInputRef.current.files[0])
    fetchSendCat(formData)
    // console.log(fileInputRef.current.files[0].name)
  }
  // social Monupulations
  
  const [objSocial, setObjSocial] = useState({url:''})
  const [messSocial, setMessSocial] = useState({mess:'', err:''})
  const fileInputRef2 = useRef(); 
  var formData2 = new FormData();
  const [socialAddModal, setSocialAddModal] = useState(false)

  const [fetchAddSocial, isLoadingAddSocial, ErrorAddSocial] = useFetching(async(formdata2)=>{
    const res = await PostService.createNewCat(formdata2)
    setMessSocial({mess:res.mess, err:res.err})
    if(res.mess){
        setSocials(res.socials)
        setObjSocial({url:''})
    }
  });
  const sendNewSocial = (e)=>{
    e.preventDefault()
    setMessSocial({mess:'', err:''})
    if(objSocial.url.trim()=='' || !fileInputRef2.current.files[0]){
      setMessSocial({...messSocial, err:'Заполните все поля!!!'})
      return
    }
    formData2.append("addNewSocial", '1')
    formData2.append("url", objSocial.url.trim())
    formData2.append("file", fileInputRef2.current.files[0])
    formData2.append("token", user.login)
    fetchAddSocial(formData2)
  }
  return (
    <div className="App">
      <Header bigTitle="Egoist" littleTitle="чай-кофе" showMenu={setMenuSwitch}/>
      <div className={clad.edit_main}>
        <div className={clad.btn_edit_main} onClick={()=>setAdminModal(true)}>Добавить категорию</div>
        <Link to={'/users'} className={clad.btn_edit_main}>Пользователи</Link>
        <div className={clad.btn_edit_main} onClick={()=>setSocialAddModal(true)}>Соц. сети</div>
      </div>
      <AdminModal adminModal={adminModal} setAdminModal={setAdminModal}>
        <h1>Добавление категории</h1>
        <form onSubmit={sendNewCatToDb} >
          {/* enctype="multipart/form-data" */}
          <p>Название категории</p>
          <input type="text" placeholder="Введите название для новой категории" value={newCat.name} onChange={(e)=>setNewCat({...newCat, name:e.target.value})}/>
          <p>Описание категории</p>
          <input type="text" placeholder="Введите описание для новой категории" value={newCat.descr} onChange={(e)=>setNewCat({...newCat, descr:e.target.value})}/>
          <p>Выберите картинку категории</p>
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
      <AdminModal adminModal={socialAddModal} setAdminModal={ setSocialAddModal }>
        <form onSubmit={sendNewSocial} >
          {/* enctype="multipart/form-data" */}
            <p>Введите url адресс соц. сети</p>
            <input type="text" placeholder="https://example.com" value={objSocial.url} onChange={(e)=>setObjSocial({...objSocial, url:e.target.value})}/>
            <p>Выберите картинку соц. сети</p>
            <input type="file" ref={fileInputRef2}/>
            <span className={clad.pMess}>{messSocial.mess}</span>
            <span className={clad.pError}>{messSocial.err}</span>
            <span className={clad.pError}>{ErrorAddSocial}</span>
            {isLoadingAddSocial
                ?<p>Отправка данных...</p>
                :<button>Добавить</button>
              }
        </form>
      </AdminModal>
      {isLoading
        ?<Loader/>
        :<Wrapper items={categories} error={error}/>
      }
    </div>
  );
}

export default Admin_Main;
