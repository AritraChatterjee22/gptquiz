'use client'
import { Game, Question } from '@prisma/client'
import React from 'react'
import { LuChevronRight, LuTimer } from 'react-icons/lu'
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import MCQCounter from './MCQCounter'
import {useMutation} from "@tanstack/react-query"
import axios from "axios"
import { z } from 'zod'
import { checkAnswerSchema } from '@/schemas/form/quiz'

type Props = {
    game: Game & {questions: Pick<Question, 'id' | 'options' | 'question'>[]}
  }

const MCQ = ({game}: Props) => {
  const [questionIndex, setQuestionIndex] = React.useState(0);
  const [selectedChoice, setSelectedChoice] = React.useState<number>(0)

  const currentQuestion = React.useMemo(()=>{
      return game.questions[questionIndex]
    },[questionIndex, game.questions])

  const {mutate: checkAnswer, isLoading: isChecking} = useMutation({
      mutationFn: async () =>{
          const payload: z.infer<typeof checkAnswerSchema> = {
              questionId: currentQuestion.id,
              userAnswer: options[selectedChoice],

            }
          const response = await axios.post('/api/checkAnswer', payload)
        }
    })

  const options = React.useMemo(()=>{
      if(!currentQuestion) return []
      if(!currentQuestion.options) return []
      return JSON.parse(currentQuestion.options as string) as string[];
    },[currentQuestion])

  return (
    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-[80vw] max-w-4xl w-[90vw]'>
      <div className='flex flex-row justify-between'>
      <div className='flex flex-col'>
        {/*Topic*/}
        <p>
          <span className='text-slate-400 mr-2'>Topic</span>
          <span className='px-2 py-1 text-white rounded-lg bg-slate-800'>{game.topic}</span>
        </p>
        <div className='flex self-start mt-3 text-slate-400'>
          <LuTimer className='mr-2'/>
          <span>00:00</span>
        </div>
        </div>
        <MCQCounter correctAnswers={3} wrongAnswers={3}/>
      </div>
      <Card className='w-full mt-4'>
        <CardHeader className='flex flex-row items-center'>
          <CardTitle className='mr-5 text-center divide-y divide-zinc-800/50'>
            <div>{questionIndex + 1}</div>
            <div className='text-base text-slate-400'>
              {game.questions.length}
            </div>
          </CardTitle>
          <CardDescription className='flex-grow text-lg'>
            {currentQuestion.question}
          </CardDescription>
        </CardHeader>
      </Card>
      <div className='flex flex-col items-center justify-center w-full mt-4'>
        {options.map((option, index) =>{
            return(
              <Button key={index}
              className='justify-start w-full py-8 mb-4'
              variant={selectedChoice === index ? 'default' : 'secondary'}
              onClick={()=>{
                  setSelectedChoice(index);
                }}
              >
                <div className='flex items-center justify-start'>
                  <div className='p-2 px-3 mr-5 border rounded-md'>
                    {index + 1}
                  </div>
                  <div className='text-start'>{option}</div>
                </div>
              </Button>
            )
          })}
          <Button
          className='mt-2'
          >
            Next <LuChevronRight className='w-4 h-4 ml-2'/>
          </Button>
      </div>
    </div>
  )
}

export default MCQ
