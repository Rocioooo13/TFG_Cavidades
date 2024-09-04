import { MenuHorizontal } from "./MenuHorizontal";
import { Map } from "./Map";
import { ListMaps } from "./ListMaps";
import api from "../api";
import { useEffect, useState } from "react";
import ModalMapas from "./ModalMapas";

export const App = () => {
  const [capasSeleccionadas, setCapasSeleccionadas] = useState([]);
  const [mapSelected, setMapSelected] = useState("");
  const [maps, setMaps] = useState([]);
  const [modalMapasIsOpen, setModalMapasIsOpen] = useState(false);
  const [crearContorno, setCrearContorno] = useState(false);
  const [coordsPolygon, setCoordsPolygon] = useState([]);
  const [color, setColor] = useState("#000"); // Estado para mantener el color seleccionado
  const [nombreDelContorno, setNombreDelContorno] = useState("");
  const [getContornos, setGetContornos] = useState([]);
  const [contornosSeleccionados, setContornosSeleccionados] = useState([]);
  const [mapaNuevo, setMapaNuevo] = useState("");
  const [todasCuevas, setTodasCuevas] = useState([]);
  const [index, setIndex] = useState(0);
  const [capaNueva, setCapaNueva] = useState(false);
  const [contornoNuevo, setContornoNuevo] = useState(false);
  const [contornoEliminado, setContornoEliminado] = useState(false);

  //Me devuelve la URL console.log(api.getMap(2)[0]);
  const loadMap = async () => {
    const mapSelect = await api.getMap(2);
    setMapSelected(mapSelect ?? "");
    console.log("Pongo incialmente el contorno a: ", crearContorno);
  };
  const handleItemClick = (item) => {
    // console.log("Valor de item.url " + item.url);
    setMapSelected("");
    setTimeout(() => setMapSelected(item.url ?? ""), 500);
  };

  const loadMaps = async () => {
    let objectMaps;
    const mapsSelect = await api.getMaps();
    objectMaps = mapsSelect;
    setMaps(objectMaps ?? []);
  };

  useEffect(() => {
    loadMap();
    loadMaps();
  }, []);
  useEffect(() => {
    //loadMap();
    setTimeout(() => {
      loadMaps();
    }, 200);
  }, [mapaNuevo]);
  const openModalMapas = () => {
    setModalMapasIsOpen(true);
  };

  const closeModalMapas = () => {
    setModalMapasIsOpen(false);
  };

  const submitContour = () => {
    // console.log(nombreDelContorno.split(" ").join(""));
    setContornoNuevo(false);
    const nombreContornoSinEspacios = nombreDelContorno.split(" ").join("");
    api
      .createContourTable(nombreContornoSinEspacios)
      .then(async (_) => {
        for (let index = 0; index < coordsPolygon.length; index++) {
          const coord = coordsPolygon[index];
          await api.addContour(nombreContornoSinEspacios, coord);
        }
      })
      .finally(() => {
        setCrearContorno(false);

        setColor("#000");
        setNombreDelContorno("");
        setCoordsPolygon([]);
        alert("Controno creado correctamente");
        setContornoNuevo(true);

        //console.log(" ", color);
      });
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
          crearContorno={crearContorno}
          setCrearContorno={setCrearContorno}
          setColor={setColor}
          color={color}
          coordsPolygon={coordsPolygon}
          setCoordsPolygon={setCoordsPolygon}
          nombreDelContorno={nombreDelContorno}
          setNombreDelContorno={setNombreDelContorno}
          getContornos={getContornos}
          setGetContornos={setGetContornos}
          contornosSeleccionados={contornosSeleccionados}
          setContornosSeleccionados={setContornosSeleccionados}
          todasCuevas={todasCuevas}
          setTodasCuevas={setTodasCuevas}
          index={index}
          setIndex={setIndex}
          capaNueva={capaNueva}
          setCapaNueva={setCapaNueva}
          contornoNuevo={contornoNuevo}
          setContornoNuevo={setContornoNuevo}
          contornoEliminado = {contornoEliminado}
          setContornoEliminado = {setContornoEliminado}
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
            crearContorno={crearContorno}
            setCrearContorno={setCrearContorno}
            coordsPolygon={coordsPolygon}
            setCoordsPolygon={setCoordsPolygon}
            color={color}
            nombreDelContorno={nombreDelContorno}
            setNombreDelContorno={setNombreDelContorno}
            contornosSeleccionados={contornosSeleccionados}
            setContornosSeleccionados={setContornosSeleccionados}
            todasCuevas={todasCuevas}
            setTodasCuevas={setTodasCuevas}
            index={index}
            setIndex={setIndex}
            capaNueva={capaNueva}
            setCapaNueva={setCapaNueva}
            contornoNuevo={contornoNuevo}
            setContornoNuevo={setContornoNuevo}
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
              {/* {(crearContorno = true ? <u> Finalizar contorno</u> : null)} */}
            </p>
          </div>
          {crearContorno ? (
            <button
              className="botonGuardarContorno"
              style={{
                top: "95%",
                marginLeft: "25px",
                zIndex: 1000,
              }}
              onClick={submitContour}
            >
              Guardar contorno
            </button>
          ) : null}
        </div>
      </div>
      <ModalMapas
        isOpen={modalMapasIsOpen}
        onRequestClose={closeModalMapas}
        mapaNuevo={mapaNuevo}
        setMapaNuevo={setMapaNuevo}
      />
    </div>
  );
};
