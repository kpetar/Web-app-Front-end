import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Container } from 'react-bootstrap';
import './App.css';

function App() {
  return (
    <Container>
      <FontAwesomeIcon icon={faHome}></FontAwesomeIcon>Home
    </Container>
  );
}

export default App;
