'use client';

import React from 'react';

import { useForm } from 'react-hook-form';

import { RegexPatterns } from 'constants/regexPatterns';

import AppLogo from '@apps/translation-app/app/assets/images/app_logo';
import { LoginFormData } from '../../../models/LoginFormData';

import styles from './LoginForm.module.scss';

const LoginForm = (props: { onSubmit: (data: string) => void }) => {
  const form = useForm<LoginFormData>();

  return (
    <div>
      <div className="flex justify-center my-16">
        <AppLogo />
      </div>
      <h1 className="mb-12 text-black">Login </h1>

      <form
        action=""
        onSubmit={form.handleSubmit((data) =>
          props.onSubmit(JSON.stringify(data)),
        )}
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
