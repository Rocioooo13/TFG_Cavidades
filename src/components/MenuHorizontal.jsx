import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import ModalForm from "./ModalForm";
import ModalTablaCapas from "./ModalTablaCapas";
import ModalTablaContornos from "./ModalTablaContornos";
import geojson from "geojson";
//import { ExportCSV } from "./ExportCSV";
import api, { createTable, createUser, obtenertablas } from "../api";
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
    const tablaSelected = await api.obtenertablas();
    setTablas(tablaSelected ?? []);
    // console.log(tablaSelected);
  };

  useEffect(() => {
    loadTablas();
    loadCuevas();
  }, []);

  useEffect(() => {
    loadTablas();
    loadCuevas();
  }, [capaNueva === true]);

  const loadContornos = async () => {
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

  const loadCuevas = async () => {
    const cuevasArray = await api.getCuevas();
    setCuevas(cuevasArray ?? []);
  };

  //Para buscar una capa
  const filteredConcejos = tablas.filter((tabla) => {
    const regex = new RegExp(searchText.toLowerCase(), "g");
    return regex.test(tabla.nombre.toLowerCase());
  });

  const [contornoGeoJSON, setContornoGeoJSON] = useState([]);
  const loadContornoGeoJSON = async () => {
    let objectGeoJSON = await api.getPolygons("pruebana3");

    // Transforma los datos si es necesario
    if (objectGeoJSON && Array.isArray(objectGeoJSON)) {
      objectGeoJSON = objectGeoJSON.map((item) => ({
        ...item,
        latitud: item.latitud, // Asume que viene con otra propiedad que debes transformar
        longitud: item.longitud, // Ajusta estos nombres según sea necesario
      }));
    }

    setContornoGeoJSON(objectGeoJSON ?? []);
  };
  useEffect(() => {
    loadContornoGeoJSON();
  });

  const exportToGeoJSON = async () => {
    setTimeout(console.log(contornosSeleccionados.length), 200);
    if (!contornosSeleccionados || contornosSeleccionados.length === 0) {
      console.error("No hay contornos seleccionados para exportar.");
      return;
    }

    const date = new Date();

    // Estructura base de un archivo GeoJSON
    const geoJSON = {
      type: "FeatureCollection",
      generator: "catalogo_cavidades",
      timestamp: date.toISOString(),
      features: [], // Este array contendrá las características (features)
    };

    setTimeout(console.log(contornosSeleccionados.length), 200);
    // Bucle for para recorrer los contornos seleccionados
    for (let i = 0; i < contornosSeleccionados.length; i++) {
      const contorno = contornosSeleccionados[i].split(" ").join("");
      const color = colorContorno[i]; // Limpiamos el nombre del contorno si es necesario

      try {
        // Llamada a la API para obtener las coordenadas del polígono
        const objectGeoJSONTemp = await api.getPolygons(contorno);

        // Verifica si hay datos válidos
        if (objectGeoJSONTemp && objectGeoJSONTemp.length > 0) {
          console.log(
            `Contorno: ${contorno}, Datos recibidos:`,
            objectGeoJSONTemp
          );

          // Estructura de cada feature (polígono) en el GeoJSON
          const featuresGeoJSON = {
            type: "Feature",
            properties: {
              nombre: contorno, // Se puede ajustar según sea necesario
              color: color[i], // Puedes ajustar el color si tienes esta información
            },
            geometry: {
              type: "Polygon",
              coordinates: [[]], // Coordenadas del polígono
            },
          };

          // Bucle para rellenar las coordenadas del polígono
          for (let j = 0; j < objectGeoJSONTemp.length; j++) {
            const line = objectGeoJSONTemp[j];
            featuresGeoJSON.geometry.coordinates[0].push([
              line.longitud,
              line.latitud,
            ]);
          }

          // Si hay coordenadas, cerramos el polígono uniendo el último punto con el primero
          if (featuresGeoJSON.geometry.coordinates[0].length > 0) {
            const firstPoint = featuresGeoJSON.geometry.coordinates[0][0];
            featuresGeoJSON.geometry.coordinates[0].push(firstPoint);
          }

          // Añadimos el polígono (feature) al GeoJSON
          geoJSON.features.push(featuresGeoJSON);
          console.log("Feature añadida:", featuresGeoJSON);
        } else {
          console.warn(`No se encontraron datos para el contorno: ${contorno}`);
        }
      } catch (error) {
        console.error(
          `Error al obtener datos para el contorno: ${contorno}`,
          error
        );
      }
    }

    // Verifica si se agregaron características (features) al GeoJSON
    // if (geoJSON.features.length === 0) {
    //   console.error("No se agregaron features al GeoJSON.");
    //   return;
    // }
    for (let i = 0; i < capasSeleccionadas.length; i++) {
      const capa = capasSeleccionadas[i].split(" ").join(""); // Limpiamos el nombre del contorno si es necesario

      try {
        // Llamada a la API para obtener las coordenadas del polígono
        const objectGeoJSONTempCapa = await api.getCuevas2(capa);

        // Verifica si hay datos válidos
        if (objectGeoJSONTempCapa && objectGeoJSONTempCapa.length > 0) {
          console.log(`Capa: ${capa}, Datos recibidos:`, objectGeoJSONTempCapa);

          // Bucle para rellenar las coordenadas del polígono
          for (let j = 0; j < objectGeoJSONTempCapa.length; j++) {
            const line = objectGeoJSONTempCapa[j];

            // Crear una nueva featureGeoJSON para cada línea
            const featuresGeoJSONCapa = {
              type: "Feature",
              properties: {
                denominacion: line.denominacion, // Se puede ajustar según sea necesario
                X: line.X,
                Y: line.Y,
                Z: line.Z,
                elipsoide: line.elipsoide,
                huso: line.huso,
                zonaUTM: line.zonaUTM,
                hermisferio: line.hermisferio,
                concejo: capa,
                latitud: line.latitud,
                longitud: line.longitud, // Puedes ajustar el color si tienes esta información
              },
              geometry: {
                type: "Point",
                coordinates: [line.longitud, line.latitud], // Coordenadas del punto
              },
            };

            // Añadimos el punto (feature) al GeoJSON
            geoJSON.features.push(featuresGeoJSONCapa);
            console.log("Feature añadida:", featuresGeoJSONCapa);
          }
        } else {
          console.warn(`No se encontraron datos para el contorno: ${capa}`);
        }
      } catch (error) {
        console.error(
          `Error al obtener datos para el contorno: ${capa}`,
          error
        );
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
                {filteredConcejos.map((tabla) => (
                  <NavDropdown.Item
                    key={tabla.nombre}
                    onClick={() => handleSeleccionarTabla(tabla.nombre)}
                    href="#form/3.1"
                    id="listaConcejos"
                  >
                    {tabla.nombre}
                  </NavDropdown.Item>
                ))}
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
                {filteredContornos.map((contorno) => (
                  <NavDropdown.Item
                    key={contorno.nombre}
                    onClick={() => handleSeleccionarContorno(contorno.nombre)}
                    href="#form/3.1"
                    id="listaContornos"
                  >
                    {contorno.nombre}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
              <NavDropdown
                autoClose="true"
                title="Exportar"
                className="collapsible-nav-dropdown"
              >
                <NavDropdown.Item onClick={closeNav} href="#action/3.1">
                  Exportar proyecto a...
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={exportToGeoJSON} href="#action/3.2">
                  GeoJSON
                </NavDropdown.Item>
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
