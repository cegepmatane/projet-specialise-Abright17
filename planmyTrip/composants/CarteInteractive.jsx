import { MapContainer, Marker, Popup, Polyline, TileLayer } from "react-leaflet";
import { calculerDistanceHaversineEnKm, determinerClasseProximite, determinerMessageProximite } from "../services/voyage.js";

export default function CarteInteractive({ element, hebergement }) {
  const latitude = Number(element?.lat);
  const longitude = Number(element?.lng);
  const latitudeHebergement = Number(hebergement?.lat);
  const longitudeHebergement = Number(hebergement?.lng);

  const elementValide = Number.isFinite(latitude) && Number.isFinite(longitude);
  const hebergementValide = Number.isFinite(latitudeHebergement) && Number.isFinite(longitudeHebergement);

  const distanceEnKm = elementValide && hebergementValide
    ? calculerDistanceHaversineEnKm(latitudeHebergement, longitudeHebergement, latitude, longitude)
    : null;

  const messageProximite = distanceEnKm != null ? determinerMessageProximite(distanceEnKm) : null;
  const classeProximite = distanceEnKm != null ? determinerClasseProximite(distanceEnKm) : null;

  if (!elementValide) {
    return (
      <div className="carte-interactive__indisponible">
        Carte indisponible pour cet élément.
      </div>
    );
  }

  return (
    <div className="carte-interactive__bloc">
      {distanceEnKm != null ? (
        <div className="bloc-proximite-carte">
          <p>
            <strong>Distance depuis l'hébergement choisi :</strong> {distanceEnKm.toFixed(1)} km
          </p>
          <span className={classeProximite}>{messageProximite}</span>
        </div>
      ) : hebergement ? (
        <div className="bloc-proximite-carte">
          <p>L'hébergement est choisi, mais ses coordonnées ou celles de cet élément sont incomplètes.</p>
        </div>
      ) : (
        <div className="bloc-proximite-carte">
          <p>Choisis d'abord un hébergement pour voir la proximité avec ce lieu.</p>
        </div>
      )}

      <div className="carte-interactive">
        <MapContainer center={[latitude, longitude]} zoom={14} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[latitude, longitude]}>
            <Popup>{element.nom}</Popup>
          </Marker>

          {hebergementValide ? (
            <Marker position={[latitudeHebergement, longitudeHebergement]}>
              <Popup>Hébergement choisi : {hebergement.nom}</Popup>
            </Marker>
          ) : null}

          {hebergementValide ? (
            <Polyline
              positions={[
                [latitudeHebergement, longitudeHebergement],
                [latitude, longitude],
              ]}
            />
          ) : null}
        </MapContainer>
      </div>
    </div>
  );
}
