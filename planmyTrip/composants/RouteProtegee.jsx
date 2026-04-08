import { Navigate } from "react-router";
import { lireUtilisateurConnecte } from "../services/stockageLocal.js";

export default function RouteProtegee({ children }) {
  const utilisateurConnecte = lireUtilisateurConnecte();

  if (!utilisateurConnecte) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
