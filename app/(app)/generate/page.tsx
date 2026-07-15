import { Suspense } from "react";

import GenerateContent from "./GenerateContent";

export default function GeneratePage() {
  return (
    <Suspense fallback={<p className="text-slate-500">Loading generator...</p>}>
      <GenerateContent />
    </Suspense>
  );
}
