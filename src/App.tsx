import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import NotFound from "./pages/NotFound";
import TikTok from "./pages/TikTok";
import Reportes from "./pages/Reportes";
import Login from "./pages/Login";
import Facturacion from "./pages/Facturacion";
import Prospeccion from "./pages/Prospeccion";
import ArcaTester from "./components/ArcaTester";
import '@/i18n/config';

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/tiktok" element={<TikTok />} />
            <Route path="/reportes" element={<Reportes />} />
            <Route path="/login" element={<Login />} />
            <Route path="/facturacion" element={<Facturacion />} />
            <Route path="/prospeccion" element={<Prospeccion />} />
            <Route path="/arca-test" element={<ArcaTester />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
