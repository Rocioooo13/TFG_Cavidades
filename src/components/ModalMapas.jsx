import React from "react";
import Modal from "react-modal";
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
      .then((_) => {
        // El _ hace referencia a que la variable devuelta no la usamos y nos da igual
        //console.log("Aqui fallo 5");
      })
      .finally(() => {
        onRequestClose();
      });
  };
  // Override zIndex to display the modal overlayed to the map
  Modal.defaultStyles.overlay.zIndex = 1000;
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Formulario Modal"
      style={customStyles}
      ariaHideApp={false}
    >
      <h3>Añadir mapa</h3>
      <br />
      <form className="form">
        <div className="inputContainer">
          <label className="labelForm">Nombre:</label>
          <input
            className="inputForm"
            id="nombreMapa"
            type="text"
            placeholder="Escribe el nombre del mapa"
          />
        </div>

        <div className="inputContainer">
          <label className="labelForm">URL:</label>
          <input
            className="inputForm"
            type="text"
            id="url"
            placeholder="Escribe la url del mapa"
          />
        </div>

        <div className="botonesForm">
          <button className="botonForm" type="button" onClick={onRequestClose}>
            Cancelar
          </button>
          <button className="botonForm" type="button" onClick={añadirMapa}>
            Crear
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ModalMapas;
