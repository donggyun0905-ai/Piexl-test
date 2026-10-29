// 관리자 수치 설명 (vite 플러그인 balanceDocsPlugin.mjs가 공용 코드 주석에서 만듦): { 표 이름: { "값.경로": "설명", "": 표 설명 } }
declare module "virtual:balance-docs" {
  const docs: Record<string, Record<string, string>>;
  export default docs;
}
