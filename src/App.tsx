import React from 'react'

import { useState } from 'react'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import './App.css'
import { History, SendSms } from './modules'

const queryClient = new QueryClient()

function App() {
  const [activeTab, setActiveTab] = useState<'sendSms' | 'history'>('sendSms')
  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ display: 'flex', gap: 4, alignContent: 'center', justifyContent: 'center' }}>
        <button onClick={() => setActiveTab('sendSms')}>
          Send an SMS
        </button>
        <button onClick={() => setActiveTab('history')}>
          View SMS history
        </button>
      </div>
      <div style={{ padding: 4 }}>
        {
          activeTab === 'history' ?
            <History />
            : <SendSms />
        }
      </div>
    </QueryClientProvider>
  )
}

export default App
