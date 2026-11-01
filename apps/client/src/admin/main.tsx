// 관리자 페이지 시작 (/admin/). 게임 화면과 따로 묶임
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AdminApp } from "./AdminApp";
import "../styles/base.css";
import "../styles/admin.css";
import "../styles/admin-pw.css";
import "../styles/admin-docs.css";
import "../styles/admin-status.css";
import "../styles/tier-play.css";

const root = document.getElementById("root");
if (!root) throw new Error("#root 없음");
createRoot(root).render(
  <StrictMode>
    <AdminApp />
  </StrictMode>,
);
