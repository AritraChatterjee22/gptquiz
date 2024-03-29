"use client"
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { LuBrainCircuit } from 'react-icons/lu'
import { useRouter } from 'next/navigation'

type Props = {}

const GptQuizCard = (props: Props) => {
  const router = useRouter()
  return (
    <Card className='hover:cursor-pointer hover:opacity-75' onClick={()=>{
        router.push("/quiz")
      }}>
      <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
        <CardTitle className='text-2xl font-bold'>Take a Quiz!</CardTitle>
        <LuBrainCircuit size={28} strokeWidth={2.5}/>
      </CardHeader>
      <CardContent>
        <p className='text-sm text-muted-foreground'>
          Challenge yourself with a quiz!
        </p>
      </CardContent>
    </Card>
  )
}

export default GptQuizCard
