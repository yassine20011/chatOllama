import { Navigate, Outlet } from 'react-router-dom';
import  useAuth  from '@/hooks/useAuth';


const PrivateRoute = () => {
    const { isAuth } = useAuth();
    // If authorized, return an outlet that will render child elements
    // If not, return element that will navigate to login page
    return isAuth ? <Outlet /> : <Navigate to="/signin" />;
}

export default PrivateRoute;