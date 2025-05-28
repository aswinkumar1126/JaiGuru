import './App.css';
import AppRoutes from './routes/appRoutes/appRoutes';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ProductProvider } from './context/product/productContext';


function App() {

  const queryClient = new QueryClient();
  return (
    <div className="App">

      <QueryClientProvider client={queryClient}>
        <ProductProvider>
      < AppRoutes />
          </ProductProvider>
    </QueryClientProvider>
    
    </div>
  );
}

export default App;
