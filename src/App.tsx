import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import './styles/global.scss';
import { Router } from './Router';
import { CartContextProvider } from './contexts/CartContext';
function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <BrowserRouter>
        <CartContextProvider>
          <Router />
        </CartContextProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
