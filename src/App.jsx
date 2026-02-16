import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>PlanMyTrip PoC</h1>

      <MapContainer
        center={[48.8566, -67.5220]}  // Matane
        zoom={12}
        style={{ height: "80vh", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  );
}
