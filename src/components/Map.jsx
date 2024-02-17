import {
  MapContainer,
  TileLayer,
  LayersControl,
  Marker,
  Popup,
  LayerGroup,
  Polygon,
  Tooltip,
} from "react-leaflet";
import { useEffect, useState } from "react";
import api from "../api";
import L from "leaflet";
// import "leaflet/dist/leaflet.css";

const { BaseLayer, Overlay } = LayersControl;

export const Map = ({ url }) => {
  const [cuevas, setCuevas] = useState([]);
  const loadCuevas = async () => {
    const cuevas = await api.getCuevas();
    setCuevas(cuevas ?? []);
  };

  useEffect(() => {
    loadCuevas();
  }, []);
  //Personaliza los waypoints
  const customIcon = new L.DivIcon({
    className: "custom-icon", // Clase CSS para estilos personalizados
    html: '<div class="svg-icon"><svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--noto" preserveAspectRatio="xMidYMid meet" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><circle cx="63.93" cy="64" r="60" fill="#c33"></circle><circle cx="60.03" cy="63.1" r="56.1" fill="#f44336"></circle><path d="M23.93 29.7c4.5-7.1 14.1-13 24.1-14.8c2.5-.4 5-.6 7.1.2c1.6.6 2.9 2.1 2 3.8c-.7 1.4-2.6 2-4.1 2.5a44.64 44.64 0 0 0-23 17.4c-2 3-5 11.3-8.7 9.2c-3.9-2.3-3.1-9.5 2.6-18.3z" fill="#ff8a80"></path></g></svg></div>', // Inserta tu SVG aquí
    iconSize: [25, 25], // Tamaño del icono [ancho, alto]
  });
  console.log("URL en el componente map " + url);
  if (url !== "") {
    console.log("Tengo info");
    return (
      <div style={{ zIndex: 0, height: "100%", width: "100%" }}>
        <MapContainer
          center={[43.36662, -5.86112]}
          zoom={8}
          style={{ height: "100vh", width: "100wh" }}
        >
          {/* <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://1.aerial.maps.ls.hereapi.com/maptile/2.1/maptile/newest/terrain.day/{z}/{x}/{y}/256/png8?app_id=eAdkWGYRoc4RfxVo0Z4B&app_code=TrLJuXVK62IQk0vuXFzaig&lg=eng"
          /> */}

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url={url}
          />
          <LayersControl name="Capas" position="topright">
            <Overlay name="capa cuevas">
              <LayerGroup name="Cuevas de prueba">
                {cuevas.map((cueva, index) => (
                  <Marker
                    key={index}
                    position={[cueva.longitud, cueva.latitud]}
                    icon={customIcon}
                    //onClick={() => handleMarkerClick(waypoint)}
                  >
                    <div
                      style={{
                        color: "black",
                        background: "white",
                        padding: "4px",
                        borderRadius: "4px",
                        fontSize: "14px",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    ></div>
                    <Popup>
                      <div style={{ textAlign: "center" }}>
                        <p>{cueva.denominacion}</p>
                        <hr />
                        {/*Botón que abre la ventana modal*/}
                        <button
                          style={{
                            color: "white",
                            backgroundColor: "green",
                          }}
                          //onClick={() => handleMarkerClick(waypoint)}
                        >
                          Detalles
                        </button>
                      </div>
                    </Popup>
                    <Tooltip>{cueva.denominacion}</Tooltip>
                  </Marker>
                ))}
              </LayerGroup>
            </Overlay>
          </LayersControl>
        </MapContainer>
      </div>
    );
  } else {
    console.log("No tengo info");
    return <div style={{ zIndex: 0, height: "100%", width: "100%" }}></div>;
  }
};
