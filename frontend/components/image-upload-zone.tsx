"use client"

import type React from "react"

import { useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Upload } from "lucide-react"

interface ImageUploadZoneProps {
  onImageSelect: (file: File) => void
  disabled?: boolean
}

export default function ImageUploadZone({ onImageSelect, disabled }: ImageUploadZoneProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      const files = e.dataTransfer.files
      if (files.length > 0) {
        const file = files[0]
        if (file.type.startsWith("image/")) {
          onImageSelect(file)
        }
      }
    },
    [onImageSelect],
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files && files.length > 0) {
      onImageSelect(files[0])
    }
  }

  return (
    <Card
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed border-primary/30 hover:border-primary/50 transition-colors p-8 text-center cursor-pointer"
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        disabled={disabled}
        className="hidden"
        id="image-upload"
      />
      <label htmlFor="image-upload" className="cursor-pointer block">
        <Upload className="w-12 h-12 text-primary/50 mx-auto mb-4" />
        <p className="text-foreground font-semibold mb-1">Drop your image here</p>
        <p className="text-muted-foreground text-sm">or click to browse</p>
      </label>
    </Card>
  )
}
