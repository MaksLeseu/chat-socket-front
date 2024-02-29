import {api} from "./api";

const initialState = {
    messages: []
}

export const chatReducer = (state: any = initialState, action: any) => {
    switch (action.type) {
        case 'messages-received': {
            return {...state, messages: action.messages}
        }
        case 'new-messages-received': {
            return {...state, messages: [...state.messages, action.message]}
        }
        default:
            return state
    }
}

const messagesReceived = (messages: any) => ({type: 'messages-received', messages})
const newMessageReceived = (message: string) => ({type: 'new-messages-received', message})

export const createConnection = (): any => (dispatch: any) => {
    api.createConnection()
    api.subscribe((messages: any) => {
            dispatch(messagesReceived(messages))
        },
        (message: string) => {
            dispatch(newMessageReceived(message))
        })
}
export const destroyConnection = (): any => (dispatch: any) => {
    api.destroyConnection()
}

export const setClientName = (name: string): any => (dispatch: any) => {
    api.sendName(name)
}

export const setClientMessage = (message: string): any => (dispatch: any) => {
    api.sendMessage(message)
}