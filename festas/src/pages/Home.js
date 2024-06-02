import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Descricao from '../components/Descricao';
import Festas from '../components/Festas';
import Mapa from '../components/Mapa';
import Criar from '../pages/Criar';

export default function Home() {
    const location = useLocation();

    useEffect(() => {
        if (location.state && location.state.scrollTo) {
            const section = document.getElementById(location.state.scrollTo);
            if (section) {
                const headerOffset = 70;
                const elementPosition = section.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth',
                });
            }
        }
    }, [location]);

    return (
        <div className="bg-cover bg-center min-h-screen" style={{ backgroundColor: '#f2e3c6' }}>
            <Header />
            <main className="flex-grow flex flex-col mt-20">
                <div className="bg-white p-4 w-full"> <Descricao /> </div>
                <div id="festas-section" className="p-4 w-full bg-brown-800" style={{ marginTop: '20px', paddingTop: '20px' }}>
                    <div className="flex justify-center my-8 px-32">
                        <div className="md:w-1/2 p-4"> <Festas /> </div>
                        <div className="md:w-1/2 p-4"> <Mapa /> </div>
                    </div>
                </div>  
                <div id="criar-section" className="p-4 w-full bg-brown-800" style={{ marginTop: '20px', paddingTop: '20px' }}>
                    <Criar />
                </div>
            </main>
        </div>
    );
}
