import React from 'react';
import Header from '../components/Header';
import Descricao from '../components/Descricao';
import Festas from '../components/Festas';
import Mapa from '../components/Mapa';
import Criar_Festa from '../components/Criar';
import imagemDescricao from '../fotos_juntas.png';

export default function Home() {
    return (
        <div className="bg-cover bg-center min-h-screen" style={{ backgroundColor: '#f2e3c6' }}>
            <Header />
            <main className="flex-grow flex flex-col mt-20">
                <div className="bg-white p-4 w-full">
                    <Descricao 
                      imageSrc={imagemDescricao} 
                      description="Bem-vindo às Festas e Romarias de Portugal. Descubra as mais belas e tradicionais festas e romarias de Portugal. Viaje no tempo e conheça as celebrações que mantêm viva a nossa cultura e história." 
                    />
                </div>
                <div id="festas-section" className=" p-4 w-full bg-brown-800" style={{ marginTop: '20px', paddingTop: '20px' }}>
                    <div className="flex justify-center my-8 px-32">
                        <div className="md:w-1/2 p-4">
                            <Festas />
                        </div>
                        <div className="md:w-1/2 p-4">
                            <Mapa />
                        </div>
                    </div>
                </div>  
                <div id="criar-section" className="p-4 w-full bg-brown-800" style={{ marginTop: '20px', paddingTop: '20px' }}>
                <Criar_Festa />
                </div>
            </main>
        </div>
    );
}
