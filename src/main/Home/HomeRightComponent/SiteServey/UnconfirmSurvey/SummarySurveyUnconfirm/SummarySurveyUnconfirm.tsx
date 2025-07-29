// import { useQuery } from "@tanstack/react-query";
// import { CSSProperties, useMemo, useRef } from "react";
// import { FcPrint } from "react-icons/fc";
// import { GoDotFill } from "react-icons/go";
// import { useParams } from "react-router-dom";
// import { FadeLoader } from "react-spinners";
// import ReactToPrint from "react-to-print";
// import apiAxios from "../../../../../../api/api";
// import logo2 from "../../../../../../assets/images/logo2.png";
// import pictureSummary from "../../../../../../assets/images/pictureSummary.png";
// import { api } from "../../../../../service/api/endpoint";
// import "./SummarySurveyUncofirm.css";
// const override: CSSProperties = {
//   display: "flex",
//   margin: "500px auto",
//   borderColor: "red",
// };
// function SummarySurveyUnconfirm() {
//   const { id } = useParams(); // Lấy giá trị từ URL
//   const invoiceContentRef = useRef<any>();
//   // const fetchDataSurveyProjectSession = async (session: string) => {
//   //   try {
//   //     const response = await apiAxios.get(api.getSurveyReportSummary(session));
//   //     return response.data; // { founds: [], search_options: {} }
//   //   } catch (error) {
//   //     alert("Something went wrong, please login again!!");
//   //     return { list_survey_reports: [] }; // Tránh lỗi khi dữ liệu không có
//   //   }
//   // };

//   // const {
//   //   data: dataSurveySummaryProjectSession,
//   //   isLoading: isLoadingDataSurveySummaryProjectSession,
//   // } = useQuery({
//   //   queryKey: ["dataSurveySummaryProjectSession", project_session],
//   //   queryFn: () => fetchDataSurveyProjectSession(project_session as string),
//   //   refetchOnWindowFocus: false,
//   // });

//   const NumberId = Number(id);
//   const fetchDataDetailById = async (idReport: number) => {
//     try {
//       const response = await apiAxios.get(api.getDetailSurveyReport(idReport));
//       return response.data; // { confirm_projects: [], search_options: {} }
//     } catch (error) {
//       alert("Something went wrong, please login again!!");
//       return { error: "Failed to fetch data" };
//     }
//   };

//   const { data: dataDetailReportSurvey, isLoading: isDataDetailReportSurvey } =
//     useQuery({
//       queryKey: ["dataDetailReportSurvey", NumberId],
//       queryFn: () => fetchDataDetailById(NumberId),
//       refetchOnWindowFocus: false, // Không gọi lại API khi chuyển tab
//       enabled: !!NumberId,
//     });

//   if (isDataDetailReportSurvey)
//     return (
//       <FadeLoader
//         loading={isDataDetailReportSurvey}
//         cssOverride={override}
//         color="red"
//         aria-label="Loading Spinner"
//         data-testid="loader"
//       />
//     );

//   return (
//     <div className="w-[1300px] mx-auto p-10">
//       <div className="flex justify-between items-center">
//         <div className="text-center mb-5">
//           <ReactToPrint
//             trigger={() => (
//               <button className="btn btn-ghost gap-3 capitalize">
//                 <FcPrint size={24} />
//                 Print
//               </button>
//             )}
//             documentTitle={`N/A - Site Survey - ${dataDetailReportSurvey?.project_session}`}
//             content={() => invoiceContentRef.current}
//             pageStyle={`
//           @page { margin: 20mm; }
//           @media print {
//             body { -webkit-print-color-adjust: exact; }
//             .print-content {
//               position: relative;
//             }
//             .page-break {
//                 page-break-before: always;
//             }
//             .no-page-break {
//                 page-break-before: auto;
//             }
//             .page-number {
//               position: fixed;
//               bottom: 10mm;
//               right: 10mm;
//               color: black;
//             }
//           }
//         `}
//           />
//         </div>
//       </div>
//       <div>
//         <div
//           id="capture"
//           className="invoice-container page"
//           ref={invoiceContentRef}
//         >
//           <div
//           // key={index}
//           // className={index === 0 ? "no-page-break" : "page-break"}
//           >
//             <div className="flex gap-10 justify-between items-center mt-10 border-b border-solid border-gray-400 pb-3 w-5/6 mx-auto">
//               <img src={logo2} alt="logo" className="w-[300px]" />

//               <div className="text-right text-sm">
//                 <p className="font-bold text-blue-600">
//                   No.34 Loyang Crescent <br /> Singapore 508993
//                 </p>
//                 <p>
//                   <strong>T:</strong>{" "}
//                   <a href="tel:+6562857813">+65 6285 7813</a>
//                 </p>
//                 <p>
//                   <strong>E:</strong>{" "}
//                   <a href="mailto:enquiry@deltatech.com.sg">
//                     enquiry@deltatech.com.sg
//                   </a>
//                 </p>
//                 <p>
//                   <strong>W:</strong>{" "}
//                   <a target="_black" href="www.deltatech.com.sg">
//                     www.deltatech.com.sg
//                   </a>
//                 </p>
//               </div>
//             </div>
//             <div className="flex justify-around items-center m-4">
//               <h1 className="text-center text-xl font-bold">
//                 SURVEY FORM FOR DOOR
//               </h1>
//               <p className="font-bold">
//                 Survey door overview reference: <span>SFM-PRN-OO1</span>
//               </p>
//             </div>

//             {/* infor customer */}
//             <div className="flex justify-between items-center mt-3">
//               {/* left */}
//               <div>
//                 <p className="font-bold text-black">
//                   Client:
//                   <span className="font-normal pl-2">
//                     {
//                       dataSurveySummaryProjectSession?.list_survey_reports[0]
//                         ?.client_name
//                     }
//                   </span>
//                 </p>

