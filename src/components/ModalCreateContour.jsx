import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { SketchPicker } from "react-color";
import { createContourPropsTable, addContourProps } from "../api";

const customStyles = {
  content: {
    width: "500px",
    height: "600px",
    margin: "auto",
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

  const handleChangeComplete = (newColor) => {
    setColor(newColor.hex); 
  };

  const handleClicCrearContorno = async () => {
    const colorElegido = document.getElementById("color").value;
    setColor(colorElegido);

    await createContourPropsTable();
    const addContour = await addContourProps(nombreDelContorno, color);
    onRequestClose();
    setCrearContorno(true);
  };


  Modal.defaultStyles.overlay.zIndex = 1000;
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Modal Create Contour"
      style={customStyles}
      ariaHideApp={false}
    >
      <h3>Propiedades del contorno</h3>
      <br />
      <div className="inputContainer">
        <label className="labelForm">Nombre: </label>
        <input
          className="inputForm"
          type="text"
          placeholder="Escribe el nombre del contorno"
          id="nombreContorno"
          value={nombreDelContorno} 
          onChange={(e) => setNombreDelContorno(e.target.value)} 
        />
      </div>
      <div className="inputContainer">
        <label className="labelForm">Color: </label>
        <input
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
      <div className="botonesForm">
        <button className="botonForm" type="button" onClick={onRequestClose}>
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
    </Modal>
  );
};
export default ModalCreateContour;
