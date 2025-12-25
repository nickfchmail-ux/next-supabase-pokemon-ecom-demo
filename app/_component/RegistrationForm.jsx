'use client';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useForm } from 'react-hook-form';
import Logo from './Logo';
function onSubmit(data) {
  console.log(data);
}

function RegistrationForm({ onClose }) {
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-[max-content] space-y-2 bg-amber-50 p-5 gap-y-5 rounded-2xl"
    >
      <Logo className="flex justify-start" />
      <TextField
        label="Email"
        variant="standard"
        type="text"
        className={`px-2 rounded-2xl p-0.5`}
        {...register('email', {
          required: 'An Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address',
          },
        })}
      />
      {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      <TextField
        label="Password"
        variant="standard"
        type="password"
        id="password"
        className={`px-2 rounded-2xl`}
        {...register('password', {
          required: 'A password is required',
          minLength: {
            value: 6,
            message: 'Password must be at least 6 characters',
          },
        })}
      />
      {errors.password && <p className="text-red-500">{errors.password.message}</p>}
      <TextField
        label="Confirm Password"
        variant="standard"
        type="password"
        id="confirmPassword"
        className={`px-2 rounded-2xl`}
        {...register('confirmPassword', {
          required: 'A password is required',
          validate: (value) => {
            return value === password || 'The passwords do not match';
          },
        })}
      />
      {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
      <TextField
        label="Address"
        variant="standard"
        type="text"
        id="address"
        className={`px-2 rounded-2xl`}
        {...register('address', { required: 'An address is required' })}
      />
      {errors.address && <p className="text-red-500">{errors.address.message}</p>}
      <li className="list-none flex gap-2 mt-5">
        <Button
          variant="outlined"
          sx={{
            borderColor: '#ff5722',
            color: '#ff5722',
            '&:hover': {
              borderColor: '#e64a19',
              color: '#e64a19',
            },
          }}
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          variant="outlined"
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            e.currentTarget.closest('form')?.requestSubmit();
          }}
        >
          Submit
        </Button>
      </li>
    </form>
  );
}

export default RegistrationForm;
