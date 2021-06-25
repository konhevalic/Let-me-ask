import {useHistory, useParams} from 'react-router-dom'
import { Button } from '../components/Button'
import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'
import checkimg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'
import '../styles/room.scss'
import { RoomCode } from '../components/RoomCode'
//import { useAuth } from '../hooks/useAuth'
import { Question } from '../components/Question'
import { useRoom } from '../hooks/useRoom'
import { database } from '../services/firebase'

type RoomParams = {
  id: string
}

export function AdminRoom() {
  //const {user} = useAuth()
  const history = useHistory()
  const params = useParams<RoomParams>()
  const roomId = params.id

  //hook para carregar os dados da sala 
  const {title, questions} = useRoom(roomId)

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endAt: new Date()
    })
    history.push('/')
  }

  async function handleDeleteQuestion(questionId: string) {
    if(window.confirm("Tem certeza que deseja remover esta pergunta?")){
      await  database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
    }
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await  database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true
    })
  }

  async function handleHighlightuestion(questionId: string) {
    await  database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true
    })
  }

    return (
      <div id="page-room">
        <header>
          <div className="content">
            <img src={logoImg} alt="Logo Let me ask" />
            <div>
                <RoomCode code={roomId}/>
                <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
            </div>
            
          </div>
        </header>

        <main>
          <div className="room-title">
            <h1>Sala {title}</h1>
            {
              questions.length > 0 && <span>{questions.length} pergunta(s)</span>
            }
          </div>

          <div className="question-list">
            {questions.map((question) => {
              return (
                <Question 
                  key = {question.id}
                  content={question.content}
                  author={question.author}
                  isAnswered={question.isAnswered}
                  isHighlighted={question.isHighlighted}
                >
                  {
                    !question.isAnswered  && (
                      <>
                        <button
                        type="button"
                        onClick={() => handleCheckQuestionAsAnswered(question.id)}
                      >
                        <img src={checkimg} alt="Remover pergunta" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleHighlightuestion(question.id)}
                      >
                        <img src={answerImg} alt="Remover pergunta" />
                      </button>
                      </>
                    )
                  }
                  <button
                    type="button"
                    onClick={() => handleDeleteQuestion(question.id)}
                  >
                    <img src={deleteImg} alt="Remover pergunta" />
                  </button>
                </Question>
              )
            })}
          </div>
        </main>
          
      </div>
    )
}