// Modal.js
import React from 'react';
import { IoMdArrowBack } from "react-icons/io";
import './modal.css'; // Add appropriate styles for the modal

const Modal = ({ onClose, children }) => {
  return (
    <div className="modalpost-overlay" onClick={onClose}>
     <div className='back-button'>
        <IoMdArrowBack onClick={onClose} />
     </div>
      <div className="modalpost-content" onClick={(e) => e.stopPropagation()}>
        
        {children}
      </div>
    </div>
  );
};

export default Modal;
