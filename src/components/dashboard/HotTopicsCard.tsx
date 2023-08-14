import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'

type Props = {}

const HotTopicsCard = (props: Props) => {
  return (
    <Card className='col-span-4'>
      <CardHeader>
        <CardTitle className='text-2xl font-bold'>Hot Topics</CardTitle>
        <CardDescription>
          Click on a topic to start a quiz on it!
        </CardDescription>
      </CardHeader>
      <CardContent className='pl-2'>Hot Topics go here</CardContent>
    </Card>
  )
}

export default HotTopicsCard
