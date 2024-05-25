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
import ModalFormUpdate from "./ModalFormUpdate";
// import "leaflet/dist/leaflet.css";

const { BaseLayer, Overlay } = LayersControl;

export const Map = ({ url, cuevaIni }) => {
  const [cuevas, setCuevas] = useState([]);
  const loadCuevas = async () => {
    const cuevas = await api.getCuevas();
    setCuevas(cuevas ?? []);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cuevaSelected, setCuevaSelected] = useState(cuevaIni);
  const [waypoints, setWaypoints] = useState([]);

  const handleMarkerClick = (cueva) => {
    setCuevaSelected(cueva);
    setIsModalOpen(true);
  };

  useEffect(() => {
    loadCuevas();
  }, []);
  //Personaliza los waypoints
  const customIcon = new L.DivIcon({
    className: "custom-icon", // Clase CSS para estilos personalizados
    //<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAACBUlEQVR4nK2UMW/TQBTHTywshZEFiQGYGPA56Z3o2Y7lM0O/BCPqSqouwCfgAzAgFRYQSAgxsiC6MrQiqRSTNmnsNCmqqrao6jk2hTaHEgSyzz47cflLb/3/3vvfvQdAjnoGXNrSYXNTgycOUTij2PcpbjKKnjELU1BUXkWxWjr83iAKj5ZvY6HQp9CevT6VuWuoC46mDEXzdMC49gMbzU1k/k0r61+JcpZm3pADuE/R4ZFVvpELSIvFe7jI++t17rku52HAT2trPHy8mBbXSqb5tll6IJr3373hruv+q6h+vnqRgBxbqCIFdDTVETt3I+YiYKTEJBQ/lQI2NOVHrPv1ei7g9MuqGJMjBTgExn5O1/NyAcPBQJzgSApoEMinB/gxALNRKAU0ifIrFlG9NnVEzEaeFNDSlN34I1fzH/lRVQDg91KAV1GXxW/ae/s645s+T+6Che9JAT165+rooCUXrcp36rXxmwyDYByL2Pm4e4oH+4RcAllq62pLdiYaWafiT/7LIE/beqnsFAAwG4XB3fI1MIk6Rmm1AOAJmFS7c7evbBB4MimAUdzZM80ZMI36Zul+WlQp5mfHFBugiLqG+iF3AgsvgaLiAFxo67CbAXgJzqs989ZMW4MHSQBa4fM3L54bMNJoATcJZH8BjKLPB/P48n8xj0JaOjz0Kf6Yu60R/QbJDWobI0huvAAAAABJRU5ErkJggg==">
    //'<div class="svg-icon"><svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--noto" preserveAspectRatio="xMidYMid meet" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><circle cx="63.93" cy="64" r="60" fill="#c33"></circle><circle cx="60.03" cy="63.1" r="56.1" fill="#f44336"></circle><path d="M23.93 29.7c4.5-7.1 14.1-13 24.1-14.8c2.5-.4 5-.6 7.1.2c1.6.6 2.9 2.1 2 3.8c-.7 1.4-2.6 2-4.1 2.5a44.64 44.64 0 0 0-23 17.4c-2 3-5 11.3-8.7 9.2c-3.9-2.3-3.1-9.5 2.6-18.3z" fill="#ff8a80"></path></g></svg></div>'
    html: '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAACBUlEQVR4nK2UMW/TQBTHTywshZEFiQGYGPA56Z3o2Y7lM0O/BCPqSqouwCfgAzAgFRYQSAgxsiC6MrQiqRSTNmnsNCmqqrao6jk2hTaHEgSyzz47cflLb/3/3vvfvQdAjnoGXNrSYXNTgycOUTij2PcpbjKKnjELU1BUXkWxWjr83iAKj5ZvY6HQp9CevT6VuWuoC46mDEXzdMC49gMbzU1k/k0r61+JcpZm3pADuE/R4ZFVvpELSIvFe7jI++t17rku52HAT2trPHy8mBbXSqb5tll6IJr3373hruv+q6h+vnqRgBxbqCIFdDTVETt3I+YiYKTEJBQ/lQI2NOVHrPv1ei7g9MuqGJMjBTgExn5O1/NyAcPBQJzgSApoEMinB/gxALNRKAU0ifIrFlG9NnVEzEaeFNDSlN34I1fzH/lRVQDg91KAV1GXxW/ae/s645s+T+6Che9JAT165+rooCUXrcp36rXxmwyDYByL2Pm4e4oH+4RcAllq62pLdiYaWafiT/7LIE/beqnsFAAwG4XB3fI1MIk6Rmm1AOAJmFS7c7evbBB4MimAUdzZM80ZMI36Zul+WlQp5mfHFBugiLqG+iF3AgsvgaLiAFxo67CbAXgJzqs989ZMW4MHSQBa4fM3L54bMNJoATcJZH8BjKLPB/P48n8xj0JaOjz0Kf6Yu60R/QbJDWobI0huvAAAAABJRU5ErkJggg==">', // Inserta tu SVG aquí
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
                          onClick={() => handleMarkerClick(cueva)}
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
        <div
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <ModalFormUpdate
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            cuevaSelected={cuevaSelected}
          />
        </div>
      </div>
    );
  } else {
    console.log("No tengo info");
    return <div style={{ zIndex: 0, height: "100%", width: "100%" }}></div>;
  }
};
Map.defaultProps = {
  cuevaIni: {
    denominacion: "No tiene nombre",
    X: 0,
    Y: 0,
    Z: 0,
    elipsoide: "WGS84",
    huso: 30,
    zonaUTM: "T",
    hemisferio: "N",
    concejo: "No tiene nombre",
    latitud: 0,
    longitud: 0,
  },
};
