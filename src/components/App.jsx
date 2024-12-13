import { MenuHorizontal } from "./MenuHorizontal";
import { Map } from "./Map";
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
  //Contornos
  const [contornosSeleccionados, setContornosSeleccionados] = useState([]);
  //Esto es para el manejo de visibilidad de los contornos
  const [contornos, setContornos] = useState([]);
  const [index2, setIndex2] = useState(0);
  //Aqui meteré todas las cuevas de cada concejo
  const [todosContornos, setTodosContornos] = useState([]);
  //Aqui manejo que capas estan visibles, es decir para almacenar la visibilidad de cada capa.
  const [contornosVisibles, setContornosVisibles] = useState({});
  //Guardamos aqui los colores
  const [colorContorno, setColorContorno] = useState([]);

  const [mapaNuevo, setMapaNuevo] = useState("");
  const [todasCuevas, setTodasCuevas] = useState([]);
  const [capasVisibles, setCapasVisibles] = useState({});
  const [index, setIndex] = useState(0);
  const [capaNueva, setCapaNueva] = useState(false);
  const [contornoNuevo, setContornoNuevo] = useState(false);
  const [contornoEliminado, setContornoEliminado] = useState(false);
  const [cuevaActualizada, setCuevaActualizada] = useState(false);

  const loadMap = async () => {
    await api.createMapTable();
    const mapSelect = await api.getMap(1);
    if (!mapSelect) {
      setMapSelected(
        "https://1.aerial.maps.ls.hereapi.com/maptile/2.1/maptile/newest/terrain.day/{z}/{x}/{y}/256/png8?app_id=eAdkWGYRoc4RfxVo0Z4B&app_code=TrLJuXVK62IQk0vuXFzaig&lg=eng"
      );
      return;
    }
    setMapSelected(mapSelect ?? "");
  };
  const handleItemClick = (item) => {
    setMapSelected("");
    setTimeout(() => {
      if (item?.url !== "") {
        setMapSelected(
          item?.url ??
            "https://1.aerial.maps.ls.hereapi.com/maptile/2.1/maptile/newest/terrain.day/{z}/{x}/{y}/256/png8?app_id=eAdkWGYRoc4RfxVo0Z4B&app_code=TrLJuXVK62IQk0vuXFzaig&lg=eng"
        );
      } else {
        setMapSelected(
          "https://1.aerial.maps.ls.hereapi.com/maptile/2.1/maptile/newest/terrain.day/{z}/{x}/{y}/256/png8?app_id=eAdkWGYRoc4RfxVo0Z4B&app_code=TrLJuXVK62IQk0vuXFzaig&lg=eng"
        );
      }
    }, 500);
  };

  const loadMaps = async () => {
    let objectMaps;
    await api.createMapTable();
    const mapsSelect = await api.getMaps();
    if (!mapsSelect) {
      setMaps([]);
      return;
    }
    objectMaps = mapsSelect;
    setMaps(objectMaps ?? []);
  };

  useEffect(() => {
    loadMap();
    loadMaps();
  }, []);

  useEffect(() => {
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

  const submitContour = async () => {
    setContornoNuevo(false);
    const nombreContornoSinEspacios = nombreDelContorno.split(" ").join("");
    await api.createContourTable(nombreContornoSinEspacios);

    for (let index = 0; index < coordsPolygon.length; index++) {
      const coord = coordsPolygon[index];
      await api.addContour(nombreContornoSinEspacios, coord);
    }
    let objecNombre = "";
    let objectColor = "#000";

    setCrearContorno(false);

    setColor(objectColor);
    setNombreDelContorno(objecNombre);

    setCoordsPolygon([]);
    alert("Contorno creado correctamente");
    setContornoNuevo(true);
  };
  const [mapaEliminado, setMapaEliminado] = useState(false);
  const handleDeleteMap = async (id, nombre) => {
    setMapaEliminado(false);
    await api.deleteMapaListaMapas(id);
    setMapaEliminado(true);
  };
  useEffect(() => {
    loadMaps();
  }, [mapaEliminado === true]);
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
          contornoEliminado={contornoEliminado}
          setContornoEliminado={setContornoEliminado}
          capasVisibles={capasVisibles}
          setCapasVisibles={setCapasVisibles}
          cuevaActualizada={cuevaActualizada}
          setCuevaActualizada={setCuevaActualizada}
          todosContornos={todosContornos}
          setTodosContornos={setTodosContornos}
          contornos={contornos}
          setContornos={setContornos}
          colorContorno={colorContorno}
          setColorContorno={setColorContorno}
          index2={index2}
          setIndex2={setIndex2}
          contornosVisibles={contornosVisibles}
          setContornosVisibles={setContornosVisibles}
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
            capasVisibles={capasVisibles}
            setCapasVisibles={setCapasVisibles}
            cuevaActualizada={cuevaActualizada}
            setCuevaActualizada={setCuevaActualizada}
            todosContornos={todosContornos}
            setTodosContornos={setTodosContornos}
            contornos={contornos}
            setContornos={setContornos}
            colorContorno={colorContorno}
            setColorContorno={setColorContorno}
            index2={index2}
            setIndex2={setIndex2}
            contornosVisibles={contornosVisibles}
            setContornosVisibles={setContornosVisibles}
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
          <div style={{ margin: "10%" }} className="listaMapas">
            <p style={{ color: "white" }}>Mapas</p>

            {maps.length > 0 && (
              <div className="table-container-mapas">
                {maps.map((mapa) => (
                  <table className="custom-table-mapas" key={mapa.name}>
                    <tbody>
                      <tr className="table-row-mapas">
                        <td
                          className="table-cell-mapas"
                          onClick={() => handleItemClick(mapa)}
                          href="#form/3.1"
                          id="listaConcejos"
                        >
                          {mapa.name}
                        </td>
                        <td
                          className="table-cell-mapas svg-cell"
                          onClick={() => handleDeleteMap(mapa.id, mapa.name)}
                        >
                          <svg
                            fill="#FFFF"
                            width="20px"
                            height="20px"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            id="cross"
                            className="icon glyph"
                          >
                            <path d="M13.41,12l6.3-6.29a1,1,0,1,0-1.42-1.42L12,10.59,5.71,4.29A1,1,0,0,0,4.29,5.71L10.59,12l-6.3,6.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l6.29,6.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z"></path>
                          </svg>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                ))}
              </div>
            )}

            <p
              style={{ color: "white", fontSize: "12" }}
              onClick={openModalMapas}
            >
              <u>+ Añadir mapa</u>
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
        setMapSelected={setMapSelected}
      />
    </div>
  );
};
