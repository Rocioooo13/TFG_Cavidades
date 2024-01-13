import { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import ModalForm from "./ModalForm";
import api, { createTable, createUser } from "../api";

export const MenuHorizontal = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };
  return (
    <div style={{ zIndex: 0, flex: "none" }}>
      <Navbar
        collapseOnSelect
        expand="lg"
        className="bg-body-tertiary"
        variant="dark"
        data-bs-theme="dark"
      >
        <Container>
          <Navbar.Brand href="#home">Catálogo cavidades</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              {/* <Nav.Link href="#features">Cuevas</Nav.Link> */}
              <NavDropdown title="Cuevas" id="collapsible-nav-dropdown">
                <NavDropdown.Item onClick={openModal} href="#form/3.1">
                  Crear por formulario
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#csv/3.2">
                  Importar excel (.csv)
                </NavDropdown.Item>
              </NavDropdown>
              {/* <Nav.Link href="#pricing">Capas</Nav.Link> */}
              <NavDropdown title="Capas" id="collapsible-nav-dropdown">
                <NavDropdown.Item href="#form/3.1">
                  <input type="search" placeholder="Busca una capa..."></input>
                </NavDropdown.Item>
                <NavDropdown.Item href="#form/3.1">Capa 1</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#csv/3.2">Capa 2</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#csv/3.2">...</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="Exportar" id="collapsible-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">
                  Exportar proyecto a...
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.2">
                  Exportar capa a...
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Nav>
              <Nav.Link href="#deets">More deets</Nav.Link>
              <Nav.Link eventKey={2} href="#memes">
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
