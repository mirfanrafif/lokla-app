'use client';

import React, { useState } from 'react';

type PopupContextType = {
  isShow: boolean;
  children: React.ReactNode;
  openPopup: (children: React.ReactNode) => void;
  closePopup: () => void;
};

const popupDefaultValue = {
  isShow: false,
  children: null,
  openPopup: () => {},
  closePopup: () => {},
};

export const PopupContext =
  React.createContext<PopupContextType>(popupDefaultValue);

PopupContext.displayName = 'Popup';

const PopupContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [popupData, setPopupData] =
    useState<PopupContextType>(popupDefaultValue);

  return (
    <PopupContext.Provider
      value={{
        ...popupData,
        openPopup: (children) => {
          setPopupData({
            ...popupData,
            isShow: true,
            children,
          });
        },
        closePopup: () => {
          setPopupData({
            ...popupData,
            isShow: false,
          });
        },
      }}
    >
      {children}
    </PopupContext.Provider>
  );
};

export default PopupContextProvider;
