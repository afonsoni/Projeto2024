import React from 'react';
import logo from '../logo.svg'; // Substitua pelo caminho para o seu logotipo
import { Link } from 'react-router-dom';

const Header = () => {
  const scrollToFestas = () => {
    const festasSection = document.getElementById('festas-section');
    const headerOffset = 70; 
    const elementPosition = festasSection.getBoundingClientRect().top;
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  };

  const scrollToHome = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 p-4 z-50" style={{ backgroundColor: '#f2e3c6' }}>
      <div className="container mx-auto flex justify-between items-center">
        <img src={logo} alt="Logo" className="h-16" />
        <h1 className="text-4xl font-bold" style={{ fontFamily: 'serif', color: '#4a2e2a' }}>Festas e Romarias</h1>
        <div>
          <button 
            onClick={scrollToHome} 
            className="bg-white text-[#4a2e2a] rounded px-4 py-2 mr-2 ml-2 transition-colors duration-300 hover:bg-[#4a2e2a] hover:text-white"
          >
            Home
          </button>
          <button 
            onClick={scrollToFestas} 
            className="bg-white text-[#4a2e2a] rounded px-4 py-2 mr-2 ml-2 transition-colors duration-300 hover:bg-[#4a2e2a] hover:text-white"
          >
            Festas
          </button>
          <Link to="/CriarFesta" className="bg-white text-[#4a2e2a] rounded px-4 py-2 mr-2 ml-2 transition-colors duration-300 hover:bg-[#4a2e2a] hover:text-white">
            Criar Festa
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header