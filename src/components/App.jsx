import { MenuHorizontal } from "./MenuHorizontal";
import { Map } from "./Map";
import { ListMaps } from "./ListMaps";
import api from "../api";
import { useEffect, useState } from "react";
import ModalMapas from "./ModalMapas";

export const App = () => {
  const [capasSeleccionadas, setCapasSeleccionadas] = useState([]);
  //Me devuelve la URL console.log(api.getMap(2)[0]);
  const [mapSelected, setMapSelected] = useState("");
  const loadMap = async () => {
    const mapSelect = await api.getMap(2);
    setMapSelected(mapSelect ?? "");
  };
  const handleItemClick = (item) => {
    // console.log("Valor de item.url " + item.url);
    setMapSelected("");
    setTimeout(() => setMapSelected(item.url ?? ""), 500);
  };
  //console.log("Mi mapa por defecto es: " + map);
  const [maps, setMaps] = useState([]);
  const loadMaps = async () => {
    const mapsSelect = await api.getMaps();
    setMaps(mapsSelect ?? []);
  };

  useEffect(() => {
    loadMap();
    loadMaps();
  }, []);
  const [modalMapasIsOpen, setModalMapasIsOpen] = useState(false);
  const openModalMapas = () => {
    setModalMapasIsOpen(true);
  };

  const closeModalMapas = () => {
    setModalMapasIsOpen(false);
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <div style={{ width: "100%" }}>
        <MenuHorizontal
          capasSeleccionadas={capasSeleccionadas}
          setCapasSeleccionadas={setCapasSeleccionadas}
        />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <div
          style={{
            width: "90%",
            height: "700px",
          }}
        >
          <Map
            url={mapSelected}
            capasSeleccionadas={capasSeleccionadas}
            setCapasSeleccionadas={setCapasSeleccionadas}
          />
        </div>

        <div
          style={{
            width: "30vh",
            height: "92.5vh",
            marginRight: "0px",
            backgroundColor: "#2B3035",
          }}
        >
          {/* <h3 style={{ margin: "10%", color: "green" }}>Lista</h3>
          <hr style={{ marginLeft: "10%" }} />

          {maps?.map((mapa) => (
            <ul
              key={mapa.id}
              style={{
                marginLeft: "10%",
                color: "white",
                backgroundColor: mapSelected === mapa ? "#90EE90" : "green",
                cursor: "pointer",
              }}
              onClick={() => handleItemClick(mapa)}
            >
              <p>{mapa.name}</p>
            </ul>
          ))} */}
          <div style={{ margin: "10%" }} className="listaMapas">
            <p style={{ color: "white" }}>Mapas</p>
            {maps?.map((mapa) => (
              <div
                style={{
                  marginLeft: "10%",
                  color: "white",
                  //backgroundColor: mapSelected === mapa ? "#90EE90" : "green",
                  cursor: "pointer",
                }}
                key={mapa.id}
                onClick={() => handleItemClick(mapa)}
              >
                <p>{mapa.name}</p>
              </div>
            ))}
            <p
              style={{ color: "white", fontSize: "12" }}
              onClick={openModalMapas}
            >
              <u>+ Añadir mapa</u>
            </p>
          </div>
        </div>
      </div>
      <ModalMapas isOpen={modalMapasIsOpen} onRequestClose={closeModalMapas} />
    </div>
  );
};
