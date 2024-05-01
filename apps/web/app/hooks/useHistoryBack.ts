import React from "react";
import { useNavigate } from "@remix-run/react";

export const useHistoryBack = () => {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  return { goBack };
};
