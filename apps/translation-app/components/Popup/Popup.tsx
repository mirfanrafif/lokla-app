'use client';

import React from 'react';

import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { PopupContext } from '../../context/PopupProvider';

const Popup = () => {
  return (
    <PopupContext.Consumer>
      {(value) =>
        value.isShow ? (
          <div className="popup-overlay">
            <div className="popup-popup">
              {value.children}
              <button
                className="absolute top-4 right-4"
                onClick={value.closePopup}
              >
                <FontAwesomeIcon icon={faClose} />
              </button>
            </div>
          </div>
        ) : null
      }
    </PopupContext.Consumer>
  );
};

export default Popup;
