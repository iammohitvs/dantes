import ReactDom from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./App";
import { StrictMode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RootLayout from "./layouts/RootLayout";

const root = document.getElementById("root");
const queryClient = new QueryClient();

ReactDom.createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<App />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
