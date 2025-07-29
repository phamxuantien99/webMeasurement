import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { BsEyeFill } from "react-icons/bs";
import { IoMdAddCircleOutline } from "react-icons/io";
import { Link } from "react-router-dom";
import apiAxios from "../../../../../api/api";
import { api } from "../../../../service/api/endpoint";
import { useDebounce } from "../../../../service/hooks/useDebounce";

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
  "Serial Number",
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
  "serial_no",
];

const ConfirmMeasurement = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearchValue = useDebounce(searchQuery, 1000);
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const handleSearch = (value: string) => setSearchQuery(value);

  const fetchDataMeasurementReport = async (
    currentPage: number,
    status: string,
    searchValue: string
  ) => {
    try {
      const response = await apiAxios.get(
        api.getMeasurementReport(currentPage, status, searchValue)
      );
      return response.data;
    } catch (error) {
      alert("Something went wrong, please login again!!");
      return { error: "Failed to fetch data" };
    }
  };

  const {
    data: dataMeasurementReport,
    isLoading: isLoadingDataMeasurementReport,
  } = useQuery({
    queryKey: [
      "dataMeasurementReportConfirm",
      currentPage,
      debouncedSearchValue,
    ],
    queryFn: () =>
      fetchDataMeasurementReport(currentPage, "confirm", debouncedSearchValue),
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  const totalCount = dataMeasurementReport?.search_options?.total_count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const handleOpenPopup = (item: any) => {
    setSelectedItem(item);
    setIsOpen(true);
  };

  const handleSubmit = async (serial_number: string) => {
    try {
      setIsSubmitting(true);
      const response = await apiAxios.put(
        `https://ec2api.deltatech-backend.com/api/v1/measurement/measurement_report_serial/{measurement_report_id}?measurement_request_id=${selectedItem}&serial_number=${serial_number}`,
        {}
      );
      queryClient.invalidateQueries("dataMeasurementReportConfirm");
      queryClient.invalidateQueries("dataListSummaryMeasurement");
      setIsOpen(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
                <th key={idx} className="py-2 px-3 border">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoadingDataMeasurementReport && (
              <tr>
                <td
                  colSpan={headerNew.length + 2}
                  className="py-4 text-center text-gray-500"
                >
                  Loading...
                </td>
              </tr>
            )}
            {!isLoadingDataMeasurementReport &&
              dataMeasurementReport?.founds?.length === 0 && (
                <tr>
                  <td
                    colSpan={headerNew.length + 2}
                    className="py-4 text-center text-red-500 font-medium"
                  >
                    No results found
                  </td>
                </tr>
              )}
            {dataMeasurementReport?.founds?.map((item: any, index: number) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-2 px-3 border text-center">
                  {(currentPage - 1) * pageSize + index + 1}
                </td>
                <td className="py-2 px-3 border">
                  <div className="flex justify-center items-center gap-2">
                    <Link
                      to={`/home/measurementReport/${item["id"]}`}
                      className="text-blue-600 hover:text-blue-800"
                      title="View Report"
                    >
                      <BsEyeFill size={16} />
                    </Link>
                    <button
                      onClick={() => handleOpenPopup(item["id"])}
                      className="text-green-600 hover:text-green-800 disabled:opacity-40"
                      disabled={item["serial_no"] !== ""}
                      title="Assign Serial No."
                    >
                      <IoMdAddCircleOutline size={16} />
                    </button>
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

      {/* ✅ Pagination moved outside scrollable container */}
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

      {/* Popup for assigning serial number */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Enter Serial Number</h2>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter serial number..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmit(inputValue)}
                disabled={inputValue === ""}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen loading overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-white bg-opacity-60 z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
};

export default ConfirmMeasurement;

// import { useInfiniteQuery } from "@tanstack/react-query";
// import { useEffect, useRef } from "react";
// import apiAxios from "../../../../../api/api";
// import { api } from "../../../../service/api/endpoint";

// const STATUS = "confirm"; // hoặc "unconfirm" tùy vào use case của bạn
// const SEARCH_VALUE = ""; // có thể dùng useState để dynamic nếu muốn

// const MeasurementList = () => {
//   const observerRef = useRef<HTMLDivElement | null>(null);

//   const fetchDataMeasurementReport = async (
//     currentPage: number,
//     status: string,
//     searchValue: string
//   ) => {
//     try {
//       const response = await apiAxios.get(
//         api.getMeasurementReport(currentPage, status, searchValue)
//       );
//       return response.data; // { confirm_projects: [], search_options: {} }
//     } catch (error) {
//       alert("Something went wrong, please login again!!");
//       return { error: "Failed to fetch data" };
//     }
//   };
//   const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
//     useInfiniteQuery({
//       queryKey: ["measurement-report", STATUS, SEARCH_VALUE],
//       queryFn: ({ pageParam = 1 }: { pageParam?: number }) =>
//         fetchDataMeasurementReport(pageParam, STATUS, SEARCH_VALUE),
//       initialPageParam: 1,
//       getNextPageParam: (lastPage: any, allPages: any[]) => {
//         const totalCount = lastPage?.search_options?.total_count || 0;
//         const pageSize = lastPage?.search_options?.page_size || 20; // fallback nếu API không trả
//         const totalPages = Math.ceil(totalCount / pageSize);
//         const nextPage = allPages.length + 1;

//         return nextPage <= totalPages ? nextPage : undefined;
//       },
//     });

//   useEffect(() => {
//     const observer = new IntersectionObserver((entries) => {
//       if (entries[0].isIntersecting && hasNextPage) {
//         fetchNextPage();
//       }
//     });

//     if (observerRef.current) observer.observe(observerRef.current);
//     return () => observer.disconnect();
//   }, [fetchNextPage, hasNextPage]);

//   return (
//     <div className="p-4 max-w-3xl mx-auto">
//       <h2 className="text-lg font-bold mb-4">Danh sách Measurement Reports</h2>

//       {status === "pending" && <p>Đang tải dữ liệu...</p>}
//       {status === "error" && <p>Có lỗi xảy ra khi tải dữ liệu.</p>}

//       {data?.pages.map((page, pageIndex) => (
//         <div key={pageIndex}>
//           {page.founds.map((item: any) => (
//             <div
//               key={item.id}
//               className="border p-4 mb-3 rounded shadow-sm bg-white"
//             >
//               <p>
//                 <strong>Project:</strong> {item.project_number}
//               </p>
//               <p>
//                 <strong>Client:</strong> {item.client_name}
//               </p>
//               <p>
//                 <strong>Location:</strong> {item.location}
//               </p>
//               <p>
//                 <strong>Serial No:</strong> {item.serial_no}
//               </p>
//             </div>
//           ))}
//         </div>
//       ))}

//       <div ref={observerRef} className="text-center py-4 text-gray-500 text-sm">
//         {isFetchingNextPage
//           ? "Đang tải thêm..."
//           : hasNextPage
//           ? "Kéo xuống để tải thêm"
//           : "Đã hiển thị toàn bộ báo cáo"}
//       </div>
//     </div>
//   );
// };

// export default MeasurementList;
