'use client'
import { useRef, useState } from 'react'
import Image from 'next/image'
import { Wave, Random } from 'react-animated-text'

import { marked } from 'marked'
import parse from 'html-react-parser'
import SearchCard from '@/components/Search'

export default function Home () {
  const messageRef = useRef()

  const [messages, setMessages] = useState([])
  const [displayMessage, setDisplayMessage] = useState(
    'How far? </br> How i fit help you today?'
  )
  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()

    const prompt = messageRef.current.value

    setLoading(true)

    let newMessageList = [
      ...messages,
      {
        role: 'user',
        content: "respond in pidgin english always "+prompt
      }
    ]
    messageRef.current.value = ''
    try {
      const response = await fetch('/api/bot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: newMessageList })
      })

      if (!response.ok) {
        return
      }

      const data = await response.json()

      newMessageList.push({
        role: data.response.message.role,
        content: data.response.message.content
      })

      setMessages(newMessageList)
      setDisplayMessage(data.response.message.content)
      messageRef.current.value = ''
    } catch (error) {
      console.log(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className='md:container mx-auto max-w-5xl px-4'>
      <div className='h-screen mt-5'>
        <div className='md:grid grid-cols-2'>
          <div
            className={`bg-blue-400 relative rounded-2xl py-4 px-4 flex flex-col justify-center items-center text-justify ${loading
              ? 'animate-pulse'
              : ''}`}
          >
            <div className='absolute h-[35px] w-[35px] -z-10 bg-blue-400 -right-[18px] top-[50%] rotate-45' />
            <h3 className='text-2xl text-white bold'>DietGPT say:</h3>
            <p className='text-white'>
              {loading
                ? //  '[DietGPT dey think]'
                  <>
                    <Wave
                      text='DietGPT dey think'
                      effect='stretch'
                      effectChange={5.0}
                    />
                  </>
                : parse(marked(displayMessage))}
            </p>
          </div>

          <div >
            <Image className='sm:top' alt='DietGPT' src='/bot.png' width={512} height={512} />
          </div>
        </div>
        {/* <SearchCard  /> */}
        <form className='mt-6' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-4'>
            <label className='font-bold flex flex-row gap-4'>Yarn Something 
              {/* //  text="🔴 🟡 🟢" */}
                    <Wave
                      text='. . .'
                      effect='jump'
                      effectChange={0.5}
                    />
                  </label>
            <input
              className='px-4 py-2 text-gray-700 placeholder-gray-500 bg-white border border-gray-700 rounded-lg'
              required
              type='text'
              ref={messageRef}
              placeholder='You wan ask or talk something nice?'
            />
          </div>

          <button
            type='submit'
            className='px-4 py-2 mt-2 text-gray-700 bg-gray-100 border border-gray-700 rounded-lg hover:scale-110 transition-all duration-200'
          >
            Send 🚀
          </button>
        </form>
      </div>
      <div className='mt-6'>
        {messages.map(message => {
          return (
            <div key={message.content} className='flex items-center gap-4 py-2'>
              <div className='w-[10%] flex items-center'>
                {message.role === 'assistant'
                  ? <div className='w-[50px] h-[50px] rounded-full overflow-hidden'>
                    <img
                      src='/bot.png'
                      className='w-full h-full object-cover'
                      />
                  </div>
                  : <div className='text-xl font-bold'>You:</div>}
              </div>

              <div className='bg-gray-100 py-2 px-4 border border-gray-400 rounded-xl'>
                {message.content}
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}
