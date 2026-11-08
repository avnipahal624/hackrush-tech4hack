import "@vly-ai/integrations";
import { Toaster } from "@/components/ui/sonner";
import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import React, { StrictMode, Suspense, lazy, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import "./index.css";

const Landing = lazy(() => import("./pages/Landing.tsx"));

function RouteLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper p-6">
      <div className="border-[3px] border-ink bg-brand-lime px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.12em] shadow-[4px_4px_0_#171717]">
        Loading HACKRUSH 2026…
      </div>
    </div>
  );
}

/** Silent error boundary so the toolbar can never blank the preview. */
class ToolbarErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err: Error) {
    console.warn("[VlyToolbar] Caught error, toolbar disabled:", err.message);
  }
  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

/** Hard guard so runtime errors never leave the preview as a blank page. */
class RootErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; message: string; stack: string }
> {
  state = { hasError: false, message: "", stack: "" };
  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      message: error.message || "Unknown runtime error",
      stack: error.stack || "",
    };
  }
  componentDidCatch(err: Error) {
    console.error("[Preview] Root crash:", err);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-paper p-6 text-ink">
          <div className="brutal-card max-w-lg p-5 text-center">
            <p className="font-display text-lg uppercase">Preview runtime error</p>
            <p className="mt-2 break-words text-xs text-ink/70">
              {this.state.message}
            </p>
            {this.state.stack ? (
              <pre className="mt-3 max-h-40 overflow-auto border-2 border-ink bg-paper p-2 text-left text-[10px] leading-4 text-ink/60">
                {this.state.stack}
              </pre>
            ) : null}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function RouteSyncer() {
  const location = useLocation();

  useEffect(() => {
    window.parent.postMessage(
      { type: "iframe-route-change", path: location.pathname },
      "*",
    );
  }, [location.pathname]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "navigate") {
        if (event.data.direction === "back") window.history.back();
        if (event.data.direction === "forward") window.history.forward();
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootErrorBoundary>
      <ToolbarErrorBoundary>
        <VlyToolbar />
      </ToolbarErrorBoundary>
      <BrowserRouter>
        <RouteSyncer />
        <Suspense fallback={<RouteLoading />}>
          <Routes>
            <Route path="*" element={<Landing />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <Toaster
        position="bottom-right"
        closeButton
        toastOptions={{
          duration: 4200,
          classNames: {
            toast:
              "!rounded-none !border-[3px] !border-ink !bg-paper !font-body !text-ink !shadow-[4px_4px_0_#171717]",
            title: "!font-heading !text-sm !font-bold !uppercase !tracking-wide",
            description: "!text-ink/70 !text-xs",
            actionButton:
              "!rounded-none !border-2 !border-ink !bg-brand-lime !text-ink !font-heading !text-xs !font-bold",
            cancelButton:
              "!rounded-none !border-2 !border-ink !bg-white !text-ink !font-heading !text-xs !font-bold",
            closeButton:
              "!rounded-none !border-2 !border-ink !bg-white !text-ink",
          },
        }}
      />
    </RootErrorBoundary>
  </StrictMode>,
);
