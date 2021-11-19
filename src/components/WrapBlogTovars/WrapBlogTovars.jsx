import React from 'react'
import tovarCl from './tovars.module.css'
import { useNavigate } from 'react-router-dom'

const WrapBlogTovars = ({catsTovars, cat_id, ErrorTovar}) => {
    const navigate = useNavigate();
    const ocenkaFunc = (ocenka)=>{
        // ocenka = isNaN(ocenka) ? 0 : ocenka
        const divs = [];
        for(var i=0; i<ocenka; i++)
            divs.push(<div key={Math.random()} className={tovarCl.red_zvezda}></div>)
        
        for(var i=0; i<5-ocenka;i++)
            divs.push(<div key={Math.random()} className={tovarCl.zvezda}></div>)
        
        return divs;
    }
    if(ErrorTovar){
        return <h1 style={{marginTop:'5rem', padding:'1rem'}}>Плохое интернет соединение. Перезагрузите страницу. {ErrorTovar}</h1>
    }
    if(!catsTovars.length){
        return <h1 style={{marginTop:'5rem', padding:'1rem'}}>Товаров в данной категории нет</h1>
    }
    return (
        <div className={tovarCl.wrapper}>
            {catsTovars.map((item, index)=>
                <div className={tovarCl.blog} key={index} onClick={()=>{navigate(`/cat${cat_id}/tovar${item.id}`)}}>
                    <img src={item.img} className={tovarCl.img} alt={item.name}/>
                    <p>{item.name}</p>
                    <div className={tovarCl.ocenka}>
                        {ocenkaFunc(Math.round(item.summGolos/item.amountPeople))}
                    </div>
                    <div className={tovarCl.cena}>{item.cena+" тг"}</div>
                </div>
            )}
        </div>
    )
}

export default WrapBlogTovars
