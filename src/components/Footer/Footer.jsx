import React from 'react'
import Loader from '../Loader/Loader';
import ftCl from './footer.module.css';

const Footer = ({socials, isLoadingSocailas, errorSocials}) => {
    return (
        <div className={ftCl.footer}>
            <span>&copy; All rights reserved ~ Nariman {new Date().getFullYear()}</span>
            <div className={ftCl.socials}>
                {isLoadingSocailas
                    ?<span style={{color: 'white'}}>загрузка наших соц. сетей...</span>
                    :
                    errorSocials
                        ? <span style={{color: 'tomato'}}>Ошибка загрузки ~ {errorSocials}</span>
                        :
                        socials.map((item, index)=>
                            <a key={index} target="_blank" href={item.url} rel="noreferrer">
                                <img src={item.img} className={ftCl.img} alt={item.url}/>
                            </a>
                        )
                }
            </div>
        </div>
    )
}

export default Footer
