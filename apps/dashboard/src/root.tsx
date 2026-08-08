import ReactDom from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./App";
import { StrictMode } from "react";
import "./globals.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RootLayout from "./layouts/RootLayout";
import Jobpage from "./pages/Jobpage";
import Loginpage from "./pages/Loginpage";
import { Toaster } from "@/components/ui/toast";
import AuthLayout from "./layouts/AuthLayout";
import Queuepage from "./pages/Queuepage";

const root = document.getElementById("root");
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

ReactDom.createRoot(root as ReactDom.Container).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename="/dashboard">
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<App />} />
            <Route path="/job/:jobId" element={<Jobpage />} />
            <Route path="/queues" element={<Queuepage />} />
          </Route>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Loginpage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  </StrictMode>
);
