import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

interface AuthProps {
    authState?: {token: string | null; authenticated: boolean | null};
    onRegister?: (nik: string, password: string) => Promise<any>;
    onLogin?: (nik: string, password: string) => Promise<any>;
    onLogout?: () => Promise<any>;
}

export const TOKEN_KEY = 'my-jwt';
export const USER_DATA = 'itsme';
export const API_URL = 'http://handbook-credo.id/';
// export const API_URL = 'http://192.168.1.6/hih_admin/';
const AuthContext = createContext<AuthProps>({});


export const useAuth = () => {
    return useContext(AuthContext); 
}

export const AuthProvider = ({children}: any) => {
    const [authState, setAuthState] = useState<{ 
        token: string | null;
        authenticated: boolean | null;
    }>({
        token: null,
        authenticated: null,
    })

    useEffect(() => {
        const loadToken = async () => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY)

            if (token) {
                axios.defaults.headers.common['Authorization'] = token

                setAuthState({
                    token: token,
                    authenticated: true
                })
            }
        }

        loadToken()
    }, [])

    const register =async (nik:string, password:string) => {
        try {
            return await axios.post(`${API_URL}users`, {nik, password});
        } catch(e) {
            return {error: true, msg: (e as any).response.data.msg}
        }
    }

    const login = async (nik:string, password:string) => {
        try {
            const result = await axios.post(`${API_URL}appauth`, {nik, password});
            
            setAuthState({
                token: result.data.token,
                authenticated: true
            })
            
            axios.defaults.headers.common['Authorization'] = result.data.token;
            await SecureStore.setItemAsync(TOKEN_KEY, result.data.token)
            await SecureStore.setItemAsync(USER_DATA, JSON.stringify(result.data.data))

            return result
        } catch(e) {
            return {error: true, msg: (e as any).response.data.message}
        }
    }

    const logout = async () => {
        await SecureStore.deleteItemAsync(TOKEN_KEY)
        await SecureStore.deleteItemAsync(USER_DATA)
        axios.defaults.headers.common['Authorization'] = ''
        setAuthState({
            token: null,
            authenticated: false
        })
    }

    const value = {
        onRegister: register,
        onLogin: login,
        onLogout: logout,
        authState
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}