import { useState } from "react";
import { useDebounce } from "../../../../service/hooks/useDebounce";
import apiAxios from "../../../../../api/api";
import { api } from "../../../../service/api/endpoint";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { BsEyeFill } from "react-icons/bs";

const headerNew = [
  "Project Code",
  "Client Name",
  "Location",
  "Contact Person",
  "Telephone Number",
  "Date Create",
  "Type Of Shutter",
  "Shutter Number",
  "Opening Length",
  "Opening Height",
];

const headerKey = [
  "project_number",
  "client_name",
  "location",
  "contact_person",
  "telephone_number",
  "date_create",
  "shutter_type",
  "shutter_no",
  "opening_length",
  "opening_height",
];

const pageSize = 20;

const ConfirmSurvey = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const debouncedSearchValue = useDebounce(searchQuery, 1000);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const fetchDataSurveyReport = async (
    currentPage: number,
    status: string,
    searchValue: string
  ) => {
    try {
      const response = await apiAxios.get(
        api.getSurveyReport(currentPage, status, searchValue)
      );
      return response.data;
    } catch (error) {
      alert("Something went wrong, please login again!!");
      return { error: "Failed to fetch data" };
    }
  };

  const { data: dataSurveyReport, isLoading: isLoadingDataSurveyReport } =
    useQuery({
      queryKey: ["dataSurveyReportConfirm", currentPage, debouncedSearchValue],
      queryFn: () =>
        fetchDataSurveyReport(currentPage, "confirm", debouncedSearchValue),
      // keepPreviousData: true,
      refetchOnWindowFocus: false,
    });

  const totalCount = dataSurveyReport?.search_options?.total_count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="p-4 bg-white shadow rounded-md">
      {/* Search input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="🔍 Search by project code, client name or location..."
          onChange={(event) => handleSearch(event.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
        />
      </div>

      {/* Scrollable table */}
      <div className="overflow-y-auto" style={{ maxHeight: "75vh" }}>
        <table className="w-full text-sm text-left border border-gray-200">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="py-2 px-3 border">No.</th>
              <th className="py-2 px-3 border text-center">Action</th>
              {headerNew.map((header, idx) => (
                <th key={idx} className="py-2 px-3 border text-center">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoadingDataSurveyReport && (
              <tr>
                <td
                  colSpan={headerNew.length + 2}
                  className="py-4 text-center text-gray-500"
                >
                  Loading...
                </td>
              </tr>
            )}
            {!isLoadingDataSurveyReport &&
              dataSurveyReport?.founds?.length === 0 && (
                <tr>
                  <td
                    colSpan={headerNew.length + 2}
                    className="py-4 text-center text-red-500 font-medium"
                  >
                    No results found
                  </td>
                </tr>
              )}
            {dataSurveyReport?.founds?.map((item: any, index: number) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-2 px-3 border text-center">
                  {(currentPage - 1) * pageSize + index + 1}
                </td>
                <td className="py-2 px-3 border">
                  <div className="flex justify-center items-center gap-2">
                    <Link
                      to={`/home/surveyReport/${item["id"]}`}
                      className="text-blue-600 hover:text-blue-800"
                      title="View Report"
                    >
                      <BsEyeFill size={16} />
                    </Link>
                  </div>
                </td>
                {headerKey.map((key, i) => (
                  <td key={i} className="py-2 px-3 border text-center">
                    {item[key] || "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center px-4 py-3 border-t text-sm bg-white mt-2 rounded-md shadow w-[400px]">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
        </span>
        <button
          onClick={() => {
            if (currentPage < totalPages) {
              setCurrentPage((prev) => prev + 1);
            }
          }}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ConfirmSurvey;
