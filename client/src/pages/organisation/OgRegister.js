import React, { useState } from 'react';
import './OgRegister.css';
import NavbarCertif from "../components/Navbar";
import Footer from "../components/Footer";
import { Container, Row, Col } from "react-bootstrap";

function OgRegister() {
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('error');
  const [alertMessage, setAlertMessage] = useState('');

  // const [organizationNumber, setOrganizationNumber] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // const handleOrgNumberChange = (e) => {
  //   setOrganizationNumber(e.target.value);
  // };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handlePhoneChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/organization/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // ogNumber: organizationNumber,
          name,
          phoneNumber,
          email,
          password,
        }),
      });

      if (response.ok) {
        setAlertMessage(`Registration successful! You will receive a mail once verified by admin`);
        setAlertSeverity('Success');
        setShowAlert(true);
        console.log('Registration successful! You will receive a mail once verified by admin');
      } else {
        console.log(response)
        console.error('Registration failed');
        setAlertMessage(`Registration failed`);
        setAlertSeverity('error');
        setShowAlert(true);
      }
    } catch (error) {
      console.error('Error:', error);
    }
    setName('');
    setPhoneNumber('');
    setEmail('');
    setPassword('');
  };

//   return (
//   <>
//     <div className="navLogin">
//         <NavbarCertif  textColor="#FFFFFF" />
//       </div>
//     <div className="register-container">
//       <div className= "bubbleBodyR">   
//         <div className="bubbleR bubble_oneR"></div>
//         <div className="bubbleR bubble_twoR"></div>
//         <div className="bubbleR bubble_threeR"></div>
//         <div className="bubbleR bubble_fourR"></div>
//       </div>
//       <div className='flex-container-register'>
//         <div className="image-section">
//           <img src="login-side.png" alt="Organization" />
//         </div>

//         <div className="form-section">
//           <h2>Register Form</h2>
//           <form onSubmit={handleSubmit}>
//             {/* <div>
//               <label>
//                 Organization Number:
//                 <input
//                   type="text"
//                   value={organizationNumber}
//                   onChange={handleOrgNumberChange}
//                 />
//               </label>
//             </div> */}
//             <div>
//               <label>
//                 Name:
//                 <input
//                   type="text"
//                   value={name}
//                   onChange={handleNameChange}
//                 />
//               </label>
//             </div>
//             <div>
//               <label>
//                 Phone Number:
//                 <input
//                   type="text"
//                   value={phoneNumber}
//                   onChange={handlePhoneChange}
//                 />
//               </label>
//             </div>
//             <div>
//               <label>
//                 Email:
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={handleEmailChange}
//                 />
//               </label>
//             </div>
//             <div>
//               <label>
//                 Password:
//                 <input
//                   type="password"
//                   value={password}
//                   onChange={handlePasswordChange}
//                 />
//               </label>
//             </div>
//             <div>
//               <button type="submit">Register</button>
//             </div>
//           </form>
//         </div>
//       </div>
//       </div>
//       <Footer />  
//     </>
//   );
// }

return (
  <>
    <div className="navLogin">
      <NavbarCertif  textColor="#FFFFFF" />
    </div>
    <div className="register-container">
      <div className= "bubbleBodyR">   
        <div className="bubbleR bubble_oneR"></div>
        <div className="bubbleR bubble_twoR"></div>
        <div className="bubbleR bubble_threeR"></div>
        <div className="bubbleR bubble_fourR"></div>
      </div>
      <Row className='flex-container-register'>
        <Col className="image-section">
          <img src="login-side.png" alt="Organization" />
        </Col>

        <Col className="form-section">
          <h2>Register Form</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>
                Name:
                <input
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                />
              </label>
            </div>
            <div>
              <label>
                Phone Number:
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                />
              </label>
            </div>
            <div>
              <label>
                Email:
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                />
              </label>
            </div>
            <div>
              <label>
                Password:
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                />
              </label>
            </div>
            <div>
              <button type="submit">Register</button>
            </div>
          </form>
        </Col>
      </Row>
    </div>
    <Footer />  
    </>
  );
}

export default OgRegister;
