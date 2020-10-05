import API from "@aws-amplify/api";
import Amplify from "@aws-amplify/core";
import React from "react";
import Files from "react-butterfiles";
import AwsExports from "./aws-exports";
/**
 * Retrieve pre-signed POST data from a dedicated API endpoint.
 * @param selectedFile
 * @returns {Promise<any>}
 */
const getPresignedPostData = (selectedFile) => {
  return new Promise((resolve) => {
    let apiName = "superqso";
    let path = "/s3presignedpost";
    let myInit = {
      body: {
        name:          
          selectedFile.name,
      },
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Authorization": "eyJraWQiOiJaSlFnMENhYVI5XC9FaWxHa291VHRSaDhOTmRGUjAxaWEzeFpobHpwNXpRUT0iLCJhbGciOiJSUzI1NiJ9.eyJjdXN0b206Y2FsbHNpZ24iOiJUU0xMIiwiY3VzdG9tOmNvdW50cnkiOiJBUiIsInN1YiI6IjAxZTQzZDMwLWUxMjctNGJjZi05MDJiLThkMWJlYmNkYWQ5YSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJiaXJ0aGRhdGUiOiIxOTg1LTAxLTA0IiwiY3VzdG9tOmxhc3ROYW1lIjoiTGFuZ2VuYXVlciIsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX0laMHJ5bXpCdiIsImNvZ25pdG86dXNlcm5hbWUiOiJsaXNhbmRyb2xhbkBnbWFpbC5jb20iLCJhdWQiOiIzMm91aXFwamZuZThsMHZuc2FzcGxobWd2ciIsImV2ZW50X2lkIjoiZGI4YTdiNDgtMzliZS00NWU3LThkMWQtMGQ4NmNjY2FjMjY2IiwiY3VzdG9tOmZpcnN0TmFtZSI6Ikxpc2FuZHJvIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2MDE0ODM5NjksImV4cCI6MTYwMTU5MDU2OCwiaWF0IjoxNjAxNTg2OTY4LCJlbWFpbCI6Imxpc2FuZHJvbGFuQGdtYWlsLmNvbSJ9.REzmmabUYWdUi9TiifhM9Mz5NbsfUlVOfX-AYuy38-Kb2bCB7amRcdEm0hltkKIz93xPdxYMwQenpPVhwQuTvfnoNHWXGJpNvrlCPcZq_gM9LjpJNLNGoDFBjaFu7NI-TfAtglxOHNwdZG0PEmZoUiTThZvfB8ByRgSQi7bWeFr2VnbCBafe8amSymhO8TUlvw9r-YWs6oIEr4vwWlQhi7e8jWokxtktlh9cHnXYPo8AWH7oF91BnX8c7xJDLbxxxROkvQ3DJnw0HI-JsxffzPRDcAlwcBz0tIy7SWSlcd12LRvPWnqn5QBlNeETabEvT3Sb-DCr2dn4WRJ2NduQ8w"
      },
    };

    API.post(apiName, path, myInit)
      .then((response) => {
        console.log(response);
        resolve(response.body.data);
      })
      .catch((error) => {
        if (process.env.NODE_ENV !== "production") {
          console.log(error);
        }
      });
  });
};

/**
 * Upload file to S3 with previously received pre-signed POST data.
 * @param presignedPostData
 * @param file
 * @returns {Promise<any>}
 */
const uploadFileToS3 = (presignedPostData, file) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    Object.keys(presignedPostData.fields).forEach((key) => {
      formData.append(key, presignedPostData.fields[key]);
    });

    // Actual file has to be appended last.
    formData.append("file", file);
    console.log(presignedPostData.url);
    console.log(formData);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", presignedPostData.url, true);
    xhr.send(formData);
    xhr.onload = function () {
      console.log(this);
      this.status === 204 ? resolve() : reject(this.responseText);
    };
  });
};

/**
 * Component renders a simple "Select file..." button which opens a file browser.
 * Once a valid file has been selected, the upload process will start.
 * @returns {*}
 * @constructor
 */
const FileUploadButton = () => (
  <Files
  maxSize="10mb"
    onSuccess={async ([selectedFile]) => {
      // Step 1 - get pre-signed POST data.
      console.log(selectedFile);
      try {
        const presignedPostData = await getPresignedPostData(selectedFile);
        console.log(presignedPostData);
        // Step 2 - upload the file to S3.

        const { file } = selectedFile.src;
        await uploadFileToS3(presignedPostData, file);
        console.log("File was successfully uploaded!");
      } catch (e) {
        console.log(e);
        console.log("An error occurred!", e.message);
      }
    }}
  >
    {({ browseFiles }) => <button onClick={browseFiles}>Select file...</button>}
  </Files>
);
Amplify.configure(AwsExports);
function App() {
  return (
    <div className="App">
      <FileUploadButton />
      <hr />
    </div>
  );
}

export default App;
