import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import api, { deleteContorno, deleteCuevaListaContornos } from "../api";

const ModalTablaContornos = ({
  isOpen,
  onRequestClose,
  contornoNuevo,
  setContornoNuevo,
  contornoEliminado,
  setContornoEliminado,
  contornosSeleccionados,
  setContornosSeleccionados,
  todosContornos,
  setTodosContornos,
  contornos,
  setContornos,
  colorContorno,
  setColorContorno,
  index2,
  setIndex2,
  contornosVisibles,
  setContornosVisibles,
}) => {
  const customStyles = {
    content: {
      width: "1100px",
      height: "600px",
      margin: "auto",
      padding: "20px",
    },
  };

  const [selectedOption, setSelectedOption] = useState("");
  const [nombreContorno, setNombreContorno] = useState("");
  const handleChange = (event) => {
    setSelectedOption(event.target.value);
    setNombreContorno(event.target.value);
  };

  const [tablasContornos, setTablasContornos] = useState([]);
  const loadTablas = async () => {
    await api.createContourPropsTable();
    const tablaSelected = await api.obtenerContornos();
    setTablasContornos(tablaSelected ?? []);
  };

  const [contorno, setContorno] = useState([]);
  const loadContorno = async () => {
    if (!nombreContorno) {
      setContorno([]);
    } else {
      const getContorno = await api.getPolygons(
        nombreContorno.split(" ").join("")
      );
      setContorno(getContorno ?? []);
    }
  };

  const selectedOptionData = contorno.filter(
    (item) => item.nombre === nombreContorno.split(" ").join("")
  );

  const handleClicButton = () => {
    onRequestClose();
  };
  const [idSeleccionado, setidSeleccionado] = useState("");

  const handleClicEliminarContorno = async (id) => {
    await deleteContorno(nombreContorno.split(" ").join(""));
    await deleteCuevaListaContornos(nombreContorno);
    setContornoEliminado(true);
    if (contornosSeleccionados.length > 0) {
      if (contornosSeleccionados.length >= index2) {
        try {
          const x = contornosSeleccionados.findIndex(
            (contorno) => contorno === nombreContorno
          );

          setTodosContornos((prevContornos) => {
            const filtered = prevContornos.filter((_, index) => {
              return index !== x;
            });
            return filtered;
          });
          setColorContorno((prevColorContornos) => {
            const filtered = prevColorContornos.filter((_, index) => {
              return index !== x;
            });
            return filtered;
          });
          setContornosVisibles((prevContornosVisibles) => {
            delete prevContornosVisibles[nombreContorno];
            return prevContornosVisibles;
          });
        } catch (error) {
          console.error("Error cargando contornos:", error);
        }
      }
    }

    setContornosSeleccionados((prevContornossSeleccionados) => {
      return prevContornossSeleccionados.filter(
        (contorno) => contorno !== nombreContorno
      );
    });

    setNombreContorno("");
    setContornoEliminado(false);

    setIndex2(index2 - 1);
  };

  useEffect(() => {
    loadTablas();
    loadContorno();
  }, []);

  useEffect(() => {
    loadContorno();
    loadContornosExportacion();
  }, [idSeleccionado, nombreContorno, contornoNuevo === true]);

  useEffect(() => {
    loadTablas();
  }, [contornoEliminado === true, contornoNuevo === true]);

  const [contornosExport, setContornosExport] = useState([]);
  const headersContorno = [
    { label: "Nombre", key: "nombre" },
    { label: "Latitud", key: "latitud" },
    { label: "Longitud", key: "longitud" },
  ];

  const loadContornosExportacion = async () => {
    const nombreContornoAux = new String(nombreContorno).split(" ").join("");
    if (!nombreContornoAux) {
      setContornosExport([]);
      return;
    }
    const contornoArray = await api.getPolygons(nombreContornoAux);
    setContornosExport(contornoArray ?? []);
  };

  const csvReport = {
    data: contornosExport,
    headers: headersContorno,
    filename: `Capa contorno ${nombreContorno}.csv`,
  };

  const clicDownloadContorno = () => {
    const csvData = csvReport.data
      .map((item) => `${item.nombre},${item.latitud},${item.longitud}`)
      .join("\n");

    const csvContent = `${csvReport.headers
      .map((header) => header.label)
      .join(",")}\n${csvData}`;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;

    link.setAttribute("download", csvReport.filename);
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  return (
    <Modal
      show={isOpen}
      onHide={onRequestClose}
      centered
      dialogClassName="modal-90w modal-90h"
      size="lg"
    >
      <Modal.Header closeButton>
        <div className="botonTablaCapas">
          <Modal.Title>Tablas Contornos</Modal.Title>
          {nombreContorno ? (
            <button
              className="botonTablaExportar"
              type="button"
              onClick={clicDownloadContorno}
            >
              Exportar contorno a CSV
            </button>
          ) : null}
        </div>
      </Modal.Header>
      <Modal.Body>
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="select" style={{ marginRight: "10px" }}>
            Selecciona un contorno:
          </label>
          <select id="select" value={selectedOption} onChange={handleChange}>
            <option value="">--Seleccione una opción--</option>
            {tablasContornos.map((tabla) => (
              <option key={tabla.id} value={tabla.nombre}>
                {tabla.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="table-container">
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid black", padding: "8px" }}>
                  ID
                </th>
                <th style={{ border: "1px solid black", padding: "8px" }}>
                  Nombre
                </th>
                <th style={{ border: "1px solid black", padding: "8px" }}>
                  Latitud
                </th>
                <th style={{ border: "1px solid black", padding: "8px" }}>
                  Longitud
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedOptionData.length > 0 ? (
                selectedOptionData.map((item) => (
                  <tr key={item.id}>
                    <td
                      id="identificador"
                      style={{ border: "1px solid black", padding: "8px" }}
                    >
                      {item.id}
                    </td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>
                      {item.nombre}
                    </td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>
                      {item.latitud}
                    </td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>
                      {item.longitud}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="12"
                    style={{
                      border: "1px solid black",
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    No se ha seleccionado ninguna opción
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="botonesForm">
          {nombreContorno ? (
            <button
              className="botonFormEliminar"
              type="button"
              onClick={handleClicEliminarContorno}
            >
              Eliminar contorno
            </button>
          ) : null}
          <button
            className="botonForm"
            type="button"
            onClick={handleClicButton}
          >
            Cerrar
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalTablaContornos;
