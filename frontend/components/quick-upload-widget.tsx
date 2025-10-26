"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import Link from "next/link"
import ImageUploadZone from "./image-upload-zone"

export default function QuickUploadWidget() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  return (
    <Card className="p-8 border border-primary/20 bg-primary/5">
      <h2 className="text-xl font-semibold text-foreground mb-4">Quick Upload</h2>
      <p className="text-muted-foreground mb-6">Upload a plant image to detect diseases instantly</p>

      <ImageUploadZone onImageSelect={setSelectedImage} />

      {selectedImage && (
        <div className="mt-4 flex gap-3">
          <Link href="/detect" className="flex-1">
            <Button className="w-full bg-primary hover:bg-primary/90">
              <Upload className="w-4 h-4 mr-2" />
              Go to Detection
            </Button>
          </Link>
          <Button variant="outline" onClick={() => setSelectedImage(null)}>
            Clear
          </Button>
        </div>
      )}
    </Card>
  )
}
