'use client'
import { Game, Question } from '@prisma/client'
import React from 'react'
import { LuChevronRight, LuTimer, LuLoader2, LuBarChart } from 'react-icons/lu'
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button, buttonVariants } from './ui/button'
import MCQCounter from './MCQCounter'
import {useMutation} from "@tanstack/react-query"
import axios from "axios"
import { z } from 'zod'
import { checkAnswerSchema } from '@/schemas/form/quiz'
import { useToast } from './ui/use-toast'
import Link from "next/link";
import { cn } from '@/lib/utils'

type Props = {
    game: Game & {questions: Pick<Question, 'id' | 'options' | 'question'>[]}
  }

const MCQ = ({game}: Props) => {
  //react state for question number
  const [questionIndex, setQuestionIndex] = React.useState(0);
  
  //react state for selecting an option
  const [selectedChoice, setSelectedChoice] = React.useState<number>(0)

  //react state to count correct answers
  const [correctAnswers, setCorrectAnswers] = React.useState<number>(0)

  //react state to count the wrong answers
  const [wrongAnswers, setWrongAnswers] = React.useState<number>(0)

  //react state for end of quiz
  const [hasEnded, setHasEnded] = React.useState<boolean>(false)

  //shadcn toast
  const {toast} = useToast()

  const currentQuestion = React.useMemo(()=>{
      return game.questions[questionIndex]
    },[questionIndex, game.questions])
  

  //using mutation and checking the correct answer from endpoint
  const {mutate: checkAnswer, isLoading: isChecking} = useMutation({
      mutationFn: async () =>{
          const payload: z.infer<typeof checkAnswerSchema> = {
              questionId: currentQuestion.id,
              userAnswer: options[selectedChoice],
            }
          const response = await axios.post('/api/checkAnswer', payload);
          return response.data
        }
    })
  
  //shadcn toast for correct or wrong answers
  //counting correct answers
  //increasing the index of questions
  const handleNext = React.useCallback(()=>{
      if(isChecking) return;
      checkAnswer(undefined, {
          onSuccess: ({isCorrect})=>{
              if(isCorrect){
                  toast({
                      title: "Correct!",
                      description: "Correct Answer",
                      variant: 'success',
                    })
                  setCorrectAnswers((prev) => prev + 1)
                } else {
                    toast({
                        title: "Incorrect!",
                        description: "Incorrect Answer",
                        variant: "destructive",
                      })
                    setWrongAnswers((prev) => prev + 1)
                  }
                  if(questionIndex === game.questions.length - 1){
                      setHasEnded(true);
                      return;
                    }
                  setQuestionIndex((prev) => prev + 1)
            }
        })
    },[checkAnswer, toast, isChecking, questionIndex, game.questions.length])

  
  //Adding keyboard controls
  React.useEffect(()=>{
    const handleKeyDown = (event: KeyboardEvent) => {
          if(event.key === '1'){
              setSelectedChoice(0);
            } else if(event.key === '2') {
                setSelectedChoice(1);
              }
              else if(event.key === '3'){
                  setSelectedChoice(2);
                }
                else if(event.key === '4'){
                    setSelectedChoice(3);
                  }
                  else if(event.key === 'Enter'){
                      handleNext();
                    }
      }
      document.addEventListener('keydown', handleKeyDown)
      return () =>{
          document.removeEventListener("keydown", ()=> {});
        }
    },[handleNext]);


  const options = React.useMemo(()=>{
      if(!currentQuestion) return []
      if(!currentQuestion.options) return []
      return JSON.parse(currentQuestion.options as string) as string[];
    },[currentQuestion])

  if(hasEnded) {
      return(
        <div className='absolute flex flex-col justify-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
          <div className='px-4 mt-2 font-semibold text-white bg-green-500 rounded-md whitespace-nowrap'>
            You completed in {'6 mins 9 secs'}
          </div>
          <Link href={`/statistics/${game.id}`} className={cn(buttonVariants(),'mt-2')}>
            View Statistics
            <LuBarChart className='w-4 h-4 ml-2'/>
          </Link>
        </div>
      )
    }

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
        <MCQCounter correctAnswers={correctAnswers} wrongAnswers={wrongAnswers}/>
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
          disabled = {isChecking}
          onClick={()=>{
              handleNext();
            }}
          >
          {isChecking && <LuLoader2 className='w-4 h-4 mr-2 animate-spin'/>}
            Next <LuChevronRight className='w-4 h-4 ml-2'/>
          </Button>
      </div>
    </div>
  )
}

export default MCQ
