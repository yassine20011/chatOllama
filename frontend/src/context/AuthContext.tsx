import axiosInstance from '@/conf/axois-instance';
import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";


interface loginInput {
    email: string;
    password: string;
}

interface signupInput {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}


interface AuthContextType {
    isAuth: boolean;
    token: string | null;
    login: (input: loginInput) => Promise<void>;
    signup: (input: signupInput) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    isAuth: false,
    token: null,
    login: async () => { },
    signup: async () => { },
    logout: async () => { },
});


const checkToken = (token: string | null) => {
    
    if (!token) {
        return false;
    }    
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
        return false;
    } else {
        return true;
    }
}


function AuthContextProvider({ children }: any) {
    const [user, setUser] = useState(null);
    const [isAuth, setIsAuth] = useState(checkToken(localStorage.getItem('token')));
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);


    const navigate = useNavigate();
    const login = async (input: loginInput) => {
        // Call login endpoint
        try {
            const response = await axiosInstance.post('/v1/signin', input)
            // If successful, setUser(user)
            if (response.status === 200) {
                console.log(response.data);
                const { token, ...user } = response.data;
                setUser(user);
                setIsAuth(true);
                setToken(token);
                localStorage.setItem('token', token);
                navigate('/chat/c');
                console.log("isAuth", isAuth);
            }
            else {
                setUser(null);
            }
        } catch (error) {
            setUser(null);
            throw error;
        }
    }

    const signup = async (input: signupInput) => {
        // Call signup endpoint
        try {
            const response = await axiosInstance.post('/v1/signup', input)
            // If successful, setUser(user)
            if(response.status==201 ){
                console.log(response.data);
                const { token, ...user } = response.data;
                setUser(user);
                setIsAuth(true);
                setToken(token);
                localStorage.setItem('token', token);
                navigate('/chat/c');
            }
            // Else, setUser(null)
            else{
                setUser(null);
            }
        }catch(error){
            setUser(null);
            throw error
        }
    }

    const logout = async () => {
        setUser(null);
        setIsAuth(false);
        localStorage.removeItem('token');
        navigate('/');
    }

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);

            if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
                logout();
            } else {
                setIsAuth(true);
            }
        } else {
            setIsAuth(false);
            setUser(null);
        }

        setLoading(false);
    }, []);



    const values = {
        isAuth, setIsAuth ,token, login, signup, logout
    }

    return (
        <AuthContext.Provider value={values}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext, AuthContextProvider };