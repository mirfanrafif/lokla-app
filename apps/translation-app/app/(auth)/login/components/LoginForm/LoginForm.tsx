'use client';

import React from 'react';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { RegexPatterns } from 'constants/regexPatterns';

import AppLogo from '@apps/translation-app/app/assets/images/app_logo';
import { buildTranslationListUrl } from '@apps/translation-app/app/translation/navigations/translations.navigation';
import { LoginFormData } from '../../../models/LoginFormData';

import styles from './LoginForm.module.scss';

const LoginForm = () => {
  const form = useForm<LoginFormData>();
  const router = useRouter();

  const loginAction = async (data: LoginFormData) => {
    return fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        const data = await response.json();

        if (response.status >= 400) {
          throw Error(data.message);
        }

        toast.success('Success login');
        router.push(buildTranslationListUrl());
      })
      .catch((error) => {
        toast.error(`Error login: ${error.message}`);
      });
  };

  return (
    <div>
      <div className="flex justify-center my-16">
        <AppLogo />
      </div>
      <h1 className="mb-12 text-black">Login </h1>

      <form
        action=""
        onSubmit={form.handleSubmit(loginAction)}
        className={styles.form}
      >
        <input
          type="text"
          placeholder="Email"
          {...form.register('email', {
            required: true,
            pattern: {
              value: RegexPatterns.Email,
              message: 'Please input a valid email',
            },
          })}
        />

        <input
          type="password"
          placeholder="Password"
          {...form.register('password', {
            required: true,
          })}
        />

        <button
          className="button w-full"
          disabled={form.formState.isSubmitting}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
