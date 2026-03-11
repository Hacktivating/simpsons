import Navbar from "./components/Navbar"
import { Route, Routes } from "react-router"
import HomePage from "./pages/HomePage"
import SessionPage from "./pages/SessionPage"
import ProfilePage from "./pages/ProfilePage"
import CreateSessionPage from "./pages/CreateSessionPage"
import EditSessionPage from "./pages/EditSessionPage"
import { useQuery } from "@tanstack/react-query"
import useAuthReq from "./hooks/useAuthReq"
import useUserSync from "./hooks/useUserSync"

function App() {
  const {isClerkLoaded, isSignedIn} = useAuthReq();
  useUserSync();

  if (!isClerkLoaded) return null;

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/session/:id" element={<SessionPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/create" element={<CreateSessionPage />} />
          <Route path="/edit/:id" element={<EditSessionPage />} />
        </Routes>
      </main>   
    </div>
  )
}

export default App
