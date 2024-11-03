import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import ModalForm from "./ModalForm";
import ModalTablaCapas from "./ModalTablaCapas";
import ModalTablaContornos from "./ModalTablaContornos";
import tokml from "tokml";
import vkbeautify from "vkbeautify";
import api from "../api";

import ImportCSV from "./ImportCSV";
import ImportCSVContour from "./ImportCSVContour";
import ModalCreateContour from "./ModalCreateContour";

export const MenuHorizontal = ({
  capasSeleccionadas,
  setCapasSeleccionadas,
  crearContorno,
  setCrearContorno,
  setColor,
  color,
  coordsPolygon,
  setCoordsPolygon,
  nombreDelContorno,
  setNombreDelContorno,
  getContornos,
  setGetContornos,
  contornosSeleccionados,
  setContornosSeleccionados,
  todasCuevas,
  setTodasCuevas,
  index,
  setIndex,
  capaNueva,
  setCapaNueva,
  contornoNuevo,
  setContornoNuevo,
  contornoEliminado,
  setContornoEliminado,
  capasVisibles,
  setCapasVisibles,
  cuevaActualizada,
  setCuevaActualizada,
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
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [menuIsExpanded, setMenuIsExpanded] = useState(false);
  const [tablaCapasIsOpen, setTablaCapasIsOpen] = useState(false);

  const [tablaContornosIsOpen, setTablaContornosIsOpen] = useState(false);
  const [importCsvIsOpen, setImportCsvIsOpen] = useState(false);

  const [importCsvIsOpenContour, setImportCsvIsOpenContour] = useState(false);
  const [openModalCreateContour, setOpenModalCreateContour] = useState(false);

  const [tablaSeleccionada, setTablaSeleccionada] = useState("");

  const [tablaSeleccionada2, setTablaSeleccionada2] = useState("");

  const [tablas, setTablas] = useState([]);
  const [cuevas, setCuevas] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchContorno, setSearchContorno] = useState("");

  const toggle = (expanded) => {
    setMenuIsExpanded(expanded);
  };

  const closeNav = () => {
    setMenuIsExpanded(false);
  };

  const openModal = () => {
    setModalIsOpen(true);
    closeNav();
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };
  const openTablaCapas = () => {
    setTablaCapasIsOpen(true);
    closeNav();
  };

  const openTablaContornos = () => {
    setTablaContornosIsOpen(true);
    closeNav();
  };
  const openImportCsvModal = () => {
    setImportCsvIsOpen(true);
    closeNav();
  };

  const closeImportCsvModal = () => {
    setImportCsvIsOpen(false);
  };

  const openImportCsvModalContour = () => {
    setImportCsvIsOpenContour(true);
    closeNav();
  };

  const closeImportCsvModalContour = () => {
    setImportCsvIsOpenContour(false);
  };

  const closeTablaCapas = () => {
    setTablaCapasIsOpen(false);
  };
  const closeTablaContornos = () => {
    setTablaContornosIsOpen(false);
  };

  const handleClickActivarContorno = () => {
    let objecNombre = "";
    let objectColor = "#000";
    setColor(objectColor);
    setNombreDelContorno(objecNombre);

    setCoordsPolygon([]);
    setCrearContorno(true);
    setTimeout(() => {
      console.log(
        "NombreDelContorno: ",
        nombreDelContorno,
        "y color elegido: ",
        color
      );
    }, 500);
    setOpenModalCreateContour(true);
    closeNav();
  };

  const closeCreateContour = () => {
    setCrearContorno(false);
    setOpenModalCreateContour(false);
  };

  const handleSeleccionarTabla = (nombreTabla) => {
    setTablaSeleccionada(nombreTabla);
    if (!capasSeleccionadas.includes(nombreTabla)) {
      setCapasSeleccionadas((prevCapas) => [...prevCapas, nombreTabla]);
    } else {
    }
    closeNav();
  };

  const loadTablas = async () => {
    await api.createListaCapas();
    const tablaSelected = await api.obtenertablas();
    setTablas(tablaSelected ?? []);
  };

  useEffect(() => {
    loadTablas();
  }, []);

  useEffect(() => {
    loadTablas();
  }, [capaNueva === true]);

  const loadContornos = async () => {
    await api.createContourPropsTable();
    const contornoSelected = await api.obtenerContornos();
    setGetContornos(contornoSelected ?? []);
  };

  useEffect(() => {
    loadContornos();
  }, [coordsPolygon, contornoNuevo === true, contornoEliminado]);

  const filteredContornos = getContornos.filter((contorno) => {
    const regexContorno = new RegExp(searchContorno.toLowerCase(), "g");
    return regexContorno.test(contorno.nombre.toLowerCase());
  });

  const handleSeleccionarContorno = (nombreTablaContorno) => {
    setTablaSeleccionada2(nombreTablaContorno);
    if (!contornosSeleccionados.includes(nombreTablaContorno)) {
      setContornosSeleccionados((prevContornos) => [
        ...prevContornos,
        nombreTablaContorno,
      ]);
      console.log(
        "Acabo de seleccionar el contorno",
        nombreDelContorno,
        " y se ha añadido al array"
      );
    } else {
      console.log("El contorno ya está seleccionado");
    }
    closeNav();
  };
  const imprimirNombreContorno = () => {
    console.log("Nombre tabla :", contornosSeleccionados);
  };

  useEffect(() => {
    imprimirNombreContorno();
  }, [tablaSeleccionada2]);

  const filteredConcejos = tablas.filter((tabla) => {
    const regex = new RegExp(searchText.toLowerCase(), "g");
    return regex.test(tabla.nombre.toLowerCase());
  });

  const [contornoGeoJSON, setContornoGeoJSON] = useState([]);

  const exportToGeoJSON = async () => {
    const date = new Date();

    const geoJSON = {
      type: "FeatureCollection",
      generator: "catalogo_cavidades",
      timestamp: date.toISOString(),
      features: [],
    };

    for (let i = 0; i < contornosSeleccionados.length; i++) {
      const contorno = contornosSeleccionados[i].split(" ").join("");
      const color = colorContorno[i];

      const objectGeoJSONTemp = await api.getPolygons(contorno);

      if (objectGeoJSONTemp && objectGeoJSONTemp.length > 0) {
        const featuresGeoJSON = {
          type: "Feature",
          properties: {
            nombre: contorno,
            color: color[i],
          },
          geometry: {
            type: "Polygon",
            coordinates: [[]],
          },
        };

        for (let j = 0; j < objectGeoJSONTemp.length; j++) {
          const line = objectGeoJSONTemp[j];
          featuresGeoJSON.geometry.coordinates[0].push([
            Number(line.latitud),
            Number(line.longitud),
          ]);
        }

        if (featuresGeoJSON.geometry.coordinates[0].length > 0) {
          const firstPoint = featuresGeoJSON.geometry.coordinates[0][0];
          featuresGeoJSON.geometry.coordinates[0].push(firstPoint);
        }
        geoJSON.features.push(featuresGeoJSON);
      }
    }

    for (let i = 0; i < capasSeleccionadas.length; i++) {
      const capa = capasSeleccionadas[i].split(" ").join("");

      const objectGeoJSONTempCapa = await api.getLayers(capa);

      if (objectGeoJSONTempCapa && objectGeoJSONTempCapa.length > 0) {
        for (let j = 0; j < objectGeoJSONTempCapa.length; j++) {
          const line = objectGeoJSONTempCapa[j];
          const zValue = new String(line.Z).replace(" m", "");

          const featuresGeoJSONCapa = {
            type: "Feature",
            properties: {
              denominacion: line.denominacion,
              X: Number(line.X),
              Y: Number(line.Y),
              Z: zValue,
              elipsoide: line.elipsoide,
              huso: Number(line.huso),
              zonaUTM: line.zonaUTM,
              hemisferio: line.hemisferio,
              concejo: capa,
              latitud: Number(line.latitud),
              longitud: Number(line.longitud),
            },
            geometry: {
              type: "Point",
              coordinates: [Number(line.latitud), Number(line.longitud)],
            },
          };

          geoJSON.features.push(featuresGeoJSONCapa);
        }
      }
    }

    const blob = new Blob([JSON.stringify(geoJSON, null, 2)], {
      type: "application/json",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "capas.geojson");
    document.body.appendChild(link);
    link.click();

    window.URL.revokeObjectURL(url);
    link.remove();
  };

  const exportToKML = async () => {
    const date = new Date();

    const geoJSON = {
      type: "FeatureCollection",
      generator: "catalogo_cavidades",
      timestamp: date.toISOString(),
      features: [],
    };

    for (let i = 0; i < contornosSeleccionados.length; i++) {
      const contorno = contornosSeleccionados[i].split(" ").join("");
      const color = colorContorno[i];

      const objectGeoJSONTemp = await api.getPolygons(contorno);

      if (objectGeoJSONTemp && objectGeoJSONTemp.length > 0) {
        const featuresGeoJSON = {
          type: "Feature",
          properties: {
            nombre: contorno,
            color: color,
          },
          geometry: {
            type: "Polygon",
            coordinates: [[]],
          },
        };

        for (let j = 0; j < objectGeoJSONTemp.length; j++) {
          const line = objectGeoJSONTemp[j];
          featuresGeoJSON.geometry.coordinates[0].push([
            Number(line.latitud),
            Number(line.longitud),
          ]);
        }

        if (featuresGeoJSON.geometry.coordinates[0].length > 0) {
          const firstPoint = featuresGeoJSON.geometry.coordinates[0][0];
          featuresGeoJSON.geometry.coordinates[0].push(firstPoint);
        }

        geoJSON.features.push(featuresGeoJSON);
      }
    }

    for (let i = 0; i < capasSeleccionadas.length; i++) {
      const capa = capasSeleccionadas[i].split(" ").join("");

      const objectGeoJSONTempCapa = await api.getLayers(capa);

      if (objectGeoJSONTempCapa && objectGeoJSONTempCapa.length > 0) {
        for (let j = 0; j < objectGeoJSONTempCapa.length; j++) {
          const line = objectGeoJSONTempCapa[j];

          const featuresGeoJSONCapa = {
            type: "Feature",
            properties: {
              denominacion: line.denominacion,
              X: line.X,
              Y: line.Y,
              Z: line.Z,
              elipsoide: line.elipsoide,
              huso: line.huso,
              zonaUTM: line.zonaUTM,
              hemisferio: line.hemisferio,
              concejo: capa,
              latitud: line.latitud,
              longitud: line.longitud,
            },
            geometry: {
              type: "Point",
              coordinates: [Number(line.latitud), Number(line.longitud)],
            },
          };

          geoJSON.features.push(featuresGeoJSONCapa);
        }
      }
    }

    const kmlTemp = tokml(geoJSON);

    const KML = vkbeautify.xml(kmlTemp);
    const blob = new Blob([KML], {
      type: "application/vnd.google-earth.kml+xml",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "capas.kml");
    document.body.appendChild(link);
    link.click();

    window.URL.revokeObjectURL(url);
    link.remove();
  };

  const exportToGPX = async () => {
    const date = new Date().toISOString();

    let gpx = `<?xml version="1.0" encoding="UTF-8"?>
  <gpx version="1.1" creator="MyApp" xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
    <metadata>
      <time>${date}</time>
    </metadata>`;

    for (let i = 0; i < contornosSeleccionados.length; i++) {
      const contorno = contornosSeleccionados[i].split(" ").join("");
      const color = colorContorno[i];

      const objectGPXTemp = await api.getPolygons(contorno);

      if (objectGPXTemp && objectGPXTemp.length > 0) {
        gpx += `
    <trk>
      <name>${contorno}</name>
      <trkseg>`;

        for (let j = 0; j < objectGPXTemp.length; j++) {
          const line = objectGPXTemp[j];
          gpx += `
        <trkpt lat="${Number(line.longitud)}" lon="${Number(line.latitud)}">
          <ele>${line.elevacion || 0}</ele>
        </trkpt>`;
        }

        const firstPoint = objectGPXTemp[0];
        gpx += `
        <trkpt lat="${Number(firstPoint.longitud)}" lon="${Number(
          firstPoint.latitud
        )}">
          <ele>${firstPoint.elevacion || 0}</ele>
        </trkpt>`;

        gpx += `
      </trkseg>
    </trk>`;
      }
    }

    for (let i = 0; i < capasSeleccionadas.length; i++) {
      const capa = capasSeleccionadas[i].split(" ").join("");

      const objectGPXTempCapa = await api.getLayers(capa);

      if (objectGPXTempCapa && objectGPXTempCapa.length > 0) {
        for (let j = 0; j < objectGPXTempCapa.length; j++) {
          const line = objectGPXTempCapa[j];
          const zValue = new String(line.Z).replace(" m", "");
          gpx += `
    <wpt lat="${Number(line.longitud)}" lon="${Number(line.latitud)}">
      <name>${line.denominacion || capa}</name>
      <ele>${zValue || 0}</ele>
      <desc>Coordenadas: (${line.X}, ${line.Y}, Z: ${zValue})</desc>
    </wpt>`;
        }
      }
    }

    gpx += `
  </gpx>`;

    const blob = new Blob([gpx], {
      type: "application/gpx+xml",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "capas.gpx");
    document.body.appendChild(link);
    link.click();

    window.URL.revokeObjectURL(url);
    link.remove();
  };

  const { convert } = require("geojson2shp");
  const path = require("path");
  const os = require("os");

  const exportToShapefile = async () => {
    const date = new Date();
    const dd = String(date.getUTCDate()).padStart(2, "0");
    const MM = String(date.getUTCMonth() + 1).padStart(2, "0");
    const yyyy = date.getUTCFullYear(); // Año
    const hh = String(date.getUTCHours()).padStart(2, "0");
    const mm = String(date.getUTCMinutes()).padStart(2, "0");

    const customFormattedDate = `${dd}-${MM}-${yyyy}T${hh},${mm}`;

    // Estructura base de un archivo GeoJSON
    const geoJSON = {
      type: "FeatureCollection",
      generator: "catalogo_cavidades",
      timestamp: date.toISOString(),
      features: [],
    };

    // Recorrer contornos seleccionados
    for (let i = 0; i < contornosSeleccionados.length; i++) {
      const contorno = contornosSeleccionados[i].split(" ").join("");
      const color = colorContorno[i];

      const objectGeoJSONTemp = await api.getPolygons(contorno);

      if (objectGeoJSONTemp && objectGeoJSONTemp.length > 0) {
        const featuresGeoJSON = {
          type: "Feature",
          properties: {
            nombre: contorno,
            color: color,
          },
          geometry: {
            type: "Polygon",
            coordinates: [[]],
          },
        };

        for (let j = 0; j < objectGeoJSONTemp.length; j++) {
          const line = objectGeoJSONTemp[j];
          featuresGeoJSON.geometry.coordinates[0].push([
            Number(line.latitud),
            Number(line.longitud),
          ]);
        }

        // Cerramos el polígono
        if (featuresGeoJSON.geometry.coordinates[0].length > 0) {
          const firstPoint = featuresGeoJSON.geometry.coordinates[0][0];
          featuresGeoJSON.geometry.coordinates[0].push(firstPoint);
        }

        geoJSON.features.push(featuresGeoJSON);
      }
    }

    // Recorrer capas seleccionadas
    for (let i = 0; i < capasSeleccionadas.length; i++) {
      const capa = capasSeleccionadas[i].split(" ").join("");
      const objectGeoJSONTempCapa = await api.getLayers(capa);

      if (objectGeoJSONTempCapa && objectGeoJSONTempCapa.length > 0) {
        for (let j = 0; j < objectGeoJSONTempCapa.length; j++) {
          const line = objectGeoJSONTempCapa[j];

          const featuresGeoJSONCapa = {
            type: "Feature",
            properties: {
              denominacion: line.denominacion,
              X: line.X,
              Y: line.Y,
              Z: line.Z,
              elipsoide: line.elipsoide,
              huso: line.huso,
              zonaUTM: line.zonaUTM,
              hemisferio: line.hemisferio,
              longitud: line.latitud,
              latitud: line.longitud,
              concejo: capa,
            },
            geometry: {
              type: "Point",
              coordinates: [Number(line.latitud), Number(line.longitud)],
            },
          };

          geoJSON.features.push(featuresGeoJSONCapa);
        }
      }
    }

    const dir = os.homedir();
    const pathTest = path.join(
      dir,
      "Downloads",
      "capas_" + customFormattedDate + ".zip"
    );

    const options = {
      layer: "mi-capa",
      targetCrs: 2154,
    };

    try {
      for (const feature of geoJSON.features) {
        if (
          feature.geometry.coordinates.length === 0 ||
          !Array.isArray(feature.geometry.coordinates)
        ) {
          throw new Error("Coordenadas inválidas en GeoJSON");
        }
      }

      await convert(geoJSON, pathTest, options);
      console.log("Shapefile creado exitosamente en:", pathTest);
    } catch (error) {
      console.error("Error al crear el Shapefile:", error);
    }
  };

  return (
    <div style={{ zIndex: 2, flex: "none" }}>
      <Navbar
        className="bg-body-tertiary"
        variant="dark"
        data-bs-theme="dark"
        onToggle={toggle}
        expand="lg"
        expanded={menuIsExpanded}
      >
        <Container>
          <Navbar.Brand href="#home">Catálogo cavidades</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse className="responsive-navbar-nav">
            <Nav>
              <NavDropdown
                autoClose="true"
                title="Cuevas"
                className="collapsible-nav-dropdown"
              >
                <NavDropdown.Item onClick={openTablaCapas} href="#action/3.1">
                  Todas las capas
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={openModal} href="#form/3.1">
                  Crear por formulario
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={openImportCsvModal} href="#csv/3.2">
                  Importar excel (.csv)
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item>
                  <input
                    name="buscarCapaCuevas"
                    type="search"
                    placeholder="Busca una capa..."
                    list="listaConcejos"
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setSearchText(e.target.value)}
                  ></input>
                </NavDropdown.Item>
                {filteredConcejos.length > 0 && (
                  <div className="table-container-menu">
                    {filteredConcejos.map((tabla) => (
                      <table className="custom-table-menu" key={tabla.nombre}>
                        <tbody>
                          <tr className="table-row-menu">
                            <td className="table-cell-menu">
                              <NavDropdown.Item
                                onClick={() =>
                                  handleSeleccionarTabla(tabla.nombre)
                                }
                                href="#form/3.1"
                                id="listaConcejos"
                              >
                                {tabla.nombre}
                              </NavDropdown.Item>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    ))}
                  </div>
                )}
              </NavDropdown>

              <NavDropdown
                autoClose="true"
                title="Contornos"
                className="collapsible-nav-dropdown"
              >
                <NavDropdown.Item
                  onClick={openTablaContornos}
                  href="#action/3.1"
                >
                  Todos los contornos
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item
                  onClick={handleClickActivarContorno}
                  href="#form/3.1"
                >
                  Crear contorno
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item
                  onClick={openImportCsvModalContour}
                  href="#csv/3.2"
                >
                  Importar excel (.csv)
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item>
                  <input
                    name="buscarCapaContorno"
                    type="search"
                    placeholder="Busca un contorno..."
                    list="listaContornos"
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setSearchContorno(e.target.value)}
                  ></input>
                </NavDropdown.Item>
                {filteredContornos.length > 0 && (
                  <div className="table-container-menu">
                    {filteredContornos.map((contorno) => (
                      <table
                        className="custom-table-menu"
                        key={contorno.nombre}
                      >
                        <tbody>
                          <tr className="table-row-menu">
                            <td className="table-cell-menu">
                              <NavDropdown.Item
                                onClick={() =>
                                  handleSeleccionarContorno(contorno.nombre)
                                }
                                href="#form/3.1"
                                id="listaConcejos"
                              >
                                {contorno.nombre}
                              </NavDropdown.Item>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    ))}
                  </div>
                )}
              </NavDropdown>
              <NavDropdown
                autoClose="true"
                title="Exportar proyecto a..."
                className="collapsible-nav-dropdown"
              >
                <NavDropdown.Item onClick={exportToGeoJSON} href="#action/3.2">
                  GeoJSON
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={exportToKML} href="#action/3.2">
                  KML
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item
                  onClick={exportToShapefile}
                  href="#action/3.2"
                >
                  Shapefile
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={exportToGPX} href="#action/3.2">
                  GPX
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <ModalForm
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        capasSeleccionadas={capasSeleccionadas}
        todasCuevas={todasCuevas}
        setTodasCuevas={setTodasCuevas}
        index={index}
        setIndex={setIndex}
        capaNueva={capaNueva}
        setCapaNueva={setCapaNueva}
      />
      <ModalTablaCapas
        isOpen={tablaCapasIsOpen}
        onRequestClose={closeTablaCapas}
        capasSeleccionadas={capasSeleccionadas}
        setCapasSeleccionadas={setCapasSeleccionadas}
        todasCuevas={todasCuevas}
        setTodasCuevas={setTodasCuevas}
        index={index}
        setIndex={setIndex}
        capaNueva={capaNueva}
        setCapaNueva={setCapaNueva}
        capasVisibles={capasVisibles}
        setCapasVisibles={setCapasVisibles}
        cuevaActualizada={cuevaActualizada}
        setCuevaActualizada={setCuevaActualizada}
      />
      <ModalTablaContornos
        isOpen={tablaContornosIsOpen}
        onRequestClose={closeTablaContornos}
        contornoNuevo={contornoNuevo}
        setContornoNuevo={setContornoNuevo}
        contornoEliminado={contornoEliminado}
        setContornoEliminado={setContornoEliminado}
        contornosSeleccionados={contornosSeleccionados}
        setContornosSeleccionados={setContornosSeleccionados}
        todosContornos={todosContornos}
        setTodosContornos={setTodosContornos}
        contornos={contornos}
        setContornos={setContornos}
        colorContorno={colorContorno}
        setColorContorno={setColorContorno}
        index2={index2}
        setIndex2={setIndex2}
        contornosVisibles={contornosVisibles}
        setContornosVisibles={setContornosVisibles}
      ></ModalTablaContornos>
      <ModalCreateContour
        isOpen={openModalCreateContour}
        onRequestClose={closeCreateContour}
        crearContorno={crearContorno}
        setCrearContorno={setCrearContorno}
        setColor={setColor}
        color={color}
        nombreDelContorno={nombreDelContorno}
        setNombreDelContorno={setNombreDelContorno}
      />
      <ImportCSV
        isOpen={importCsvIsOpen}
        onRequestClose={closeImportCsvModal}
        capaNueva={capaNueva}
        setCapaNueva={setCapaNueva}
      />
      <ImportCSVContour
        isOpen={importCsvIsOpenContour}
        onRequestClose={closeImportCsvModalContour}
        contornoNuevo={contornoNuevo}
        setContornoNuevo={setContornoNuevo}
      />
    </div>
  );
};
