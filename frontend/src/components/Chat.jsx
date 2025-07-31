import { useState, useEffect } from 'react'
import axios from 'axios'
import BubbleChat from './BubbleChat'

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const fetchChatHistory = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/chat/get-chat`, {
        withCredentials: true
      })
      
      if (response.data.chatHistory && response.data.chatHistory.length > 0) {
        setMessages(response.data.chatHistory)
        localStorage.setItem('chatMessages', JSON.stringify(response.data.chatHistory))
      }
    } catch (error) {
      console.error('Error fetching chat history:', error)
    }
  }

  const handleDeleteChat = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/chat/delete-chat`, {
        withCredentials: true
      })
      
      setMessages([])
      localStorage.removeItem('chatMessages')
    } catch (error) {
      console.error('Error deleting chat:', error)
    }
  }

  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages')
    if (savedMessages) {
      const parsedMessages = JSON.parse(savedMessages)
      setMessages(parsedMessages)
      
      if (parsedMessages.length > 0) {
        fetchChatHistory()
      }
    } else {
      fetchChatHistory()
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages))
  }, [messages])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const userMessage = {
      id: Date.now(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setNewMessage('')
    setIsLoading(true)

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_DOMAIN}/api/chat/message`, {
        message: newMessage,
        chatHistory: messages
      }, {
        withCredentials: true
      })

      const aiMessage = {
        id: Date.now() + 1,
        text: response.data.response,
        sender: 'ai',
        timestamp: new Date().toISOString()
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        {messages.length > 0 && (
          <button
            onClick={handleDeleteChat}
            className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Clear Chat
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <p>Start a conversation with AI Customer Service</p>
          </div>
        ) : (
          messages.map((message,index) => (
            <div key={message.id} className={`flex w-full ${message.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
              <BubbleChat 
                color={message.sender === 'user' ? 'blue' : 'green'} 
                content={message.text} 
                className={message.sender === 'user' ? 'rounded-bl-none' : 'rounded-br-none'}
              />
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-2xl bg-gray-100">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      <form onSubmit={handleSendMessage} className="p-6 border-t border-gray-200">
        <div className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !newMessage.trim()}
            className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}
