"use client"

import { useState, useEffect, useRef } from "react"
import api from "../../lib/api"
import toast from "react-hot-toast"
import { Upload, Trash2, Copy, ImageIcon } from "lucide-react"

export default function MediaPage() {
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    fetchMedia()
  }, [])

  const fetchMedia = async () => {
    try {
      const res = await api.get("/upload/media")
      setMedia(res.data.data)
    } catch (error) {
      toast.error("Failed to fetch media")
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    const formData = new FormData()

    if (files.length === 1) {
      formData.append("image", files[0])
      try {
        await api.post("/upload/image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        toast.success("Image uploaded!")
        fetchMedia()
      } catch (error) {
        toast.error("Failed to upload image")
      }
    } else {
      for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i])
      }
      try {
        await api.post("/upload/images", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        toast.success("Images uploaded!")
        fetchMedia()
      } catch (error) {
        toast.error("Failed to upload images")
      }
    }

    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return
    try {
      await api.delete(`/upload/${id}`)
      toast.success("Image deleted!")
      fetchMedia()
    } catch (error) {
      toast.error("Failed to delete image")
    }
  }

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url)
    toast.success("URL copied to clipboard!")
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
          <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-600 mt-1">Manage your uploaded images</p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            className="hidden"
            id="fileUpload"
          />
          <label
            htmlFor="fileUpload"
            className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer ${
              uploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <Upload size={20} />
            {uploading ? "Uploading..." : "Upload Images"}
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {media.map((item) => (
          <div key={item._id} className="group relative bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="aspect-square">
              <img src={item.url || "/placeholder.svg"} alt={item.filename} className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <button
                onClick={() => copyUrl(item.url)}
                className="p-2 bg-white rounded-full text-gray-700 hover:text-blue-600"
                title="Copy URL"
              >
                <Copy size={18} />
              </button>
              <button
                onClick={() => handleDelete(item._id)}
                className="p-2 bg-white rounded-full text-gray-700 hover:text-red-600"
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </div>
            <div className="p-2">
              <p className="text-xs text-gray-500 truncate">{item.filename}</p>
            </div>
          </div>
        ))}

        {media.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 bg-white rounded-xl">
            <ImageIcon size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-500">No images uploaded yet</p>
            <label htmlFor="fileUpload" className="mt-4 text-blue-600 hover:underline cursor-pointer">
              Upload your first image
            </label>
          </div>
        )}
      </div>
    </div>
  )
}
