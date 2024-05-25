import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import api from "../api";

const ModalTablaCapas = ({ isOpen, onRequestClose }) => {
  const customStyles = {
    content: {
      width: "1000px",
      height: "600px",
      margin: "auto",
      padding: "20px",
    },
  };
  //La opcion que selecciono del desplegable
  const [selectedOption, setSelectedOption] = useState("");
  const [nombreCapa, setNombreCapa] = useState("");
  const handleChange = (event) => {
    //const nombre = new String(event.target.value).split(" ").join("");
    setSelectedOption(event.target.value);
    setNombreCapa(event.target.value);
  };
  //   const loadSelectedName = (event) => {
  //     const nombreConcejo = event.target.value;
  //     //const nombreConcejo2 = new String(nombreConcejo).split(" ").join("");
  //     //setNombreCapa(nombreConcejo);
  //     //console.log("Selected value:", nombreCapa);
  //   };

  //   const options = [
  //     { value: "option1", label: "Opción 1" },
  //     { value: "option2", label: "Opción 2" },
  //     { value: "option3", label: "Opción 3" },
  //   ];

  //Los nombres de las tablas que hay en la BD
  const [tablas, setTablas] = useState([]);
  const loadTablas = async () => {
    const tablaSelected = await api.obtenertablas();
    setTablas(tablaSelected ?? []);
    // console.log(tablaSelected);
  };

  //El nombre del concejo sin espacios
  // const loadNombreConcejo = () => {
  //   //const nombre = new String(selectedOption).split(" ").join("");
  //   setNombreCapa(selectedOption);
  // };

  //Las cuevas de la capa seleccionada
  const [capa, setCapa] = useState([]);
  const loadCapa = async () => {
    if (!nombreCapa) {
      setCapa([]);
    } else {
      const getCapa = await api.getCuevas2(nombreCapa.split(" ").join(""));
      setCapa(getCapa ?? []);
    }
  };

  useEffect(() => {
    loadTablas();
    loadCapa();
  }, []);

  useEffect(() => {
    loadCapa();
  }, [nombreCapa]);

  const selectedOptionData = capa.filter(
    (item) => item.concejo === nombreCapa.split(" ").join("")
  );

  const handleClicButton = () => {
    console.log(tablas);
    console.log(capa);
    console.log(nombreCapa);
    console.log(selectedOption);
  };

  Modal.defaultStyles.overlay.zIndex = 1000;
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Tabla Capas"
      style={customStyles}
      ariaHideApp={false}
    >
      <h3>Tabla Capas</h3>
      <br />
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="select" style={{ marginRight: "10px" }}>
          Selecciona una capa:
        </label>
        <select id="select" value={selectedOption} onChange={handleChange}>
          <option value="">--Seleccione una opción--</option>
          {tablas.map((tabla) => (
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
              Denominacion
            </th>
            <th style={{ border: "1px solid black", padding: "8px" }}>X</th>
            <th style={{ border: "1px solid black", padding: "8px" }}>Y</th>
            <th style={{ border: "1px solid black", padding: "8px" }}>Z</th>
            <th style={{ border: "1px solid black", padding: "8px" }}>
              Elipsoide
            </th>
            <th style={{ border: "1px solid black", padding: "8px" }}>Huso</th>
            <th style={{ border: "1px solid black", padding: "8px" }}>
              Zona UTM
            </th>
            <th style={{ border: "1px solid black", padding: "8px" }}>
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
            </th>
          </tr>
        </thead>
        <tbody>
          {selectedOptionData.length > 0 ? (
            selectedOptionData.map((item) => (
              <tr key={item.value}>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  {item.id}
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  {item.denominacion}
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  {item.X}
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  {item.Y}
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
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
                  {item.hermisferio}
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  {item.concejo}
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  {item.latitud}
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  {item.longitud}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="2"
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
        <button className="botonForm" type="button" onClick={handleClicButton}>
          Probar
        </button>
      </div>
    </Modal>
  );
};

export default ModalTablaCapas;
