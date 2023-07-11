import './App.css';
import { BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import MainForm from './components/MainForm';
import ChatRoom from './components/ChatRoom';

function App() {
  return (
    <div className="container-fluid text-dark bg-light d-flex align-items-center justify-content-center" style={{height:"100vh"}}>
      <Router>
        <Routes>
          <Route index element={<MainForm/>} />
          <Route path='/chat/:roomName' element={<ChatRoom/>} />
          <Route path='*' element={<h1>404 Not Found</h1>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
