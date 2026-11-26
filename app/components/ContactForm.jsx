'use client'

import { useState } from 'react'

export default function ContactForm({ onSubmit }) {
  const [formData, setFormData] = useState({ name: '', email: '', whatsapp: '', message: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Enter a valid email'
    if (!formData.whatsapp.trim()) newErrors.whatsapp = 'Whatsapp number is required'
    else if (!/^\+?[\d\s-]{7,}$/.test(formData.whatsapp)) newErrors.whatsapp = 'Enter a valid whatsapp number'
    if (!formData.message.trim()) newErrors.message = 'Message is required'
    return newErrors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setSubmitting(true)
    if (onSubmit) onSubmit(formData)
    setSubmitSuccess(true)
    setSubmitting(false)
  }

  if (submitSuccess) {
    return (
      <div className="text-center py-4 text-green-600 font-medium">
        Thank you! Your message has been sent.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Name
        </label>
        <input
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your name"
          className={`w-full px-3 py-2 border rounded-md ${
            errors.name ? 'border-red-500' : 'border-slate-300'
          } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none`}
        />
        {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Email
        </label>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          className={`w-full px-3 py-2 border rounded-md ${
            errors.email ? 'border-red-500' : 'border-slate-300'
          } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none`}
        />
        {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Whatsapp Number
        </label>
        <input
          name="whatsapp"
          type="tel"
          value={formData.whatsapp}
          onChange={handleChange}
          placeholder="+92 300 0000000"
          className={`w-full px-3 py-2 border rounded-md ${
            errors.whatsapp ? 'border-red-500' : 'border-slate-300'
          } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none`}
        />
        {errors.whatsapp && <p className="text-xs text-red-600 mt-1">{errors.whatsapp}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Message
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Write your message..."
          rows={4}
          className={`w-full px-3 py-2 border rounded-md ${
            errors.message ? 'border-red-500' : 'border-slate-300'
          } focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none`}
        />
        {errors.message && <p className="text-xs text-red-600 mt-1">{errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md font-medium transition-colors"
      >
        {submitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}
