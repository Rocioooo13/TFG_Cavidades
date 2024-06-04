import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import Papa from "papaparse";
import { añadirCapaListaCapas, createCueva, createTable } from "../api";

const ImportCSV = ({ isOpen, onRequestClose /*, onCsvImport*/ }) => {
  const [file, setFile] = useState(null);
  const [tableName, setTableName] = useState(""); // Agrega un campo para el nombre de la tabla
  const [matriz, setMatriz] = useState([]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleImport = () => {
    if (file && tableName) {
      Papa.parse(file, {
        complete: (result) => {
          console.log(result);
          setMatriz(result.data); // Asegúrate de que estás estableciendo los datos correctamente
          //onCsvImport({ tableName, data: result.data });
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
    const conc = new String(tableName).split(" ").join("");
    console.log("Llega aqui 1 ", tableName);

    createTable(conc).then((_) => {
      console.log("Llega aqui 2");

      añadirCapaListaCapas(tableName);
      console.log("Llega aqui 3");

      matriz.map((item) => {
        const lat = new String(item.latitud).replace(",", ".");
        const lon = new String(item.longitud).replace(",", ".");
        if (item.X != null) {
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
            lon
            //document.getElementById("archivo").value
          )
            .then((_) => {
              // El _ hace referencia a que la variable devuelta no la usamos y nos da igual
              console.log("Llega aqui 4");
            })
            .finally(() => {
              onRequestClose();
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

  Modal.defaultStyles.overlay.zIndex = 1000;
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} ariaHideApp={false}>
      <h3>Importar capa csv</h3>
      <br></br>
      <p>
        Selecciona el .csv y escribe el nombre que quieres ponerle a la capa
      </p>
      <br></br>
      <input
        type="text"
        placeholder="Nombre de la tabla"
        value={tableName}
        onChange={(e) => setTableName(e.target.value)}
      />
      <input type="file" accept=".csv" onChange={handleFileChange} />

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

export default ImportCSV;
