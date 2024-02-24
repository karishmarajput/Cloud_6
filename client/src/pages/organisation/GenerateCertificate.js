import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import NavbarCertif from "../components/Navbar";
import './generationCertificate.css'
import Footer from "../components/Footer";
import Loader from '../components/Loader';
import CustomAlert from '../components/Alert';

function GenerateCertificate() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [isPublic, setIsPublic] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedCsv, setSelectedCsv] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('error');
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:8000/organization/gettemplates', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const { data } = await response.json();
        setTemplates(data);
      } else {
        throw new Error('Failed to fetch templates');
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      setAlertMessage(`Failed to fetch templates: ${error}`);
      setAlertSeverity('error');
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setFile(null);
    setIsPublic(true);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.name.endsWith('.docx')) {
      setFile(selectedFile);
    } else {
      setFile(null);
    }
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0]; 
    if (droppedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      handleFileChange({ target: { files: [droppedFile] } });
    } else {
      setAlertMessage('Please upload a docx file.');
      setAlertSeverity('error');
      setShowAlert(true);
    }
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };

  const handleCsvChange = (e) => {
    setSelectedCsv(e.target.files[0]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (!selectedTemplate || !selectedCsv) {
      setLoading(false);
      return;
    }

    try {
      const authToken = localStorage.getItem('authToken');
      const formData = new FormData();
      formData.append('template_id', selectedTemplate.name);
      formData.append('csvfile', selectedCsv);

      const response = await fetch('http://localhost:8000/organization/csvandtemplate', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        setAlertMessage('Successfully generated certificates and mailed to participants.');
        setAlertSeverity('success');
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      console.error('Error submitting:', error);
      setAlertMessage(`Error submitting: ${error}`);
      setAlertSeverity('error');
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    setLoading(true);
    if (!file) {
      setLoading(false);
      return;
    }

    try {
      const authToken = localStorage.getItem('authToken');
      const formData = new FormData();
      formData.append('myFile', file);
      formData.append('publicBool', isPublic);

      const response = await fetch('http://localhost:8000/organization/uploadtemplate', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        setAlertMessage('Successfully uploaded the template');
        setAlertSeverity('success');
        closeModal();
        fetchTemplates();
      } else {
        throw new Error('Failed to upload file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setAlertMessage(`Error uploading file: ${error}`);
      setAlertSeverity('error');
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowAlert(false);
  };

  return (
    <div>
      <div className="navLogin">
        <NavbarCertif textColor="#FFFFFF" />
      </div>
      <CustomAlert
        open={showAlert}
        onClose={handleAlertClose}
        severity={alertSeverity}
        message={alertMessage}
      />
      {loading && <Loader />}
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <button className="modal-close-btn" onClick={closeModal}>X</button>
        <div className='modalDiv' onDragOver={handleDragOver} onDrop={handleDrop}>
          <h2><b>Create New Template</b></h2>
          <p>Create a template in docx and add placeholders in it using word. Sample</p>
          <div className="drag-drop-area">
            {file ? (
              <p>Selected File: {file.name}</p>
            ) : (
              <div>
                <p>Drag and drop your file here or</p>
                <input type="file" className='dragdropBtn' onChange={handleFileChange} accept=".docx" />
              </div>
            )}
          </div>
          <div className="publicSwitchDiv">
            <label htmlFor="publicSwitch" className="public-label">Public</label>
            <input
              id="public"
              type="checkbox"
              checked={isPublic}
              onChange={() => setIsPublic(!isPublic)}
              className="public-checkbox"
            />
          </div>
          <div className='publicSwitchDiv p-4'>
            <button  onClick={handleUpload}>Done</button>
          </div>
        </div>
      </Modal>

      <div className='container generationContent'>
        <h1><b>Generate New Certificate</b></h1>
        <h3>Choose a Template</h3>
        <div className='templates'>
          <div>
            <button className="generationBtn" onClick={openModal}>+</button>
          </div>
          {templates.map((template, index) => (
            <div
              key={index}
              style={{
                backgroundColor: selectedTemplate === template ? 'lightblue' : 'white',
              }}
              onClick={() => handleTemplateSelect(template)}
            >
              <img
                src={`http://localhost:8000/image_files/${template.name}`}
                alt={template.name}
                style={{ width: '300px', height: '200px', boxShadow: '5px 3px 3px #aaaaaa', border: '0.5px solid #aaaaaa' }}
              />
            </div>
          ))}
        </div>
        <h3>Upload participants list CSV file</h3>
        <input 
          type="file" 
          onChange={handleCsvChange} 
          style={{
            padding: '10px',
            marginBottom: '15px',
            marginTop: '10px',
            cursor: 'pointer',
          }}
          accept=".csv"
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>
      <Footer />
    </div>
  );
}

export default GenerateCertificate;
