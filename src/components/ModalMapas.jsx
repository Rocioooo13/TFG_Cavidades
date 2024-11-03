import React from "react";
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

const ModalMapas = ({ isOpen, onRequestClose, mapaNuevo, setMapaNuevo }) => {
  const añadirMapa = () => {
    let objectMapa = "";
    const nombreDelMapa = document.getElementById("nombreMapa").value;
    objectMapa = nombreDelMapa;
    const urlDelMapa = document.getElementById("url").value;
    setMapaNuevo(objectMapa);

    addMap(nombreDelMapa, urlDelMapa)
      .then((_) => {})
      .finally(() => {
        onRequestClose();
      });
  };
  return (
    <Modal
      show={isOpen}
      onHide={onRequestClose}
      centered
      style={customStyles}
    >
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
            <label className="labelForm">URL:</label>
            <input
              name="urlMapa"
              className="inputForm"
              type="text"
              id="url"
              placeholder="Escribe la url del mapa"
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
