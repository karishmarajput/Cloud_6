import React, { useState, useRef } from "react";
import "./dragAndDrop.css";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import Loader from '../components/Loader';
import CustomAlert from '../components/Alert';


function DragDropFile() {
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false); // Move loading state here
  const inputRef = useRef(null);
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertSeverity, setAlertSeverity] = React.useState('error');
  const [alertMessage, setAlertMessage] = React.useState('');

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowAlert(false);
  };
  const handleFile = (files) => {
    const file = files[0];
    const formData = new FormData();

    if (file.type === 'application/pdf') {
      formData.append('pdf', file);

      setLoading(true);

      fetch('http://localhost:8000/verify/uploadpdf', {
        method: 'POST',
        body: formData,
      })
        .then(async(response) => {
          if (response.ok) {
            const data = await response.json();
            console.log(data)
           
            setAlertMessage(`Verification done successfully. Given certificate is ${data.message}`);
            setAlertSeverity('success')
            setShowAlert(true);
            
          } else {
            setAlertMessage('Failed to upload file');
            setAlertSeverity('error')
            setShowAlert(true);
            throw new Error('Failed to upload file');

          }
        })
        .catch((error) => {
          console.error('Error uploading file:', error);
          setAlertMessage(`Failed to uploading file ${error}`);
            setAlertSeverity('error')
            setShowAlert(true);
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (file.type === 'application/zip') {
      
      const zipFormData = new FormData();
      zipFormData.append('zip', file);

      setLoading(true);
     


      fetch('http://localhost:8000/verify/uploadzip', {
        method: 'POST',
        body: zipFormData,
      })
        .then(async(response) => {
          if (response.ok) {
            const data = await response.json();
            console.log(data)
            downloadCSV(data.data)
            setAlertMessage('Successfully verified the certificates. Obtain the results in csv.');
            setAlertSeverity('success')
            setShowAlert(true);
          } else {
            
            setAlertMessage('Failed to upload folder');
            setAlertSeverity('error')
            setShowAlert(true);
            throw new Error('Failed to upload folder');
          }
        })
        .catch((error) => {
          console.error('Error uploading folder:', error);
          setAlertMessage(`Error uploading folder: ${error}`);
          setAlertSeverity('error')
          setShowAlert(true);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      // alert('Invalid file type. Please upload a PDF file or a folder as a ZIP file.');
      setAlertMessage('Invalid file type. Please upload a PDF file or a folder as a ZIP file.');
          setAlertSeverity('error')
          setShowAlert(true);
    }
  };
  function convertToCSV(data) {
    const header = Object.keys(data[0]).join(',') + '\n';
    const body = data.map(obj => Object.values(obj).join(',')).join('\n');
    return header + body;
  }
  function downloadCSV(data) {
    const csvContent = convertToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'data.csv');
    document.body.appendChild(link);
    link.click();
  
    document.body.removeChild(link);
  }
  function downloadCSV(data) {
    const csvContent = convertToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'data.csv');
    document.body.appendChild(link);
    link.click();
  
    document.body.removeChild(link);
  }

  const handleDrag = function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = function (e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files);
    }
  };

  const handleChange = function (e) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files);
    }
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  return (
    <div className="page">
      <CustomAlert
        open={showAlert}
        onClose={handleAlertClose}
        severity={alertSeverity}
        message={alertMessage}
      />
      <form
        id="form-file-upload"
        onDragEnter={handleDrag}
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          ref={inputRef}
          type="file"
          id="input-file-upload"
          multiple={true}
          onChange={handleChange}
        />
        <label
          id="label-file-upload"
          htmlFor="input-file-upload"
          className={dragActive ? "drag-active" : ""}
        >
          <div>
            {loading && <Loader />}
            <button className="upload-button" onClick={onButtonClick}>
              <CloudUploadRoundedIcon sx={{ fontSize: 150 }} />
            </button>
            <p>Drag and drop your file here or Upload a file</p>
  
          </div>
        </label>
        {dragActive && (
          <div
            id="drag-file-element"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          ></div>
        )}
      </form>
    </div>
  );
}

export default DragDropFile;
