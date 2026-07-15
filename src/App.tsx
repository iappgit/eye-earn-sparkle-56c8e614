import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { OfflineProvider } from "@/contexts/OfflineContext";
import { LocalizationProvider } from "@/contexts/LocalizationContext";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import { UICustomizationProvider } from "@/contexts/UICustomizationContext";
import { DragContextProvider } from "@/components/DraggableButton";
import ProtectedRoute from "@/components/ProtectedRoute";
import { SplashScreen } from "@/components/SplashScreen";
import { OfflineBanner } from "@/components/layout/OfflineBanner";
import { SwipeBackIndicator } from "@/components/SwipeBackIndicator";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";
import { useSwipeBack } from "@/hooks/useSwipeBack";
import LaunchChooser from "./pages/LaunchChooser";
import Install from "./pages/Install";
import NotFound from "./pages/NotFound";
import OAuthConsent from "./pages/OAuthConsent";

const DemoApp = lazy(() => import("./demo/DemoApp"));
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const Admin = lazy(() => import("./pages/Admin"));
const Create = lazy(() => import("./pages/Create"));
const Studio = lazy(() => import("./pages/Studio"));
const MyPage = lazy(() => import("./pages/MyPage"));
const SocialConnect = lazy(() => import("./pages/SocialConnect"));
const PromotionDetails = lazy(() =>
  import("./components/PromotionDetails").then((m) => ({
    default: m.PromotionDetails,
  })),
);

const queryClient = new QueryClient();

const RouteFallback: React.FC = () => (
  <div
    className="min-h-[100dvh] flex items-center justify-center bg-background"
    style={{ paddingTop: "env(safe-area-inset-top)" }}
  >
    <div className="text-center px-6">
      <div
        className="w-10 h-10 rounded-full mx-auto mb-3 border-2 border-primary/30 border-t-primary animate-spin"
        aria-hidden
      />
      <p className="text-sm text-muted-foreground">Loading…</p>
    </div>
  </div>
);

const ProductionSplash: React.FC = () => {
  const location = useLocation();
  if (location.pathname.startsWith("/demo") || location.pathname === "/start") return null;
  return <SplashScreen />;
};

const AppContent = () => {
  const location = useLocation();
  const minimalChrome =
    location.pathname.startsWith("/demo") || location.pathname === "/start";

  const { isSwipingBack, swipeProgress } = useSwipeBack({
    enabled: !minimalChrome,
    threshold: 150,
    edgeWidth: 25,
  });

  return (
    <>
      {!minimalChrome && (
        <SwipeBackIndicator isActive={isSwipingBack} progress={swipeProgress} />
      )}
      {!minimalChrome && <BreadcrumbNavigation />}
      {!minimalChrome && <OfflineBanner />}
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/start" element={<LaunchChooser />} />
          <Route path="/demo" element={<DemoApp />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/.lovable/oauth/consent" element={<OAuthConsent />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <Create />
              </ProtectedRoute>
            }
          />
          <Route
            path="/studio"
            element={
              <ProtectedRoute>
                <Studio />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-page"
            element={
              <ProtectedRoute>
                <MyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/social-connect"
            element={
              <ProtectedRoute>
                <SocialConnect />
              </ProtectedRoute>
            }
          />
          <Route path="/install" element={<Install />} />
          <Route
            path="/promotion/:id"
            element={
              <ProtectedRoute>
                <PromotionDetails />
              </ProtectedRoute>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LocalizationProvider>
      <AccessibilityProvider>
        <UICustomizationProvider>
          <DragContextProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <ProductionSplash />
                <AuthProvider>
                  <OfflineProvider>
                    <AppContent />
                  </OfflineProvider>
                </AuthProvider>
              </BrowserRouter>
            </TooltipProvider>
          </DragContextProvider>
        </UICustomizationProvider>
      </AccessibilityProvider>
    </LocalizationProvider>
  </QueryClientProvider>
);

export default App;
