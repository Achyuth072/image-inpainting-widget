import { useState, useEffect, useRef } from 'react'
import * as fabric from 'fabric'
import './App.css'

function App() {
  const [image, setImage] = useState(null)
  const canvasRef = useRef(null) // Ref to acces the canvas
  const canvasInstance = useRef(null) // Ref to store the canvas instance

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImage(reader.result)
        addImageToCanvas(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // To initialize the canvas and load the image
  const addImageToCanvas = (image) => {
    if (canvasInstance.current) {
      // If canvas is already initialized, resuse it
      fabric.FabricImage.fromURL(image, (img) => {
        img.scaleToWidth(800)
        img.scaleToHeight(600)
        canvasInstance.current.setBackgroundImage(img, canvasInstance.current.renderAll.bind(canvasInstance.current))
      })
    }

  }
  
  useEffect(() => {
    //Initialize the canvas only once
    if (!canvasInstance.current && canvasRef.current) {
      canvasInstance.current = new fabric.Canvas(canvasRef.current, {
        width: 800,
        height: 600,
      })
    }

    return () => {
      // Clean up the canvas on component unmount
      if (canvasInstance.current) {
        canvasInstance.current.dispose()
      }
    }
  },[])

  return (
    <div className="App">
      <h1>Image Inpainting Widget</h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ marginBottom: '20px' }}
      />

      {image && (
        <div>
          <h3>Uploaded Image</h3>
          <img
            src={image}
            alt="Uploaded"
            style={{ maxWidth: '100%', maxHeight: '20px' }}
          />
        </div>
      )}

      {/* Canvas */}
      <canvas ref={canvasRef} />      
    </div>
  )
}

export default App
