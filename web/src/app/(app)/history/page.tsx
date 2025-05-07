import { lazy, Suspense } from "react";

const HistoryComp = lazy(() => import("../../../components/history/history"));

export default function HistoryPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HistoryComp />
    </Suspense>
  );
}
