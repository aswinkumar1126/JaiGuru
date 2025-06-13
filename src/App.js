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
import { UserAuthProvider } from './public/context/authContext/AuthContext';


function App() {

  const queryClient = new QueryClient();
  return (
    <div className="App">

      <QueryClientProvider client={queryClient}>
        <MyContextProvider>
          <ProductProvider>
            <PageTitleProvider>   
              <AuthProvider>

                <UserAuthProvider>
                 

                  < AppRoutes /> 

                 
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
