import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import apiAxios from "../../../../../api/api";
import { api } from "../../../../service/api/endpoint";
import { useDebounce } from "../../../../service/hooks/useDebounce";
import { Link } from "react-router-dom";
import { BsEyeFill } from "react-icons/bs";

const headerNew = [
  "Project Code",
  "Client Name",
  "Location",
  "Person Contact",
  "Telephone Number",
];

const headerKey = [
  "project_number",
  "client_name",
  "location",
  "person_contract",
  "telephone_number",
];

const pageSize = 20;

const ProjectCode = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const debouncedSearchValue = useDebounce(searchQuery, 500);

  const fetchDataLogistic = async () => {
    try {
      const response = await apiAxios.get(
        api.getListProjectCodeHaveSurveyReport(
          currentPage,
          debouncedSearchValue
        )
      );
      return response.data;
    } catch (error) {
      alert("Something went wrong, please login again!!");
      return { error: "Failed to fetch data" };
    }
  };

  const {
    data: dataProjectCode,
    isLoading: isLoadingDataProjectCode,
    isFetching,
  } = useQuery({
    queryKey: ["dataTotalProduct", currentPage, debouncedSearchValue],
    queryFn: fetchDataLogistic,
    // keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const projects = dataProjectCode?.confirm_projects ?? [];
  const totalCount = dataProjectCode?.search_options?.total_count || 0;
  const totalPage = Math.ceil(totalCount / pageSize);

  return (
    <div className="p-4 bg-white shadow rounded-md">
      <div className="mb-4">
        <input
          type="text"
          placeholder="🔍 Search by client, location, etc."
          value={searchQuery}
          onChange={(event) => handleSearch(event.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
        />
      </div>

      <div className="overflow-y-auto" style={{ maxHeight: "75vh" }}>
        <table className="w-full text-sm text-left border border-gray-200">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="py-2 px-3 border text-center">No.</th>
              <th className="py-2 px-3 border text-center">Action</th>
              {headerNew.map((item, index) => (
                <th key={index} className="py-2 px-3 border">
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoadingDataProjectCode || isFetching ? (
              <tr>
                <td
                  colSpan={headerNew.length + 2}
                  className="py-4 text-center text-gray-500"
                >
                  Loading...
                </td>
              </tr>
            ) : projects.length === 0 ? (
              <tr>
                <td
                  colSpan={headerNew.length + 2}
                  className="py-4 text-center text-red-500 font-medium"
                >
                  No results found
                </td>
              </tr>
            ) : (
              projects.map((item: any, index: number) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-2 px-3 border text-center">
                    {(currentPage - 1) * pageSize + index + 1}
                  </td>
                  <td className="py-2 px-3 border">
                    <div className="flex justify-center items-center">
                      <Link
                        to={`/home/formSurvey/${item["project_number"]}`}
                        className="text-blue-600 hover:text-blue-800"
                        title="View Survey"
                      >
                        <BsEyeFill size={16} />
                      </Link>
                    </div>
                  </td>
                  {headerKey.map((key, index) => (
                    <td key={index} className="py-2 px-3 border">
                      {item[key] || "-"}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center px-4 py-3 border-t text-sm bg-white mt-2 rounded-md w-[400px]">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page <strong>{currentPage}</strong> of <strong>{totalPage}</strong>
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPage))
          }
          disabled={currentPage === totalPage}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProjectCode;
