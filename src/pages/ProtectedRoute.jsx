import { useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/FakeAuthContext"
import { useEffect } from "react";

function ProtectedRoute({children}) {
    const {isAuthenticated} = useAuth();
    const navigate = useNavigate();
    
    useEffect(function(){
        if(isAuthenticated) return 
    },[navigate])

    return children;
}

export default ProtectedRoute
