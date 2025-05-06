import { lazy, Suspense } from "react";

const HomeComp = lazy(() => import("../../../components/home/home"));

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeComp />
    </Suspense>
  );
}
