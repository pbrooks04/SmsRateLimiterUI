import React, { useState, useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'

import { sendSms, type SmsRequest } from '../api'

export function SendSms() {
  const [formData, setFormData] = useState<SmsRequest>({
    accountId: '',
    phonenumber: '',
    message: '',
  })

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }, [setFormData])

  const sendSmsMutation = useMutation({
    mutationFn: sendSms,
    onSuccess: () => {
      setFormData({
        accountId: '',
        phonenumber: '',
        message: '',
      })
      alert('Sent SMS')
    },
  })

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    // Prevent the browser from reloading.
    e.preventDefault()

    await sendSmsMutation.mutateAsync(formData)
  }, [sendSmsMutation])

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Send SMS</h2>

      <div style={fieldContainerStyle}>
        <label htmlFor='accountId' style={labelStyle}>Account ID:</label>
        <input
          type='text'
          id='accountId'
          name='accountId'
          value={formData.accountId}
          onChange={handleChange}
          required
          style={inputStyle}
        />
      </div>

      <div style={fieldContainerStyle}>
        <label htmlFor='phonenumber' style={labelStyle}>Phone Number:</label>
        <input
          type='tel'
          id='phonenumber'
          name='phonenumber'
          value={formData.phonenumber}
          onChange={handleChange}
          pattern='\d{10}'
          title='Enter a 10-digit phone number'
          required
          style={inputStyle}
        />
      </div>

      <div style={fieldContainerStyle}>
        <label htmlFor='message' style={labelStyle}>Message:</label>
        <textarea
          id='message'
          name='message'
          value={formData.message}
          onChange={handleChange}
          required
          rows={4}
          style={textareaStyle}
        />
      </div>

      <button type='submit' style={buttonStyle}>Send</button>
    </form>
  )
}

const formStyle: React.CSSProperties = {
  margin: '0 auto',
  padding: '16px',
  border: '1px solid #ccc',
  borderRadius: '8px',
}

const fieldContainerStyle: React.CSSProperties = {
  marginBottom: '12px',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '4px',
  fontWeight: 'bold',
}

const inputStyle: React.CSSProperties = {
  width: '80%',
  padding: '8px',
  borderRadius: '4px',
  border: '1px solid #ccc',
}

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: 'vertical',
}

const buttonStyle: React.CSSProperties = {
  padding: '10px 16px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
}


