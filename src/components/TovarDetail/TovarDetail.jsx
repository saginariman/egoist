import React from 'react'
import dt from './detail_tov.module.css'
import Loader from '../Loader/Loader';
const TovarDetail = ({tovar, myOcenka, setMyOcenka, sendOcenka, isLoadingSendOcenka, errorOcenka, ErrorTovar}) => {
    const ocenkaFunc = (ocenka)=>{
        const divs = [];
        for(var i=0; i<ocenka; i++)
            divs.push(<div key={Math.random()} className={dt.red_zvezda}></div>)
        
        for(var i=0; i<5-ocenka;i++)
            divs.push(<div key={Math.random()} className={dt.zvezda}></div>)
        
        return divs;
    }
    if(ErrorTovar){
        return <h1 style={{marginTop:'5rem', padding:'1rem'}}>Плохое интернет соединение. Перезагрузите страницу. {ErrorTovar}</h1>
    }
    if(!tovar){
        return <h1 style={{marginTop:'5rem', padding:'1rem'}}>Данного товара нет в базе данных.</h1>
    }
    return (
        <div className={dt.blogDetail}>
            <img src={tovar.img} alt={tovar.name} className={dt.img}/>
            <p className={dt.tov__name}>{tovar.name}</p>
            <div className={dt.ocenka}>
                {ocenkaFunc(Math.round(tovar.summGolos/tovar.amountPeople))}
                {tovar.summGolos 
                    ? <span className={dt.col__ocen}>(Проголосовали: {tovar.amountPeople}, Общая сумма оценок: {tovar.summGolos})</span>
                    : <p className={dt.danger__text}>Рейтинг товара доступен только для зарегистрированных пользователей</p>
                }
            </div>
            <div className={dt.div__cena}>{tovar.cena+" "}&#8376;</div>
            <h3 className={dt.h2Desc}>Описание</h3>
            <p className={dt.tov__desc}>{tovar.descr}</p>
            {errorOcenka
                ?<p className={dt.dangerText}>Ошибка. Что-то пошло не так! Перезагрузите страницу. {errorOcenka}</p>
                :''
            }
            {isLoadingSendOcenka
                ? <Loader/>
                :
                tovar.ocenka_from_current_user
                    ?
                    <div className={[dt.ocenka, dt.ocenka__container].join(' ')}>
                        <span>Ваша оценка: </span>
                        {ocenkaFunc(Math.round(tovar.ocenka_from_current_user))}
                    </div>
                    :
                    <div>
                        <div className={[dt.ocenka, dt.ocenka__container].join(' ')}>
                            <div className={[myOcenka>=1 ? dt.red_zvezda : dt.zvezda, dt.big_star].join(" ")} onClick={()=>{tovar.summGolos ? setMyOcenka(1) : console.log('cs')}}></div>
                            <div className={[myOcenka>=2 ? dt.red_zvezda : dt.zvezda, dt.big_star].join(" ")} onClick={()=>{tovar.summGolos ? setMyOcenka(2) : console.log('cs')}}></div>
                            <div className={[myOcenka>=3 ? dt.red_zvezda : dt.zvezda, dt.big_star].join(" ")} onClick={()=>{tovar.summGolos ? setMyOcenka(3) : console.log('cs')}}></div>
                            <div className={[myOcenka>=4 ? dt.red_zvezda : dt.zvezda, dt.big_star].join(" ")} onClick={()=>{tovar.summGolos ? setMyOcenka(4) : console.log('cs')}}></div>
                            <div className={[myOcenka>=5 ? dt.red_zvezda : dt.zvezda, dt.big_star].join(" ")} onClick={()=>{tovar.summGolos ? setMyOcenka(5) : console.log('cs')}}></div>
                        </div>
                        {tovar.summGolos 
                            ? <div className={dt.btn__ocenitt} onClick={sendOcenka}>Оценить</div> 
                            : <p className={dt.dangerText}>Оценить товар могут только зарегистрированные пользователи!</p>
                        }
                    </div>
            }
        </div>
    )
}

export default TovarDetail
