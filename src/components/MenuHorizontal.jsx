import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import ModalForm from "./ModalForm";
import ModalTablaCapas from "./ModalTablaCapas";
import ModalTablaContornos from "./ModalTablaContornos";
import geojson from "geojson";
import tokml from "tokml";
import vkbeautify from "vkbeautify";
import geojson2shp from "geojson2shp";
//import { ExportCSV } from "./ExportCSV";
import api, { createTable, obtenertablas } from "../api";
import { Form } from "react-bootstrap";

//Para exportar
import { CSVLink } from "react-csv";
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

  //Seleccionar varias capas
  const [tablaSeleccionada, setTablaSeleccionada] = useState("");

  //Seleccionar varios contornos
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
  // const exportCSV = () => {
  //   setMenuIsExpanded(false);
  // };

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

  // const handleCsvImport = (data) => {
  //   window.electron.send("import-csv", data);
  // };

  const closeTablaCapas = () => {
    setTablaCapasIsOpen(false);
  };
  const closeTablaContornos = () => {
    setTablaContornosIsOpen(false);
  };
  // const openCreateContour = () => {
  //   const openCreateContour = () => {
  //     if (crearContorno) {
  //       // Verifica el estado de crearContorno
  //       setOpenModalCreateContour(true);
  //       closeNav();
  //     } else {
  //       // No hacer nada si crearContorno es falso
  //     }
  //   };
  // };
  const handleClickActivarContorno = () => {
    // console.log("Entro para cambiar el contorno");
    setCoordsPolygon([]);
    setCrearContorno(true);
    setOpenModalCreateContour(true);
    closeNav();
    // console.log("Pongo el contorno a: ", crearContorno);
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
      //console.log("La capa ya está seleccionada");
    }
    closeNav();
  };
  // const imprimirNombreTabla = () => {
  //   console.log("Nombre tabla :", capasSeleccionadas);
  // };

  // useEffect(() => {
  //   imprimirNombreTabla();
  // }, [tablaSeleccionada]);

  const loadTablas = async () => {
    await api.createListaCapas();
    const tablaSelected = await api.obtenertablas();
    setTablas(tablaSelected ?? []);
    // console.log(tablaSelected);
  };

  useEffect(() => {
    loadTablas();
    // loadCuevas();
  }, []);

  useEffect(() => {
    loadTablas();
    // loadCuevas();
  }, [capaNueva === true]);

  const loadContornos = async () => {
    await api.createContourPropsTable();
    const contornoSelected = await api.obtenerContornos();
    setGetContornos(contornoSelected ?? []);
    // console.log(tablaSelected);
  };

  useEffect(() => {
    loadContornos();
  }, [coordsPolygon, contornoNuevo === true, contornoEliminado]);

  //Para buscar una capa
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
      // console.log(
      //   "Tamaño del array contorno Seleccionado",
      //   contornosSeleccionados.length
      // );
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

  // const loadCuevas = async () => {
  //   const cuevasArray = await api.getCuevas();
  //   setCuevas(cuevasArray ?? []);
  // };

  //Para buscar una capa
  const filteredConcejos = tablas.filter((tabla) => {
    const regex = new RegExp(searchText.toLowerCase(), "g");
    return regex.test(tabla.nombre.toLowerCase());
  });

  const [contornoGeoJSON, setContornoGeoJSON] = useState([]);

  const exportToGeoJSON = async () => {
    const date = new Date();

    // Estructura base de un archivo GeoJSON
    const geoJSON = {
      type: "FeatureCollection",
      generator: "catalogo_cavidades",
      timestamp: date.toISOString(),
      features: [], // Este array contendrá las características (features)
    };

    // Bucle for para recorrer los contornos seleccionados
    for (let i = 0; i < contornosSeleccionados.length; i++) {
      const contorno = contornosSeleccionados[i].split(" ").join("");
      const color = colorContorno[i]; // Limpiamos el nombre del contorno si es necesario

      const objectGeoJSONTemp = await api.getPolygons(contorno);

      // Verifica si hay datos válidos
      if (objectGeoJSONTemp && objectGeoJSONTemp.length > 0) {
        // console.log(
        //   `Contorno: ${contorno}, Datos recibidos:`,
        //   objectGeoJSONTemp
        // );

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

        // Bucle para rellenar las coordenadas del polígono
        for (let j = 0; j < objectGeoJSONTemp.length; j++) {
          const line = objectGeoJSONTemp[j];
          featuresGeoJSON.geometry.coordinates[0].push([
            Number(line.latitud),
            Number(line.longitud),
          ]);
        }

        // Cerramos el polígono uniendo el último punto con el primero
        if (featuresGeoJSON.geometry.coordinates[0].length > 0) {
          const firstPoint = featuresGeoJSON.geometry.coordinates[0][0];
          featuresGeoJSON.geometry.coordinates[0].push(firstPoint);
        }
        geoJSON.features.push(featuresGeoJSON);
        // console.log("Feature añadida:", featuresGeoJSON);
      }
    }

    for (let i = 0; i < capasSeleccionadas.length; i++) {
      const capa = capasSeleccionadas[i].split(" ").join("");

      const objectGeoJSONTempCapa = await api.getLayers(capa);

      // Verifica si hay datos válidos
      if (objectGeoJSONTempCapa && objectGeoJSONTempCapa.length > 0) {
        // console.log(`Capa: ${capa}, Datos recibidos:`, objectGeoJSONTempCapa);

        // Bucle para rellenar las coordenadas del polígono
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
          // console.log("Feature añadida:", featuresGeoJSONCapa);
        }
      }
    }

    // Creamos un archivo blob con el contenido del GeoJSON
    const blob = new Blob([JSON.stringify(geoJSON, null, 2)], {
      type: "application/json",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "contornos.geojson");
    document.body.appendChild(link);
    link.click();

    // Limpiamos el enlace después de descargar
    window.URL.revokeObjectURL(url);
    link.remove();
  };

  const exportToKML = async () => {
    const date = new Date();

    // Estructura base de un archivo GeoJSON para luego convertir a KML
    const geoJSON = {
      type: "FeatureCollection",
      generator: "catalogo_cavidades",
      timestamp: date.toISOString(),
      features: [],
    };

    // Bucle for para recorrer los contornos seleccionados
    for (let i = 0; i < contornosSeleccionados.length; i++) {
      const contorno = contornosSeleccionados[i].split(" ").join("");
      const color = colorContorno[i];

      const objectGeoJSONTemp = await api.getPolygons(contorno);

      if (objectGeoJSONTemp && objectGeoJSONTemp.length > 0) {
        // console.log(
        //   `Contorno: ${contorno}, Datos recibidos:`,
        //   objectGeoJSONTemp
        // );

        // Estructura de cada feature (polígono) en el GeoJSON
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

        // Bucle para rellenar las coordenadas del polígono
        for (let j = 0; j < objectGeoJSONTemp.length; j++) {
          const line = objectGeoJSONTemp[j];
          featuresGeoJSON.geometry.coordinates[0].push([
            Number(line.latitud),
            Number(line.longitud),
          ]);
        }

        // Cerramos el polígono uniendo el último punto con el primero
        if (featuresGeoJSON.geometry.coordinates[0].length > 0) {
          const firstPoint = featuresGeoJSON.geometry.coordinates[0][0];
          featuresGeoJSON.geometry.coordinates[0].push(firstPoint);
        }

        // Añadimos el polígono (feature) al GeoJSON
        geoJSON.features.push(featuresGeoJSON);
        // console.log("Feature añadida:", featuresGeoJSON);
      }
    }

    for (let i = 0; i < capasSeleccionadas.length; i++) {
      const capa = capasSeleccionadas[i].split(" ").join("");

      const objectGeoJSONTempCapa = await api.getLayers(capa);

      if (objectGeoJSONTempCapa && objectGeoJSONTempCapa.length > 0) {
        // console.log(`Capa: ${capa}, Datos recibidos:`, objectGeoJSONTempCapa);

        // Bucle para rellenar las coordenadas del polígono
        for (let j = 0; j < objectGeoJSONTempCapa.length; j++) {
          const line = objectGeoJSONTempCapa[j];

          // Crear una nueva featureGeoJSON para cada línea
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
              coordinates: [Number(line.latitud), Number(line.longitud)], // Coordenadas del punto
            },
          };

          geoJSON.features.push(featuresGeoJSONCapa);
          // console.log("Feature añadida:", featuresGeoJSONCapa);
        }
      }
    }

    // Usamos tokml para convertir el GeoJSON a KML
    const kmlTemp = tokml(geoJSON);

    const KML = vkbeautify.xml(kmlTemp);
    // Creamos un archivo blob con el contenido del KML
    const blob = new Blob([KML], {
      type: "application/vnd.google-earth.kml+xml",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "contornos.kml");
    document.body.appendChild(link);
    link.click();

    // Limpiamos el enlace después de descargar
    window.URL.revokeObjectURL(url);
    link.remove();
  };

  const exportToGPX = async () => {
    const date = new Date().toISOString();

    // Estructura base del archivo GPX
    let gpx = `<?xml version="1.0" encoding="UTF-8"?>
  <gpx version="1.1" creator="MyApp" xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
    <metadata>
      <time>${date}</time>
    </metadata>`;

    // Bucle for para recorrer los contornos seleccionados y exportarlos como tracks (polígonos)
    for (let i = 0; i < contornosSeleccionados.length; i++) {
      const contorno = contornosSeleccionados[i].split(" ").join("");
      const color = colorContorno[i]; // No se usa en GPX, pero lo dejamos por si se necesita en otro lugar

      const objectGPXTemp = await api.getPolygons(contorno);

      if (objectGPXTemp && objectGPXTemp.length > 0) {
        gpx += `
    <trk>
      <name>${contorno}</name>
      <trkseg>`;

        // Bucle for para añadir cada punto (vértice) del polígono como un trackpoint
        for (let j = 0; j < objectGPXTemp.length; j++) {
          const line = objectGPXTemp[j];
          gpx += `
        <trkpt lat="${Number(line.longitud)}" lon="${Number(line.latitud)}">
          <ele>${line.elevacion || 0}</ele>
        </trkpt>`;
        }

        // Cerramos el polígono añadiendo el primer punto al final
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

    // Bucle for para recorrer las capas seleccionadas y exportarlas como waypoints (puntos)
    for (let i = 0; i < capasSeleccionadas.length; i++) {
      const capa = capasSeleccionadas[i].split(" ").join("");

      const objectGPXTempCapa = await api.getLayers(capa);

      if (objectGPXTempCapa && objectGPXTempCapa.length > 0) {
        // Bucle for para añadir cada capa como un waypoint
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

    // Cerrar el archivo GPX
    gpx += `
  </gpx>`;

    // Crear el archivo GPX como un blob
    const blob = new Blob([gpx], {
      type: "application/gpx+xml",
    });

    // Crear un enlace para descargar el archivo
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "exported_data.gpx");
    document.body.appendChild(link);
    link.click();

    // Limpiar el enlace después de la descarga
    window.URL.revokeObjectURL(url);
    link.remove();
  };

  const { convert } = require("geojson2shp");

  const exportToShapefile = async () => {
    const date = new Date();

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
              // "DATUM, HZ":  + ", " +  + ,
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

    // Definir la ruta de salida para el archivo zip
    const outputPath = "C:/Users/rocio/Desktop/contornos.zip";
    const options = {
      layer: "mi-capa",
      targetCrs: 2154,
    };
    // console.log(geoJSON);

    try {
      // Asegúrate de que las coordenadas sean válidas
      for (const feature of geoJSON.features) {
        if (
          feature.geometry.coordinates.length === 0 ||
          !Array.isArray(feature.geometry.coordinates)
        ) {
          throw new Error("Coordenadas inválidas en GeoJSON");
        }
      }

      // Convertir y exportar a Shapefile
      await convert(geoJSON, outputPath, options);
      console.log("Shapefile creado exitosamente en:", outputPath);
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
              {/* <Nav.Link href="#features">Cuevas</Nav.Link> */}
              <NavDropdown
                autoClose="true"
                title="Cuevas"
                className="collapsible-nav-dropdown"
              >
                <NavDropdown.Item
                  onClick={openTablaCapas}
                  /*{closeNav}*/ href="#action/3.1"
                >
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
                    type="search"
                    placeholder="Busca una capa..."
                    list="listaConcejos"
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setSearchText(e.target.value)} // Actualiza el texto de búsqueda
                  ></input>
                </NavDropdown.Item>
                {/* {filteredConcejos.map((tabla) => (
                  <NavDropdown.Item
                    key={tabla.nombre}
                    onClick={() => handleSeleccionarTabla(tabla.nombre)}
                    href="#form/3.1"
                    id="listaConcejos"
                  >
                    {tabla.nombre}
                  </NavDropdown.Item>
                ))} */}
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
                  /*{closeNav}*/ href="#action/3.1"
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
                    type="search"
                    placeholder="Busca un contorno..."
                    list="listaContornos"
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setSearchContorno(e.target.value)} // Actualiza el texto de búsqueda
                  ></input>
                </NavDropdown.Item>
                {/* {filteredContornos.map((contorno) => (
                  <NavDropdown.Item
                    key={contorno.nombre}
                    onClick={() => handleSeleccionarContorno(contorno.nombre)}
                    href="#form/3.1"
                    id="listaContornos"
                  >
                    {contorno.nombre}
                  </NavDropdown.Item>
                ))} */}
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
                {/*<NavDropdown.Item onClick={closeNav} href="#action/3.1">
                  Exportar proyecto a...
                </NavDropdown.Item>
                <NavDropdown.Divider />*/}
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
                {/*<NavDropdown.Item href="#action/3.2">GML</NavDropdown.Item>
                <NavDropdown.Divider />*/}
                <NavDropdown.Item onClick={exportToGPX} href="#action/3.2">
                  GPX
                </NavDropdown.Item>
                {/*<NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.2">OSM</NavDropdown.Item>*/}
              </NavDropdown>
            </Nav>
            {/* <Nav>
              <Nav.Link onClick={closeNav} href="#deets">
                More deets
              </Nav.Link>
              <Nav.Link onClick={closeNav} href="#memes">
                Dank memes
              </Nav.Link>
            </Nav> */}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* Agrega el componente ModalForm con las props adecuadas */}
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
        isOpen={/*crearContorno*/ openModalCreateContour}
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
        // onCsvImport={handleCsvImport}
      />
      <ImportCSVContour
        isOpen={importCsvIsOpenContour}
        onRequestClose={closeImportCsvModalContour}
        contornoNuevo={contornoNuevo}
        setContornoNuevo={setContornoNuevo}
        // onCsvImport={handleCsvImport}
      />
    </div>
  );
};
