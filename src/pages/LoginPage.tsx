// Login page component
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui';
import { useAppStore } from '@/store';
import { ValidationService } from '@/services';
import backgroundImage from '@/assets/images/BG-Image.jpg';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { auth, login } = useAppStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: typeof formData) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev: typeof formErrors) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const errors: typeof formErrors = {};

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!ValidationService.isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (!ValidationService.isValidPassword(formData.password)) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/map');
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-4"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      
      {/* Login Dialog */}
      <div className="relative z-10 w-full max-w-[400px]">
        <div className="bg-white rounded-2xl shadow-2xl w-[400px] h-[494px] pt-12 pb-12 px-10 flex flex-col justify-between">
          <form onSubmit={handleSubmit} className="flex flex-col h-full justify-between">
              {/* Logo/Brand Image */}
              <div className="flex justify-center">
                <svg width="116" height="20" viewBox="0 0 116 20" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                  <rect width="116" height="20" fill="url(#pattern0_8881_3328)"/>
                  <defs>
                    <pattern id="pattern0_8881_3328" patternContentUnits="objectBoundingBox" width="1" height="1">
                      <use xlinkHref="#image0_8881_3328" transform="matrix(0.00308642 0 0 0.0179012 0 -0.00123457)"/>
                    </pattern>
                    <image id="image0_8881_3328" width="324" height="56" preserveAspectRatio="none" xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUQAAAA4CAYAAACFfYHIAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAuPSURBVHgB7Z39edQ6FsZf9uH/HSq4ogKGCq5TAVABkwoSKmCmgptbAaYCQgURFdyhAlRCtoJdnbVMNGeOLMn2fCQ5v+cxg2VZtvXxWkc6VgBFURRFURRFURRFURRFURRFURRFURRFURRFURRFUZRxvMAEjDEL//Pebx9D0MY5ZzEz4TqN3xY+/RaKoigHYJQgBoG68tu13xbssMVMwihdx6c7ScQVRVFSVImLF6gGnUC9L4huMVIYh66jgqgoyqHIigszixvUY1EgjKXXUUFUFOVQJMUlYxaPwUIQxtrrqCAqcxDqHW33vk7d44j4a6/9z2cW/Nrfh4NyEHyeG//ziwW3Pssv44CXwokNyszird+++u0vFm4h9/AorPHp0/FNCCs1v09OaEDXicO3PmO3GJ/2Eul8uDl2gz0VmTyWcH6jvHE1+e+vQ3n9BeEFTALlz99Aefa8FMLuhk/Z7en5yrQjiD78IogqvQEb4fwGZaa3RSecufs5FtR4Pg8cq2nIHHoxrBLHWnSN/jkwlMeD+DpHeXSLrm66TPS/sGuNrP35Pw7hIaE8Lv5VGI8qG4kTdesvchWHjlM8/1/aLMqpus4Z8TH0bqoJXfkVlKlQ/q/89ou/pAVMYZjyzCgRxE/oBGpdO8ZRIYzbKdc5A/oJoTE0UObm2oviPwPHLdu/R92LW3mivMxF8Np0g4mEnp4NpjQ3gR9TT3AImh1vUc9HKEOQWP09cPwNgtM+C19ST9HXrU/COTSQvvbbHyH9zSN8CSsHICuIc0LC11mIu2F4GtCE0aJmAiSYyw2UIWgWeD0UIeQjmcm8l049xe+8jgXxW0FRGKVjiIoMF7/aiZVREwjKLq7jA2Sz91F4MSjnwVF7iE8Q57dltE/m7xrlNGzfYmSPMfre2+DBfCTB3pb2wg3vvkc+epHjvBmT9pGgCbmGhb0De1EJzwnJZB7Kj3B8iV1zndKwU83vMLS0jNKlMfbt2HRD2S1ZmpPLbyjdkHbWWiqoc6so7TaVB1H9X8b3Uft8KojTID/MWBCpfJuSQgiV3rDgH6gUxIyLUx/HoRvf/DtTSbnj6qU/9zakfz2Q9uYcFt0IQzL0fPF4ohGikg9iw8Ikh/87dn6LLk8aDOR58LW9rBWwkO4XJGa8/fEWFeOdQWx6l65FIo5DZfmVpIvy++VlYf1GrnuU/g2L6yCM0/u4ff1cCMfonA0KJ83UZJ6GNDtZaqLxyZQWlYSKQI22yUVF13P9R+odDfAnnYPhoQDjty/hXs6BPcGvfOZBQkPN5Tkdu6u8bl+WZiDOqjRdH4XqV192i6Go6Mrv18zpxve7RDmLUJeyk7nUKwzeBOuBezHoRLeofqogTod/4ZD1SUz4Hn5FBaHSrFGH8du3ivgrlPvnrf09XeP07OX9jDPIKxQ01IBB1xBr0i5N926ojpnuS5wWdZ/cGmTE9lDpCvHXhXEpf0vFdlUSSQVxGgbdeEncKynxSWzYvqsZ6whv3DULjp3ayfx7hc69xLF45I6yRh0OnZ8oTVyQT+lX7KdLfDYjHdTnIDQ6fv3sONYIelegPj8ob5wQrxmRHzREcRnSpfSlF6VBegiDjklC3Pv69n7BG+Ge6dxvA+lKDu+UD3GduxDSXaD85VCUX/52VpDbmUU+/5LoGOJEaEzOFw5l+lUUnPNJ5OZyX2iljedKCPsUjwOFscI2jKFw388/Uc5Xn9aKhdnQQLiJ13/CuMZpkMyiH5gXh8531kVh1m83PkskU7rvVZUg+eTe+nRJzLgYXflw6Tt3ygNej1Jl2GK/DOmFeS34HzfYtxY2sUtUuBdK9y268egFS7fGLc2CLQbDXi5SWe/cT4Dyj57lDgXtS3uI83DL9pM9gyAkDQtuw2+pIHIz4T41KB4q1JYFNyjDCQ3p9wF0b2LO0R3Nw1gSCcZKONxiXi4GTHDJgbzUpEsukRfEiR/bs0QSQzG5MrwQDkll2Ahht5DTJdHjPTO6X4MyNtKnu9HscyOk5VzCX9V1C39sUID2EKfxB/0TZjctditNqqfE32y2dozLR3+LOn6ivGHuXArD9yE9N7VLU/tMAywyJj6VAQmD9DKhVYhuMR8u81xbIezfKKPNHJdciniZNonzktDzmM6TIBZX6s01sSAFUV2hHKknWPLCzzriY8RzohPv3DfuKogz8h27BZXySWzYfvwmLW085wSJbcPCqKE6zAM1ojEz2A7dmNmTIOFSxIc+3gmnlrwQqO7y8TgqQ4vjU2JSvxHCLGZABXE+WuyO3xj+lhW6+o6ZuqUm8w7mwUH4TUjfsCij0i1E6hUd8nolWL99cE9vHUkuiDyfDdt3hXlghbA3QyeYB6fpU9Q5w/bv57JIVBCn8ar/T5hcsdh909L/bbTPx2YsJmAKnLKPgBPCDI7P/79MwIH+8uOZ4LCbt4YdN0L8fKKd2cyDX0lxo1nsBqeDi63DTKggToObuDSoHgsi+SSug1ga7I/BDK3iMshIP8THCAndp8xx5yasWP6EmLNXtjd8Y9hK42fEbJaACuKMCOM8/UxgC9n3kDdigwKCD9ZaOEQCaxF8I6NZuRaPd5mx5Ay6sofDvhvUWP4T70Q9Q56mRTcOTr9xnVvjeIuXGMyECuL8kCjFFaH3SeSCVOQGkECqaG9P1EuSGp2DcghqTcVSJ+elEOzYvuTfuCmYET4EvEc4W49V/RDnp2X7TTTpEWMxgpCW4dc8ocnYCGEOyiHgwuXYPndCN6bsSxkjhDm2z2ehtycSQ+In21+Ymb6QUkGcmTDbZVkw/1KknTArJhX83F9j1CC5euh43syECTQOFwYp31fII5Whja5NdW5RcK1jMfY5s6ggHobvbH+ROV6DJIgmFTmM/dR8qhezNMOLCKyEa9sn6O5yDK4yx6Ux4Fu232LfnLzKlKGB/HVLLDpVdS7wBofjVggbk397qCAehhbpmS838esJ6e14ZQS/iRBGH+unjuWghvBNalDhfGkss+pjeuU31yaxhFoIX7Fgl/i0jee/Qbe8lxHSpTBuvRAbfiHs1+dG6rVGn1G+x4FIWGH0OOICEqZbsmyNAiZNqiQypHnCfmBFOHnBhx6LCQSfMRLFeDyJBOsuXNOFMHpDrzB9wLlBt44iifjPTNpOZ4QnsQ5tioZAHLr8JXO2EeKmJuXW4RwThZE4LQvL0CbKUKrPd8GD4UcmzR6D+ZA+ZVyF/Ouf06CzjhoUUi2IkYc6qe5SiHIXHJQnOchG13msUKFIgjhldrmH/PL4m92gzs2hRigNyv5ezCWUsfTuWg3yDXjr0ot50MuYlr3iq7sY5MvQIV2GN+jaPK83K5S306kv598EFzfy6OBtzCD9nH0eJyk2mU0HNTha1oe6xMuB6A06Ybwz8mBwzXUeJU5eZcZOmEzhaZcKK92D5ADeoOzc0sHzy+duGUzAofy7ayqPD4OJdeN/b1E3228xsJJPCJfWOhSjQxbWWccV/S2R8JV+3ED5mx3bzgoiCZrp1nkjgVqjTuUbFArjxOucK3zyZLbxteDy8BppE5wKn0STKvGNcPwd8tyHlXWkxUR7LDofyBbKWPqhhqLyLHmpug5KL7V4bY9F9zLLphuEtl8gOHWPLR7qAxeg92bmBYSDKJL4ukQUiy7PblAg5i94gL/h/6IcemAyDfsMyn1Xa4XjVGAp83vvOtoL2ScMjvcbsXUj/BKFsqce7UV0vImucQ+dUT4IoTypPfTiMao8WZq9/2qf5qTyMw9/cc/Mkd4cCM9YbZGNFUR6aOqq7q3Ya+ZdcCB5HWV+coKoKE+d2kkVi+5PWd6mIoQenJ0ojDZ3HUVRlLkpEcRR5uoIYVSzWFGUkzIkiLOYqwXCqGaxoihnwwsoSkAnVZTnjn7LrCiKEtAFYpWY11AURVEURVEURVEURVEURVEURVEURRnifxHG25SeGomiAAAAAElFTkSuQmCC"/>
                  </defs>
                </svg>
              </div>
              
              {/* Header */}
              <div className="text-center">
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                  Account Login
                </h1>
                <p className="text-gray-500" style={{ fontSize: '16px' }}>
                  Please enter your details to log in.
                </p>
              </div>

              {/* Email Field */}
              <div>
                <div className="space-y-1 mb-4">
                  <div className="flex items-center space-x-1">
                    <label className="text-sm font-medium text-gray-900">
                      Email
                    </label>
                    <span className="text-red-500 text-sm">*</span>
                  </div>
                  <div className="relative">
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      autoComplete="email"
                      className={`w-full h-[38px] px-3 py-2.5 border rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                        formErrors.email
                          ? 'border-red-300 focus:ring-red-500'
                          : 'border-gray-300'
                      }`}
                      required
                    />
                  </div>
                  {formErrors.email && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-1">
                  <div className="flex items-center space-x-1">
                    <label className="text-sm font-medium text-gray-900">
                      Password
                    </label>
                    <span className="text-red-500 text-sm">*</span>
                  </div>
                  <div className="relative">
                    <input
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className={`w-full h-[38px] px-3 py-2.5 border rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                        formErrors.password
                          ? 'border-red-300 focus:ring-red-500'
                          : 'border-gray-300'
                      }`}
                      required
                    />
                  </div>
                  {formErrors.password && (
                    <p className="text-xs text-red-500 mt-1">{formErrors.password}</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <Button
                  type="submit"
                  className="w-full h-[38px] bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                   loading={auth.isLoading}
                   disabled={auth.isLoading}
                >
                  {auth.isLoading ? 'Logging in...' : 'Log in'}
                </Button>
              </div>
          </form>
        </div>
      </div>
    </div>
  );
};
