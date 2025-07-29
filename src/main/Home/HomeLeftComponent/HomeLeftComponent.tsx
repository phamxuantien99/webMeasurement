import { useState } from "react";
import apiAxios from "../../../api/api";
import logo1 from "../../../assets/images/logo1.png";
import { api } from "../../service/api/endpoint";
import { ToastContainer } from "react-toastify";
import Select from "react-select/base";

const HomeLeftComponent = () => {
  const [formData, setFormData] = useState({
    projectNumber: "",
    clientName: "",
    location: "",
    personalContact: "",
    telephoneNumber: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [isLoading, setIsLoading] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors: { [key: string]: string } = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key as keyof typeof formData].trim()) {
        newErrors[key] = "This field is required";
        valid = false;
      }
    });
    setErrors(newErrors);
    return valid;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        await apiAxios.post(
          api.postProjectCodeConfirm(
            formData.projectNumber,
            formData.clientName,
            formData.location,
            formData.personalContact,
            formData.telephoneNumber
          )
        );
        console.log("Form Data Submitted:", formData);
        setFormData({
          projectNumber: "",
          clientName: "",
          location: "",
          personalContact: "",
          telephoneNumber: "",
        });
        setErrors({});
      } catch (error) {
        console.error("Submission failed", error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  return (
    // <div className="bg-white p-6 rounded-lg shadow-lg w-96 fixed inset-0 m-auto flex flex-col items-center z-50 gap-10">
    //   <div className="flex justify-between items-center">
    //     <img className="w-[500px]" src={logo1} alt="logo" />
    //   </div>
    //   <h1 className="text-xl font-bold mb-3 uppercase">
    //     Create New Project Information
    //   </h1>

    //   <form onSubmit={handleSubmit} className="space-y-4 w-full">
    //     {Object.keys(formData).map((key) => (
    //       <div key={key}>
    //         <label
    //           className="block text-sm font-medium text-gray-700 mb-1"
    //           htmlFor={key}
    //         >
    //           {key
    //             .replace(/([A-Z])/g, " $1")
    //             .replace(/^./, (str) => str.toUpperCase())}
    //         </label>
    //         <input
    //           id={key}
    //           type={key === "telephoneNumber" ? "tel" : "text"}
    //           name={key}
    //           placeholder={key
    //             .replace(/([A-Z])/g, " $1")
    //             .replace(/^./, (str) => str.toUpperCase())}
    //           value={formData[key as keyof typeof formData]}
    //           onChange={handleChange}
    //           className={`w-full p-2 border rounded ${
    //             errors[key] ? "border-red-500" : "border-gray-300"
    //           }`}
    //         />
    //         {errors[key] && (
    //           <p className="text-red-500 text-sm">{errors[key]}</p>
    //         )}
    //       </div>
    //     ))}
    //     <button
    //       type="submit"
    //       className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
    //       disabled={isLoading}
    //     >
    //       {isLoading ? "Submitting..." : "Submit"}
    //     </button>
    //   </form>
    // </div>

    <form
      // ref={generateInvoiceFormRef}
      className="flex flex-col gap-5 mb-7 p-7 border-2 rounded-2xl shadow-2xl w-full md:min-w-[400px] bg-white"
      onSubmit={handleSubmit}
    >
      <ToastContainer />
      <div className="flex justify-between items-center">
        <img className="w-[500px]" src={logo1} alt="logo" />
      </div>

      <div className="grid gap-5">
        {Object.keys(formData).map((key) => (
          <div key={key}>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor={key}
            >
              {key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
            </label>
            <input
              id={key}
              type={key === "telephoneNumber" ? "tel" : "text"}
              name={key}
              placeholder={key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
              value={formData[key as keyof typeof formData]}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                errors[key] ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors[key] && (
              <p className="text-red-500 text-sm mt-2">{errors[key]}</p>
            )}
          </div>
        ))}
      </div>
      <button
        type="submit"
        className={`btn btn - primary 
          ${isLoading && "loading"}`}
      >
        {/* Generate Installation */}
        Generate New Project
      </button>
    </form>
  );
};

export default HomeLeftComponent;
