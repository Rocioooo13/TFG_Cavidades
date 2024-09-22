import React, { useState } from "react";
import Modal from "react-modal";
import api, {
  createTable,
  createCueva,
  createListaCapas,
  añadirCapaListaCapas,
} from "../api";

const customStyles = {
  content: {
    width: "500px",
    height: "600px",
    margin: "auto",
  },
};

const ModalFileViewer = ({
  isOpen,
  onRequestClose,
  capasSeleccionadas,
  todasCuevas,
  setTodasCuevas,
  index,
  capaNueva,
  setCapaNueva,
}) => {
  
  Modal.defaultStyles.overlay.zIndex = 1000;
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Modal FileViewer"
      style={customStyles}
      ariaHideApp={false}
    >
      <h3>Visualizar archivo</h3>
      <br />
      
    </Modal>
  );
};

export default ModalFileViewer;
