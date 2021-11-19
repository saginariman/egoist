import React from 'react'
import clad from '../../styles/Admin.module.css'

const AdminModal = ({children, adminModal, setAdminModal}) => {
    var modalCls = [clad.modalAdmin]
    if(adminModal){
        modalCls.push(clad.modalAdminActive)
    }
    const hideAdminModal = ()=>{
        setAdminModal(false)
    }
    return (
        <div className={[modalCls].join(' ')} >
            <div className={clad.modalBefore}></div>
            <div className={clad.containerModal} onClick={hideAdminModal}>
                <div className={clad.contentModal} onClick={(e)=>e.stopPropagation()}>
                    <div className={clad.modalClose} onClick={hideAdminModal}>x</div>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default AdminModal
