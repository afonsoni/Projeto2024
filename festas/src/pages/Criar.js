import React, { useState, forwardRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import pt from 'date-fns/locale/pt';

registerLocale('pt', pt);

export default function Criar() {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const handleStartDateChange = (date) => {
        setStartDate(date);
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
    };

    const CustomInput = forwardRef(({ value, onClick }, ref) => (
        <button
            type="button"
            className="appearance-none block w-full bg-[#f2e3c6] text-gray-700 border border-gray-200 rounded py-3 px-16 leading-tight focus:outline-none focus:bg-white focus:border-[#4a2e2a]"
            onClick={onClick}
            ref={ref}
        >
            {value || 'dd-mm-yyyy'}
        </button>
    ));

    return (
        <div className="flex flex-col bg-cover bg-center bg-white min-h-screen">
            <Header />
            <main className="flex-grow flex flex-col items-center justify-center mt-28 md:mt-0" id="criar-section">
                <h2 className="text-2xl font-bold mb-8 mt-8 px-4 text-right text-[#4a2e2a]">Criar Evento</h2>

                <form className="w-full max-w-lg">
                    <div className="mb-6">
                        <label className="block uppercase tracking-wide text-[#4a2e2a] text-xs font-bold mb-2" htmlFor="grid-name">
                            Nome do Evento
                        </label>
                        <input className="appearance-none block w-full bg-[#f2e3c6] text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-[#4a2e2a]" id="grid-name" type="text" placeholder="Nome do Evento" />
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-[#4a2e2a] text-xs font-bold mb-2" htmlFor="grid-start-date">
                                Data de Início
                            </label>
                            <DatePicker
                                selected={startDate}
                                onChange={handleStartDateChange}
                                dateFormat="dd-MM-yyyy"
                                placeholderText="dd-mm-yyyy"
                                customInput={<CustomInput />}
                                locale="pt"
                                isClearable
                                todayButton="Hoje"
                                popperPlacement="top-end"
                            />
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                            <label className="block uppercase tracking-wide text-[#4a2e2a] text-xs font-bold mb-2" htmlFor="grid-end-date">
                                Data de Fim
                            </label>
                            <DatePicker
                                selected={endDate}
                                onChange={handleEndDateChange}
                                dateFormat="dd-MM-yyyy"
                                placeholderText="dd-mm-yyyy"
                                customInput={<CustomInput />}
                                locale="pt"
                                isClearable
                                todayButton="Hoje"
                                popperPlacement="top-end"
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-[#4a2e2a] text-xs font-bold mb-2" htmlFor="grid-district">
                                Distrito
                            </label>
                            <input className="appearance-none block w-full bg-[#f2e3c6] text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-[#4a2e2a]" id="grid-district" type="text" placeholder="Distrito" />
                        </div>
                        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-[#4a2e2a] text-xs font-bold mb-2" htmlFor="grid-county">
                                Concelho
                            </label>
                            <input className="appearance-none block w-full bg-[#f2e3c6] text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-[#4a2e2a]" id="grid-county" type="text" placeholder="Concelho" />
                        </div>
                        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-[#4a2e2a] text-xs font-bold mb-2" htmlFor="grid-parish">
                                Freguesia
                            </label>
                            <input className="appearance-none block w-full bg-[#f2e3c6] text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-[#4a2e2a]" id="grid-parish" type="text" placeholder="Freguesia" />
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block uppercase tracking-wide text-[#4a2e2a] text-xs font-bold mb-2" htmlFor="grid-description">
                            Descrição
                        </label>
                        <textarea className="appearance-none block w-full bg-[#f2e3c6] text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-[#4a2e2a]" id="grid-description" placeholder="Descrição do Evento" />
                    </div>
                </form>
            </main>
            <Footer className="mt-auto" />
        </div>
    );
}
