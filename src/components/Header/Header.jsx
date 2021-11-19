import React from 'react'
import cl from './header.module.css';
import { MdMenu, MdLocalCafe} from 'react-icons/md';

const Header = ({bigTitle, littleTitle, showMenu}) => {
    return (
        <div className={cl.header}>
            <div className={cl.icon__menu}><MdMenu className={cl.menu} onClick={()=>{showMenu(true)}}/></div>
            <div className={cl.header__titles}>
                <MdLocalCafe style={{fontSize:'200%'}}/>
                <div className={cl.header__big__title}>{bigTitle}</div>
                <div className={cl.header__little_title}>{littleTitle}</div>
            </div>
        </div>
    )
}

export default Header
