import React from 'react';
import './Styles/Modal.css';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-button" onClick={onClose} aria-label="Close">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="14" cy="14" r="13" fill="#fff" stroke="#f09819" strokeWidth="2"/>
                        <line x1="9" y1="9" x2="19" y2="19" stroke="#f25c2b" strokeWidth="2.2" strokeLinecap="round"/>
                        <line x1="19" y1="9" x2="9" y2="19" stroke="#f25c2b" strokeWidth="2.2" strokeLinecap="round"/>
                    </svg>
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
