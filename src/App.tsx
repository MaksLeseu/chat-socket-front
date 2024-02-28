import React, {useEffect, useState} from 'react';
import './App.css';
import {io} from "socket.io-client";

type MessagesType = MessageType[] | []

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
  const [message, setMessage] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [sentName, setSentName] = useState<boolean>(false)

  const sendMessageHandler = () => {
    if (message.trim().length !== 0) {
      socket.emit('client-message-sent', message)
      setMessage('')
    }
  }

  const sendNameHandler = () => {
    if (name.trim().length !== 0) {
      socket.emit('client-name-sent', name)
      setSentName(true)
    }
  }

  return (
    <div className="App">
      <div className={'chat'}>
        {messages.map((m, id) => {
          return (
              <div key={id} className={'messagesContainer'}>
                <p>{m.user.name}:</p> {m.message}
              </div>
          )
        })}
      </div>
        <div className={'inputContainer'}>
          <p>{sentName && `The name was set.`}</p>
          <input value={name} placeholder={'name'} onChange={(e) => setName(e.currentTarget.value)}/>
          <button onClick={sendNameHandler}>Send name.</button>
        </div>
        <div className={'textareaContainer'}>
          <textarea className={'textarea'} placeholder={'message'} value={message} onChange={(e) => setMessage(e.currentTarget.value)}></textarea>
          <button disabled={!sentName} onClick={sendMessageHandler}>Send</button>
        </div>
    </div>
  );
}

export default App;
