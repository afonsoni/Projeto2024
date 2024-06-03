import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../logo.svg';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    const headerOffset = 40;
    const elementPosition = section.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  };

  const handleHomeClick = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  const handleFestasClick = () => {
    if (location.pathname === '/') {
      scrollToSection('festas-section');
    } else {
      navigate('/', { state: { scrollTo: 'festas-section' } });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 p-4 z-50" style={{ backgroundColor: '#f2e3c6' }}>
      <div className="container mx-auto flex justify-between items-center">
        <img src={logo} alt="Logo" className="h-16" />
        <link href="https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap" rel="stylesheet"></link>
        <h1 className="text-4xl font-bold" style={{ fontFamily: 'MedievalSharp', color: '#4a2e2a' }}>Festas e Romarias</h1>
        <div>
          <button
            onClick={handleHomeClick}
            className="bg-white text-[#4a2e2a] rounded px-4 py-2 mr-2 ml-2 transition-colors duration-300 hover:bg-[#4a2e2a] hover:text-white"
          >
            Home
          </button>
          <button
            onClick={handleFestasClick}
            className="bg-white text-[#4a2e2a] rounded px-4 py-2 mr-2 ml-2 transition-colors duration-300 hover:bg-[#4a2e2a] hover:text-white"
          >
            Festas
          </button>
          <Link
            to="/CriarFesta"
            className="bg-white text-[#4a2e2a] rounded px-4 py-2 mr-2 ml-2 transition-colors duration-300 hover:bg-[#4a2e2a] hover:text-white"
          >
            Criar Festa
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
