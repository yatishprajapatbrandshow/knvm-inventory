
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';


export function SidebarLinks(props) {
    const navigate = useNavigate();
    useEffect(()=>{        
        function logoutUser() {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        }
        logoutUser()
    })
  
  return;
}

export default SidebarLinks;
