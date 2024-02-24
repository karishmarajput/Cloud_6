import React from 'react';
import OrganisationDashboard from '../organisation/OrganisationDashboard';
import OgLogin from '../organisation/OgLogin';
function OrganisationAuth({ element: Element, ...rest }) {
  const authToken = localStorage.getItem('authToken');
  const isAuthenticated = !!authToken; 
  const getAdminName = () => {
    if (isAuthenticated) {
      try {
        const tokenData = authToken.split('.')[1];
        const decodedToken = atob(tokenData);
        const { username } = JSON.parse(decodedToken);
        return username;
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  };

  const adminName = getAdminName();

  return isAuthenticated ? (
    <OrganisationDashboard/>
  ) : (
    <OgLogin />
  );
}

export default OrganisationAuth;
