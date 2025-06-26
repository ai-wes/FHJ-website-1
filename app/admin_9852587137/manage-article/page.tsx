import * as React from "react";
import ManageArticleForm from "./form";

export default function ManageArticlePage() {
  return (
    <React.Suspense
      fallback={
        <div className="container mx-auto py-10 px-4 text-center">
          <p>Loading...</p>
        </div>
      }
    >
      <ManageArticleForm />
    </React.Suspense>
  );
}
