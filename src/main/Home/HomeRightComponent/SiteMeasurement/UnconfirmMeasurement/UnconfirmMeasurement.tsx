// ...Các import không đổi
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { BsEyeFill } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import apiAxios from "../../../../../api/api";
import { api } from "../../../../service/api/endpoint";
import { useDebounce } from "../../../../service/hooks/useDebounce";

// ...headerNew và headerKey không đổi

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
  "person_contract",
  "telephone_number",
  "date_create",
  "shutter_type",
  "shutter_no",
  "opening_length",
  "opening_height",
];

const UnconfirmMeasurement = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1); // 🆕 Quản lý page
  const pageSize = 20;
  const debouncedSearchValue = useDebounce(searchQuery, 1000);
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [inputValue, setInputValue] = useState("");
  const debouncedSearchValueChooseProject = useDebounce(inputValue, 1000);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenPopup = (item: any) => {
    setSelectedId(item);
    setIsOpen(true);
    setSelectedValue("");
    setInputValue("");
  };

  const fetchDataLogistic = async (
    currentPage: number,
    searchValue: string
  ) => {
    const response = await apiAxios.get(
      api.getProjectCode(currentPage, searchValue)
    );
    return response.data;
  };

  const { data: dataProjectCode, isLoading: isLoadingDataProjectCode } =
    useQuery({
      queryKey: ["dataTotalProduct", debouncedSearchValueChooseProject],
      queryFn: () => fetchDataLogistic(1, debouncedSearchValueChooseProject),
      refetchOnWindowFocus: false,
    });

  const isValidProjectCode =
    dataProjectCode?.confirm_projects?.some(
      (project: any) => project.project_number === inputValue
    ) ?? false;

  const handleSubmit = async (project_code: string) => {
    const isValid = dataProjectCode?.confirm_projects?.some(
      (project: any) => project.project_number === project_code
    );

    if (!isValid) {
      alert("Invalid Project Code. Please select a valid one from the list.");
      return;
    }

    try {
      setIsSubmitting(true);
      await apiAxios.put(
        `https://ec2api.deltatech-backend.com/api/v1/measurement/measurement_report/{measurement_report_id}?measurement_request_id=${encodeURIComponent(
          selectedId
        )}&project_code=${encodeURIComponent(project_code)}`,
        {}
      );
      queryClient.invalidateQueries({
        queryKey: ["dataMeasurementReportUnconfirmed"],
      });
      queryClient.invalidateQueries({
        queryKey: ["dataTotalProduct"],
      });

      setIsOpen(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset page khi search
  };

  const fetchDataMeasurementReport = async (
    currentPage: number,
    status: string,
    searchValue: string
  ) => {
    const response = await apiAxios.get(
      api.getMeasurementReport(currentPage, status, searchValue)
    );
    return response.data;
  };

  const {
    data: dataMeasurementReport,
    isLoading: isLoadingDataMeasurementReport,
  } = useQuery({
    queryKey: [
      "dataMeasurementReportUnconfirmed",
      currentPage,
      debouncedSearchValue,
    ],
    queryFn: () =>
      fetchDataMeasurementReport(
        currentPage,
        "unconfirmed",
        debouncedSearchValue
      ),
    refetchOnWindowFocus: false,
    // keepPreviousData: true,
  });

  const totalCount = dataMeasurementReport?.search_options?.total_count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div>
      {/* Scrollable table + popup logic */}
      <div className="overflow-y-auto" style={{ maxHeight: "84vh" }}>
        <table className="w-full table">
          <thead>
            <tr>
              <td colSpan={12}>
                <input
                  type="text"
                  placeholder="Search by project code or client name or location ..."
                  onChange={(event) => handleSearch(event.target.value)}
                  className="border-2 w-full py-2 px-4 border-red-300 mb-6 rounded-md"
                />
              </td>
            </tr>
            <tr>
              <th>No.</th>
              <th>Action</th>
              {headerNew.map((item, index) => (
                <th key={index}>{item}</th>
              ))}
            </tr>
          </thead>
          <tbody className="w-full">
            {!isLoadingDataMeasurementReport &&
              dataMeasurementReport?.founds?.length === 0 && (
                <tr>
                  <td
                    colSpan={headerNew.length + 2}
                    className="text-center text-red-600 text-xl"
                  >
                    No results
                  </td>
                </tr>
              )}
            {isLoadingDataMeasurementReport && (
              <tr>
                <td colSpan={headerNew.length + 2} className="text-center">
                  Loading...
                </td>
              </tr>
            )}
            {dataMeasurementReport?.founds?.map((item: any, index: number) => (
              <tr key={index}>
                <th>{(currentPage - 1) * pageSize + index + 1}</th>
                <td className="py-2 px-3 border">
                  <div className="flex justify-center items-center gap-2">
                    <Link
                      to={`/home/UnconfirmMeasurementDetail/${item["id"]}`}
                      className="text-blue-600 hover:text-blue-800"
                      title="View Report"
                    >
                      <BsEyeFill size={16} />
                    </Link>
                    <button
                      onClick={() => handleOpenPopup(item["id"])}
                      className="text-green-600 hover:text-green-800"
                      title="Edit Project Code"
                    >
                      <FaEdit size={16} />
                    </button>
                  </div>
                </td>
                {headerKey.map((key, idx) => (
                  <td key={idx} className="text-center">
                    {item[key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* ✅ Popup chọn project code */}
        {isOpen && (
          <div style={styles.overlay}>
            <div style={styles.popup}>
              <h3 style={styles.title}>Select Project Code</h3>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search Project Code..."
                style={styles.input}
              />
              <div style={styles.dropdown}>
                {isLoadingDataProjectCode ? (
                  <p style={styles.loadingText}>Loading...</p>
                ) : (
                  <>
                    {inputValue && isValidProjectCode ? (
                      <div
                        style={{
                          ...styles.dropdownItem,
                          backgroundColor: "#f0f0f0",
                        }}
                      >
                        {inputValue}
                      </div>
                    ) : (
                      dataProjectCode?.confirm_projects
                        ?.filter((item: any) =>
                          item.project_number
                            .toLowerCase()
                            .includes(inputValue.toLowerCase())
                        )
                        ?.map((item: any, index: number) => (
                          <div
                            key={index}
                            onClick={() => {
                              setSelectedValue(item.project_number);
                              setInputValue(item.project_number);
                            }}
                            style={{
                              ...styles.dropdownItem,
                              backgroundColor:
                                selectedValue === item.project_number
                                  ? "#f0f0f0"
                                  : "#fff",
                            }}
                          >
                            {item.project_number}
                          </div>
                        ))
                    )}
                  </>
                )}
              </div>
              <div style={styles.buttonContainer}>
                <button
                  onClick={() => handleSubmit(inputValue)}
                  style={{
                    ...styles.submitButton,
                    backgroundColor:
                      inputValue === "" || !isValidProjectCode
                        ? "#ccc"
                        : styles.submitButton.backgroundColor,
                    cursor:
                      inputValue === "" || !isValidProjectCode
                        ? "not-allowed"
                        : "pointer",
                  }}
                  disabled={inputValue === "" || !isValidProjectCode}
                >
                  Submit
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  style={styles.closeButton}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ✅ Pagination moved outside scroll */}
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

      {/* ✅ Loading overlay when submitting */}
      {isSubmitting && (
        <div style={styles.fullScreenOverlay}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
};

// ✅ style object không thay đổi
const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  popup: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 12,
    minWidth: 350,
    maxWidth: 500,
    width: "90%",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
  },
  title: {
    marginBottom: 16,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    marginBottom: 12,
    border: "1px solid #ccc",
    borderRadius: 6,
    fontSize: 16,
    outline: "none",
  },
  dropdown: {
    maxHeight: 150,
    overflowY: "auto",
    border: "1px solid #ddd",
    borderRadius: 6,
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  dropdownItem: {
    padding: "10px 12px",
    cursor: "pointer",
    borderBottom: "1px solid #eee",
  },
  loadingText: {
    textAlign: "center",
    padding: "10px 0",
    color: "#555",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
  },
  submitButton: {
    padding: "8px 16px",
    backgroundColor: "#27B770",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    fontWeight: "bold",
  },
  closeButton: {
    padding: "8px 16px",
    backgroundColor: "#ccc",
    color: "#333",
    border: "none",
    borderRadius: 6,
    fontWeight: "bold",
    cursor: "pointer",
  },
  fullScreenOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
  },
  spinner: {
    width: 60,
    height: 60,
    border: "6px solid #f3f3f3",
    borderTop: "6px solid #27B770",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};

export default UnconfirmMeasurement;
