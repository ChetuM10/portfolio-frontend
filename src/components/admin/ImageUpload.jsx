"use client"

import { useState, useRef } from "react"
import api from "../../lib/api"
import toast from "react-hot-toast"
import { X, ImageIcon } from "lucide-react"

export default function ImageUpload({ value, onChange }) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append("image", file)

    try {
      const res = await api.post("/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      onChange(res.data.data.url)
      toast.success("Image uploaded!")
    } catch (error) {
      toast.error("Failed to upload image")
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleRemove = () => {
    onChange("")
  }

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
        id={`imageUpload-${Math.random()}`}
      />

      {value ? (
        <div className="relative inline-block">
          <img src={value || "/placeholder.svg"} alt="Uploaded" className="w-32 h-32 object-cover rounded-lg" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <label
          htmlFor={fileInputRef.current?.id || "imageUpload"}
          className={`flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors ${
            uploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          ) : (
            <>
              <ImageIcon className="text-gray-400 mb-2" size={24} />
              <span className="text-xs text-gray-500">Upload Image</span>
            </>
          )}
        </label>
      )}
    </div>
  )
}
