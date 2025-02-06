import { Route, Routes } from 'react-router-dom';
import Home from '@/pages/Home/Home.tsx';
import { InstanceProvider } from '@/contexts/AppContext.tsx';
import Login from '@/pages/Login/Login.tsx';

function App() {

  return (
    <InstanceProvider>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/chat/:id" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
      </Routes>
    </InstanceProvider>
  )
}

export default App
