import { Routes, Route } from "react-router-dom";

import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor";
import Documents from "./pages/Documents";
import Settings from "./pages/Settings";
import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./pages/Profile";

import MainLayout from "./layout/MainLayout";

export default function App() {
  return (
    <Routes>

      <Route path="/" element={<AuthPage />} />

      <Route
        path="/dashboard"
        element={
          <MainLayout>
            <Dashboard />
          </MainLayout>
        }
      />

      <Route
        path="/home"
        element={
          <MainLayout>
            <Home />
          </MainLayout>
        }
      />

      <Route
        path="/about"
        element={
          <MainLayout>
            <About />
          </MainLayout>
        }
      />

      <Route
        path="/profile"
        element={
          <MainLayout>
            <Profile />
          </MainLayout>
        }
      />

      <Route
        path="/editor"
        element={
          <MainLayout>
            <Editor />
          </MainLayout>
        }
      />

      <Route
        path="/documents"
        element={
          <MainLayout>
            <Documents />
          </MainLayout>
        }
      />

      <Route
        path="/settings"
        element={
          <MainLayout>
            <Settings />
          </MainLayout>
        }
      />

    </Routes>
  );
}