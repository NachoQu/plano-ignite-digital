import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { lazy, Suspense } from "react";
import '@/i18n/config';

const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const TikTok = lazy(() => import("./pages/TikTok"));
const Reportes = lazy(() => import("./pages/Reportes"));
const Login = lazy(() => import("./pages/Login"));
const Facturacion = lazy(() => import("./pages/Facturacion"));
const Prospeccion = lazy(() => import("./pages/Prospeccion"));
const ArcaTester = lazy(() => import("./components/ArcaTester"));

const queryClient = new QueryClient();

const LazyFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
);

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/blog" element={<Suspense fallback={<LazyFallback />}><Blog /></Suspense>} />
            <Route path="/blog/:slug" element={<Suspense fallback={<LazyFallback />}><BlogPost /></Suspense>} />
            <Route path="/tiktok" element={<Suspense fallback={<LazyFallback />}><TikTok /></Suspense>} />
            <Route path="/reportes" element={<Suspense fallback={<LazyFallback />}><Reportes /></Suspense>} />
            <Route path="/login" element={<Suspense fallback={<LazyFallback />}><Login /></Suspense>} />
            <Route path="/facturacion" element={<Suspense fallback={<LazyFallback />}><Facturacion /></Suspense>} />
            <Route path="/prospeccion" element={<Suspense fallback={<LazyFallback />}><Prospeccion /></Suspense>} />
            <Route path="/arca-test" element={<Suspense fallback={<LazyFallback />}><ArcaTester /></Suspense>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
