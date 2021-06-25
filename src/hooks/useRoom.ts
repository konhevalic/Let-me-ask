import { useEffect } from "react"
import { useState } from "react"
import { database } from "../services/firebase"
import { useAuth } from "./useAuth"

type QuestionType = {
  id: string
  author: {
    name: string
    avatar: string
  }
  content: string
  isAnswered: boolean
  isHighlighted: boolean
  likeCount: number
  likeId: string | undefined
}

type FirebaseQuestions = Record<string, {
  author: {
    name: string
    avatar: string
  }
  content: string
  isAnswered: boolean
  isHighlighted: boolean
  likes: Record<string, {
    authorId: string
  }>
}>


export function useRoom(roomId: string) {
  const { user} = useAuth()
  //<Question[]> generic, serve para passar o tipo do vetor ao estado
  const [questions, setQuestions] = useState<QuestionType[]>([])
  const [title, setTitle] = useState('')

  useEffect(() => {
    const roomReference = database.ref(`rooms/${roomId}`)

    //buscar dados das perguntas. Método feito pela documentação do firebase
    roomReference.on('value', room => {
      const databaseRoom = room.val()
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {}
      //transformar o retorno de objeto para array
      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered,
          likeCount: Object.values(value.likes ?? {}).length,
          likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]

        }
      })
      setTitle(databaseRoom.title)
      setQuestions(parsedQuestions)
    })

    //remover os eventListeners dessa sala
    return () => {
      roomReference.off('value')
    }
    
  }, [roomId, user?.id])

  return {questions, title}
}