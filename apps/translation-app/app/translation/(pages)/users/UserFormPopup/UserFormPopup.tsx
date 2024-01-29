'use client';

import React from 'react';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { RegexPatterns } from 'constants/regexPatterns';

import { usePopup } from '@apps/translation-app/hooks/popup.hooks';
import { request } from '@apps/translation-app/lib/apiClient';
import { ProjectItem } from '../../../models/ResponseGetTranslationProject';
import { User } from '../models/User';
import { UserFormData } from '../models/UserFormData';

const UserFormPopup = (props: {
  project: ProjectItem[];
  user?: User;
  accessToken: string | undefined;
}) => {
  const defaultValues = props.user
    ? {
        fullName: props.user.fullName,
        email: props.user.email,
        role: props.user.role,
      }
    : {};

  const { closePopup } = usePopup();
  const form = useForm<UserFormData>({
    defaultValues: defaultValues,
  });
  const router = useRouter();

  const submitData = (data: UserFormData) => {
    if (props.user) {
      const requestData = {
        ...data,
        oldEmail: props.user.email,
      };
      request(
        '/users',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        },
        props.accessToken,
      )
        .then(() => {
          toast.success('Success update user');
        })
        .catch((error) => {
          toast.error(`Error update user: ${error.message}`);
        })
        .finally(() => {
          closePopup();
          router.refresh();
        });
      return;
    }

    request('/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(() => {
        toast.success('Success add user');
      })
      .catch((error) => {
        toast.error(`Error add user: ${error.message}`);
      })
      .finally(() => {
        closePopup();
        router.refresh();
      });
  };

  return (
    <form action="" onSubmit={form.handleSubmit(submitData)}>
      <div className="max-w-[512px] space-y-6">
        <h1>{props.user ? 'Edit User' : 'Add User'}</h1>
        <input
          placeholder="Full Name"
          {...form.register('fullName', {
            required: true,
          })}
          className="w-full"
        />
        <input
          placeholder="Email"
          className="w-full"
          {...form.register('email', {
            required: true,
            pattern: {
              value: RegexPatterns.Email,
              message: 'Email is not valid',
            },
          })}
        />
        {!props.user && (
          <input
            placeholder="Password"
            type="password"
            {...form.register('password', {
              required: true,
            })}
          />
        )}

        <div>
          <p className="mb-2 text-sm">Role</p>
          <select
            {...form.register('role', {
              required: true,
            })}
            className="w-full"
          >
            <option value="editor">Editor</option>
            <option value="dev">Developer</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button className="button w-full">Save</button>
      </div>
    </form>
  );
};

export default UserFormPopup;
