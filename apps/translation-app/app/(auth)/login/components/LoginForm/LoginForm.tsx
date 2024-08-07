'use client';

import React from 'react';

import { CookieKeys } from '@constants/cookieKeys';
import { addDays } from 'date-fns';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { RegexPatterns } from 'constants/regexPatterns';

import AppLogo from '@apps/translation-app/app/assets/images/app_logo';
import { buildTranslationProjectUrl } from '@apps/translation-app/app/translation/navigations/translations.navigation';
import { request } from '@apps/translation-app/lib/apiClient';
import { LoginFormData } from '../../../models/LoginFormData';
import { ResponseLoginSchema } from '../../../models/ResponseLogin';

import styles from './LoginForm.module.scss';

const LoginForm = (props: { onSubmit: (data: string) => void }) => {
  const form = useForm<LoginFormData>();
  const router = useRouter();

  const loginAction = async (data: LoginFormData) => {
    return request('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        const data = ResponseLoginSchema.parse(response);

        Cookies.set(CookieKeys.AccessToken, data.accessToken, {
          sameSite: 'strict',
        });
        Cookies.set(
          CookieKeys.Expiry,
          addDays(new Date(), 1).getTime().toString(),
          {
            sameSite: 'strict',
          },
        );
        Cookies.set(CookieKeys.User, JSON.stringify(data.user), {
          sameSite: 'strict',
        });
        toast.success('Success login');
        router.push(buildTranslationProjectUrl());
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
        onSubmit={form.handleSubmit((data) => loginAction(data))}
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
