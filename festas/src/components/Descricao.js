// Descricao.js
import React from 'react';
import PropTypes from 'prop-types';
import imagemDescricao from '../assets/fotos_juntas.png';

const Descricao = () => {

  const description="Bem-vindo às Festas e Romarias de Portugal. Descubra as mais belas e tradicionais festas e romarias de Portugal. Viaje no tempo e conheça as celebrações que mantêm viva a nossa cultura e história." 

  return (
    <div className="flex justify-center my-8 px-4">
      <div className="max-w-4xl flex items-center">
        <div className="md:w-1/2 p-4">
          <img src={imagemDescricao} alt="Descrição Imagem" />
        </div>
        <div className="md:w-1/2 md:ml-8 mt-4 md:mt-0 p-4 bg-white rounded-lg shadow-lg">
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Uncial+Antiqua&display=swap"></link>
          <h1 className="text-4xl font-bold mb-10" style={{ fontFamily: 'serif', color: '#4a2e2a' }}>Conceito deste site e sua importância</h1>
          <p className="text-lg" style={{ fontFamily: 'serif', color: '#4a2e2a' }}>{description}</p>
        </div>
      </div>
    </div>
  );
};

Descricao.propTypes = {
  imageSrc: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default Descricao;
