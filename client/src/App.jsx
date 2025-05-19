import ProtectedPage from './pages/ProtectedPage';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Login from './pages/Login';
import Signup from './pages/SignUp/Signup';
import Dashboard from './pages/Dashboard/Dashboard';
import Home from './pages/Home/Home';
import Admin from './pages/Admin/Admin'
import Orders from './pages/Orders/Orders'
import SingleProduct from './pages/SingleProduct/SingleProduct'
import Cart from './pages/Cart/Cart'
import { useEffect } from 'react';
import { ClerkProvider, useAuth } from '@clerk/clerk-react';
import { setClerkInterceptor } from './api/index';
import ProductForm from './pages/Admin/ProductForm';
import ScrollToTop from './components/ScrollToTop';
import Checkout from './pages/Checkout/Checkout';
import ForbiddenPage from './pages/ErrorPages/Forbidden';

export default function App() {
  const { getToken } = useAuth();

  useEffect(() => {
    setClerkInterceptor(getToken); // set token globally once
  }, [getToken]);
  return (

    <>
      <BrowserRouter>
      <ScrollToTop/>
        <Routes>
          <Route path='/signup' element={<Signup/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/forbidden' element={<ForbiddenPage/>} />
          {/* <Route path='/dashboard' element={<SingleProduct/>} /> */}
          <Route path='/' element={
            <ProtectedPage>
              <Home/>
            </ProtectedPage>
          } />
          <Route path='/admin' element={
            <ProtectedPage admin={true}>
              <Admin/>
            </ProtectedPage>
          } />
          <Route path='/orders' element={
            <ProtectedPage>
              <Orders/>
            </ProtectedPage>
          } />
          <Route path='/product/:id' element={
            <ProtectedPage>
              <SingleProduct/>
            </ProtectedPage>
        }/>
          <Route path='/cart' element={
            <ProtectedPage>
              <Cart/>
            </ProtectedPage>
          } />
          <Route path='/checkout' element={
            <ProtectedPage>
              <Checkout/>
            </ProtectedPage>
          } />
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}