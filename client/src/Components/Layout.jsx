import React from 'react'
import Siderbar from './Siderbar'
import Main from './Main'
import Account from './Account'

const Layout = () => {
    return (
        <div className='layout'>
            <Siderbar />
            <div className='container'>
                <Main />
                <Account />
            </div>
        </div>
    )
}

export default Layout