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

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

function haversineKm(a, b) {
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(h));
}

async function routeOSRM(a, b) {
  const url = `https://router.project-osrm.org/route/v1/driving/${a.lng},${a.lat};${b.lng},${b.lat}?overview=full&geometries=geojson`;

  const res = await fetch(url);
  const json = await res.json();

  if (json?.code !== "Ok" || !json?.routes?.length) return null;

  const coords = json.routes[0].geometry.coordinates.map(([lng, lat]) => [
    lat,
    lng,
  ]);

  const distanceKm = (json.routes[0].distance / 1000).toFixed(1);
  const durationMin = Math.round(json.routes[0].duration / 60);

  return { coords, distanceKm, durationMin };
}
setRoute(null);

const flyKm = haversineKm(a, b);

setStatus(`Calcul de l'itinéraire... (vol d'oiseau: ${flyKm.toFixed(1)} km)`);
const r = await routeOSRM(a, b);

if (!r) {
  setStatus("Itinéraire introuvable (OSRM).");
  return;
}

setRoute(r);
setStatus(
  `OK — route: ${r.distanceKm} km, ~${r.durationMin} min | vol d'oiseau: ${flyKm.toFixed(1)} km`
);
{route?.coords?.length > 0 && (
  <>
    <Polyline
      positions={route.coords}
      pathOptions={{ color: "blue", weight: 5, opacity: 0.8 }}
    />
    <FitBounds coords={route.coords} />
  </>
)}



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
