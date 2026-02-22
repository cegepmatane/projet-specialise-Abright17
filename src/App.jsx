import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import data from "./data/data.json";


const redIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const greenIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

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

function FitBounds({ coords }) {
  const map = useMap();

  useEffect(() => {
    if (!coords || coords.length === 0) return;

    const bounds = L.latLngBounds(coords);
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [coords, map]);

  return null;
}


export default function App() {
  const [activities, setActivities] = useState([]);
  const [hotels, setHotels] = useState([]);

  const [fromText, setFromText] = useState("Cégep de Matane");
  const [toText, setToText] = useState("Riôtel Matane");


  const [fromPos, setFromPos] = useState(null);
  const [toPos, setToPos] = useState(null);
  const [route, setRoute] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    setActivities(data.activities || []);
    setHotels(data.hotels || []);
  }, []);


  const allPlaces = useMemo(
    () => [...(data.activities || []), ...(data.hotels || [])],
    []
  );


  const center = useMemo(() => [48.8566, -67.5220], []);

  async function handleSearch() {
    setStatus("");
    setRoute(null);

    const a = findPlace(allPlaces, fromText);
    const b = findPlace(allPlaces, toText);

    if (!a || !b) {
      setFromPos(a);
      setToPos(b);
      setStatus(
        "Lieu introuvable dans data.json. Utilise un nom exact (ex: Cégep de Matane, McDonald's Matane, Riôtel Matane)."
      );
      return;
    }

    setFromPos(a);
    setToPos(b);


    const flyKm = haversineKm(a, b);

    setStatus(`Calcul de l'itinéraire... (vol d'oiseau: ${flyKm.toFixed(1)} km)`);
    const r = await routeOSRM(a, b);

    if (!r) {
      setStatus("Itinéraire introuvable (OSRM).");
      return;
    }

    setRoute(r);
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>PlanMyTrip PoC</h1>

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

      <MapContainer
          center={center}
          zoom={12}
          style={{ height: "90vh", width: "400%" }}
        >

        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {activities.map((act) => (
          <Marker key={`a-${act.id}`} position={[act.lat, act.lng]}>
            <Popup>
              <b>{act.name}</b><br />
              {act.category} — {act.price} $
            </Popup>
          </Marker>
        ))}

        {hotels.map((hotel) => (
          <Marker key={`h-${hotel.id}`} position={[hotel.lat, hotel.lng]}>
            <Popup>
              <b>{hotel.name}</b><br />
              {hotel.category} — {hotel.price} $
            </Popup>
          </Marker>
        ))}

        {fromPos && (
          <Marker
            position={[fromPos.lat, fromPos.lng]}
            icon={redIcon}
          >

            <Popup><b>Départ</b><br />{fromPos.label}</Popup>
          </Marker>
        )}

        {toPos && (
          <Marker position={[toPos.lat, toPos.lng]}>
            <Popup><b>Destination</b><br />{toPos.label}</Popup>
          </Marker>
        )}

        {route?.coords?.length > 0 && (
          <>
            <Polyline
              positions={route.coords}
              pathOptions={{ color: "blue", weight: 5, opacity: 0.8 }}
            />
            <FitBounds coords={route.coords} />
          </>
        )}
      </MapContainer>
    </div>
  );
}
