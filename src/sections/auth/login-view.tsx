'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Stack, Button, Typography, Link, Card, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

// components
import FormProvider from '../../components/hook-form/form-provider';
import { RHFTextField } from '../../components/hook-form';

import { useAuth } from '../../context/auth-provider';
import { useRouter } from 'next/navigation';

// ----------------------------------------------------------------------

const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const RegisterSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type LoginFormData = z.infer<typeof LoginSchema>;
type RegisterFormData = z.infer<typeof RegisterSchema>;

export default function LoginView() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { login, register } = useAuth();

  const router = useRouter();

  const loginMethods = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const registerMethods = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      confirmPassword: '',
    },
  });

  const handleLoginSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      router.push('/leads');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleRegisterSubmit = async (data: RegisterFormData) => {
    try {
      await register(data.email, data.password, data.firstName, data.lastName);
      router.push('/leads');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Stack
      spacing={2}
      sx={{
        minHeight: '100vh',
        padding: 3,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Card sx={{ p: 5, width: '100%', maxWidth: 480 }}>
        <Typography variant="h4" textAlign="center" mb={4}>
          {isLogin ? 'Login' : 'Register'}
        </Typography>

        {isLogin ? (
          <FormProvider
            methods={loginMethods}
            onSubmit={loginMethods.handleSubmit(handleLoginSubmit)}
          >
            <Stack spacing={3}>
              <RHFTextField name="email" label="Email" />
              <RHFTextField
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                disabled={loginMethods.formState.isSubmitting}
              >
                Login
              </Button>
            </Stack>
          </FormProvider>
        ) : (
          <FormProvider
            methods={registerMethods}
            onSubmit={registerMethods.handleSubmit(handleRegisterSubmit)}
          >
            <Stack spacing={3}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <RHFTextField name="firstName" label="First Name" />
                <RHFTextField name="lastName" label="Last Name" />
              </Stack>
              <RHFTextField name="email" label="Email" />
              <RHFTextField
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <RHFTextField
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={toggleConfirmPasswordVisibility} edge="end">
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                disabled={registerMethods.formState.isSubmitting}
              >
                Register
              </Button>
            </Stack>
          </FormProvider>
        )}

        <Typography variant="body2" textAlign="center" sx={{ mt: 3 }}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <Link
            component="button"
            variant="subtitle2"
            onClick={() => setIsLogin(!isLogin)}
            sx={{ textDecoration: 'none' }}
          >
            {isLogin ? 'Register' : 'Login'}
          </Link>
        </Typography>
      </Card>
    </Stack>
  );
}
