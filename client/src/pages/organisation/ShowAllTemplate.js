import NavbarCertif from "../components/Navbar";
import React, { useState, useEffect } from 'react';
import Footer from "../components/Footer";
import Modal from 'react-modal';
import { MdDelete } from "react-icons/md";
import AdminNavbar from "../components/AdminNavbar";
function ShowAllTemplate() {
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null); // State for selected template
    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        fetchTemplates();
    }, []);
    const handleTemplateClick = (template) => {
        setSelectedTemplate(template);
        setModalIsOpen(true); // Open modal on template click
    };
    const fetchTemplates = async () => {
        const authToken = localStorage.getItem('authToken');

        try {
            const response = await fetch('http://localhost:8000/organization/gettemplates', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data.data)
                setTemplates(data.data);
            } else {
                console.error('Failed to fetch templates');
            }
        } catch (error) {
            console.error('Error fetching templates:', error);
        }
    };

    const handleDeleteTemplate = async (templateID) => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`http://localhost:8000/organization/deletetemplate/${templateID}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (response.ok) {
                // Refresh templates after deletion
                fetchTemplates();
            } else {
                console.error('Failed to delete template');
            }
        } catch (error) {
            console.error('Error deleting template:', error);
        }
    };

    const [hoveredTemplate, setHoveredTemplate] = useState(null);

    return (
        <div>
            <div className="navLogin">
                <AdminNavbar textColor="#FFFFFF" />
            </div>
            <div className="showAllTemp">
            <h1 className="p-5"><b>Templates</b></h1>
            <div className='templates pb-3'>
                {templates &&
                    templates.map((template, index) => (
                        <div
                            key={index}
                            onMouseEnter={() => setHoveredTemplate(template._id)}
                            onMouseLeave={() => setHoveredTemplate(null)}
                            onClick={() => handleTemplateClick(template)}
                            style={{ position: 'relative' }}
                        >
                            {hoveredTemplate === template._id &&
                                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
                                    <button onClick={() => handleDeleteTemplate(template._id)} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>Delete <MdDelete /></button>
                                </div>
                            }
                            {/* {
                                hoveredTemplate === template._id && template.publicBool &&
                                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
                                    <p style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color:'green',fontWeight:700,fontSize:'1rem' }}>Public Template</p>
                                 </div>   
                            } */}
                            <img
                            
                                src={`http://localhost:8000/image_files/${template.name}`}
                                alt={template.name}
                                style={{ width: '300px', height: '200px',boxShadow:'5px 3px 3px #aaaaaa',border: template.publicBool === true ? '.15rem solid green' : '.15rem solid #4E54C8',}}
                            />
                        </div>
                    ))}
            </div>
            </div>
            {/* Modal for displaying larger view of the template */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Template Modal"
            >
                {selectedTemplate && (
                    <div>
                        <img
                            src={`http://localhost:8000/image_files/${selectedTemplate.name}`}
                            alt={selectedTemplate.name}
                            style={{ maxWidth: '100%', maxHeight: '100%', boxShadow: '5px 3px 3px #aaaaaa' }}
                        />
                        {/* Add any additional information you want to display in the modal */}
                    </div>
                )}
            </Modal>
            <Footer />
        </div>
    )
}
export default ShowAllTemplate;
