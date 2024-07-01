import {
  MapContainer,
  TileLayer,
  LayersControl,
  Marker,
  Popup,
  LayerGroup,
  Tooltip,
  Polygon,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useState } from "react";
import api from "../api";
import L from "leaflet";
import ModalFormUpdate from "./ModalFormUpdate";
import { MenuHorizontal } from "./MenuHorizontal";

const { BaseLayer, Overlay } = LayersControl;

export const Map = ({
  url,
  cuevaIni,
  capasSeleccionadas,
  setCapasSeleccionadas,
  crearContorno,
  setCrearContorno,
}) => {
  const [cuevas, setCuevas] = useState([]);
  const [index, setIndex] = useState(0);
  //Aqui meteré todas las cuevas de cada concejo
  const [todasCuevas, setTodasCuevas] = useState([]);
  //Aqui manejo que capas estan visibles, es decir para almacenar la visibilidad de cada capa.
  const [capasVisibles, setCapasVisibles] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cuevaSelected, setCuevaSelected] = useState(cuevaIni);
  const [cuevaActualizada, setCuevaActualizada] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState([0, 0]);
  const [coordsPolygon, setCoordsPolygon] = useState([]);
  // const [mostrarNuevoContorno, setMostrarNuevoContorno] = useState(false);

  const customIcon = new L.DivIcon({
    className: "custom-icon",
    html: '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAACBUlEQVR4nK2UMW/TQBTHTywshZEFiQGYGPA56Z3o2Y7lM0O/BCPqSqouwCfgAzAgFRYQSAgxsiC6MrQiqRSTNmnsNCmqqrao6jk2hTaHEgSyzz47cflLb/3/3vvfvQdAjnoGXNrSYXNTgycOUTij2PcpbjKKnjELU1BUXkWxWjr83iAKj5ZvY6HQp9CevT6VuWuoC46mDEXzdMC49gMbzU1k/k0r61+JcpZm3pADuE/R4ZFVvpELSIvFe7jI++t17rku52HAT2trPHy8mBbXSqb5tll6IJr3373hruv+q6h+vnqRgBxbqCIFdDTVETt3I+YiYKTEJBQ/lQI2NOVHrPv1ei7g9MuqGJMjBTgExn5O1/NyAcPBQJzgSApoEMinB/gxALNRKAU0ifIrFlG9NnVEzEaeFNDSlN34I1fzH/lRVQDg91KAV1GXxW/ae/s645s+T+6Che9JAT165+rooCUXrcp36rXxmwyDYByL2Pm4e4oH+4RcAllq62pLdiYaWafiT/7LIE/beqnsFAAwG4XB3fI1MIk6Rmm1AOAJmFS7c7evbBB4MimAUdzZM80ZMI36Zul+WlQp5mfHFBugiLqG+iF3AgsvgaLiAFxo67CbAXgJzqs989ZMW4MHSQBa4fM3L54bMNJoATcJZH8BjKLPB/P48n8xj0JaOjz0Kf6Yu60R/QbJDWobI0huvAAAAABJRU5ErkJggg==">',
    iconSize: [25, 25],
  });
  const customIconClickCoords = new L.DivIcon({
    className: "custom-icon",
    html: '<svg fill="red" width="20px" height="20px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><title>point</title><path d="M16 4.686l-11.314 11.314 11.314 11.314 11.314-11.314-11.314-11.314zM10.343 16l5.657-5.657 5.657 5.657-5.657 5.657-5.657-5.657z"></path></svg>',
    iconSize: [25, 25],
  });

  const loadCuevas = async () => {
    if (capasSeleccionadas.length > 0) {
      if (capasSeleccionadas.length >= index) {
        const conc = capasSeleccionadas[index].split(" ").join("");
        try {
          const capa = await api.getLayers(conc);
          setCuevas(capa ?? []);

          setTodasCuevas((prevCapas) => {
            const nuevasCapas = [...prevCapas, capa ?? []];
            // console.log(
            //   "Index: ",
            //   index,
            //   "Cuevas añadidas a todasCuevas",
            //   nuevasCapas
            // );
            return nuevasCapas;
          });

          setCapasVisibles((prev) => ({
            ...prev,
            [capasSeleccionadas[index]]: true,
          }));

          setIndex(index + 1);
          console.log("Capa seleccionada", capasVisibles);
        } catch (error) {
          console.error("Error cargando cuevas:", error);
        }
        //console.log("Capa visible", capasVisibles);
      }
    }
  };

  const handleMarkerClick = (cueva) => {
    setCuevaSelected(cueva);
    setIsModalOpen(true);
    setCuevaActualizada(false);
  };

  useEffect(() => {
    loadCuevas();
  }, []);

  useEffect(() => {
    loadCuevas();
  }, [cuevaActualizada, capasSeleccionadas]);

  // Added markers when clicking the map
  const Markers = () => {
    useMapEvents({
      click(e) {
        setSelectedPosition([e.latlng.lat, e.latlng.lng]);
        // console.log("Coordinates on click: ", [e.latlng.lat, e.latlng.lng]);
        if (selectedPosition[0] !== 0 && selectedPosition[1] !== 0) {
          setCoordsPolygon((coords) => [...coords, selectedPosition]);
          console.log(coordsPolygon);
        }
      },
    });

    return selectedPosition ? (
      <Marker
        key={selectedPosition[0]}
        position={selectedPosition}
        interactive={false}
        icon={customIconClickCoords}
      />
    ) : null;
  };
  // Función para alternar el estado de mostrarNuevoContorno
  // const toggleMostrarNuevoContorno = () => {
  //   setMostrarNuevoContorno(!mostrarNuevoContorno);
  // };

  //console.log("URL en el componente map " + url);
  if (url !== "") {
    //console.log("Tengo info");
    return (
      <div style={{ zIndex: 0, height: "100%", width: "100%" }}>
        <MapContainer
          center={[43.36662, -5.86112]}
          zoom={8}
          style={{ height: "92.5vh", width: "100wh" }}
        >
          {/* {crearContorno ? <Markers /> : null} */}
          {crearContorno /*&& mostrarNuevoContorno*/ ? <Markers /> : null}

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url={url}
          />
          <LayersControl name="Capas" position="topright">
            {capasSeleccionadas.map((capa, index) => (
              <Overlay
                key={index}
                name={`Capa ${capa}`}
                checked={capasVisibles[capa]}
                // onChange={(e) => handleLayerVisibility(capa, e.target.checked)}
              >
                {/* La visibilidad de cada LayerGroup se controla utilizando el estado capasVisibles. */}
                <LayerGroup name="Cuevas de prueba">
                  {capasVisibles[capa] &&
                    todasCuevas[index] &&
                    todasCuevas[index].map((cueva) => (
                      <Marker
                        key={cueva.id}
                        position={[cueva.longitud, cueva.latitud]}
                        icon={customIcon}
                      >
                        <Popup>
                          <div style={{ textAlign: "center" }}>
                            <p>{cueva.denominacion}</p>
                            <hr />
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
            ))}
            {crearContorno /*&& mostrarNuevoContorno*/ ? (
              <Overlay name="Contorno" checked={true}>
                <Polygon
                  positions={coordsPolygon}
                  color="black"
                  fill={false}
                  weight={1}
                />
              </Overlay>
            ) : null}
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
            setCuevaActualizada={setCuevaActualizada}
          />
        </div>
      </div>
    );
  } else {
    //console.log("No tengo info");
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
