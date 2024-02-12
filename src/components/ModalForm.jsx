import React from "react";
import Modal from "react-modal";
import api, { createTable } from "../api";

const customStyles = {
  content: {
    width: "500px",
    height: "560px",
    margin: "auto",
  },
};

const ModalForm = ({ isOpen, onRequestClose }) => {
  // Override zIndex to display the modal overlayed to the map
  const pruebaObtenerValor = () => {
    // Obtener el valor del label
    const inputValor = document.getElementById("denominacion").value;

    // Imprimir el valor recuperado
    console.log(inputValor);
  };

  const formulaLatitudLongitud = () => {
    const aSemi = 6378137;
    const bSemi = 6356752.314;
    const excentricidad = 0.081819191;
    const e1 = 0.082094438;
    const e12 = 0.006739497;
    const c = 6399593.626;

    //Cambiar porque tengo que ver como obtener el valor de un input
    const yDelForm = document.getElementById("y").value;
    const hemisferioIndez =
      document.getElementById("hemisferio1").selectedIndex;
    const hemisferio = document.getElementById("hemisferio1")[0].label;
    const xDelForm = document.getElementById("x").value;
    const huso = document.getElementById("huso").value;

    //Cambiar el nombre de las variable de los input
    // COMRPOBAR DE OTRA MANERA PORQUE NO FUNCIONA
    var yAlSurEcuador = 0;
    if (hemisferio === "S") {
      yAlSurEcuador = yDelForm - 10000000;
    } else {
      yAlSurEcuador = yDelForm;
    }
    const fi = yAlSurEcuador / (6366197.724 * 0.9996);
    const ni =
      (c / Math.pow(1 + e12 * Math.pow(Math.cos(fi), 2), 1 / 2)) * 0.9996;
    const a = (xDelForm - 500000) / ni;
    const A1 = Math.sin(2 * fi);
    const A2 = A1 * Math.pow(Math.cos(fi), 2);
    console.log("A2: ", A2);
    const J2 = fi + A1 / 2;
    const J4 = (3 * A1 + J2) / 4;
    const J6 = (5 * J4 + A2 * Math.pow(Math.cos(fi), 2)) / 3;
    const alfa = (3 / 4) * e12;
    const beta = (5 / 3) * Math.pow(alfa, 2);
    const gamma = (85 / 27) * Math.pow(alfa, 3);
    const bfi = 0.9996 * c * fi - alfa * J2 + beta * J4 - gamma * J6;
    const b = (yAlSurEcuador - bfi) / ni;
    const zeta = ((e12 * a) / 2) * Math.pow(Math.cos(fi), 2);
    const xi = a * (1 - zeta / 3);
    const eta = b * (1 - zeta) + fi;
    const senhxi = (Math.pow(Math.E, xi) - Math.pow(Math.E, -xi)) / 2;
    const deltaLambda = Math.atan(senhxi / Math.cos(eta));
    const tan = Math.atan(Math.cos(deltaLambda) * Math.tan(eta));
    const meridianoCentral1 = 6 * huso - 183;
    const radianes =
      fi +
      (1 +
        e12 * Math.pow(Math.cos(fi), 2) -
        (3 / 2) * e12 * Math.sin(fi) * Math.cos(fi) * (tan - fi)) *
        (tan - fi);
    const longitud1 = +(deltaLambda / Math.PI) * 180 + meridianoCentral1;
    var longitud = 0;
    if (meridianoCentral1 === -183) {
      longitud = 0;
    } else {
      longitud = longitud1;
    }
    const latitud = +(radianes / Math.PI) * 180;

    console.log("Longitud: ", longitud, " Latitud: ", latitud);
    return [longitud, latitud];
  };
  const addCueva = () => {
    //Obtengo el valor del concejo para crear la tabla
    const conc = new String(document.getElementById("concejo").value)
      .split(" ")
      .join("");
    createTable(conc);

    //Obtengo latitud y longitud de la cueva
    var latlong = formulaLatitudLongitud();
    console.log(latlong[0]);

    //Inserto la cueva en la tabla creada
    const denom = document.getElementById("denominacion").value;
    const yDelForm = document.getElementById("y").value;
    const xDelForm = document.getElementById("x").value;
    const zDelForm = document.getElementById("z").value;
    const elip = document.getElementById("elipsoide").value;
    const huso = document.getElementById("huso").value;
    const zonautmIndex = document.getElementById("zona").selectedIndex;
    const zonautm = document.getElementById("zona")[0].label;
    const hemisferioIndex =
      document.getElementById("hemisferio1").selectedIndex;
    const hemisferio = document.getElementById("hemisferio1")[0].label;

    api.createCueva(
      denom,
      yDelForm,
      xDelForm,
      zDelForm,
      elip,
      huso,
      zonautm,
      hemisferio,
      conc,
      latlong[0],
      latlong[1]
    );
    //Cierro la ventana modal
    // onRequestClose();
  };
  Modal.defaultStyles.overlay.zIndex = 1000;
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Formulario Modal"
      style={customStyles}
      ariaHideApp={false}
    >
      <h3>Crear cueva</h3>
      <br />
      <form className="form">
        <div className="inputContainer">
          <label className="labelForm">Denominación:</label>
          <input
            className="inputForm"
            type="text"
            placeholder="Escribe el nombre de la cueva"
            id="denominacion"
          />
        </div>

        <div className="inputContainer">
          <label className="labelForm">X:</label>
          <input
            className="inputForm"
            type="text"
            placeholder="Escribe la coordenada X de la cueva"
            id="x"
          />
        </div>

        <div className="inputContainer">
          <label className="labelForm">Y:</label>
          <input
            className="inputForm"
            type="text"
            placeholder="Escribe la coordenada Y de la cueva"
            id="y"
          />
        </div>

        <div className="inputContainer">
          <label className="labelForm">Z:</label>
          <input
            className="inputForm"
            type="text"
            placeholder="Escribe la coordenada Z de la cueva en m"
            id="z"
          />
        </div>

        <div className="inputContainer">
          <label className="labelForm">Elipsoide:</label>
          <input
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
            className="inputForm"
            type="text"
            placeholder="Escribe el huso de la cueva"
            id="huso"
          />
        </div>

        <div className="inputContainer">
          <label className="labelForm">Zona UTM:</label>
          <select
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
            className="inputForm"
            type="text"
            placeholder="Escribe el concejo al que pertenece la cueva"
            id="concejo"
          />
        </div>

        <div className="botonesForm">
          <button
            className="botonForm"
            type="button"
            // onClick={formulaLatitudLongitud}
            onClick={addCueva}
          >
            boton prueba
          </button>
          <button className="botonForm" type="button" onClick={onRequestClose}>
            Cancelar
          </button>
          <button className="botonForm" type="submit" onClick={addCueva}>
            Crear
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ModalForm;
