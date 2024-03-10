import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import ModalForm from "./ModalForm";
import api, { createTable, createUser, obtenertablas } from "../api";

export const MenuHorizontal = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [menuIsExpanded, setMenuIsExpanded] = useState(false);

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

  const [tablas, setTablas] = useState([]);
  const loadTablas = async () => {
    const tablaSelected = await api.obtenertablas();
    setTablas(tablaSelected ?? []);
    // console.log(tablaSelected);
  };

  useEffect(() => {
    loadTablas();
  }, []);

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
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav>
              {/* <Nav.Link href="#features">Cuevas</Nav.Link> */}
              <NavDropdown
                autoClose="true"
                title="Cuevas"
                id="collapsible-nav-dropdown"
              >
                <NavDropdown.Item onClick={openModal} href="#form/3.1">
                  Crear por formulario
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={closeNav} href="#csv/3.2">
                  Importar excel (.csv)
                </NavDropdown.Item>
              </NavDropdown>
              {/* <Nav.Link href="#pricing">Capas</Nav.Link> */}
              <NavDropdown
                autoClose="outside"
                title="Capas"
                id="collapsible-nav-dropdown"
                aria-expanded={menuIsExpanded}
              >
                <NavDropdown.Item href="#form/3.1">
                  <input
                    type="search"
                    placeholder="Busca una capa..."
                    list="listaConcejos"
                  ></input>
                </NavDropdown.Item>

                {tablas.map((tabla) => (
                  <NavDropdown.Item
                    onClick={closeNav}
                    href="#form/3.1"
                    id="listaConcejos"
                  >
                    {tabla.nombre}
                  </NavDropdown.Item>
                ))}

                {/*<NavDropdown.Item href="#form/3.1">Capa 1</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#csv/3.2">Capa 2</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#csv/3.2">...</NavDropdown.Item> */}
              </NavDropdown>
              <NavDropdown
                autoClose="true"
                title="Exportar"
                id="collapsible-nav-dropdown"
              >
                <NavDropdown.Item onClick={closeNav} href="#action/3.1">
                  Exportar proyecto a...
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={closeNav} href="#action/3.2">
                  Exportar capa a...
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Nav>
              <Nav.Link onClick={closeNav} href="#deets">
                More deets
              </Nav.Link>
              <Nav.Link onClick={closeNav} href="#memes">
                Dank memes
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* Agrega el componente ModalForm con las props adecuadas */}
      <ModalForm isOpen={modalIsOpen} onRequestClose={closeModal} />
    </div>
  );
};
