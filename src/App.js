import './App.css';
import AppRoutes from './routes/appRoutes/appRoutes';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ProductProvider } from './context/product/productContext';
import { MyContextProvider } from './context/themeContext/themeContext';
import { PageTitleProvider } from './context/pageTitle/PageTitleContext';
import { AuthProvider } from './context/auth/authContext';
function App() {

  const queryClient = new QueryClient();
  return (
    <div className="App">

      <QueryClientProvider client={queryClient}>
        <MyContextProvider>
          <ProductProvider>
            <PageTitleProvider>   
              <AuthProvider>
                  < AppRoutes /> 
              </AuthProvider>
              </PageTitleProvider>
          </ProductProvider>
        </MyContextProvider>
    </QueryClientProvider>
    
    </div>
  );
}

export default App;
