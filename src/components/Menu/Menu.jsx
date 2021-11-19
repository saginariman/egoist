import React from 'react'
import { MdKeyboardArrowRight, MdOutlineCoffee } from 'react-icons/md';
import { Link } from 'react-router-dom';
import menuCl from './menu.module.css';
import { useNavigate } from 'react-router-dom'

const Menu = ({menuSwitch, setMenuSwitch, menu_items, categories}) => {
    var clstyle = [menuCl.menu__body]
    if(menuSwitch){
        clstyle.push(menuCl.menu__active)
    }
    const navigate = useNavigate();
    return (
        <div className={clstyle.join(' ')}>
            <div className={menuCl.menu__container}>
                <div className={menuCl.menu__container__before} onClick={()=>{setMenuSwitch(false)}}></div>
                <div className={[menuCl.menu__content, menuCl.container_scroll].join(' ')}>
                    {menu_items.map((item, index)=>
                        <Link to={item.url} className={menuCl.menu__category} key={index} onClick={()=>{setMenuSwitch(false)}}>
                            {item.icon}
                            <span>{item.name}</span>
                            <MdKeyboardArrowRight/>
                        </Link>
                    )}
                    {categories.map((item, index)=>
                        <div
                            className={menuCl.menu__category} 
                            key={index} 
                            onClick={()=>{navigate(`/cat${item.id}`, {state: item.name});setMenuSwitch(false)}}>
                            <MdOutlineCoffee/>
                            <span>{item.name}</span>
                            <MdKeyboardArrowRight/>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Menu
