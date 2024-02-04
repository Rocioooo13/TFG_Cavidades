import React from "react";
import Modal from "react-modal";

const customStyles = {
  content: {
    width: "500px",
    height: "270px",
    margin: "auto",
    zIndex: 2,
  },
};

const ModalMapas = ({ isOpen, onRequestClose }) => {
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
            type="text"
            placeholder="Escribe el nombre del mapa"
          />
        </div>

        <div className="inputContainer">
          <label className="labelForm">URL:</label>
          <input
            className="inputForm"
            type="text"
            placeholder="Escribe la url del mapa"
          />
        </div>

        <div className="botonesForm">
          <button className="botonForm" type="button" onClick={onRequestClose}>
            Cancelar
          </button>
          <button className="botonForm" type="submit">
            Crear
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ModalMapas;
