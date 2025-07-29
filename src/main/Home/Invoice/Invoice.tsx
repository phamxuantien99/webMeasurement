import { useQuery } from "@tanstack/react-query";
import { CSSProperties, useRef } from "react";
import { FcPrint } from "react-icons/fc";
import { useParams } from "react-router-dom";
import { FadeLoader } from "react-spinners";
import { useReactToPrint } from "react-to-print";
import pictureWeb from "../../../assets/images/Screenshot 2024-05-09 170657.png";
import { api } from "../../service/api/endpoint";
import "./InvoiceStyle.css";

import apiAxios from "../../../api/api";
import logo2 from "../../../assets/images/logo2.png";

const override: CSSProperties = {
  display: "flex",
  margin: "500px auto",
  borderColor: "red",
};

function Invoice() {
  const { id } = useParams();
  //   const { auth } = useContext(AuthContext) as AuthContextType;
  //   console.log({ auth });
  const auth = localStorage.getItem("authTokenInstallation");






  

  return (
  
  );
}

export default Invoice;
