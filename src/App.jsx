import { Marker, Popup } from "react-leaflet";

import { Polyline, useMap } from "react-leaflet";
import L from "leaflet";


const [fromText, setFromText] = useState("Cégep de Matane");
const [toText, setToText] = useState("Riôtel Matane");

const [fromPos, setFromPos] = useState(null);
const [toPos, setToPos] = useState(null);
const [status, setStatus] = useState("");

const allPlaces = useMemo(
  () => [...(data.activities || []), ...(data.hotels || [])],
  []
);

<div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "12px" }}>
  <input
    value={fromText}
    onChange={(e) => setFromText(e.target.value)}
    placeholder="Départ (doit exister dans data.json)"
    style={{ padding: "10px", minWidth: "260px", flex: "1" }}
  />
  <input
    value={toText}
    onChange={(e) => setToText(e.target.value)}
    placeholder="Destination (doit exister dans data.json)"
    style={{ padding: "10px", minWidth: "260px", flex: "1" }}
  />
  <button onClick={handleSearch} style={{ padding: "10px 14px" }}>
    Rechercher
  </button>
</div>

{status && <p style={{ marginTop: 0 }}>{status}</p>}
function findPlace(allPlaces, query) {
  const q = query.trim().toLowerCase();
  if (!q) return null;

  let found = allPlaces.find((p) => p.name.trim().toLowerCase() === q);
  if (!found) {
    found = allPlaces.find((p) => p.name.trim().toLowerCase().includes(q));
  }
  if (!found) return null;

  return {
    ...found,
    lat: Number(found.lat),
    lng: Number(found.lng),
    label: found.name,
  };
}
{fromPos && (
  <Marker position={[fromPos.lat, fromPos.lng]} icon={redIcon}>
    <Popup><b>Départ</b><br />{fromPos.label}</Popup>
  </Marker>
)}

{toPos && (
  <Marker position={[toPos.lat, toPos.lng]}>
    <Popup><b>Destination</b><br />{toPos.label}</Popup>
  </Marker>
)}
