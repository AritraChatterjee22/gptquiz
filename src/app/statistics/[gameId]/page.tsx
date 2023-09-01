import AccuracyCard from '@/components/statistics/AccuracyCard';
import QuestionList from '@/components/statistics/QuestionList';
import ResultsCard from '@/components/statistics/ResultsCard';
import TimeTakenCard from '@/components/statistics/TimeTakenCard';
import { buttonVariants } from '@/components/ui/button';
import { prisma } from '@/lib/db';
import { getAuthSession } from '@/lib/nextauth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { argv0 } from 'process';
import React from 'react'
import { LuLayoutDashboard } from 'react-icons/lu';

type Props = {
    params: {
        gameId: string;
      };
  };

const statisticsPage = async ({params: {gameId}}: Props) => {

  //endpoint protection
  const session = await getAuthSession()
  if(!session?.user){
      return redirect('/')
    }
  const game = await prisma.game.findUnique({
      where: {id: gameId},
      include: {
          questions: true
        }
    })
  if(!game){
      return redirect("/quiz")
    }


  let accuracy: number = 0
  if(game.gameType === 'mcq'){
      let totalCorrect = game.questions.reduce((acc, question) =>{
          if(question.isCorrect){
              return acc + 1;
            }
            return acc;
        }, 0);
      accuracy = (totalCorrect / game.questions.length) * 100;
    } else if(game.gameType === 'open_ended'){
        let totalPercentage = game.questions.reduce((acc, question) =>{
            return acc + (question.percentageCorrect || 0)
          }, 0)
        accuracy = (totalPercentage / game.questions.length)
      }

  accuracy = Math.round(accuracy * 100) / 100


  return (
    <>
      <div className='p-8 mx-auto max-w-7xl'>
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-3xl font-bold tracking-tight'>Statistics</h2>
          <div className='flex items-center space-x-2'>
            <Link href='/dashboard' className={buttonVariants()}>
              <LuLayoutDashboard className='mr-2'/>
              Back To Dashboard
            </Link>
          </div>
        </div>
        <div className='grid gap-4 mt-4 md:grid-cols-7'>
          <ResultsCard accuracy={accuracy}/>
          <AccuracyCard accuracy={accuracy}/>
          <TimeTakenCard timeEnded={new Date()} timeStarted={game.timeStarted}/>
        </div>
        <QuestionList quesitons={game.questions}/>
      </div>
    </>
  )
}

export default statisticsPage
