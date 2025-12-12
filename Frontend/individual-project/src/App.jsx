import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CharactersPage from "./pages/CharactersPage";
import CharacterDetailPage from "./pages/CharacterDetailPage";
import WeaponsPage from "./pages/WeaponsPage";
import WeaponDetailPage from "./pages/WeaponDetailPage";
import ArtifactsPage from "./pages/ArtifactsPage";
import ArtifactDetailPage from "./pages/ArtifactDetailPage";
import FavoriteCharactersPage from "./pages/FavoriteCharactersPage";
import MyTeamsPage from "./pages/MyTeamsPage";
import TeamDetailPage from "./pages/TeamDetailPage";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/characters" element={<CharactersPage />} />
        <Route path="/characters/:id" element={<CharacterDetailPage />} />
        <Route path="/weapons" element={<WeaponsPage />} />
        <Route path="/weapons/:id" element={<WeaponDetailPage />} />
        <Route path="/artifacts" element={<ArtifactsPage />} />
        <Route path="/artifacts/:id" element={<ArtifactDetailPage />} />
        <Route
          path="/favoritecharacters"
          element={<FavoriteCharactersPage />}
        />
        <Route path="/myteams" element={<MyTeamsPage />} />
        <Route path="/myteams/:id" element={<TeamDetailPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
