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

  const uploadFileToS3 = async (file) => {
    const uploadUrl = `${process.env.REACT_APP_S3_BUCKET_URL}/${file.name}`;
    console.log("uploadUrl = " + uploadUrl);
    await axios.put(uploadUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
    });
  };

  const callApiEndpoint = async (inputText, fileName) => {
    const apiEndpoint = process.env.REACT_APP_API_ENDPOINT + "add-item";
    const apiPayload = {
      input_text: inputText,
      input_file_path: `${process.env.REACT_APP_S3_BUCKET_NAME}/${fileName}`,
    };

    const apiResponse = await axios.post(apiEndpoint, apiPayload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return apiResponse.data;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!inputText || !selectedFile) {
      alert('Please provide both text input and file input.');
      return;
    }

    try {
      await uploadFileToS3(selectedFile);
      alert(`File uploaded successfully: ${selectedFile.name}`);

      const response = await callApiEndpoint(inputText, selectedFile.name);
      alert('API call successful: ' + response.message);

      console.log('API Response:', response);
    } catch (error) {
      console.error('Error:', error);
      alert('Error occurred. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextInput value={inputText} onChange={handleInputChange} />
      <FileInput onChange={handleFileChange} />
      <button type="submit">Submit</button>
    </form>
  );
};

const TextInput = ({ value, onChange }) => (
  <div>
    <label>
      Text Input:
      <input type="text" value={value} onChange={onChange} />
    </label>
  </div>
);

const FileInput = ({ onChange }) => (
  <div>
    <label>
      File Input:
      <input type="file" onChange={onChange} />
    </label>
  </div>
);

export default FileUpload;
