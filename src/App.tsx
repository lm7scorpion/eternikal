import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useContext } from 'react';
import { Store } from './pages/Store';
import { Admin } from './pages/Admin';
import { ProductProvider, ProductContext } from './context/ProductContext';

function ThemeApplier({ children }: { children: React.ReactNode }) {
  const ctx = useContext(ProductContext);
  const theme = ctx?.storeConfig?.themeMode || 'dark';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return <>{children}</>;
}

function App() {
  return (
    <ProductProvider>
      <ThemeApplier>
        <Router>
          <Routes>
            <Route path="/" element={<Store />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Router>
      </ThemeApplier>
    </ProductProvider>
  );
}

export default App;
