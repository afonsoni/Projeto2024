import React, { useState } from 'react';
import Header from '../components/Header';
import Descricao from '../components/Descricao';
import festas from '../festas.json'; // Supondo que você tenha um arquivo JSON para festas
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import Festas from '../components/Festas';
import Mapa from '../components/Mapa';
import imagemDescricao from '../romaria.png';

export default function Home() {
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const filteredFestas = festas.filter(festa =>
        festa["Nome da Festa"].toLowerCase().includes(searchTerm.toLowerCase()) &&
        (!startDate || new Date(festa.Data) >= startDate) &&
        (!endDate || new Date(festa.Data) <= endDate)
    );

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
                <div id="festas-section" className="p-4 w-full bg-brown-800" style={{ marginTop: '20px', paddingTop: '20px' }}>
                        <div className="md:w-1/2 p-4">
                            <div className="sticky top-0 bg-white p-4 mb-4 rounded z-10">
                                <form className="max-w-md mx-auto">
                                    {/* Formulário de pesquisa e filtro */}
                                </form>
                                <div className="mt-4">
                                    {/* Lista de festas */}
                                    <Festas filteredFestas={filteredFestas} />
                                </div>
                            </div>
                        <div className="md:w-1/2 p-4">
                            {/* Mapa de festas */}
                            <Mapa />
                        </div>
                    </div>
                </div>  
            </main>
        </div>
    );
}
