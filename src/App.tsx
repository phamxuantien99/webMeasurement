import React, { CSSProperties, Suspense, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { FadeLoader } from "react-spinners";
import "./App.css";
import withAuth from "./main/com/RequiredAuth";

const Home = React.lazy(() => import("./main/Home/Home"));
const Login = React.lazy(() => import("./main/Login/Login"));
const InvoiceCase2 = React.lazy(
  () => import("./main/Home/InvoiceCase2/InvoiceCase2")
);

const UnconfirmMeasurementDetail = React.lazy(
  () =>
    import(
      "./main/Home/HomeRightComponent/SiteMeasurement/UnconfirmMeasurement/UnconfirmMeasurementDetail"
    )
);
const FormSummary = React.lazy(
  () => import("./main/Home/FormSummary/FormSummary")
);

const FormReportSurvey = React.lazy(
  () => import("./main/Home/FormSurvey/FormSurvey")
);

const FormSummarySurvey = React.lazy(
  () =>
    import(
      "./main/Home/HomeRightComponent/SiteServey/ProjectCode/SummarySurvey/SummarySurvey"
    )
);

// const FormSummarySurveyReportUnconfirm = React.lazy(
//   () =>
//     import(
//       "./main/Home/HomeRightComponent/SiteServey/UnconfirmSurvey/SummarySurveyUnconfirm/SummarySurveyUnconfirm"
//     )
// );

const override: CSSProperties = {
  display: "flex",
  margin: "500px auto",
  borderColor: "red",
};

function App() {
  const ProtectedComponent = withAuth(Home);
  const navigate = useNavigate();
  const location = useLocation();

  const getToken = () => {
    const token = localStorage.getItem("access_token_installation");
    const expiration = localStorage.getItem("expiration_installation");
    if (token && expiration && new Date(expiration) > new Date()) {
      return token;
    }
    return null;
  };

  useEffect(() => {
    const token = getToken();
    if (token && location.pathname === "/") {
      navigate("/home"); // Chuyển hướng đến trang chủ nếu token còn hạn
    }
  }, [navigate, location.pathname]);

  return (
    <Suspense
      fallback={
        <div>
          {" "}
          <FadeLoader
            cssOverride={override}
            color="red"
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/home"
          element={<ProtectedComponent element={<Home />} />}
        />
        {/* Measurement */}
        <Route path="/home/measurementReport/:id" element={<InvoiceCase2 />} />

        <Route
          path="/home/UnconfirmMeasurementDetail/:id"
          element={<UnconfirmMeasurementDetail />}
        />

        <Route
          path="/home/formSummary/:project_number"
          element={<FormSummary />}
        />
        {/* Survey */}
        {/* confirm and unconfirm detail */}
        <Route path="/home/surveyReport/:id" element={<FormReportSurvey />} />
        {/* project code  */}
        <Route
          path="/home/formSurvey/:project_number"
          element={<FormSummarySurvey />}
        />

        {/* <Route
          path="/home/formSurveySummaryUnConfirm/:id"
          element={<FormSummarySurveyReportUnconfirm />}
        /> */}
      </Routes>
    </Suspense>
  );
}

export default App;
