import React from 'react'
import wp from './wrapper.module.css'
import { useNavigate } from 'react-router-dom'
const Wrapper = ({items, error}) => {
    const navigate = useNavigate();
    if(error){
        return <h1 style={{marginTop:'5rem', padding:'1rem'}}>Плохое интернет соединение. Перезагрузите страницу. {error}</h1>
    }
    return (
        <div className={wp.wrapper}>
            <h2>Категории</h2>
            <div className={wp.wrap__container}>
                {items.map((cat, index)=>
                    <div key={index} className={wp.blog} onClick={()=>{navigate(`/cat${cat.id}`, {state: cat.name})}}>
                        <img className={wp.img} src={cat.img} alt={cat.name}/>
                        <p className={wp.blog__name}>{cat.name}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Wrapper
