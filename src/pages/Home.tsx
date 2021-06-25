import { useHistory } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIconImg from '../assets/images/google-icon.svg'

import { Button } from '../components/Button'

import '../styles/auth.scss'
import { FormEvent } from 'react'
import { useState } from 'react'
import { database } from '../services/firebase'


export function Home() {
  const history = useHistory()
  const { user, signInWithGoogle} = useAuth()
  const [roomCode, setRoomCode] = useState('')

  async function handleCreateRoom() {
      if (!user) {
        await signInWithGoogle()
      }
      
      history.push('/rooms/new')    
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault()

    if (roomCode === '') {
      return
    }

    const roomReference = await database.ref(`rooms/${roomCode}`).get() //busca os dados do código da sala digitado

    if (!roomReference.exists()) {
      alert ("Esta sala não existe!")
      return
    }

    if(roomReference.val().endAt) {
      alert('Sala já encerrada')
      return
    }

    history.push(`rooms/${roomCode}`)

  }
  
  return (
      <div id="page-auth">
        <aside>
          <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
          <strong>Toda pergunta tem uma resposta.</strong>
          <p>Tire as dúvidas da sua audiência em tempo real</p>
        </aside>
        <main>
          <div className="main-content">
            <img src={logoImg} alt="Logo Let me ask" />
            <button onClick={handleCreateRoom} className="create-room">
              <img src={googleIconImg} alt="ícone google" />
              Crie sua sala com o google
            </button>
            <p className="separator">ou entre em uma sala</p>
            <form action="" onSubmit={handleJoinRoom}>
              <input
                type="text"
                placeholder="Digite o código da sala"
                onChange={event => setRoomCode(event.target.value)}
                value={roomCode}
              />
              <Button type="submit">Entrar na sala</Button>
            </form>
          </div>
        </main>
      </div>
  )
}