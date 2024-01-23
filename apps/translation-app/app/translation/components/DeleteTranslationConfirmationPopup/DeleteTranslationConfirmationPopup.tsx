import React from 'react';

const DeleteTranslationConfirmationPopup = (props: {
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  return (
    <div className="space-y-4">
      <h3>Delete Translation</h3>
      <p>Are you sure want to delete this translation?</p>
      <div className="flex flex-row justify-end gap-x-4">
        <button className="button" onClick={props.onCancel}>
          Cancel
        </button>
        <button className="button" onClick={props.onConfirm}>
          Confirm
        </button>
      </div>
    </div>
  );
};

export default DeleteTranslationConfirmationPopup;
