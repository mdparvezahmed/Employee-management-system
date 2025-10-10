import axios from 'axios';
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [rememberMe, setRememberMe] = React.useState(false);

    const navigate = useNavigate();

    const { login } = useAuth();

    const [error, setError] = React.useState(null);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            const response = await axios.post('http://localhost:7000/api/auth/login', {
                email,
                password
            });
            if(response.data.success){
                login(response.data.user)
                localStorage.setItem('token', response.data.token);
                if(response.data.user.role === 'admin'){
                    navigate('/admin-dashboard');
                }else{
                    navigate('/employee-dashboard');
                }
            }
        } catch (error) {
            if(error.response && !error.response.data.success){
                setError(error.response.data.message);
            }else{
                setError('An error occurred. Please try again.');
            }
        }

    }

    return (
        <div className='flex flex-col items-center h-screen justify-center bg-gradient-to-b from-gray-900 from-60% to-gray-800'>
            <h2 className='font-bitcount text-gray-100 text-3xl mb-6'>Employee Management System</h2>
            <form className='bg-gray-850 p-6 rounded-2xl shadow-lg border border-gray-700' onSubmit={handleSubmit}>
                <h2 className='text-2xl mb-4 text-teal-400'>Login</h2>
                <div className='mb-4'>
                    <label className='block text-gray-300' htmlFor='email'>Email:</label>
                    <input className='border border-gray-700 bg-gray-800 p-2 rounded w-full text-gray-100 focus:border-teal-400 focus:outline-none'
                        type='email' id='email'
                        name='email'
                        placeholder='Enter email'
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className='mb-4'>
                    <label className='block text-gray-300' htmlFor='password'>Password:</label>
                    <input className='border border-gray-700 bg-gray-800 p-2 rounded w-full text-gray-100 focus:border-teal-400 focus:outline-none'
                        type='password' id='password'
                        name='password'
                        placeholder='******' required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className='mb-4 flex items-center justify-between'>
                    <label className='flex items-center text-gray-300' htmlFor='rememberMe'>
                        <input type='checkbox' id='rememberMe'
                            name='rememberMe'
                            className='mr-2 accent-teal-500'
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        Remember me
                    </label>
                    <a href="#" className='text-teal-400 hover:underline ml-2'>Forgot password?</a>
                </div>
                <button className='w-full bg-teal-500 hover:bg-teal-600 text-white p-2 rounded transition-colors duration-200' type='submit'>Login</button>
                {error && <p className='text-red-500 mt-4'>{error}</p>}
            </form>
        </div>
    );
}

export default Login
