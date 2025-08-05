import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Report from "./pages/Report";
import Login from "./pages/Login";
import { AuthProvider } from "./components/AuthProvider";
import LiveMatch from "./pages/LiveMatch";
import { ThemeProvider } from "./components/ThemeProvider";
import SignUp from './pages/SignUp';




const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Toaster />
        <Sonner />
        <BrowserRouter basename="/Scout-IA">
          <AuthProvider>
            <Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<SignUp />} />


  <Route
    path="/"
    element={
      <AuthProvider>
        <Index />
      </AuthProvider>
    }
  />
  <Route
    path="/report"
    element={
      <AuthProvider>
        <Report />
      </AuthProvider>
    }
  />
  <Route
    path="/live"
    element={
      <AuthProvider>
        <LiveMatch />
      </AuthProvider>
    }
  />

  <Route path="*" element={<NotFound />} />
</Routes>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;