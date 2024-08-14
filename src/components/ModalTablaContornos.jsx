import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import api, {
  deleteContorno,
  deleteCapa,
  deleteCuevaListaContornos,
} from "../api";

const ModalTablaContornos = ({ isOpen, onRequestClose }) => {
  const customStyles = {
    content: {
      width: "1100px",
      height: "600px",
      margin: "auto",
      padding: "20px",
    },
  };

  //La opcion que selecciono del desplegable
  const [selectedOption, setSelectedOption] = useState("");
  const [nombreContorno, setNombreContorno] = useState("");
  const handleChange = (event) => {
    //const nombre = new String(event.target.value).split(" ").join("");
    setSelectedOption(event.target.value);
    setNombreContorno(event.target.value);
    //console.log(nombreContorno);
  };

  //Los nombres de las tablas que hay en la BD
  const [tablasContornos, setTablasContornos] = useState([]);
  const loadTablas = async () => {
    const tablaSelected = await api.obtenerContornos();
    setTablasContornos(tablaSelected ?? []);
    console.log(tablaSelected);
  };

  //Las cuevas de la capa seleccionada
  const [contorno, setContorno] = useState([]);
  const loadContorno = async () => {
    if (!nombreContorno) {
      setContorno([]);
    } else {
      const getContorno = await api.getPolygons(
        nombreContorno.split(" ").join("")
      );
      setContorno(getContorno ?? []);
    }
  };

  const selectedOptionData = contorno.filter(
    (item) => item.nombre === nombreContorno.split(" ").join("")
  );

  const handleClicButton = () => {
    onRequestClose();
  };
  const [idSeleccionado, setidSeleccionado] = useState("");
  // const handleClicBin = (id) => {
  //   deleteCueva(nombreContorno.split(" ").join(""), id).then((_) => {
  //     setidSeleccionado(id);
  //   });
  // };

  const [contornoEliminado, setContornoEliminado] = useState(false);
  const handleClicEliminarContorno = (id) => {
    setContornoEliminado(false);
    deleteContorno(nombreContorno.split(" ").join("")).then((_) => {
      deleteCuevaListaContornos(nombreContorno).then((_) => {
        setContornoEliminado(true);
        //selectedOptionData = [];
      });
    });
  };

  useEffect(() => {
    loadTablas();
    loadContorno();
  }, []);

  //Si hay un cambio en nombreCapa se recarga la lista de Cuevas
  useEffect(() => {
    loadContorno();
  }, [nombreContorno]);

  useEffect(() => {
    loadTablas();
    //loadCapa();
  }, [contornoEliminado]);

  //Si hay un cambio en idSeleccionado se recarga la lista de Cuevas
  useEffect(() => {
    loadContorno();
  }, [idSeleccionado]);

  Modal.defaultStyles.overlay.zIndex = 1000;
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Tablas Contornos"
      style={customStyles}
      ariaHideApp={false}
    >
      <h3>Tablas Contornos</h3>
      <br />
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="select" style={{ marginRight: "10px" }}>
          Selecciona un contorno:
        </label>
        <select id="select" value={selectedOption} onChange={handleChange}>
          <option value="">--Seleccione una opción--</option>
          {tablasContornos.map((tabla) => (
            <option key={tabla.id} value={tabla.nombre}>
              {tabla.nombre}
            </option>
          ))}
        </select>
      </div>

      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid black", padding: "8px" }}>ID</th>
            <th style={{ border: "1px solid black", padding: "8px" }}>
              Nombre
            </th>
            {/* <th style={{ border: "1px solid black", padding: "8px" }}>X</th>
            <th style={{ border: "1px solid black", padding: "8px" }}>Y</th>
            <th style={{ border: "1px solid black", padding: "8px" }}>Z</th>*/}
            <th style={{ border: "1px solid black", padding: "8px" }}>
              Latitud
            </th>
            {/* <th style={{ border: "1px solid black", padding: "8px" }}>Huso</th> */}
            <th style={{ border: "1px solid black", padding: "8px" }}>
              Longitud
            </th>
            {/* <th style={{ border: "1px solid black", padding: "8px" }}>
              Hemisferio
            </th>
            <th style={{ border: "1px solid black", padding: "8px" }}>
              Concejo
            </th>
            <th style={{ border: "1px solid black", padding: "8px" }}>
              Latitud
            </th>
            <th style={{ border: "1px solid black", padding: "8px" }}>
              Longitud
            </th> */}
          </tr>
        </thead>
        <tbody>
          {selectedOptionData.length > 0 ? (
            selectedOptionData.map((item) => (
              <tr key={item.id}>
                <td
                  id="identificador"
                  style={{ border: "1px solid black", padding: "8px" }}
                >
                  {item.id}
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  {item.nombre}
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  {item.longitud}
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  {item.latitud}
                </td>
                {/* <td style={{ border: "1px solid black", padding: "8px" }}>
                  {item.Z}
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  {item.elipsoide}
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  {item.huso}
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  {item.zonaUTM}
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  {item.hemisferio}
                </td>
                <td
                  id="concejo"
                  style={{ border: "1px solid black", padding: "8px" }}
                >
                  {item.concejo}
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  {item.latitud}
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  {item.longitud}
                </td> */}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="12"
                style={{
                  border: "1px solid black",
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                No se ha seleccionado ninguna opción
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="botonesForm">
        <button
          className="botonFormEliminar"
          type="button"
          onClick={handleClicEliminarContorno}
        >
          Eliminar contorno
        </button>
        <button className="botonForm" type="button" onClick={handleClicButton}>
          Cerrar
        </button>
      </div>
    </Modal>
  );
};

export default ModalTablaContornos;
