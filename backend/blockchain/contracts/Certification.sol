// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;
contract Certification {
    struct Certificate {
        string CertificateID;
        string[] HashedValues;
        string Latest;
        uint256 ExpiryTime;
    }
    
    mapping(string => Certificate) public certificates;
    event certificateGenerated(string _CertificateID);

    function GenerateCertificate(string memory _CertificateID, string memory _HashedValue, uint256 _ExpiryTime) public {
        Certificate storage cert = certificates[_CertificateID];
        
        if (bytes(cert.CertificateID).length == 0) {
            cert.CertificateID = _CertificateID;
            cert.HashedValues.push(_HashedValue);
            cert.Latest = _HashedValue;
            cert.ExpiryTime = _ExpiryTime;
            emit certificateGenerated(_CertificateID);
        } else {
            cert.HashedValues.push(_HashedValue);
            cert.ExpiryTime = _ExpiryTime;
            cert.Latest = _HashedValue;
        }
    }

    function GenerateCertificateWithInfinity(string memory _CertificateID, string memory _HashedValue) public {
        Certificate storage cert = certificates[_CertificateID];
        
        if (bytes(cert.CertificateID).length == 0) {
            cert.CertificateID = _CertificateID;
            cert.HashedValues.push(_HashedValue);
            cert.Latest = _HashedValue;
            cert.ExpiryTime = 2**256 - 1;
            emit certificateGenerated(_CertificateID);
        } else {
            cert.HashedValues.push(_HashedValue);
            cert.ExpiryTime = 2**256 - 1 ;
            cert.Latest = _HashedValue;
        }
    }

    function RetrieveData(string memory _CertificateID) public view returns (string memory, string[] memory, string memory, uint256) {
        require(bytes(certificates[_CertificateID].CertificateID).length != 0, "Certificate with this ID does not exist");
        
        Certificate memory retrieved = certificates[_CertificateID];
        return (retrieved.CertificateID, retrieved.HashedValues, retrieved.Latest, retrieved.ExpiryTime);
    }
}