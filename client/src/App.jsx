import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import ProtectedPage from './pages/ProtectedPage';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './pages/Login';
import Signup from './pages/SignUp/Signup';
import Dashboard from './pages/Dashboard/Dashboard';
import Home from './pages/Home/Home';
import Admin from './pages/Admin/Admin'
import Orders from './pages/Orders/Orders'
import SingleProduct from './pages/SingleProduct/SingleProduct'
import Cart from './pages/Cart/Cart'
import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { setClerkInterceptor } from './api/index';
import ProductForm from './pages/Admin/ProductForm';

export default function App() {
  const { getToken } = useAuth();

  useEffect(() => {
    setClerkInterceptor(getToken); // set token globally once
  }, [getToken]);
  return (

    <>
      <BrowserRouter>
        <Routes>
          <Route path='/signup' element={<Signup/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/dashboard' element={<ProductForm/>} />
          <Route path='/' element={
            <ProtectedPage>
              <Home/>
            </ProtectedPage>
          } />
          <Route path='/admin' element={
            <ProtectedPage>
              <Admin/>
            </ProtectedPage>
          } />
          <Route path='/orders' element={
            <ProtectedPage>
              <Orders/>
            </ProtectedPage>
          } />
          <Route path='/product' element={
            <ProtectedPage>
              <SingleProduct/>
            </ProtectedPage>
          } />
          <Route path='/cart' element={
            <ProtectedPage>
              <Cart/>
            </ProtectedPage>
          } />
        </Routes>
      </BrowserRouter>
    {/* <header>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header> */}
    </>
  );
}