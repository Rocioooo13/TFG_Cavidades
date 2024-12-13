import React from "react";
import Modal from "react-bootstrap/Modal";
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

const ModalForm = ({
  isOpen,
  onRequestClose,
  capasSeleccionadas,
  todasCuevas,
  setTodasCuevas,
  index,
  capaNueva,
  setCapaNueva,
}) => {
  const pruebaObtenerValor = () => {
    const inputValor = document.getElementById("denominacion").value;
  };

  const formulaLatitudLongitud = () => {
    const aSemi = 6378137;
    const bSemi = 6356752.314;
    const excentricidad = 0.081819191;
    const e1 = 0.082094438;
    const e12 = 0.006739497;
    const c = 6399593.626;

    const yDelForm = document.getElementById("y").value;
    const hemisferioIndex =
      document.getElementById("hemisferio1").selectedIndex;
    const hemisferio =
      document.getElementById("hemisferio1")[hemisferioIndex].label;
    const xDelForm = document.getElementById("x").value;
    const huso = document.getElementById("huso").value;

    var yAlSurEcuador = 0;
    if (hemisferio === "S") {
      yAlSurEcuador = Number(yDelForm - 10000000);
    } else {
      yAlSurEcuador = Number(yDelForm);
    }
    const fi = Number((yAlSurEcuador / (6366197.724 * 0.9996)).toFixed(9)); // 9 o 8
    const ni = Number(
      (
        (c / Math.pow(1 + e12 * Math.pow(Math.cos(fi), 2), 1 / 2)) *
        0.9996
      ).toFixed(3)
    );
    const a = Number(((xDelForm - 500000) / ni).toFixed(9));
    const A1 = Number(Math.sin(2 * fi).toFixed(9));
    const A2 = Number((A1 * Math.pow(Math.cos(fi), 2)).toFixed(9));
    const J2 = Number((fi + A1 / 2).toFixed(9));
    const J4 = Number(((3 * J2 + A2) / 4).toFixed(9));
    const J6 = Number(
      ((5 * J4 + A2 * Math.pow(Math.cos(fi), 2)) / 3).toFixed(9)
    );
    const alfa = Number(((3 / 4) * e12).toFixed(9)); //9
    const beta1 = ((5 / 3) * Math.pow(alfa, 2)).toExponential(4);
    const beta = Number(beta1);
    const gamma1 = ((35 / 27) * Math.pow(alfa, 3)).toExponential(5);
    const gamma = Number(gamma1);
    const bfi = Number(
      (0.9996 * c * (fi - alfa * J2 + beta * J4 - gamma * J6)).toFixed(3)
    );
    const b = Number(((yAlSurEcuador - bfi) / ni).toFixed(9));
    const zeta1 = (
      ((e12 * Math.pow(a, 2)) / 2) *
      Math.pow(Math.cos(fi), 2)
    ).toExponential(5);
    const zeta = Number(zeta1);
    const xi = Number((a * (1 - zeta / 3)).toFixed(9));
    const eta = Number((b * (1 - zeta) + fi).toFixed(9));
    const senhxi = Number(
      ((Math.pow(Math.E, xi) - Math.pow(Math.E, -xi)) / 2).toFixed(9)
    );
    const deltaLambda = Number(Math.atan(senhxi / Math.cos(eta)).toFixed(9));
    const tan = Number(
      Math.atan(Math.cos(deltaLambda) * Math.tan(eta)).toFixed(9)
    );
    const meridianoCentral1 = 6 * huso - 183;
    const radianes = Number(
      (
        fi +
        (1 +
          e12 * Math.pow(Math.cos(fi), 2) -
          (3 / 2) * e12 * Math.sin(fi) * Math.cos(fi) * (tan - fi)) *
          (tan - fi)
      ).toFixed(9)
    );
    const longitud1 = Number(
      +(deltaLambda / Math.PI) * 180 + meridianoCentral1
    );
    var longitud = 0;
    if (meridianoCentral1 === -183) {
      longitud = 0;
    } else {
      longitud = Number(longitud1.toFixed(7));
    }
    const latitud = Number((+(radianes / Math.PI) * 180).toFixed(7));

    return [longitud, latitud];
  };
  const addCueva = () => {
    setCapaNueva(false);
    const conc = new String(document.getElementById("concejo").value)
      .split(" ")
      .join("");

    createTable(conc).then((_) => {
      const conc2 = document.getElementById("concejo").value;
      añadirCapaListaCapas(conc2);

      var latlong = formulaLatitudLongitud();

      const denom = document.getElementById("denominacion").value;
      const yDelForm = document.getElementById("y").value;
      const xDelForm = document.getElementById("x").value;
      const zDelForm = document.getElementById("z").value;
      const elip = document.getElementById("elipsoide").value;
      const huso = document.getElementById("huso").value;
      const zonautmIndex = document.getElementById("zona").selectedIndex;
      const zonautm = document.getElementById("zona")[zonautmIndex].label;
      let archivo = document.getElementById("archivo").value;
      const archivoTemp = document.getElementById("archivo").value;
      if (archivoTemp === "" || archivoTemp === null) {
        archivo = null;
      } else {
        archivo = archivoTemp;
      }
      const hemisferioIndex =
        document.getElementById("hemisferio1").selectedIndex;
      const hemisferio =
        document.getElementById("hemisferio1")[hemisferioIndex].label;
      createCueva(
        denom,
        xDelForm,
        yDelForm,
        zDelForm,
        elip,
        huso,
        zonautm,
        hemisferio,
        conc,
        latlong[0],
        latlong[1],
        archivo
      )
        .then((_) => {})
        .finally(async () => {
          alert("La capa se ha creado correctamente.");
          if (capasSeleccionadas.length > 0) {
            if (capasSeleccionadas.length >= index) {
              try {
                let objectCuevas;
                const capa = await api.getLayers(conc);
                objectCuevas = capa;
                const x = todasCuevas.findIndex((cuevas) =>
                  cuevas.find((cueva) => cueva.concejo === conc2)
                );

                setTodasCuevas((prevCapas) => {
                  prevCapas[x] = objectCuevas;
                  return prevCapas;
                });
              } catch (error) {
                console.error("Error cargando cuevas:", error);
              }
            }
          }
          onRequestClose();
          setCapaNueva(true);
        });
    });
  };
  return (
    <Modal show={isOpen} onHide={onRequestClose} centered style={customStyles}>
      <Modal.Header closeButton>
        <Modal.Title>Crear cueva</Modal.Title>
      </Modal.Header>
      <form className="form">
        <Modal.Body>
          <div className="inputContainer">
            <label className="labelForm">Denominación:</label>
            <input
              name="denominacionCueva"
              className="inputForm"
              type="text"
              placeholder="Escribe el nombre de la cueva"
              id="denominacion"
            />
          </div>

          <div className="inputContainer">
            <label className="labelForm">X:</label>
            <input
              name="XCueva"
              className="inputForm"
              type="text"
              placeholder="Escribe la coordenada X de la cueva"
              id="x"
            />
          </div>

          <div className="inputContainer">
            <label className="labelForm">Y:</label>
            <input
              name="YCueva"
              className="inputForm"
              type="text"
              placeholder="Escribe la coordenada Y de la cueva"
              id="y"
            />
          </div>

          <div className="inputContainer">
            <label className="labelForm">Z:</label>
            <input
              name="ZCueva"
              className="inputForm"
              type="text"
              placeholder="Escribe la coordenada Z de la cueva en m"
              id="z"
            />
          </div>

          <div className="inputContainer">
            <label className="labelForm">Elipsoide:</label>
            <input
              name="elipsoideCueva"
              className="inputForm"
              defaultValue={"WGS84"}
              type="text"
              placeholder="Escribe el elipsoide de la cueva"
              id="elipsoide"
            />
          </div>

          <div className="inputContainer">
            <label className="labelForm">Huso:</label>
            <input
              name="husoCueva"
              className="inputForm"
              type="text"
              placeholder="Escribe el huso de la cueva"
              id="huso"
            />
          </div>

          <div className="inputContainer">
            <label className="labelForm">Zona UTM:</label>
            <select
              name="zonautmCueva"
              className="selectForm"
              defaultChecked="true"
              placeholder="Selecciona el hemisferio al que pertenece la cueva"
              id="zona"
            >
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="E">E</option>
              <option value="F">F</option>
              <option value="G">G</option>
              <option value="H">H</option>
              <option value="J">J</option>
              <option value="K">K</option>
              <option value="L">L</option>
              <option value="M">M</option>
              <option value="N">N</option>
              <option value="P">P</option>
              <option value="Q">Q</option>
              <option value="R">R</option>
              <option value="S">S</option>
              <option value="T" selected={true}>
                T
              </option>
              <option value="U">U</option>
              <option value="V">V</option>
              <option value="W">W</option>
              <option value="X">X</option>
            </select>
          </div>

          <div className="inputContainer">
            <label className="labelForm">Hemisferio:</label>
            <select
              name="hemisferioCueva"
              className="selectForm"
              defaultChecked="true"
              placeholder="Selecciona el hemisferio al que pertenece la cueva"
              id="hemisferio1"
            >
              <option value="Norte" selected={true}>
                N
              </option>
              <option value="Sur">S</option>
            </select>
          </div>

          <div className="inputContainer">
            <label className="labelForm">Concejo:</label>
            <input
              name="concejocueva"
              className="inputForm"
              type="text"
              placeholder="Escribe el concejo al que pertenece la cueva"
              id="concejo"
            />
          </div>

          <div className="inputContainer">
            <label className="labelForm">Ruta archivo:</label>
            <input
              name="archivoCueva"
              className="inputForm"
              type="text"
              placeholder="C:/Users/rocio/Desktop/archivo.pdf"
              id="archivo"
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
              Cancelar
            </button>
            <button className="botonForm" type="button" onClick={addCueva}>
              Crear
            </button>
          </div>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default ModalForm;
