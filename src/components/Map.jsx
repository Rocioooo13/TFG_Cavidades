import { MapContainer, TileLayer, LayersControl } from "react-leaflet";
// import "leaflet/dist/leaflet.css";

const { BaseLayer, Overlay } = LayersControl;

export const Map = () => {
  return (
    <div style={{ zIndex: 0, height: "100%", width: "100%" }}>
      <MapContainer
        center={[43.36662, -5.86112]}
        zoom={8}
        style={{ height: "100vh", width: "100wh" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://1.aerial.maps.ls.hereapi.com/maptile/2.1/maptile/newest/terrain.day/{z}/{x}/{y}/256/png8?app_id=eAdkWGYRoc4RfxVo0Z4B&app_code=TrLJuXVK62IQk0vuXFzaig&lg=eng"
        />
      </MapContainer>
    </div>
  );
};
