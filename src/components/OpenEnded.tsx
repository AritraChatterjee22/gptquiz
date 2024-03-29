'use client'
import React from 'react'
import {Game, Question} from "@prisma/client"
import { LuChevronRight, LuTimer, LuLoader2, LuBarChart } from 'react-icons/lu'
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card'
import { differenceInSeconds } from "date-fns"
import {useMutation} from "@tanstack/react-query"
import { Button, buttonVariants } from './ui/button'
import { cn, formatTimeDelta } from '@/lib/utils'
import { useToast } from './ui/use-toast'
import { z } from 'zod'
import { checkAnswerSchema } from '@/schemas/form/quiz'
import axios from "axios"
import BlankAnswerInput from './BlankAnswerInput'
import Link from "next/link";


type Props = {
    game: Game & {questions: Pick<Question, 'id' | 'question' | 'answer'>}
  }

const OpenEnded = ({game}: Props) => {

  //react state for question number
  const [questionIndex, setQuestionIndex] = React.useState(0);

  //react state for end of quiz
  const [hasEnded, setHasEnded] = React.useState<boolean>(false)

  //react state for current time 
  const [now, setNow] = React.useState<Date>(new Date());

  //react state for blank answers
  const [blankAnswer, setBlackAnswer] = React.useState<string>("")


  //shadcn toast
  const {toast} = useToast()


//react useEffect to upadte the state now
React.useEffect(()=>{
    const interval = setInterval(()=>{
        if(!hasEnded){
            setNow(new Date())
          }
      }, 1000)
    return ()=>{
        clearInterval(interval)
      }
  },[hasEnded])


  const currentQuestion = React.useMemo(()=>{
      return game.questions[questionIndex]
    },[questionIndex, game.questions])

  //using mutation and checking the correct answer from endpoint
  const {mutate: checkAnswer, isLoading: isChecking} = useMutation({
      mutationFn: async () =>{
          let filledAnswer = blankAnswer
          document.querySelectorAll('#user-blank-input').forEach(input => {
              filledAnswer = filledAnswer.replace("_____", input.value)
              input.value = ""
            })
          const payload: z.infer<typeof checkAnswerSchema> = {
              questionId: currentQuestion.id,
              userAnswer: filledAnswer,
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
          onSuccess: ({percentageSimilar})=>{
                  toast({
                      title: `Your answer is ${percentageSimilar}% similar to the correct answer.`,
                      description: "Answers are matched based on similarity comparisons",
                    })
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
                   if(event.key === 'Enter'){
                      handleNext();
                    }
      }
      document.addEventListener('keydown', handleKeyDown)
      return () =>{
          document.removeEventListener("keydown", ()=> {});
        }
    },[handleNext]);



  if(hasEnded) {
      return(
        <div className='absolute flex flex-col justify-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
          <div className='px-4 mt-2 font-semibold text-white bg-green-500 rounded-md whitespace-nowrap'>
            You completed in {' '}
            {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
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
          {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
        </div>
        </div>
        {/*<MCQCounter correctAnswers={correctAnswers} wrongAnswers={wrongAnswers}/> */}
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
        <BlankAnswerInput answer={currentQuestion.answer} setBlackAnswer={setBlackAnswer}/>
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

export default OpenEnded
