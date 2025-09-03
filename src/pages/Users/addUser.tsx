/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { adminAddUserAction } from "../../reduxKit/actions/admin/userAdctions";
import { toast } from 'react-hot-toast';

import { useDispatch } from "react-redux";
import { AppDispatch } from "../../reduxKit/store";

const AddUserForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    uniqueId: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    if (!formData.uniqueId.trim()) {
      newErrors.uniqueId = "Unique ID is required";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Create FormData object as expected by the API
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("phoneNumber", formData.phoneNumber);
      formDataToSend.append("uniqueId", formData.uniqueId);
      formDataToSend.append("password", formData.password);

      const response = await dispatch(adminAddUserAction(formDataToSend)).unwrap();
      console.log("User added successfully:", response);

      if (response?.success) {
        // Reset form
        setFormData({
          name: "",
          phoneNumber: "",
          uniqueId: "",
          password: "",
        });

        console.log("user data addedd ");
        toast.success('Successfully toasted!')
        
        
        // Navigate to users list or show success message
        navigate("/");
      } else {
        console.error("Add user failed:", response);
      }
    } catch (error) {
      console.error("Add user error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md  mx-auto"></div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="">
            <h1 className=" font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Add New User
            </h1>
           
          </div>

          {/* Divider */}
          <div className="relative py-3 sm:py-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">
                User Details
              </span>
            </div>
          </div>

          {/* Add User Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Name Field */}
              <div>
                <Label>
                  Full Name <span className="text-error-500">*</span>
                </Label>
                <Input
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("name", e.target.value)
                  }
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-error-500">{errors.name}</p>
                )}
              </div>

              {/* Phone Number Field */}
              <div>
                <Label>
                  Phone Number <span className="text-error-500">*</span>
                </Label>
                <Input
                  placeholder="+1 234 567 8900"
                  value={formData.phoneNumber}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("phoneNumber", e.target.value)
                  }
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-error-500">{errors.phoneNumber}</p>
                )}
              </div>

              {/* Unique ID Field */}
              <div>
                <Label>
                  Unique ID <span className="text-error-500">*</span>
                </Label>
                <Input
                  placeholder="Enter unique identifier"
                  value={formData.uniqueId}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("uniqueId", e.target.value)
                  }
                />
                {errors.uniqueId && (
                  <p className="mt-1 text-sm text-error-500">{errors.uniqueId}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <Label>
                  Password <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange("password", e.target.value)
                    }
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    )}
                  </span>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-error-500">{errors.password}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button 
                  className="w-full" 
                  size="sm" 
                  type="submit" 
                  loading={loading}
                  disabled={loading}
                >
                  {loading ? "Adding User..." : "Add User"}
                </Button>
              </div>
            </div>
          </form>

          {/* Back to Users Link */}
         
        </div>
      </div>
    </div>
  );
};

export default React.memo(AddUserForm);