import axios from 'axios';
import React, { Component } from 'react';

export default class Uploader extends Component {
  state = {
    message:''
  };

  getImage = e => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      this.setState({ file });
    }
  };
  getPresignedPostData = selectedFile => {
    return new Promise(resolve => {
      const xhr = new XMLHttpRequest();
      
      // Set the proper URL here.
      const url = "https://hlcyk2ty6c.execute-api.us-east-1.amazonaws.com/Prod/s3presignedput/";
      
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(
        JSON.stringify({
          name: selectedFile.name,
          type: selectedFile.type
        })
      );
      xhr.onload = function() {
        resolve(JSON.parse(this.responseText));
      };
    });
  };
  
  /**
   * Upload file to S3 with previously received pre-signed POST data.
   * @param presignedPostData
   * @param file
   * @returns {Promise<any>}
   */
  uploadFileToS3 = (presignedPostData, file) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      Object.keys(presignedPostData.fields).forEach(key => {
        formData.append(key, presignedPostData.fields[key]);
      });
  
      // Actual file has to be appended last.
      formData.append("file", file);
  
      const xhr = new XMLHttpRequest();
      xhr.open("POST", presignedPostData.url, true);
      xhr.send(formData);
      xhr.onload = function() {
        this.status === 204 ? resolve() : reject(this.responseText);
      };
    });
  };
  uploadFile = e => {
    e.preventDefault();
    const { file } = this.state;
    this.setState({message:'Uploading...'})
    const contentType = file.type; // eg. image/jpeg or image/svg+xml

    const generatePutUrl = 'https://hlcyk2ty6c.execute-api.us-east-1.amazonaws.com/Prod/s3presignedput/';
    const options = {
      params: {
        name: file.name,
        ContentType: contentType
      },
      headers: {
        'Content-Type': "application/json"
      }
    };

    axios.post(generatePutUrl, options).then(res => {
      const {
        data: { putURL }
      } = res;
      axios
        .put(putURL, file, options)
        .then(res => {
          this.setState({message:'Upload Successful'})
          setTimeout(()=>{
            this.setState({message:''});
            document.querySelector('#upload-image').value='';
          }, 2000)
        })
        .catch(err => {
          this.setState({message:'Sorry, something went wrong'})
          console.log('err', err);
        });
    });
  };

  render() {
    return (
      <React.Fragment>
        <h1>Upload an image to AWS S3 bucket</h1>
        <input
          id='upload-image'
          type='file'
          accept='image/*'
          onChange={this.getImage}
        />
        <p>{this.state.message}</p>
        <form onSubmit={this.uploadFile}>
          <button id='file-upload-button'>Upload</button>
        </form>
      </React.Fragment>
    );
  }
}