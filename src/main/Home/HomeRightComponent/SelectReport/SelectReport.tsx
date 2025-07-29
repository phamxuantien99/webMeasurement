import { useContext } from "react";
import AuthContext, { AuthContextType } from "../../../context/AuthProvider";

const dataSelectOption = ["summary-report", "confirm", "unconfirmed"];

const SelectReport = () => {
  const { setSelectedAnalysis, selectedAnalysis } = useContext(
    AuthContext
  ) as AuthContextType;

  const handleButtonClick = (value: string) => {
    setSelectedAnalysis(value);
  };

  return (
    <div className="flex flex-wrap gap-3 items-center justify-start mb-4">
      {dataSelectOption.map((item, index) => {
        const isActive = selectedAnalysis === item;
        return (
          <button
            key={index}
            onClick={() => handleButtonClick(item)}
            className={`px-6 py-2 rounded-full border font-medium text-sm transition-all duration-200 capitalize 
            ${
              isActive
                ? "bg-[#22ABE0] text-white border-[#22ABE0] shadow-md"
                : "bg-white text-gray-700 border-gray-300 hover:bg-[#22ABE0] hover:text-white hover:border-[#22ABE0]"
            }`}
          >
            {item.replace(/-/g, " ")}
          </button>
        );
      })}
    </div>
  );
};

export default SelectReport;
