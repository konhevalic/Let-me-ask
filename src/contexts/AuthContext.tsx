import { useState } from "react"
import { useEffect } from "react"
import { createContext, ReactNode } from "react"
import { auth, firebase } from "../services/firebase"

type User = {
    id: string
    name: string
    avatar: string
  }
  
  type AuthContextType = {
    user: User | undefined;
    signInWithGoogle: () => void
  }

  type AuthContextProviderProps = {
      children: ReactNode
  }

//armazena o formato do contexto que será informado
export const AuthContext = createContext({} as AuthContextType)

export function AuthContextProvider(props: AuthContextProviderProps) {
    const [user, setUser] = useState<User>()

    useEffect(() => {
      //monitora no firebase se já existia algum usuário pré logado
      const unsubscribe = auth.onAuthStateChanged(user => {
        //se ja houver algum usuario pré logado, entao realiza o login novamente automatico
        if(user) {
          const { displayName, photoURL, uid} = user
  
            if (!displayName || !photoURL) {
              throw new Error ("Informação faltante do google.")
            }
  
            setUser({
              id: uid,
              name: displayName,
              avatar: photoURL
            })
        }
      })
  
      return () => {
        unsubscribe()
      }
    }, [])
  
    function signInWithGoogle() {
      //autenticar usuario:
      const provider = new firebase.auth.GoogleAuthProvider()
  
      //abre login do google como pop-up ao inves de redirecionar para outro link fazer o login
      auth.signInWithPopup(provider)
        .then(res => {
          if (res.user) {
            const { displayName, photoURL, uid} = res.user
  
            if (!displayName || !photoURL) {
              throw new Error ("Informação faltante do google.")
            }
  
            setUser({
              id: uid,
              name: displayName,
              avatar: photoURL
            })
          }
      })    
    }


    return (
        <AuthContext.Provider value={ { user, signInWithGoogle } }>
            {props.children}
        </AuthContext.Provider>
    )
}