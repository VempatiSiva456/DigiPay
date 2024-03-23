import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './components/LoginForm';
import SignUp from './components/RegisterForm';
import HomePage from './components/HomePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;