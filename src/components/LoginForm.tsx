import { useState } from "react";
import { Row, Col, Button, Form, Container } from "react-bootstrap";
import { useForm, SubmitHandler } from 'react-hook-form';
import { userLogin } from "../api/authApi";
import toast from "react-hot-toast";
import { FaSpinner, FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { setUser } from "../redux/slice/authSlice";
import { useDispatch } from "react-redux";

interface IFormInput {
    email: string;
    password: string;
}

const LoginForm: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        register,
        formState: { errors },
        handleSubmit
    } = useForm<IFormInput>({ mode: "onChange" });

    const showError = (message: string) => {
        toast.error(message);
    };

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        setLoading(true);
        try {
            const { email, password } = data;
            const response = await userLogin(email, password);

            if (response.success) {
                toast.success(response.message);
                dispatch(setUser(response.token));
                navigate('/dashboard');
            } else {
                showError(response.message || "Login Error");
            }
        } catch (error) {
            showError("Login failed. Please try again.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container
            fluid
            className="login-page-container min-vh-100 d-flex align-items-center justify-content-center"
            style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}
        >
            <Row className="justify-content-center w-100">
                <Col xs={11} sm={9} md={7} lg={5} xl={4} className="login-form-container p-4 rounded-lg"
                    style={{
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                        border: '1px solid rgba(255, 255, 255, 0.18)',
                        transition: 'all 0.3s ease-in-out',
                    }}
                >
                    <h1 className="text-center mb-4" style={{ fontWeight: 'bold', color: '#4a4a4a' }}>
                        <span className="text-primary">Task<span style={{ color: '#6c63ff' }}>LY</span></span>
                    </h1>

                    <Form noValidate onSubmit={handleSubmit(onSubmit)}>
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
                                aria-invalid={!!errors.email}
                                aria-describedby="email-error"
                                style={{ paddingLeft: '2.5rem' }}
                            />
                            <FaEnvelope style={{ position: 'absolute', top: '0.7rem', left: '0.75rem', color: '#6c63ff' }} />
                            {errors.email && (
                                <Form.Control.Feedback type="invalid" id="email-error">
                                    {errors.email.message}
                                </Form.Control.Feedback>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-4 position-relative">
                            <Form.Control
                                type='password'
                                placeholder='Enter password'
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 4,
                                        message: "Password should be at least 4 characters long",
                                    },
                                    maxLength: {
                                        value: 10,
                                        message: "Password should not exceed 10 characters",
                                    }
                                })}
                                isInvalid={!!errors.password}
                                aria-invalid={!!errors.password}
                                aria-describedby="password-error"
                                style={{ paddingLeft: '2.5rem' }}
                            />
                            <FaLock style={{ position: 'absolute', top: '0.7rem', left: '0.75rem', color: '#6c63ff' }} />
                            {errors.password && (
                                <Form.Control.Feedback type="invalid" id="password-error">
                                    {errors.password.message}
                                </Form.Control.Feedback>
                            )}
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
                            {loading ? <FaSpinner className="fa-spin" /> : 'Login'}
                        </Button>
                    </Form>

                    <div className="text-center">
                        <Link to='/' className="text-decoration-none">
                            <span style={{ color: '#6c63ff', fontWeight: 'bold' }}>
                                Don't have an account? Register here
                            </span>
                        </Link>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default LoginForm;
