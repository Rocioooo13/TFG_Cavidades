import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import Papa from "papaparse";
import { SketchPicker } from "react-color";
import { addContourProps, createContourTable, addContourImport } from "../api";
import { Table } from "react-bootstrap";

const ImportCSVContour = ({
  isOpen,
  onRequestClose,
  contornoNuevo,
  setContornoNuevo,
}) => {
  const [file, setFile] = useState(null);
  const [tableName, setTableName] = useState("");
  const [matriz, setMatriz] = useState([]);
  const [colorImport, setColorImport] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleChangeComplete = (newColor) => {
    setColorImport(newColor.hex);
  };

  const handleImport = () => {
    if (file && tableName) {
      Papa.parse(file, {
        complete: (result) => {
          setMatriz(result.data);
          onRequestClose();
        },
        header: true,
      });
    } else {
      alert(
        "Por favor, ingrese un nombre para la tabla y seleccione un archivo."
      );
    }
  };

  const handleImportInTheBD = (matriz, tableName) => {
    setContornoNuevo(false);
    const colorElegido = document.getElementById("color").value;
    setColorImport(colorElegido);
    const cont = new String(tableName).split(" ").join("");

    createContourTable(cont).then(async (_) => {
      addContourProps(tableName, colorImport);

      for (let index = 0; index < matriz.length; index++) {
        const item = matriz[index];

        const lat = new String(item.latitud)
          .replaceAll(",", ".")
          .replaceAll(" ", "");
        const lon = new String(item.longitud)
          .replaceAll(",", ".")
          .replaceAll(" ", "");
        if (!item.nombre || !lat || !lon) {
          console.log("Se ha encontrado un valor null y no se ha insertado.");
        } else {
          const coord = [lat, lon];
          await addContourImport(cont, coord);
          onRequestClose();
          setContornoNuevo(true);
        }
      }
    });
    console.log(colorImport);
  };

  useEffect(() => {
    if (matriz.length > 0) {
      handleImportInTheBD(matriz, tableName);
    }
  }, [matriz]);
  const customStyles = {
    content: {
      width: "600px",
      height: "650px",
      margin: "auto",
      padding: "20px",
    },
  };

  Modal.defaultStyles.overlay.zIndex = 1000;
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      ariaHideApp={false}
      style={customStyles}
    >
      <h3>Importar contorno csv</h3>
      <br></br>
      <p>
        Selecciona el .csv y escribe el nombre que quieres ponerle al contorno
      </p>
      <br></br>
      <input
        type="text"
        placeholder="Nombre de la tabla"
        value={tableName}
        onChange={(e) => setTableName(e.target.value)}
      />
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <div className="inputContainer">
        <label className="labelForm">Color: </label>
        <input
          className="inputForm"
          type="text"
          id="color"
          value={colorImport}
          readOnly
          style={{ border: 0 }}
        />
      </div>
      <div className="colorPickerContainer">
        <SketchPicker
          color={colorImport}
          onChangeComplete={handleChangeComplete}
        />
        <div
          className="colorDisplay"
          style={{
            marginTop: "20px",
            width: "100px",
            height: "100px",
            backgroundColor: { colorImport },
          }}
        />
      </div>

      <div className="botonesForm">
        <button className="botonForm" type="button" onClick={onRequestClose}>
          Cancelar
        </button>
        <button className="botonForm" type="button" onClick={handleImport}>
          Importar
        </button>
      </div>
    </Modal>
  );
};

export default ImportCSVContour;
