import React from 'react';
import './App.css';
import FileUpload from './components/FileUpload';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>File Upload to S3 via Access Point</h1>
        <FileUpload />
      </header>
    </div>
  );
}

export default App;
