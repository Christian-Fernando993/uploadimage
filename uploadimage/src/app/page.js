'use client'
import { useDropzone } from 'react-dropzone'
import styles from './page.module.css'
import { useCallback, useState, useMemo } from "react";
import axios from 'axios'

export default function Home() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('') 
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    acceptedFiles.forEach((file) => {
      setSelectedImages((prevState) => [...prevState, file])
    });
  }, [])  

  const { 
    getRootProps, 
    getInputProps, 
    isDragActive, 
    isDragAccept, 
    isDragReject 
  } = useDropzone({ 
    onDrop, 
    accept: {
      'image/png': ['.png'],
      'image/jpg': ['.jpg'],
      'image/jpeg': ['.jpeg'],
    },
    maxFiles: 2
  });

  const onUpload = async () => {
    setUploadStatus("Uploading....");
    const formData = new FormData();
    selectedImages.forEach((image) => {
      formData.append("file", image);
    });
    try {
      const response = await axios.post(
        "${cloudinary.config}/api/upload",
        formData
      );
      console.log(response.data);
      setUploadStatus("Upload realizado com sucesso");
    } catch (error) {
      console.log("imageUpload" + error);
      setUploadStatus("Upload Falhou...");
    }
  };

  const style = useMemo(
    () => ({
      ...(isDragAccept ? { borderColor: '#00e676'} : {}),
      ...(isDragReject ? { borderColor: '#ff1744'} : {}),
    })
    [isDragAccept, isDragReject]
  )
  
  return (
    <div className={styles.container}>
      <div className={styles.dropzone} {...getRootProps({ style })}>
        <input {...getInputProps()} />
        {
          isDragActive ? (
            <p>Drop File(s) here ...</p>
          ):(
            <p>Drag and drop file(s) here, or click to select files</p>
          )
        }
      </div>
      <div className={styles.images}>
        {selectedImages.length > 0 &&
         selectedImages.map((image, index) => (
          <img src={`${URL.createObjectURL(image)}`}/>
         ))}
      </div>
      { selectedImages.length > 0 && (
        <div className={styles.btn}>
          <button onClick={onUpload}>Enviado para cloudinary</button>
          <p>{uploadStatus}</p>
        </div>
      )

      }
    </div>
  )
}
//https://cloudinary.com/blog/guest_post/upload-images-with-react-dropzone