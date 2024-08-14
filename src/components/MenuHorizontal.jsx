import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import ModalForm from "./ModalForm";
import ModalTablaCapas from "./ModalTablaCapas";
import ModalTablaContornos from "./ModalTablaContornos";
//import { ExportCSV } from "./ExportCSV";
import api, { createTable, createUser, obtenertablas } from "../api";
import { Form } from "react-bootstrap";

//Para exportar
import { CSVLink } from "react-csv";
import ImportCSV from "./ImportCSV";
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
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [menuIsExpanded, setMenuIsExpanded] = useState(false);
  const [tablaCapasIsOpen, setTablaCapasIsOpen] = useState(false);

  const [tablaContornosIsOpen, setTablaContornosIsOpen] = useState(false);
  const [importCsvIsOpen, setImportCsvIsOpen] = useState(false);
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

  const loadContornos = async () => {
    const contornoSelected = await api.obtenerContornos();
    setGetContornos(contornoSelected ?? []);
    // console.log(tablaSelected);
  };

  useEffect(() => {
    loadContornos();
  }, [coordsPolygon]);

  //Para buscar una capa
  const filteredContornos = getContornos.filter((contorno) => {
    const regexContorno = new RegExp(searchContorno.toLowerCase(), "g");
    return regexContorno.test(contorno.nombre.toLowerCase());
  });

  const handleSeleccionarContorno = (nombreTablaContorno) => {
    setTablaSeleccionada2(nombreTablaContorno);
    if (!contornosSeleccionados.includes(nombreTablaContorno)) {
      setContornosSeleccionados((prevCapas) => [
        ...prevCapas,
        nombreTablaContorno,
      ]);
    } else {
      //console.log("La capa ya está seleccionada");
    }
    closeNav();
  };
  const imprimirNombreContorno = () => {
    console.log("Nombre tabla :", contornosSeleccionados);
  };

  useEffect(() => {
    imprimirNombreContorno();
  }, [tablaSeleccionada2]);

  //Para exportar
  //Me creo las cabeceras del excel.
  const headers = [
    { label: "Denominacion", key: "denominacion" },
    { label: "X", key: "X" },
    { label: "Y", key: "Y" },
    { label: "Z", key: "Z" },
    { label: "Elipsoide", key: "elipsoide" },
    { label: "Huso", key: "huso" },
    { label: "Zona UTM", key: "zonaUTM" },
    { label: "Hemisferio", key: "hemisferio" },
    { label: "Concejo", key: "concejo" },
    { label: "Latitud", key: "latitud" },
    { label: "Longitud", key: "longitud" },
  ];

  //Obtengo las cuevas y las guardo en la variable cuevas
  const loadCuevas = async () => {
    const cuevasArray = await api.getCuevas();
    setCuevas(cuevasArray ?? []);
    // console.log("Cuevas array: ", cuevasArray);
  };

  //en CsvReport creo tres variables a las que le doy los valores de cuevas, las cabeceras y el nombre del archivo
  const csvReport = {
    data: cuevas,
    headers: headers,
    filename: "Cuevas.csv",
  };
  //Rellena el archivo y hace la descarga
  const clicDownload = () => {
    //console.log(cuevas);
    //console.log("Empieza la descarga");
    const csvData = csvReport.data
      .map(
        (item) =>
          `${item.denominacion},${item.X},${item.Y},${item.Z},${item.elipsoide},${item.huso},${item.zonaUTM},${item.hemisferio},${item.concejo},${item.latitud},${item.longitud}`
      )
      .join("\n");
    //console.log("Hace el map");
    //console.log(csvData);
    const csvContent = `${csvReport.headers
      .map((header) => header.label)
      .join(",")}\n${csvData}`;
    // console.log("Hace el map");
    // console.log(csvContent);
    const blob = new Blob([csvContent], { type: "text/csv" });
    // console.log("Hace el Blob");
    // console.log(blob);
    const url = window.URL.createObjectURL(blob);
    window.location.href = url;
    // const link = document.createElement('a');
    // link.href = url;
    // link.setAttribute('download', 'example.csv');
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
  };

  //Para buscar una capa
  const filteredConcejos = tablas.filter((tabla) => {
    const regex = new RegExp(searchText.toLowerCase(), "g");
    return regex.test(tabla.nombre.toLowerCase());
  });

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
                <NavDropdown.Item onClick={openModal} href="#form/3.1">
                  Crear por formulario
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={openImportCsvModal} href="#csv/3.2">
                  Importar excel (.csv)
                </NavDropdown.Item>
              </NavDropdown>
              {/* <Nav.Link href="#pricing">Capas</Nav.Link> */}
              <NavDropdown
                autoClose="outside"
                title="Capas"
                className="collapsible-nav-dropdown"
                aria-expanded={menuIsExpanded}
              >
                <NavDropdown.Item
                  onClick={openTablaCapas}
                  /*{closeNav}*/ href="#action/3.1"
                >
                  Todas las capas
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item>
                  <input
                    type="search"
                    placeholder="Busca una capa..."
                    list="listaConcejos"
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
                autoClose="inside"
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
                <NavDropdown.Item onClick={openImportCsvModal} href="#csv/3.2">
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
                <NavDropdown.Item onClick={clicDownload} href="#action/3.2">
                  Exportar capa a...
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
      <ModalForm isOpen={modalIsOpen} onRequestClose={closeModal} />
      <ModalTablaCapas
        isOpen={tablaCapasIsOpen}
        onRequestClose={closeTablaCapas}
      />
      <ModalTablaContornos
        isOpen={tablaContornosIsOpen}
        onRequestClose={closeTablaContornos}
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
        // onCsvImport={handleCsvImport}
      />
    </div>
  );
};
