import { MenuHorizontal } from "./MenuHorizontal";
import { Map } from "./Map";
import { ListMaps } from "./ListMaps";
import api from "../api";
import { useEffect, useState } from "react";

export const App = () => {
  //Me devuelve la URL console.log(api.getMap(2)[0]);
  const [map, setMap] = useState("");
  const loadMap = async () => {
    const mapSelect = await api.getMap(2);
    setMap(mapSelect ?? "");
  };
  const handleItemClick = (item) => {
    setMap(item);
  };
  console.log("Mi mapa por defecto es: " + map);
  const [maps, setMaps] = useState([]);
  const loadMaps = async () => {
    const mapsSelect = await api.getMaps();
    setMaps(mapsSelect ?? []);
  };

  useEffect(() => {
    loadMap();
    loadMaps();
  }, []);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <div style={{ width: "100%", height: "100%" }}>
        <MenuHorizontal />
      </div>
      <Map url={map} />
      <h3 style={{ marginLeft: "10%", color: "green" }}>
        Lista QuickMapService
      </h3>
      <hr style={{ marginLeft: "10%" }} />

      {maps?.map((mapa) => (
        <ul
          key={mapa.id}
          style={{
            marginLeft: "10%",
            color: "white",
            backgroundColor: map === mapa ? "#90EE90" : "green",
            cursor: "pointer",
          }}
          onClick={() => handleItemClick(mapa)}
        >
          <p>{mapa.name}</p>
        </ul>
      ))}

      {/* <ListMaps /> */}
    </div>
  );
};
