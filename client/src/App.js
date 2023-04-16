import './App.css';
import UploadNew from './components/UploadNew';
import UploadNewJourney from './components/UploadNewJourney';
import {Route, Routes} from 'react-router-dom'
import Home from './components/Home';
import LargeMap from './components/LargeMap';
import Login from './components/Login';
import UploadNewStart from './components/UploadNewStart';

function App() {

  return(
    <>
    <Routes>
      <Route path="/uploadnew" element={<UploadNewJourney/>} />
      <Route path="/uploadnewstart" element={<UploadNewStart/>} />
      <Route path="/upload" element={<UploadNew/>} />
      <Route path="/" element={<Home/>} />
      <Route path="/largemap" element={<LargeMap />} />
      <Route path="/login" element={<Login />} />
    </Routes>
    </>
  )
}

export default App;
