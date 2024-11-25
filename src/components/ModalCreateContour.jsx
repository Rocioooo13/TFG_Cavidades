import React, { useState, useRef, useCallback } from "react";
import Modal from "react-bootstrap/Modal";
import { SketchPicker } from "react-color";
import { createContourPropsTable, addContourProps } from "../api";

const customStyles = {
  content: {
    width: "500px",
    height: "600px",
    margin: "auto",
    zIndex: "1000",
  },
};

export const ModalCreateContour = ({
  isOpen,
  onRequestClose,
  crearContorno,
  setCrearContorno,
  setColor,
  color,
  nombreDelContorno,
  setNombreDelContorno,
}) => {
  const [mostrarComponente, setMostrarComponente] = useState(false);

  const handleChangeComplete = (newColor) => {
    setColor(newColor.hex);
  };

  const handleClicCrearContorno = async () => {
    await createContourPropsTable();
    const addContour = await addContourProps(nombreDelContorno, color);
    onRequestClose();
    setCrearContorno(true);
  };

  const handleNombreContorno = (e) => {
    setNombreDelContorno(e.target.value);
  };

  return (
    <Modal
      id="modalCreateContour"
      show={isOpen}
      onHide={onRequestClose}
      centered
      style={customStyles}
    >
      <Modal.Header closeButton>
        <Modal.Title>Propiedades del contorno</Modal.Title>
      </Modal.Header>
      {/* <br /> */}
      <form id="createContour">
        <Modal.Body>
          <div className="inputContainer" id="modalCreateContour">
            <label className="labelForm" htmlFor="nameOfContour">
              Nombre:{" "}
            </label>
            <input
              name="nombreDelContorno"
              className="inputForm"
              type="text"
              label="nameOfContour"
              placeholder="Escribe el nombre del contorno"
              id="nombreContorno"
              value={nombreDelContorno}
              onChange={(e) => handleNombreContorno(e)}
              form="createContour"
            />
          </div>
          <div className="inputContainer">
            <label className="labelForm">Color: </label>
            <input
              name="colorDelContorno"
              className="inputForm"
              type="text"
              id="color"
              value={color}
              readOnly
              style={{ border: 0 }}
            />
          </div>
          <div className="colorPickerContainer">
            <SketchPicker
              color={color}
              onChangeComplete={handleChangeComplete}
              form="createContour"
            />
            <div
              className="colorDisplay"
              style={{
                marginTop: "20px",
                width: "100px",
                height: "100px",
                backgroundColor: { color },
              }}
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
              Cerrar
            </button>
            <button
              className="botonForm"
              type="button"
              onClick={handleClicCrearContorno}
            >
              Guardar
            </button>
          </div>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default ModalCreateContour;
