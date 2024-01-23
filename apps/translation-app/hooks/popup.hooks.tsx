'use client';

import { useContext } from 'react';

import { PopupContext } from '../context/PopupProvider';

export const usePopup = () => {
  const { openPopup, closePopup } = useContext(PopupContext);

  return { openPopup, closePopup };
};
