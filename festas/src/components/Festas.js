import React, { useState } from 'react';
import Festa from './Festa'; // supondo que o componente Festa esteja no mesmo diretório
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import imagemDescricao from '../romaria.png';
import festas from '../festas.json';

function Festas() {
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const filteredFestas = festas.filter(festa =>
        festa["Nome da Festa"].toLowerCase().includes(searchTerm.toLowerCase()) &&
        (!startDate || new Date(festa.Data) >= startDate) &&
        (!endDate || new Date(festa.Data) <= endDate)
    );

    return (
        <div className="border p-4 rounded bg-white bg-opacity-90 h-full overflow-y-auto" style={{ fontFamily: 'serif', color: '#4a2e2a' }}>
            <h2 className="text-2xl font-bold mb-4 px-4">Mapa de Festas</h2>
            <div className="sticky top-0 bg-white p-4 mb-4 rounded z-10">
                <form className="max-w-md mx-auto">
                    <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                            </svg>
                        </div>
                        <input 
                            type="search" 
                            id="default-search" 
                            className="block w-full p-4 pl-10 text-sm text-black rounded-lg bg-gray-100" 
                            placeholder="Search Festa..." 
                            required 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </form>
                <div className="mt-4">
                    <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Filter by Date</label>
                    <div className="flex">
                        <div className="relative max-w-sm">
                            <DatePicker
                                selected={startDate}
                                onChange={date => setStartDate(date)}
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                                placeholderText="Select start date"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                                todayButton="Today"
                            />
                            {startDate && (
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                                    onClick={() => setStartDate(null)}
                                >
                                    <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M9.95 10l3.528 3.528a1 1 0 1 1-1.414 1.414L8.536 11.414l-3.529 3.53a1 1 0 1 1-1.415-1.415L7.12 10 3.586 6.472a1 1 0 0 1 1.415-1.414L9.95 8.586l3.529-3.53a1 1 0 0 1 1.415 1.415L11.378 10z" clipRule="evenodd"/>
                                    </svg>
                                </button>
                            )}
                        </div>
                        <span className="mx-4 text-gray-500">to</span>
                        <div className="relative max-w-sm">
                            <DatePicker
                                selected={endDate}
                                onChange={date => setEndDate(date)}
                                selectsEnd
                                startDate={startDate}
                                endDate={endDate}
                                minDate={startDate}
                                placeholderText="Select end date"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:
                                ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                                todayButton="Today"
                            />
                            {endDate && (
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                                    onClick={() => setEndDate(null)}
                                >
                                    <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M9.95 10l3.528 3.528a1 1 0 1 1-1.414 1.414L8.536 11.414l-3.529 3.53a1 1 0 1 1-1.415-1.415L7.12 10 3.586 6.472a1 1 0 0 1 1.415-1.414L9.95 8.586l3.529-3.53a1 1 0 0 1 1.415 1.415L11.378 10z" clipRule="evenodd"/>
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
                {filteredFestas.map((festa, index) => (
                    <Festa key={index} festa={festa} />
                ))}
            </div>
        </div>
    );
}

export default Festas;
