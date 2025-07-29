// import { useQuery } from "@tanstack/react-query";
// import { useState } from "react";
// import apiAxios from "../../../../../api/api";
// import { api } from "../../../../service/api/endpoint";
// import { useDebounce } from "../../../../service/hooks/useDebounce";
// import { Link } from "react-router-dom";
// import { BsEyeFill } from "react-icons/bs";

// const headerNew = [
//   "Project Code",
//   "Client Name",
//   "Location",
//   "Person Contact",
//   "Telephone Number",
//   // "Update By",
//   // "Update At",
// ];

// const headerKey = [
//   "project_number",
//   "client_name",
//   "location",
//   "person_contract",
//   "telephone_number",
// ];

// const ProjectCodeMeasurement = () => {
//   const [searchQuery, setSearchQuery] = useState<string>("");
//   const debouncedSearchValue = useDebounce(searchQuery, 1000);

//   const fetchDataLogistic = async (
//     currentPage: number,
//     searchValue: string
//   ) => {
//     try {
//       const response = await apiAxios.get(
//         api.getListProjectCodeHaveMeasurementReport(currentPage, searchValue)
//       );
//       return response.data; // { confirm_projects: [], search_options: {} }
//     } catch (error) {
//       alert("Something went wrong, please login again!!");
//       return { error: "Failed to fetch data" };
//     }
//   };

//   const { data: dataProjectCode, isLoading: isLoadingDataProjectCode } =
//     useQuery({
//       queryKey: ["dataTotalProduct", debouncedSearchValue],
//       queryFn: () => fetchDataLogistic(1, debouncedSearchValue),
//       refetchOnWindowFocus: false, // Không gọi lại API khi chuyển tab
//     });

//   const handleSearch = (value: string) => {
//     setSearchQuery(value);
//   };

//   return (
//     <div>
//       <div className="overflow-y-auto " style={{ maxHeight: "84vh" }}>
//         <table className="w-full table">
//           <thead>
//             <tr>
//               <td colSpan={11}>
//                 <input
//                   type="text"
//                   placeholder="Search..."
//                   value={searchQuery}
//                   onChange={(event) => handleSearch(event.target.value)}
//                   className="border-2 w-full py-2 px-4 border-red-300 bord mb-6 rounded-md"
//                 ></input>
//               </td>
//             </tr>
//             <tr>
//               <th>No.</th>
//               <th>Status</th>
//               {/* <th>Action</th> */}
//               {headerNew.map((item, index) => (
//                 <th key={index}>{item}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="w-full">
//             <tr>
//               {!isLoadingDataProjectCode &&
//                 dataProjectCode?.confirm_projects?.length === 0 && (
//                   <td
//                     colSpan={headerNew.length + 2}
//                     className={"text-center, text-xl, text-red-500"}
//                   >
//                     No results
//                   </td>
//                 )}
//               {isLoadingDataProjectCode && (
//                 <td colSpan={headerNew.length + 2} className={"text-center"}>
//                   Loading...
//                 </td>
//               )}
//             </tr>
//             {dataProjectCode?.confirm_projects?.map(
//               (item: any, index: number) => {
//                 return (
//                   <tr key={index}>
//                     <th>{index + 1}</th>
//                     <td key={"action"}>
//                       <div className="flex gap-3 justify-center items-center">
//                         <Link
//                           to={`/home/formSummary/${item["project_number"]}`}
//                           className="btn btn-square btn-outline btn-sm"
//                         >
//                           <BsEyeFill size={16} />
//                         </Link>
//                       </div>
//                     </td>
//                     {headerKey.map((key, index) => (
//                       <td key={index}>{item[key]}</td>
//                     ))}
//                   </tr>
//                 );
//               }
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ProjectCodeMeasurement;

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { BsEyeFill } from "react-icons/bs";
import apiAxios from "../../../../../api/api";
import { api } from "../../../../service/api/endpoint";
import { useDebounce } from "../../../../service/hooks/useDebounce";

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
  "person_contact",
  "telephone_number",
];

const pageSize = 20;

const ProjectCodeMeasurement = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const debouncedSearchValue = useDebounce(searchQuery, 500);

  const fetchProjectData = async () => {
    const res = await apiAxios.get(
      api.getListProjectCodeHaveMeasurementReport(
        currentPage,
        debouncedSearchValue
      )
    );
    return res.data;
  };

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["projectList", currentPage, debouncedSearchValue],
    queryFn: fetchProjectData,
    // keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  const totalCount = data?.search_options?.total_count || 0;
  const totalPage = Math.ceil(totalCount / pageSize);
  const projects = Array.isArray(data?.confirm_projects)
    ? data.confirm_projects
    : [];

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return (
    <div className="p-4 bg-white shadow rounded-md">
      <div className="mb-4">
        <input
          type="text"
          placeholder="🔍 Search by client, location, etc."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
        />
        {/* {!isLoading && (
          <p className="mt-2 text-sm text-gray-600">
            Total{" "}
            <span className="font-semibold text-black">{projects.length}</span>{" "}
            / <span className="font-semibold text-black">{totalCount}</span>{" "}
            projects
          </p>
        )} */}
      </div>

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
            {isLoading || isFetching ? (
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
                <tr
                  key={`${item.project_number}-${index}`}
                  className="hover:bg-gray-50"
                >
                  <td className="py-2 px-3 border text-center">
                    {(currentPage - 1) * pageSize + index + 1}
                  </td>
                  <td className="py-2 px-3 border">
                    <div className="flex justify-center items-center">
                      <Link
                        to={`/home/formSummary/${item.project_number}`}
                        className="text-blue-600 hover:text-blue-800"
                        title="View Summary"
                      >
                        <BsEyeFill size={16} />
                      </Link>
                    </div>
                  </td>
                  {headerKey.map((key, idx) => (
                    <td key={idx} className="py-2 px-3 border">
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

export default ProjectCodeMeasurement;
