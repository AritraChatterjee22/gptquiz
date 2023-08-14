import SignInButton from '@/components/SignInButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getAuthSession } from '@/lib/nextauth'
import { redirect}  from 'next/navigation'

export default async function Home() {
  const session = await getAuthSession()
  if(session?.user) {
      //Then user is in 
      return redirect('/dashboard') 
    }
  return (
    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
      <Card className='w-[300px]'>
        <CardHeader>
          <CardTitle>Welcome to GptQuiz!</CardTitle>
          <CardDescription>
            GptQuiz is a quiz app that lets you to create and share quiz with your friends.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignInButton text='Sign In with Google'/>
        </CardContent>
      </Card>
    </div>
  )
}
