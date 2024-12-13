import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { addMap } from "../api";

const customStyles = {
  content: {
    width: "500px",
    height: "270px",
    margin: "auto",
    zIndex: 2,
  },
};

const ModalMapas = ({
  isOpen,
  onRequestClose,
  mapaNuevo,
  setMapaNuevo,
  setMapSelected,
}) => {
  const [selectedValue, setSelectedValue] = useState("");
  const [urlValue, setUrlValue] = useState("");

  const handleSelectChange = (e) => {
    setSelectedValue(e.target.value);
    setUrlValue(e.target.value);
  };
  const handleUrlChange = (e) => {
    setUrlValue(e.target.value);
  };
  useEffect(() => {
    if (isOpen) {
      setSelectedValue("");
      setUrlValue("");
    }
  }, [isOpen]);

  const añadirMapa = () => {
    let objectMapa = "";
    const nombreDelMapa = document.getElementById("nombreMapa").value;
    objectMapa = nombreDelMapa;
    const urlDelMapa = document.getElementById("url").value;
    setMapaNuevo(objectMapa);
    if (urlDelMapa === "") {
      alert("Debes completar el campo URL.");
      return;
    }
    addMap(nombreDelMapa, urlDelMapa)
      .then((_) => {})
      .finally(() => {});
    onRequestClose();
  };
  return (
    <Modal show={isOpen} onHide={onRequestClose} centered style={customStyles}>
      <Modal.Header closeButton>
        <Modal.Title>Añadir mapa</Modal.Title>
      </Modal.Header>
      <form className="form">
        <Modal.Body>
          <div className="inputContainer">
            <label className="labelForm">Nombre:</label>
            <input
              name="nombreMapa"
              className="inputForm"
              id="nombreMapa"
              type="text"
              placeholder="Escribe el nombre del mapa"
            />
          </div>
          <div className="inputContainer">
            <label className="labelForm">
              Puedes seleccionar uno de los mapas existentes o poner la URL de
              un mapa.
            </label>
          </div>
          <div className="inputContainer">
            <label className="labelForm">Mapas:</label>
            <select
              name="zonautmCueva"
              className="selectForm"
              defaultChecked="true"
              placeholder="Selecciona el hemisferio al que pertenece la cueva"
              id="zona"
              onChange={handleSelectChange}
            >
              <option value="https://mt0.google.com/vt/lyrs=m&x={x}&y={y}&z={z}">
                Google Maps
              </option>
              <option value="https://1.aerial.maps.ls.hereapi.com/maptile/2.1/maptile/newest/terrain.day/{z}/{x}/{y}/256/png8?app_id=eAdkWGYRoc4RfxVo0Z4B&app_code=TrLJuXVK62IQk0vuXFzaig&lg=eng">
                Terrain Maps
              </option>
              <option value="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}">
                Satélite
              </option>
              <option value="https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}">
                Topográfico
              </option>
              <option value="http://tile.osm.org/{z}/{x}/{y}.png">
                Geológico
              </option>
            </select>
          </div>

          <div className="inputContainer">
            <label className="labelForm">URL:</label>
            <input
              name="urlMapa"
              className="inputForm"
              type="text"
              id="url"
              placeholder="Escribe la url del mapa"
              value={urlValue}
              onChange={handleUrlChange}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="botonesForm">
            <button
              className="botonForm"
              type="button"
              onClick={onRequestClose}
            >
              Cancelar
            </button>
            <button className="botonForm" type="button" onClick={añadirMapa}>
              Crear
            </button>
          </div>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default ModalMapas;
