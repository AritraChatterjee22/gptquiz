import React from 'react'
import keyword_extractor from 'keyword-extractor'

type Props = {
    answer: string,
  }

const BLANKS = '_____'

const BlankAnswerInput = ({answer}: Props) => {

  //React useMemo to extract keywords from answer string and shuffle them
  const keywords = React.useMemo(()=>{
      const words = keyword_extractor.extract(answer, {
          language: "english",
          remove_digits: true,
          return_changed_case: false,
          remove_duplicates: false,
        });
      const shuffle = words.sort(()=> Math.random() - 0.5);
      return shuffle.slice(0,2);
    },[answer])
  
  //React useMemo to look through keywords and replace the keyword with blanks
  const answerWithBlanks = React.useMemo(()=>{
      const answerWithBlanks = keywords.reduce((acc, keyword)=>{
          return acc.replaceAll(keyword, BLANKS)
        }, answer)
      return answerWithBlanks
    }, [keywords, answer])
  console.log(answerWithBlanks)

  return (
    <div className='flex justify-start w-full mt-4'>
      <h1 className='text-xl font-semibold'>
        {
          answerWithBlanks.split(BLANKS).map((part, index)=>{
              return (
              <>
                {part}
                {index === answerWithBlanks.split(BLANKS).length - 1 ? null : (
                  <input id='user-blank-input'
                  className='text-center border-b-2 border-black dark:border-white w-28 focus:border-2 focus:border-b-4 focus:outline-none'
                  />
                )}
              </>
              )
            })
        }
      </h1>
    </div>
  )
}

export default BlankAnswerInput
