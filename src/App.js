import React, { useState } from 'react';
import './App.css';

function App() {
  const [image, setImage] = useState(null);
  const [showText, setShowText] = useState(false);
  const [result, setResult] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (image) {
      const formData = new FormData();
      formData.append('file', dataURLtoBlob(image));
  
      try {
        const response = await fetch('http://127.0.0.1:5000/predict', {
          method: 'POST',
          body: formData,
        });
  
        if (response.ok) {
          const result = await response.json();
          setResult(result);
          console.log(result);
          setShowText(true);
        } else {
          console.error('Server response:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };
  

  // Helper function to convert base64 to blob
  function dataURLtoBlob(dataurl) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  return (
    <div className="App">
      <header className="App-header">
        {image && <img src={image} alt="Uploaded" />}
        <input type="file" onChange={handleImageChange} />
        <button onClick={handleSubmit}>Submit</button>

        {showText && <p>Your image is {result['prediction']}</p>}
      </header>
    </div>
  );
}

export default App;
