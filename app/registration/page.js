"use client";
import { useState } from "react";
import Paragraph from "../components/Paragraph";
import Button from "../components/Button";

const initialFormData = {
  name: "",
  email: "",
  gender: "",
  about: "",
};

export default function registration() {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function validate(data) {
    const newErrors = {};

    if (!data.name.trim()) {
      newErrors.name = "Full name is required.";
    } else if (data.name.trim().length < 3) {
      newErrors.name = "Full name must be at least 3 characters.";
    }

    if (!data.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!data.gender) {
      newErrors.gender = "Please select a gender.";
    }

    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newErrors = validate(formData);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Form submitted:", formData);
      setFormData(initialFormData);
    }
  }

  const inputClass =
    "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";
  const errorClass = "text-sm text-red-600 mt-1";

  return (
    <>

    

      <form
        onSubmit={handleSubmit}
        noValidate
        className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md space-y-5"
      >
        <h2 className="text-2xl font-bold text-gray-800">Registration</h2>

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className={inputClass}
          />
          {errors.name && <p className={errorClass}>{errors.name}</p>}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className={inputClass}
          />
          {errors.email && <p className={errorClass}>{errors.email}</p>}
        </div>

        <div>
          <span className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </span>
          <div className="flex items-center space-x-6">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === "male"}
                onChange={handleChange}
                className="text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Male</span>
            </label>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === "female"}
                onChange={handleChange}
                className="text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Female</span>
            </label>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="other"
                checked={formData.gender === "other"}
                onChange={handleChange}
                className="text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Other</span>
            </label>
          </div>
          {errors.gender && <p className={errorClass}>{errors.gender}</p>}
        </div>

        <div>
          <label
            htmlFor="about"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            About
          </label>
          <textarea
            id="about"
            name="about"
            rows="4"
            value={formData.about}
            onChange={handleChange}
            placeholder="Tell us a little about yourself..."
            className={inputClass}
          ></textarea>
        </div>

        <div>
          <Button value="Register" type="submit"/>   
        </div>
       
      </form>


      <Paragraph>This is testing</Paragraph>

    </>
  );
}