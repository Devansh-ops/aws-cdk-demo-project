import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!inputText || !selectedFile) {
      alert('Please provide both text input and file input.');
      return;
    }

    try {
      const uploadUrl = `${process.env.REACT_APP_S3_BUCKET_URL}/${selectedFile.name}`;
      console.log("uploadUrl = " + uploadUrl)
      await axios.put(uploadUrl, selectedFile, {
        headers: {
          'Content-Type': selectedFile.type,
        },
      });

      alert(`File uploaded successfully: ${selectedFile.name}`);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Text Input:
          <input type="text" value={inputText} onChange={handleInputChange} />
        </label>
      </div>
      <div>
        <label>
          File Input:
          <input type="file" onChange={handleFileChange} />
        </label>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default FileUpload;
