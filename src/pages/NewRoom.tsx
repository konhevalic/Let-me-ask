import {Link, useHistory} from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { FormEvent } from 'react'

import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'

import { Button } from '../components/Button'

import '../styles/auth.scss'
import { useState } from 'react'
import { database } from '../services/firebase'


export function NewRoom() {
  const {user} = useAuth()
  const history = useHistory()
  const [newRoom, setNewRoom] = useState('')

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault() //nao redireciona ao enviar o formulario

    if (newRoom.trim() === '') {
      return
    }

    //cria uma referência no banco de dados. Em banco de dados relacional, seria uma tabela nova sendo criada
    const roomReference = database.ref('rooms')

    //adiciona ao banco de dados uma nova sala criada na linha acima
    const firebaseRoom = await roomReference.push({
      title: newRoom,
      authorId: user?.id
    })

    history.push(`/rooms/${firebaseRoom.key}`)
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
            <h2>Criar uma nova sala</h2>
            <form onSubmit={handleCreateRoom}>
              <input
                type="text"
                placeholder="Nome da sala"
                // autaliza o valor do estado quando o usuário começa a digitar, no caso, a "mudança do estado"
                onChange = {event => setNewRoom(event.target.value)} 
                //atribui o valor do input ao estado
                value={newRoom}
              />
              <Button type="submit">Criar sala</Button>
            </form>
            <p>Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link></p>
          </div>
        </main>
      </div>
  )
}