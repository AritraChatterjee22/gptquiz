import React from 'react'

type Props = {
    params: {
        gameId: string;
      }
  }

const MCQPage = async ({params: {gameId}}: Props) => {
  return (
    <div>{gameId}</div>
  )
}

export default MCQPage
