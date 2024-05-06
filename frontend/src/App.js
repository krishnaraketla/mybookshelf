import {BrowserRouter, Route, Routes} from 'react-router-dom'

// pages and components
import Home from './pages/Home';
import Login from './pages/Login';
import BookDetail from './pages/BookDetail';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className='pages'>
          <Routes>
            <Route 
              path='/'
              element={<Home />}
            />
            <Route 
              path='/login'
              element={<Login />}
            />
            <Route path="/books/:id" element={<BookDetail />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
