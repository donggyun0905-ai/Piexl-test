// 도트 편집 페이지 시작 (/pixel/). 게임 화면과 따로 묶임
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PixelApp } from "./PixelApp";
import "../styles/base.css";
import "../styles/pixel.css";
import "../styles/pixel-create.css";

const root = document.getElementById("root");
if (!root) throw new Error("#root 없음");
createRoot(root).render(
  <StrictMode>
    <PixelApp />
  </StrictMode>,
);
