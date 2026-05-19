// frontend/src/pages/Login.tsx

import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import API from "../api/axios";

const Login = () => {
  const navigate =
    useNavigate();

  const [isLogin, setIsLogin] =
    useState(true);

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
      role: "sales",
    });

  const handleChange = (
    e: React.ChangeEvent<
      | HTMLInputElement
      | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      const endpoint =
        isLogin
          ? "/auth/login"
          : "/auth/register";

      const res =
        await API.post(
          endpoint,
          formData
        );

      // LOGIN

      if (isLogin) {
        localStorage.setItem(
          "token",
          res.data.token
        );

        localStorage.setItem(
          "role",
          res.data.role
        );

        navigate(
          "/dashboard"
        );
      }

      // REGISTER

      else {
        alert(
          "Registration successful"
        );

        setIsLogin(true);
      }
    } catch (error: any) {
      console.log(error);

      console.log(
        error.response
      );

      alert(
        error?.response?.data
          ?.message ||
          "Authentication failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {isLogin
            ? "Login"
            : "Register"}
        </h1>

        <form
          onSubmit={
            handleSubmit
          }
          className="space-y-4"
        >
          {/* NAME */}

          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="w-full border p-3 rounded"
              value={
                formData.name
              }
              onChange={
                handleChange
              }
              required
            />
          )}

          {/* EMAIL */}

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border p-3 rounded"
            value={
              formData.email
            }
            onChange={
              handleChange
            }
            required
          />

          {/* PASSWORD */}

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border p-3 rounded"
            value={
              formData.password
            }
            onChange={
              handleChange
            }
            required
          />

          {/* ROLE */}

          {!isLogin && (
            <select
              name="role"
              className="w-full border p-3 rounded"
              value={
                formData.role
              }
              onChange={
                handleChange
              }
            >
              <option value="sales">
                Sales User
              </option>

              <option value="admin">
                Admin
              </option>
            </select>
          )}

          {/* BUTTON */}

          <button
            type="submit"
            className="w-full bg-black text-white p-3 rounded"
          >
            {isLogin
              ? "Login"
              : "Register"}
          </button>
        </form>

        {/* TOGGLE */}

        <p className="text-center mt-4">
          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}

          <button
            onClick={() =>
              setIsLogin(
                !isLogin
              )
            }
            className="text-blue-500 ml-2"
          >
            {isLogin
              ? "Register"
              : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;