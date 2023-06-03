import React, { useState } from 'react';
import './ComponentStyles.css';

const Header = () => {

    const [title,setTitle] = useState("Home");
    const [user,setUser] = useState(null);

  return (
    <div className='header'>
        <div className='header_logo'>Company logo</div>
        <div className='header_title'>{title}</div>
        {user && <div className='header_user_icon'>{user.icon}</div>}
    </div>
  )
}

export default Header