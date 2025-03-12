import { Suspense } from "react";
import { Navigate, Route, Routes, useRoutes } from "react-router-dom";
import routes from "tempo-routes";
import LoginForm from "./components/auth/LoginForm";
import SignUpForm from "./components/auth/SignUpForm";
import Dashboard from "./components/pages/dashboard";
import Success from "./components/pages/success";
import Home from "./components/pages/home";
import { AuthProvider, useAuth } from "../supabase/auth";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "./components/ui/theme-provider";
import { SupabaseProvider } from "./contexts/SupabaseContext";

// HR Pages
import EmployeesPage from "./pages/hr/EmployeesPage";
import PayrollPage from "./pages/hr/PayrollPage";
import AdvancesPage from "./pages/hr/AdvancesPage";
import ReportsPage from "./pages/hr/ReportsPage";
import PrintPage from "./pages/hr/PrintPage";
import HRDashboard from "./pages/hr/HRDashboard";
import TimeManagementPage from "./pages/hr/TimeManagementPage";
import IncentivesPage from "./pages/hr/IncentivesPage";
import SettingsPage from "./pages/hr/SettingsPage";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  // Add Tempo routes if in Tempo environment
  const tempoRoutes =
    import.meta.env.VITE_TEMPO === "true" ? useRoutes(routes) : null;

  return (
    <>
      {tempoRoutes}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="/success" element={<Success />} />

        {/* HR Routes */}
        <Route
          path="/hr"
          element={
            <PrivateRoute>
              <HRDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/employees"
          element={
            <PrivateRoute>
              <EmployeesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/payroll"
          element={
            <PrivateRoute>
              <PayrollPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/advances"
          element={
            <PrivateRoute>
              <AdvancesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/time"
          element={
            <PrivateRoute>
              <TimeManagementPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/incentives"
          element={
            <PrivateRoute>
              <IncentivesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <PrivateRoute>
              <ReportsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/print"
          element={
            <PrivateRoute>
              <PrintPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <SettingsPage />
            </PrivateRoute>
          }
        />

        {/* Add a catch-all route to handle any undefined routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <SupabaseProvider>
        <ThemeProvider defaultTheme="light">
          <LanguageProvider>
            <Suspense fallback={<p>Loading...</p>}>
              <AppRoutes />
            </Suspense>
          </LanguageProvider>
        </ThemeProvider>
      </SupabaseProvider>
    </AuthProvider>
  );
}

export default App;
