"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import api from "../../lib/api"
import toast from "react-hot-toast"
import { Mail, MailOpen, Archive, Trash2, X } from "lucide-react"

export default function MessagesPage() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [showArchived, setShowArchived] = useState(false)

  useEffect(() => {
    fetchMessages()
  }, [showArchived])

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/contact?archived=${showArchived}`)
      setMessages(res.data.data)
    } catch (error) {
      toast.error("Failed to fetch messages")
    } finally {
      setLoading(false)
    }
  }

  const openMessage = async (message) => {
    setSelectedMessage(message)
    if (!message.isRead) {
      try {
        await api.put(`/contact/${message._id}/read`)
        fetchMessages()
      } catch (error) {
        console.error("Failed to mark as read")
      }
    }
  }

  const archiveMessage = async (id) => {
    try {
      await api.put(`/contact/${id}/archive`)
      toast.success("Message archived")
      setSelectedMessage(null)
      fetchMessages()
    } catch (error) {
      toast.error("Failed to archive message")
    }
  }

  const deleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return
    try {
      await api.delete(`/contact/${id}`)
      toast.success("Message deleted")
      setSelectedMessage(null)
      fetchMessages()
    } catch (error) {
      toast.error("Failed to delete message")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-1">Contact form submissions</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowArchived(false)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              !showArchived ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Inbox
          </button>
          <button
            onClick={() => setShowArchived(true)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              showArchived ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Archived
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="divide-y">
          {messages.map((message) => (
            <div
              key={message._id}
              onClick={() => openMessage(message)}
              className={`px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                !message.isRead ? "bg-blue-50" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {message.isRead ? (
                    <MailOpen className="text-gray-400 mt-1" size={20} />
                  ) : (
                    <Mail className="text-blue-600 mt-1" size={20} />
                  )}
                  <div>
                    <p className={`font-medium ${!message.isRead ? "text-gray-900" : "text-gray-700"}`}>
                      {message.name}
                    </p>
                    <p className="text-sm text-gray-500">{message.email}</p>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-1">{message.subject || message.message}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{format(new Date(message.createdAt), "MMM d, h:mm a")}</span>
              </div>
            </div>
          ))}

          {messages.length === 0 && (
            <div className="px-6 py-12 text-center text-gray-500">
              {showArchived ? "No archived messages" : "No messages yet"}
            </div>
          )}
        </div>
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Message Details</h2>
              <button onClick={() => setSelectedMessage(null)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">From</p>
                  <p className="font-medium text-gray-900">{selectedMessage.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <a href={`mailto:${selectedMessage.email}`} className="font-medium text-blue-600 hover:underline">
                    {selectedMessage.email}
                  </a>
                </div>
                {selectedMessage.phone && (
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{selectedMessage.phone}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium text-gray-900">{format(new Date(selectedMessage.createdAt), "PPpp")}</p>
                </div>
              </div>

              {selectedMessage.subject && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Subject</p>
                  <p className="font-medium text-gray-900">{selectedMessage.subject}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-500 mb-2">Message</p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50">
              <a
                href={`mailto:${selectedMessage.email}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reply
              </a>
              {!selectedMessage.isArchived && (
                <button
                  onClick={() => archiveMessage(selectedMessage._id)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                  <Archive size={18} /> Archive
                </button>
              )}
              <button
                onClick={() => deleteMessage(selectedMessage._id)}
                className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
              >
                <Trash2 size={18} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
