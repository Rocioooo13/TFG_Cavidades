import React, { useEffect, useState, useRef, useCallback } from "react";
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

  // Manejar la selección de color
  const handleChangeComplete = (newColor) => {
    setColor(newColor.hex);
  };

  // Crear el contorno cuando se hace clic en "Guardar"
  const handleClicCrearContorno = async () => {
    // Usamos directamente el estado `color`
    await createContourPropsTable();
    const addContour = await addContourProps(nombreDelContorno, color);
    onRequestClose();
    setCrearContorno(true);
  };

  // Mostrar el input solo cuando el modal esté completamente abierto
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setMostrarComponente(true);
      }, 500); // Delay de 500ms para asegurar que el modal está completamente listo
    } else {
      setMostrarComponente(false); // Ocultar el componente cuando el modal se cierre
    }
  }, [isOpen]);

  // const inputElement = useCallback((inputElement) => {
  //   if (inputElement) {
  //     inputElement.focus();
  //   }
  // }, []);

  const handleNombreContorno = (e) => {
    setNombreDelContorno(e.target.value);
  };

  //Modal.defaultStyles.overlay.zIndex = 1000; // Asegurar el z-index del modal
  return (
    <Modal
      id="modalCreateContour"
      show={isOpen}
      //onRequestClose={onRequestClose}
      // contentLabel="Modal Create Contour"
      style={customStyles}
      // ariaHideApp={false}
    >
      <Modal.Header>
        <Modal.Title>Propiedades del contorno</Modal.Title>
      </Modal.Header>
      {/* <br /> */}
      <form id="createContour">
        <Modal.Body>
          {mostrarComponente ? (
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
          ) : (
            <h1>Cargando...</h1>
          )}
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
