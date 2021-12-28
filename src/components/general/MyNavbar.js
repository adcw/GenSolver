import { Navbar, Container, Nav } from "react-bootstrap"

const MyNavbar = () => {
  return (
    <Navbar className="bg-third" variant="dark" sticky="top">
      <Container>
        <Navbar.Brand href="#home">GenSolver</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/">Kreator genotypów</Nav.Link>
          <Nav.Link href="/board">Kreator krzyżówek</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  )
}

export default MyNavbar
