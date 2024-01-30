'use client';

import React from 'react';

import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { usePopup } from '@apps/translation-app/hooks/popup.hooks';
import { request } from '@apps/translation-app/lib/apiClient';

const DeleteUserPopup = (props: {
  accessToken: string | undefined;
  email: string;
}) => {
  const { closePopup } = usePopup();
  const router = useRouter();

  const [isDeleting, setIsDeleting] = React.useState(false);

  const deleteUser = () => {
    setIsDeleting(true);
    request(
      '/users',
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: props.email,
        }),
      },
      props.accessToken,
    )
      .then(() => {
        toast.success('Success delete user');
      })
      .catch((error) => {
        toast.error(`Error delete user: ${error.message}`);
      })
      .finally(() => {
        setIsDeleting(false);
        closePopup();
        router.refresh();
      });
  };

  return (
    <div className="space-y-6">
      <h1>Delete User</h1>
      <p>Are you sure want to delete this user? This action is irreversible</p>

      <button className="button" onClick={deleteUser} disabled={isDeleting}>
        Confirm
      </button>
    </div>
  );
};

export default DeleteUserPopup;
