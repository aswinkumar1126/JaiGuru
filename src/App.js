import './App.css';
import AppRoutes from './routes/appRoutes/appRoutes';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ProductProvider } from './admin/context/product/productContext';
import { MyContextProvider } from './admin/context/themeContext/themeContext';
import { PageTitleProvider } from './admin/context/pageTitle/PageTitleContext';
import { AuthProvider } from './admin/context/auth/authContext';
import { UserAuthProvider } from './public/context/authContext/UserAuthContext';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const queryClient = new QueryClient();



    
  //localStorage.clear();


  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <MyContextProvider>
          <ProductProvider>
            <PageTitleProvider>
              <AuthProvider>
                <UserAuthProvider>
                  <AppRoutes />
                  <ToastContainer position="top-center" autoClose={3000} />
                </UserAuthProvider>
              </AuthProvider>
            </PageTitleProvider>
          </ProductProvider>
        </MyContextProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
