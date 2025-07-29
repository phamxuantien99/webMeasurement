import { useContext } from "react";
import SelectReport from "../SelectReport/SelectReport";
import AuthContext, { AuthContextType } from "../../../context/AuthProvider";
import ProjectCode from "../SiteServey/ProjectCode/ProjectCode";
import ConfirmSurvey from "./ConfirmSurvey/ConfirmSurvey";
import UnconfirmSurvey from "./UnconfirmSurvey/UnconfirmSurvey";

const SiteServey = () => {
  const { selectedAnalysis } = useContext(AuthContext) as AuthContextType;
  return (
    <div>
      <SelectReport />
      <div className="mt-5">
        {selectedAnalysis === "summary-report" && <ProjectCode />}
        {selectedAnalysis === "confirm" && <ConfirmSurvey />}
        {selectedAnalysis === "unconfirmed" && <UnconfirmSurvey />}
      </div>
    </div>
  );
};

export default SiteServey;
