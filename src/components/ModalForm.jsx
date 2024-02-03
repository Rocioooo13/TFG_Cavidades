import React from "react";
import Modal from "react-modal";

const customStyles = {
  content: {
    width: "500px",
    height: "560px",
    margin: "auto",
  },
};

const ModalForm = ({ isOpen, onRequestClose }) => {
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
      <h3>Crear cueva</h3>
      <br />
      <form className="form">
        <div className="inputContainer">
          <label className="labelForm">Denominación:</label>
          <input
            className="inputForm"
            type="text"
            placeholder="Escribe el nombre de la cueva"
          />
        </div>

        <div className="inputContainer">
          <label className="labelForm">X:</label>
          <input
            className="inputForm"
            type="text"
            placeholder="Escribe la coordenada X de la cueva"
          />
        </div>

        <div className="inputContainer">
          <label className="labelForm">Y:</label>
          <input
            className="inputForm"
            type="text"
            placeholder="Escribe la coordenada Y de la cueva"
          />
        </div>

        <div className="inputContainer">
          <label className="labelForm">Z:</label>
          <input
            className="inputForm"
            type="text"
            placeholder="Escribe la coordenada Z de la cueva en m"
          />
        </div>

        <div className="inputContainer">
          <label className="labelForm">Elipsoide:</label>
          <input
            className="inputForm"
            defaultValue={"WGS84"}
            type="text"
            placeholder="Escribe el elipsoide de la cueva"
          />
        </div>

        <div className="inputContainer">
          <label className="labelForm">Huso:</label>
          <input
            className="inputForm"
            type="text"
            placeholder="Escribe el huso de la cueva"
          />
        </div>

        <div className="inputContainer">
          <label className="labelForm">Zona UTM:</label>
          <select
            className="selectForm"
            defaultChecked="true"
            placeholder="Selecciona el hemisferio al que pertenece la cueva"
          >
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="E">E</option>
            <option value="F">F</option>
            <option value="G">G</option>
            <option value="H">H</option>
            <option value="J">J</option>
            <option value="K">K</option>
            <option value="L">L</option>
            <option value="M">M</option>
            <option value="N">N</option>
            <option value="P">P</option>
            <option value="Q">Q</option>
            <option value="R">R</option>
            <option value="S">S</option>
            <option value="T" selected={true}>
              T
            </option>
            <option value="U">U</option>
            <option value="V">V</option>
            <option value="W">W</option>
            <option value="X">X</option>
          </select>
        </div>

        <div className="inputContainer">
          <label className="labelForm">Hemisferio:</label>
          <select
            className="selectForm"
            defaultChecked="true"
            placeholder="Selecciona el hemisferio al que pertenece la cueva"
          >
            <option value="Norte" selected={true}>
              N
            </option>
            <option value="Sur">S</option>
          </select>
        </div>

        <div className="inputContainer">
          <label className="labelForm">Concejo:</label>
          <input
            className="inputForm"
            type="text"
            placeholder="Escribe el concejo al que pertenece la cueva"
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

export default ModalForm;
