import React from 'react';
import './App.css';
import DisplayImage from './components/DisplayImage';
import Uploader from './components/Uploader';

function App() {
  return (
    <div className='App'>
      <Uploader />
      <hr/>
      <DisplayImage />
    </div>
  );
}

export default App;