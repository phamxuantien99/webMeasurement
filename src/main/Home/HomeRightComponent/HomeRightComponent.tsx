import { useContext } from "react";
import LogoutBtn from "../Logout/LogoutBtn";
import SelectValue from "./SelectValue/SelectValue";
import AuthContext, { AuthContextType } from "../../context/AuthProvider";
import SiteMeasurement from "./SiteMeasurement/SiteMeasurement";
import SiteServey from "./SiteServey/SiteServey";

const HomeRightComponent = () => {
  const { selectSite } = useContext(AuthContext) as AuthContextType;

  return (
    <div>
      <div className="flex mb-5 justify-between items-center">
        <SelectValue />
        <LogoutBtn />
      </div>
      {selectSite === "Site Measurement" && <SiteMeasurement />}

      {selectSite === "Site Survey" && <SiteServey />}
    </div>
  );
};

export default HomeRightComponent;
