import React from 'react'
import { Card, CardContent, CardHeader } from '../ui/card'
import { LuTarget } from 'react-icons/lu'

type Props = {accuracy: number}

const AccuracyCard = ({accuracy}: Props) => {
  accuracy = Math.round(accuracy * 100) / 100;
  return (
    <Card className='md:col-span-3'>
      <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
        <CardContent className='text-2xl font-bold'>Average Accuracy</CardContent>
        <LuTarget/>
      </CardHeader>
      <CardContent>
        <div className='text-sm font-medium'>
          {accuracy.toString()}%
        </div>
      </CardContent>
    </Card>
  )
}

export default AccuracyCard