//                 <p className="font-bold text-black">
//                   Project:
//                   <span className="font-normal pl-2">N/A</span>
//                 </p>

//                 <p className="font-bold text-black">
//                   Location:
//                   <span className="font-normal pl-2">
//                     {
//                       dataSurveySummaryProjectSession?.list_survey_reports[0]
//                         ?.location
//                     }
//                   </span>
//                 </p>

//                 <p className="font-bold text-black">
//                   PIC:
//                   <span className="font-normal pl-2">
//                     {
//                       dataSurveySummaryProjectSession?.list_survey_reports[0]
//                         ?.created_by
//                     }
//                   </span>
//                 </p>

//                 <p className="font-bold text-black">
//                   Contact:
//                   <span className="font-normal pl-2">
//                     {
//                       dataSurveySummaryProjectSession?.list_survey_reports[0]
//                         ?.contact_person
//                     }
//                   </span>
//                 </p>
//               </div>

//               {/* Right */}
//               <div>
//                 <p className="font-bold text-black">
//                   Date:
//                   <span className="font-normal pl-2">
//                     {" "}
//                     {
//                       dataSurveySummaryProjectSession?.list_survey_reports[0]
//                         ?.date_create
//                     }
//                   </span>
//                 </p>

//                 <p className="font-bold text-black">
//                   Project refercence no:
//                   <span className="font-normal pl-2">
//                     Project refercence no
//                   </span>
//                 </p>
//               </div>
//             </div>

//             {/* picutre */}
//             <img src={pictureSummary} alt="" />

//             <table className="mt-7 w-full">
//               <table border={1} width={"100%"} className="w-full">
//                 <thead></thead>
//                 <tbody>
//                   <tr>
//                     <td className="text-sm" rowSpan={2}>
//                       No
//                     </td>
//                     <td className="text-sm" rowSpan={2}>
//                       L1
//                     </td>
//                     <td className="text-sm" rowSpan={2}>
//                       H1
//                     </td>
//                     <td className="text-sm" rowSpan={2} width={60}>
//                       Shutter Type
//                     </td>
//                     <td className="text-sm" rowSpan={2} width={60}>
//                       Shutter No
//                     </td>
//                     <td className="text-sm" rowSpan={2}>
//                       Finishing
//                     </td>
//                     <td className="text-sm" rowSpan={2} width={90}>
//                       Installation Position
//                     </td>

//                     <td className="text-sm" rowSpan={2} width={60}>
//                       Serial No
//                     </td>

//                     <td className="text-sm" colSpan={2}>
//                       Motor
//                     </td>
//                     <td className="text-sm" colSpan={2}>
//                       Area
//                     </td>
//                     <td className="text-sm" rowSpan={2}>
//                       Lintel
//                     </td>
//                     <td className="text-sm" rowSpan={2}>
//                       Stiffenter
//                     </td>
//                     <td className="text-sm" rowSpan={2}>
//                       Remark
//                     </td>
//                   </tr>
//                   <tr>
//                     <td>LH</td>
//                     <td>RH</td>
//                     <td>In</td>
//                     <td>Out</td>
//                   </tr>
//                   {dataSurveySummaryProjectSession?.list_survey_reports?.map(
//                     (item: any, index: number) => (
//                       <>
//                         <tr key={`${item?.id}-1`}>
//                           <td className="text-sm" rowSpan={2}>
//                             {index + 1}
//                           </td>
//                           <td className="text-sm" rowSpan={2}>
//                             {item?.opening_width}
//                           </td>
//                           <td className="text-sm" rowSpan={2}>
//                             {item?.opening_height}
//                           </td>
//                           <td className="text-sm" rowSpan={2}>
//                             {item?.type_of_shutter}
//                           </td>
//                           <td className="text-sm" rowSpan={2}>
//                             {item?.shutter_number}
//                           </td>
//                           <td className="text-sm" rowSpan={2}>
//                             {item?.finishing}
//                           </td>
//                           <td className="text-sm" rowSpan={2}>
//                             {item?.installation_position}
//                           </td>

//                           <td className="text-sm" rowSpan={2}>
//                             Serial No
//                           </td>

//                           <td className="text-sm">
//                             {item?.motor_side === "left" && (
//                               <GoDotFill size={20} />
//                             )}
//                           </td>
//                           <td className="text-sm">
//                             {item?.motor_side === "right" && (
//                               <GoDotFill size={20} />
//                             )}
//                           </td>

//                           <td className="text-sm" rowSpan={2}>
//                             {item?.area_in}
//                           </td>
//                           <td className="text-sm" rowSpan={2}>
//                             {item?.area_out}
//                           </td>
//                           <td className="text-sm" rowSpan={2}>
//                             {item?.lintel}
//                           </td>
//                           <td className="text-sm" rowSpan={2}>
//                             {item?.stiffener}
//                           </td>
//                           <td className="text-sm" rowSpan={2}>
//                             {item?.other_comment}
//                           </td>
//                         </tr>

//                         {/* 🔽 Hàng thứ hai để `rowSpan={2}` hoạt động đúng */}
//                         <tr key={`${item?.id}-2`}>
//                           <td className="text-sm"></td>
//                           <td className="text-sm"></td>
//                         </tr>
//                       </>
//                     )
//                   )}
//                 </tbody>
//               </table>
//             </table>

//             {/* Note */}
//             <div className="m-5 pl-10 flex flex-col justify-start items-start ">
//               <p>To note</p>
//               <p>Able to generate a overall list base on the latest</p>
//               <p>Able to filter and generate based on type</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SummarySurveyUnconfirm;
