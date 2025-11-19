import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Donor from "./pages/Donor";
import Beneficiary from "./pages/Beneficiary";
import NGO from "./pages/NGO";
import Merchant from "./pages/Merchant";
import Auditor from "./pages/Auditor";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/donor" element={<Donor />} />
          <Route path="/beneficiary" element={<Beneficiary />} />
          <Route path="/ngo" element={<NGO />} />
          <Route path="/merchant" element={<Merchant />} />
          <Route path="/auditor" element={<Auditor />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
