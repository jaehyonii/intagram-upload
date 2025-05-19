import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from '@/pages/Home';
import About from '@/pages/About';
import ImageSplitter from '@/pages/ImageSplitter'

function App() {
  return (
    <BrowserRouter>
      <nav className="space-x-4">
        <Link to="/">홈</Link>
        <Link to="/about">소개</Link>
        <Link to="/image-split">image-split</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/image-split" element={<ImageSplitter />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
