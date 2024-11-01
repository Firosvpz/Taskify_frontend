import React, { useState } from 'react';
import { Button, Col, Row, Form, Container } from 'react-bootstrap';
import { useForm, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaSpinner, FaUser, FaEnvelope, FaLock, FaCheckCircle } from "react-icons/fa";
import { userRegister } from '../api/authApi';
import { useNavigate, Link } from 'react-router-dom';

interface IFormInput {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const RegisterForm: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const {
        register,
        formState: { errors },
        handleSubmit,
        watch
    } = useForm<IFormInput>({ mode: "onChange" });

    const password = watch("password");

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        try {
            setLoading(true);
            const { username, email, password } = data;
            const response = await userRegister(username, email, password);

            if (response?.success) {
                toast.success(response.message);
                navigate('/login');
            } else {
                toast.error(response.message || "Registration failed.");
            }
        } catch (error) {
            toast.error("Registration failed. Please try again.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container fluid className='register-page-container min-vh-100 d-flex align-items-center justify-content-center' style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
            <Row className='justify-content-center w-100'>
                <Col xs={11} sm={9} md={7} lg={5} xl={4} className='p-4 rounded-lg' style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    transition: 'all 0.3s ease-in-out',
                }}>
                    <h1 className="text-center mb-4" style={{ fontWeight: 'bold', color: '#4a4a4a' }}>
                        <span className="text-primary">Task<span style={{ color: '#6c63ff' }}>LY</span></span>
                    </h1>
                    <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group className="mb-3 position-relative">
                            <Form.Control
                                type='text'
                                placeholder='Enter username'
                                {...register("username", {
                                    required: "Name is required",
                                    pattern: {
                                        value: /^[a-zA-Z ]{2,30}$/,
                                        message: "Invalid name",
                                    }
                                })}
                                isInvalid={!!errors.username}
                                style={{ paddingLeft: '2.5rem' }}
                            />
                            <FaUser style={{ position: 'absolute', top: '0.7rem', left: '0.75rem', color: '#6c63ff' }} />
                            <Form.Control.Feedback type="invalid">
                                {errors.username?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3 position-relative">
                            <Form.Control
                                type='email'
                                placeholder='Enter email'
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/,
                                        message: "Invalid email address",
                                    }
                                })}
                                isInvalid={!!errors.email}
                                style={{ paddingLeft: '2.5rem' }}
                            />
                            <FaEnvelope style={{ position: 'absolute', top: '0.7rem', left: '0.75rem', color: '#6c63ff' }} />
                            <Form.Control.Feedback type="invalid">
                                {errors.email?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3 position-relative">
                            <Form.Control
                                type='password'
                                placeholder='Enter password'
                                {...register("password", {
                                    required: "Password is required",
                                    pattern: {
                                        value: /^[a-zA-Z0-9]{4,10}$/,
                                        message: "Password should be 4-10 characters long and contain only letters or numbers",
                                    }
                                })}
                                isInvalid={!!errors.password}
                                style={{ paddingLeft: '2.5rem' }}
                            />
                            <FaLock style={{ position: 'absolute', top: '0.7rem', left: '0.75rem', color: '#6c63ff' }} />
                            <Form.Control.Feedback type="invalid">
                                {errors.password?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-4 position-relative">
                            <Form.Control
                                type='password'
                                placeholder='Confirm password'
                                {...register("confirmPassword", {
                                    required: "Confirm password is required",
                                    validate: (value) => value === password || "Passwords do not match",
                                })}
                                isInvalid={!!errors.confirmPassword}
                                style={{ paddingLeft: '2.5rem' }}
                            />
                            <FaCheckCircle style={{ position: 'absolute', top: '0.7rem', left: '0.75rem', color: '#6c63ff' }} />
                            <Form.Control.Feedback type="invalid">
                                {errors.confirmPassword?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Button
                            disabled={loading}
                            variant='primary'
                            type='submit'
                            className="w-100 mb-3 py-2"
                            style={{
                                background: 'linear-gradient(to right, #6c63ff, #4834d4)',
                                border: 'none',
                                transition: 'all 0.3s ease',
                            }}
                        >
                            {loading ? <FaSpinner className="fa-spin" /> : 'Register'}
                        </Button>
                        
                        <div className="text-center">
                            <Link to='/login' className="text-decoration-none">
                                <span style={{ color: '#6c63ff', fontWeight: 'bold' }}>
                                    Already have an account? Login here
                                </span>
                            </Link>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default RegisterForm;