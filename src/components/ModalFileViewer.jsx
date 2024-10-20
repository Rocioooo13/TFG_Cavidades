import React, { useState } from "react";
import Modal from "react-modal";
import FileViewer from "react-file-viewer";
import api, {
  createTable,
  createCueva,
  createListaCapas,
  añadirCapaListaCapas,
} from "../api";

const customStyles = {
  content: {
    width: "100vw",
    height: "100vh",
    margin: "auto",
  },
};

const ModalFileViewer = ({ isOpen, onRequestClose, urlArchivoCueva }) => {
  Modal.defaultStyles.overlay.zIndex = 1000;
  const file = urlArchivoCueva;
  const type = file.slice(-3);
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Modal FileViewer"
      style={customStyles}
      ariaHideApp={false}
    >
      
      <FileViewer
        className="fileViewerStyle"
        fileType={type}
        filePath={file}
      />
      <div className="botonesForm">
        <button
          id="closeFile"
          className="botonForm"
          type="button"
          onClick={onRequestClose}
        >
          Cerrar
        </button>
      </div>
    </Modal>
  );
};

export default ModalFileViewer;
