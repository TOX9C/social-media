import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { API_URL } from "../config";

const AuthRouter = ({ children }) => {
  const navigate = useNavigate();
  const token = useMemo(() => {
    const raw = localStorage.getItem("token");
    if (!raw || raw === "undefined") return null;
    return raw;
  }, []);
  const check = async () => {
    try {
      const responce = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
      });
      if (responce.status === 401) navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (!token) navigate("/login");
    check();
  });
  return token ? children : null;
};

export default AuthRouter;
