
import React, { useState } from 'react';

import './SignUp.scss';
import { useNavigate } from 'react-router-dom';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react'; // אייקונים מודרניים


const validationSignUp = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email"),
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  phone: Yup.string()
    .required("Phone is required")
    .matches(/^0\d{8,9}$/, "Phone must start with 0 and be 9–10 digits"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
});

const SignUp: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      name: '',
      phone: '',
      password: '',
      role: 2, 

    },
    validationSchema: validationSignUp,
onSubmit: async (values) => {
  try {
    const { data } = await axios.get(`http://localhost:3001/users?email=${values.email}`);

    if (data.length > 0) {
      setEmailExists(true);
    } else {
      setEmailExists(false);

      // שליחת הרשמה
      await axios.post('http://localhost:3001/users', values);
      navigate('/login')
    }
  } catch (error) {
    console.error("Error checking email or registering", error);
  }
},

  });

  return (
    <div className="sign-up-page">
      <div className="sign-up-container">
        <h2>Sign Up</h2>
        <form onSubmit={formik.handleSubmit}>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter Email Address"
            onChange={formik.handleChange}
            value={formik.values.email}
          />
          {formik.errors.email && <div className="error">{formik.errors.email}</div>}
          {emailExists && <div className="error">Email already registered. Please login.</div>}

          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter name"
            onChange={formik.handleChange}
            value={formik.values.name}
          />
          {formik.errors.name && <div className="error">{formik.errors.name}</div>}

          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="Enter phone number"
            onChange={formik.handleChange}
            value={formik.values.phone}
          />
          {formik.errors.phone && <div className="error">{formik.errors.phone}</div>}

        <div className="password-wrapper">
  <input
    id="password"
    name="password"
    type={showPassword ? "text" : "password"}
    placeholder="Enter password"
    onChange={formik.handleChange}
    value={formik.values.password}
  />
  {/* <button
    type="button"
    className="toggle-password"
    onClick={() => setShowPassword(!showPassword)}
    tabIndex={-1}
  >
    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
  </button> */}
</div>
          {formik.errors.password && <div className="error">{formik.errors.password}</div>}

          <button type="submit" className="submit-button">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;