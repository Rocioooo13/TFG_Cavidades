import React from "react";
import Modal from "react-modal";
import { Map } from "./Map";
import api, {
  createTable,
  createCueva,
  updateCueva,
  deleteCueva,
} from "../api";

const customStyles = {
  content: {
    width: "500px",
    height: "600px",
    margin: "auto",
  },
};

const ModalFormUpdate = ({ isOpen, onRequestClose, cuevaSelected }) => {
  console.log(cuevaSelected);
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

    //Cambiar porque tengo que ver como obtener el valor de un input --> HECHO
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
    console.log("yAlSurDelEcuador ", yAlSurEcuador);
    const fi = Number((yAlSurEcuador / (6366197.724 * 0.9996)).toFixed(9)); // 9 o 8
    console.log("fi ", fi);
    const ni = Number(
      (
        (c / Math.pow(1 + e12 * Math.pow(Math.cos(fi), 2), 1 / 2)) *
        0.9996
      ).toFixed(3)
    ); //3
    console.log("ni ", ni);
    const a = Number(((xDelForm - 500000) / ni).toFixed(9)); //9 o 8
    console.log("a ", a);
    const A1 = Number(Math.sin(2 * fi).toFixed(9)); //9 o 7
    console.log("A1 ", A1);
    const A2 = Number((A1 * Math.pow(Math.cos(fi), 2)).toFixed(9)); //9 o 8
    console.log("A2 ", A2);
    const J2 = Number((fi + A1 / 2).toFixed(9)); // 9 o 8 //FALLAAAAAAAAAAAAAAAAAAAA AQUI
    console.log("J2 ", J2);
    const J4 = Number(((3 * J2 + A2) / 4).toFixed(9)); //9
    console.log("J4 ", J4);
    const J6 = Number(
      ((5 * J4 + A2 * Math.pow(Math.cos(fi), 2)) / 3).toFixed(9)
    ); //9 o 8
    console.log("J6 ", J6);
    const alfa = Number(((3 / 4) * e12).toFixed(9)); //9
    console.log("alfa ", alfa);
    const beta1 = ((5 / 3) * Math.pow(alfa, 2)).toExponential(4);
    const beta = Number(beta1); // 4,2582E-05 parseFloat(numero).toExponential(4)
    console.log("beta ", beta);
    const gamma1 = ((35 / 27) * Math.pow(alfa, 3)).toExponential(5);
    const gamma = Number(gamma1); // 1.67406E-07
    console.log("gamma ", gamma);
    const bfi = Number(
      (0.9996 * c * (fi - alfa * J2 + beta * J4 - gamma * J6)).toFixed(3)
    ); // 3
    console.log("bfi ", bfi);
    const b = Number(((yAlSurEcuador - bfi) / ni).toFixed(9)); // 9 o 8
    console.log("b ", b);
    const zeta1 = (
      ((e12 * Math.pow(a, 2)) / 2) *
      Math.pow(Math.cos(fi), 2)
    ).toExponential(5);
    const zeta = Number(zeta1); // 1.20996E-06
    console.log("zeta ", zeta);
    const xi = Number((a * (1 - zeta / 3)).toFixed(9)); //9 o 8
    console.log("xi ", xi);
    const eta = Number((b * (1 - zeta) + fi).toFixed(9)); // 9 o 8
    console.log("eta ", eta);
    const senhxi = Number(
      ((Math.pow(Math.E, xi) - Math.pow(Math.E, -xi)) / 2).toFixed(9)
    ); //9 o 8
    console.log("senhxi ", senhxi);
    const deltaLambda = Number(Math.atan(senhxi / Math.cos(eta)).toFixed(9)); //9 o 8
    console.log("deltaLambda ", deltaLambda);
    const tan = Number(
      Math.atan(Math.cos(deltaLambda) * Math.tan(eta)).toFixed(9)
    ); //9 o 8
    console.log("tan ", tan);
    const meridianoCentral1 = 6 * huso - 183;
    console.log("meridianoCentral1 ", meridianoCentral1);
    const radianes = Number(
      (
        fi +
        (1 +
          e12 * Math.pow(Math.cos(fi), 2) -
          (3 / 2) * e12 * Math.sin(fi) * Math.cos(fi) * (tan - fi)) *
          (tan - fi)
      ).toFixed(9)
    ); //9 o 8
    console.log("redianes ", radianes);
    const longitud1 = Number(
      +(deltaLambda / Math.PI) * 180 + meridianoCentral1
    );
    console.log("ni ", ni);
    var longitud = 0;
    if (meridianoCentral1 === -183) {
      longitud = 0;
    } else {
      longitud = Number(longitud1.toFixed(7)); // 7
    }
    const latitud = Number((+(radianes / Math.PI) * 180).toFixed(7)); // 7

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

    //Inserto la cueva en la tabla creada
    const denom = document.getElementById("denominacion").value;
    const yDelForm = document.getElementById("y").value;
    const xDelForm = document.getElementById("x").value;
    const zDelForm = document.getElementById("z").value;
    const elip = document.getElementById("elipsoide").value;
    const huso = document.getElementById("huso").value;
    const zonautmIndex = document.getElementById("zona").selectedIndex;
    const zonautm = document.getElementById("zona")[zonautmIndex].label;
    console.log(zonautm);
    const hemisferioIndex =
      document.getElementById("hemisferio1").selectedIndex;
    const hemisferio =
      document.getElementById("hemisferio1")[hemisferioIndex].label;

    setTimeout(
      () =>
        createCueva(
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
        ),
      500
    );
    //Cierro la ventana modal REVISAR PORQUE NO FUNCIONA
    //onRequestClose();
    //Map.setIsModalOpen(true);
  };

  //FALTA POR PERFECCIONAR PARA QUE LO HAGA CON CUALQUIER CAMPO!!!
  const handleUpdateCueva = () => {
    //Obtengo el valor del concejo para crear la tabla
    // const conc = new String(document.getElementById("concejo").value)
    //   .split(" ")
    //   .join("");
    // createTable(conc);
    // //Obtengo latitud y longitud de la cueva
    // var latlong = formulaLatitudLongitud();

    //Inserto la cueva en la tabla creada
    const denom = document.getElementById("denominacion").value;
    // const yDelForm = document.getElementById("y").value;
    // const xDelForm = document.getElementById("x").value;
    // const zDelForm = document.getElementById("z").value;
    // const elip = document.getElementById("elipsoide").value;
    // const huso = document.getElementById("huso").value;
    // const zonautmIndex = document.getElementById("zona").selectedIndex;
    // const zonautm = document.getElementById("zona")[zonautmIndex].label;
    // console.log(zonautm);
    // const hemisferioIndex =
    //   document.getElementById("hemisferio1").selectedIndex;
    // const hemisferio =
    //   document.getElementById("hemisferio1")[hemisferioIndex].label;

    // setTimeout(
    //   () => updateCueva(denom, cuevaSelected.id, cuevaSelected.denominacion),
    //   500
    // );
    updateCueva(denom, cuevaSelected.id, cuevaSelected.denominacion);
    //Cierro la ventana modal REVISAR PORQUE NO FUNCIONA
    //onRequestClose();
  };
  const handleDeleteCueva = () => {
    const concejo = document.getElementById("concejo").value;
    console.log("Nombre concejo: ", concejo);
    console.log("Id cueva: ", cuevaSelected.id);
    deleteCueva(concejo, cuevaSelected.id);
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
      <h3>Detalles cueva</h3>

      <br />
      <form className="form">
        <div className="inputContainer">
          <label className="labelForm">Denominación:</label>
          <input
            className="inputForm"
            type="text"
            placeholder="Escribe el nombre de la cueva"
            id="denominacion"
            defaultValue={cuevaSelected.denominacion}
          />
        </div>

        <div className="inputContainer">
          <label className="labelForm">X:</label>
          <input
            className="inputForm"
            type="text"
            placeholder="Escribe la coordenada X de la cueva"
            id="x"
            defaultValue={cuevaSelected.X}
          />
        </div>

        <div className="inputContainer">
          <label className="labelForm">Y:</label>
          <input
            className="inputForm"
            type="text"
            placeholder="Escribe la coordenada Y de la cueva"
            id="y"
            defaultValue={cuevaSelected.Y}
          />
        </div>

        <div className="inputContainer">
          <label className="labelForm">Z:</label>
          <input
            className="inputForm"
            type="text"
            placeholder="Escribe la coordenada Z de la cueva en m"
            id="z"
            defaultValue={cuevaSelected.Z}
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
            defaultValue={cuevaSelected.huso}
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
            defaultValue={cuevaSelected.concejo}
          />
        </div>
        {/* <div className="inputContainer">
          <label className="labelForm">Archivo</label>
          <input
            className="inputForm"
            type="file"
            placeholder="Seleccione un archivo"
            id="archivo"
            defaultValue={cuevaSelected.archivo}
          />
        </div> */}

        {/* <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA6klEQVR4nK3TzwoBURgF8LNQrNmwkJXlxIJnkD+vQMlDkD1bnoLiESYWPIKUPIKU7FhMo1umdBvu951x6tSd23z3V3caQJYpgCeA8KPmeYI/xhyYtfZyAB7MYR6AYUxD5b7nQnzrWrT1XYhJLyHSlVxZI2awLFhHNfPOVGMGIVhHrUiQQkIkL0FSAAISCd7zolxJ5AJFjiRy0CBbEtlokCWJLDTInERmGmRMIiMNMiCRvgbpkEhLg9RJpKZBSiRS1CAZEklDmbsSuYHIWYmcGGRv/cmhY71jkLV1366uGKRtfZdfNe81v530AgRFEd52yqZoAAAAAElFTkSuQmCC"
            style={customDelete}
          /> */}
        <div className="botonesForm">
          {/* <button
            className="botonForm"
            type="button"
            // onClick={formulaLatitudLongitud}
            onClick={addCueva}
          >
            boton prueba
          </button> */}
          <button
            className="botonFormEliminar"
            type="button"
            onClick={handleDeleteCueva}
          >
            Eliminar
          </button>
          <button className="botonForm" type="button" onClick={onRequestClose}>
            Cancelar
          </button>
          <button
            className="botonForm"
            type="submit"
            onClick={handleUpdateCueva}
          >
            Actualizar
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ModalFormUpdate;
