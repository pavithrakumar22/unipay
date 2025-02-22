"use client"

import type React from "react"

import { useState } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function CreateEventForm() {
  const [formData, setFormData] = useState({
    organiserId: "",
    name: "",
    description: "",
    date: "",
    location: "",
    amount: "",
    durationToBuyPasses: "",
    numberOfPasses: "",
  })

  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    try {
      const response = await axios.post("http://localhost:5001/api/events/createEvent", formData)
      if (response.data.success) {
        setSuccess(true)
        setFormData({
          organiserId: "",
          name: "",
          description: "",
          date: "",
          location: "",
          amount: "",
          durationToBuyPasses: "",
          numberOfPasses: "",
        })
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message || "An error occurred while creating the event.")
      } else {
        setError("An unexpected error occurred.")
      }
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create New Event</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="organiserId" className="block text-sm font-medium text-gray-700">
              Organiser ID (Phone Number)
            </label>
            <Input
              type="text"
              id="organiserId"
              name="organiserId"
              value={formData.organiserId}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Event Name
            </label>
            <Input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <Input type="datetime-local" id="date" name="date" value={formData.date} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <Input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <Input type="number" id="amount" name="amount" value={formData.amount} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="durationToBuyPasses" className="block text-sm font-medium text-gray-700">
              Duration to Buy Passes (in hours)
            </label>
            <Input
              type="number"
              id="durationToBuyPasses"
              name="durationToBuyPasses"
              value={formData.durationToBuyPasses}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="numberOfPasses" className="block text-sm font-medium text-gray-700">
              Number of Passes
            </label>
            <Input
              type="number"
              id="numberOfPasses"
              name="numberOfPasses"
              value={formData.numberOfPasses}
              onChange={handleChange}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Create Event
          </Button>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {success && <p className="text-green-500 mt-4">Event created successfully!</p>}
      </CardContent>
    </Card>
  )
}

