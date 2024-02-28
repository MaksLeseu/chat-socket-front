import React, {useEffect, useState} from 'react';
import './App.css';
import {io} from "socket.io-client";

type MessagesType = MessageType[]

type MessageType = {
  message: string, id: string, user: {id: string, name: string}
}

const socket = io('http://localhost:3009/')

function App() {

  useEffect(() => {
    socket.on('init-messages-published', (messages) => {
      setMessages(messages)
    })
    return () => {
      socket.off('new-massage-sent')
    }
  }, [])

  useEffect(() => {
    const handleNewMessage = (message: any) => {
      setMessages((messages) => [...messages, message])
    }
    socket.on('new-massage-sent', handleNewMessage)

    return () => {
      socket.off('new-massage-sent', handleNewMessage)
    }
  }, [])

  const [messages, setMessages] = useState<MessagesType>([])

  const [messageMax, setMessageMax] = useState<string>('')
  const [messageDimych, setMessageDimych] = useState<string>('')

  const sendMessageHandler = (params: 'max' | 'dimych') => {
    const obj = {
      'max': () => {
        if (messageMax.trim().length !== 0) {
          socket.emit('client-message-sent-max', messageMax)
          setMessageMax('')
        }
      },
      'dimych': () => {
        if (messageDimych.trim().length !== 0) {
          socket.emit('client-message-sent-dimych', messageDimych)
          setMessageDimych('')
        }
      }
    }
    obj[params]()
  }

  return (
    <div className="App">
      <div className={'chat'}>
        {messages.map((m, id) => {
          return (
              <div key={id}>
                <b>{m.user.name}</b> {m.message}
                  <hr/>
              </div>
          )
        })}
      </div>
        <div className={'max'}>

          Max
          <textarea className={'textarea'} value={messageMax} onChange={(e) => setMessageMax(e.currentTarget.value)}></textarea>
          <button onClick={() => sendMessageHandler('max')}>Send</button>
        </div>
      <div>
        Dimych
        <textarea className={'textarea'} value={messageDimych} onChange={(e) => setMessageDimych(e.currentTarget.value)}></textarea>
        <button onClick={() => sendMessageHandler('dimych')}>Send</button>
      </div>
    </div>
  );
}

export default App;
