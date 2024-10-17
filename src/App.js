import './App.css';
import HomeGuestUser from './pages/common/HomeGuestUser';
import ResidentUI from './pages/common/ResidentUI';
import AdminUI from './pages/common/AdminUI';
import CollectorUI from './pages/common/CollectorUI';
import LoginPage from './pages/common/LoginPage';
import SignUpPage from './pages/common/SignUpPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeGuestUser/>}></Route>
        <Route path="/resident/*" element={<ResidentUI/>}></Route>
        <Route path="/admin/*" element={<AdminUI/>}></Route>
        <Route path="/collector/*" element={<CollectorUI />} />
        <Route path="/login/" element={<LoginPage/>}></Route>
        <Route path="/signUp/" element={<SignUpPage/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
