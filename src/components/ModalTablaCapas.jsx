import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import api, { deleteCueva, deleteCapa, deleteCuevaListaCapas } from "../api";

const ModalTablaCapas = ({ isOpen, onRequestClose }) => {
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
  const [nombreCapa, setNombreCapa] = useState("");
  const handleChange = (event) => {
    //const nombre = new String(event.target.value).split(" ").join("");
    setSelectedOption(event.target.value);
    setNombreCapa(event.target.value);
  };

  //Los nombres de las tablas que hay en la BD
  const [tablas, setTablas] = useState([]);
  const loadTablas = async () => {
    const tablaSelected = await api.obtenertablas();
    setTablas(tablaSelected ?? []);
    // console.log(tablaSelected);
  };

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
    onRequestClose();
  };
  const handleClicBin = (id) => {
    deleteCueva(nombreCapa.split(" ").join(""), id).then((_) => {});
  };
  const handleClicEliminarCapa = (id) => {
    deleteCapa(nombreCapa.split(" ").join("")).then((_) => {
      deleteCuevaListaCapas(nombreCapa).then((_) => {});
    });
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
              <tr key={item.id}>
                <td
                  id="identificador"
                  style={{ border: "1px solid black", padding: "8px" }}
                >
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
                </td>
                <td
                  style={{ border: "1px solid black", padding: "8px" }}
                  onClick={() => handleClicBin(item.id)}
                >
                  <svg
                    width="20px"
                    height="20px"
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.8489 22.6922C11.5862 22.7201 11.3509 22.5283 11.3232 22.2638L10.4668 14.0733C10.4392 13.8089 10.6297 13.5719 10.8924 13.5441L11.368 13.4937C11.6307 13.4659 11.8661 13.6577 11.8937 13.9221L12.7501 22.1126C12.7778 22.3771 12.5873 22.614 12.3246 22.6418L11.8489 22.6922Z"
                      fill="#000000"
                    />
                    <path
                      d="M16.1533 22.6418C15.8906 22.614 15.7001 22.3771 15.7277 22.1126L16.5841 13.9221C16.6118 13.6577 16.8471 13.4659 17.1098 13.4937L17.5854 13.5441C17.8481 13.5719 18.0387 13.8089 18.011 14.0733L17.1546 22.2638C17.127 22.5283 16.8916 22.7201 16.6289 22.6922L16.1533 22.6418Z"
                      fill="#000000"
                    />
                    <path
                      clipRule="evenodd"
                      d="M11.9233 1C11.3494 1 10.8306 1.34435 10.6045 1.87545L9.54244 4.37037H4.91304C3.8565 4.37037 3 5.23264 3 6.2963V8.7037C3 9.68523 3.72934 10.4953 4.67218 10.6145L7.62934 26.2259C7.71876 26.676 8.11133 27 8.56729 27H20.3507C20.8242 27 21.2264 26.6513 21.2966 26.1799L23.4467 10.5956C24.3313 10.4262 25 9.64356 25 8.7037V6.2963C25 5.23264 24.1435 4.37037 23.087 4.37037H18.4561L17.394 1.87545C17.1679 1.34435 16.6492 1 16.0752 1H11.9233ZM16.3747 4.37037L16.0083 3.50956C15.8576 3.15549 15.5117 2.92593 15.1291 2.92593H12.8694C12.4868 2.92593 12.141 3.15549 11.9902 3.50956L11.6238 4.37037H16.3747ZM21.4694 11.0516C21.5028 10.8108 21.3154 10.5961 21.0723 10.5967L7.1143 10.6285C6.86411 10.6291 6.67585 10.8566 6.72212 11.1025L9.19806 24.259C9.28701 24.7317 9.69985 25.0741 10.1808 25.0741H18.6559C19.1552 25.0741 19.578 24.7058 19.6465 24.2113L21.4694 11.0516ZM22.1304 8.7037C22.6587 8.7037 23.087 8.27257 23.087 7.74074V7.25926C23.087 6.72743 22.6587 6.2963 22.1304 6.2963H5.86957C5.34129 6.2963 4.91304 6.72743 4.91304 7.25926V7.74074C4.91304 8.27257 5.34129 8.7037 5.86956 8.7037H22.1304Z"
                      fill="#000000"
                      fillRule="evenodd"
                    />
                  </svg>
                </td>
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
          onClick={handleClicEliminarCapa}
        >
          Eliminar capa
        </button>
        <button className="botonForm" type="button" onClick={handleClicButton}>
          Cerrar
        </button>
      </div>
    </Modal>
  );
};

export default ModalTablaCapas;
