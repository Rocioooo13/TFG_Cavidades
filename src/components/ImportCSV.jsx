import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Papa from "papaparse";
import { añadirCapaListaCapas, createCueva, createTable } from "../api";

const ImportCSV = ({ isOpen, onRequestClose, capaNueva, setCapaNueva }) => {
  const [file, setFile] = useState(null);
  const [tableName, setTableName] = useState("");
  const [matriz, setMatriz] = useState([]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
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
    setCapaNueva(false);
    const conc = new String(tableName).split(" ").join("");

    createTable(conc).then((_) => {
      añadirCapaListaCapas(tableName);

      matriz.map((item) => {
        const lat = new String(item.latitud).replace(",", ".");
        const lon = new String(item.longitud).replace(",", ".");
        if (
          item.denominacion != null &&
          item.X != null &&
          item.Y != null &&
          item.Z != null &&
          item.elipsoide != null &&
          item.huso != null &&
          item.zonaUTM != null &&
          item.hemisferio != null &&
          conc != null &&
          lat != null &&
          lon != null
        ) {
          createCueva(
            item.denominacion,
            item.X,
            item.Y,
            item.Z,
            item.elipsoide,
            item.huso,
            item.zonaUTM,
            item.hemisferio,
            conc,
            lat,
            lon,
            item.archivo
          )
            .then((_) => {})
            .finally(() => {
              onRequestClose();
              setCapaNueva(true);
            });
        } else {
          console.log("Se ha encontrado un valor null y no se ha insertado.");
        }
      });
    });
  };

  useEffect(() => {
    if (matriz.length > 0) {
      handleImportInTheBD(matriz, tableName);
    }
  }, [matriz]);
  const customStyles = {
    content: {
      width: "600px",
      height: "300px",
      margin: "auto",
      padding: "20px",
    },
  };

  // Modal.defaultStyles.overlay.zIndex = 1000;
  return (
    <Modal
      show={isOpen}
      // onRequestClose={onRequestClose}
      // ariaHideApp={false}
      style={customStyles}
    >
      <Modal.Header>
        <Modal.Title>Importar capa csv</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Selecciona el .csv y escribe el nombre que quieres ponerle a la capa
        </p>
        <br></br>
        <input
          name="nombreCapaCueva"
          type="text"
          placeholder="Nombre de la tabla"
          value={tableName}
          onChange={(e) => setTableName(e.target.value)}
        />
        <input
          name="fileCapaCueva"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
        />
      </Modal.Body>
      <Modal.Footer>
        <div className="botonesForm">
          <button className="botonForm" type="button" onClick={onRequestClose}>
            Cancelar
          </button>
          <button className="botonForm" type="button" onClick={handleImport}>
            Importar
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ImportCSV;
