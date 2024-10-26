import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
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
  // Modal.defaultStyles.overlay.zIndex = 1000;
  const file = urlArchivoCueva;
  const type = file.slice(-3);
  return (
    <Modal
      show={isOpen}
      // onRequestClose={onRequestClose}
      // contentLabel="Modal FileViewer"
      onHide={onRequestClose}
      dialogClassName="modal-90w"
      size="xl"
      // ariaHideApp={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Visor de archivo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FileViewer
          className="fileViewerStyle"
          fileType={type}
          filePath={file}
        />
      </Modal.Body>
      <Modal.Footer>
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
      </Modal.Footer>
    </Modal>
  );
};

export default ModalFileViewer;
