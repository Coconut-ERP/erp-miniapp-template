import { Suspense } from "react";
import { LoadingRows } from "@erp/miniapp-ui";
import { FormPage } from "@/components/page/form-page";

export default function NewServiceRequestPage() {
  return (
    <Suspense fallback={<LoadingRows rows={5} />}>
      <FormPage />
    </Suspense>
  );
}
