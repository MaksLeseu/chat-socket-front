import React, {useEffect, useRef, useState} from 'react';
import './App.css';
import {Provider, useDispatch, useSelector} from "react-redux";
import {chatReducer, createConnection, destroyConnection, setClientMessage, setClientName} from "./chat-reducer";
import {combineReducers, legacy_createStore} from "redux";
import {AppRootStateType} from "./index";

function App() {

  const dispatch = useDispatch()
  const messages = useSelector((state: AppRootStateType) => state.chat.messages)

  useEffect(() => {
    dispatch(createConnection())
    return () => {
      dispatch(destroyConnection())
    }
  }, [])

  const [message, setMessage] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [sentName, setSentName] = useState<boolean>(false)

  useEffect(() => {
    messagesAnchorRef.current?.scrollIntoView({behavior: 'smooth'})
  }, [messages])

  const messagesAnchorRef = useRef<any>(null)

  const sendMessageHandler = () => {
    if (message.trim().length !== 0) {
      dispatch(setClientMessage(message))
      setMessage('')
    }
  }

  const sendNameHandler = () => {
    if (name.trim().length !== 0) {
      dispatch(setClientName(name))
      setSentName(true)
    }
  }

  return (
      <div className="App">
        <div className={'chat'}>
          {messages.map((m: any, id: any) => {
            return (
                <div key={id} className={'messagesContainer'}>
                  <p>{m.user.name}:</p> {m.message}
                </div>
            )
          })}
          <div ref={messagesAnchorRef}></div>
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
