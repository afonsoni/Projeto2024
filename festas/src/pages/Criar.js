import React, { useState, useEffect, forwardRef } from 'react';
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
    const [eventName, setEventName] = useState('');
    const [district, setDistrict] = useState('');
    const [county, setCounty] = useState('');
    const [parish, setParish] = useState('');
    const [description, setDescription] = useState('');
    const [districts, setDistricts] = useState([]);
    const [counties, setCounties] = useState([]);
    const [parishes, setParishes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/distritos');
                const data = await response.json();
                setDistricts(data);
            } catch (error) {
                console.error('Error fetching districts:', error);
            }
        };
    
        fetchData();
    }, []);
    

    useEffect(() => {
        const fetchData = async () => {
            if (district) {
                try {
                    const response = await fetch(`/api/concelhos?distrito=${district}`);
                    const data = await response.json();
                    setCounties(data);
                } catch (error) {
                    console.error('Error fetching counties:', error);
                }
            } else {
                setCounties([]);
                setCounty('');
            }
        };
    
        fetchData();
    }, [district]);
    

    useEffect(() => {
        const fetchData = async () => {
            if (county) {
                try {
                    const response = await fetch(`/api/freguesias?concelho=${county}`);
                    const data = await response.json();
                    setParishes(data);
                } catch (error) {
                    console.error('Error fetching parishes:', error);
                }
            } else {
                setParishes([]);
                setParish('');
            }
        };
    
        fetchData();
    }, [county]);
    

    const handleStartDateChange = (date) => {
        setStartDate(date);
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
    };

    const handleCreateEvent = async () => {

        console.log("Handle Create Event Called");


        if (!eventName || !startDate || !endDate || !district || !county) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }   

        console.log(eventName, startDate, endDate, district, county, parish, description)

        try {
            const response = await fetch('/api/criar_festa', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome: eventName,
                    dataInicio: startDate.toISOString().split('T')[0].split('-').reverse().join('-'),
                    dataFim: endDate.toISOString().split('T')[0].split('-').reverse().join('-'),
                    distrito: district,
                    concelho: county,
                    freguesia: parish,
                    descricao: description
                })
            });

            console.log("Resposta da criação:", response); // Log da resposta

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }

            const data = await response.json();
            console.log(data);

            // Lógica para lidar com o sucesso da criação da festa (opcional)
        } catch (error) {
            console.error('Error creating event:', error);
            // Lógica para lidar com o erro (opcional)
        }
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
                        <input className="appearance-none block w-full bg-[#f2e3c6] text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-[#4a2e2a]" id="grid-name" type="text" placeholder="Nome do Evento" value={eventName} onChange={(e) => setEventName(e.target.value)} />
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
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-[#4a2e2a] text-xs font-bold mb-2" htmlFor="grid-district">
                                Distrito
                            </label>
                            <select
                                className="appearance-none block w-full bg-[#f2e3c6] text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-[#4a2e2a]"
                                id="grid-district"
                                value={district}
                                onChange={(e) => setDistrict(e.target.value)}
                            >
                                <option value="">Selecione um distrito</option>
                                {districts.map((dist) => (
                                    <option key={dist} value={dist}>
                                        {dist}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-[#4a2e2a] text-xs font-bold mb-2" htmlFor="grid-county">
                                Concelho
                            </label>
                            <select
                                className="appearance-none block w-full bg-[#f2e3c6] text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-[#4a2e2a]"
                                id="grid-county"
                                value={county}
                                onChange={(e) => setCounty(e.target.value)}
                                disabled={!district}
                            >
                                <option value="">Selecione um concelho</option>
                                {counties.map((cnt) => (
                                    <option key={cnt} value={cnt}>
                                        {cnt}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-[#4a2e2a] text-xs font-bold mb-2" htmlFor="grid-parish">
                                Freguesia
                            </label>
                            <select
                                className="appearance-none block w-full bg-[#f2e3c6] text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-[#4a2e2a]"
                                id="grid-parish"
                                value={parish}
                                onChange={(e) => setParish(e.target.value)}
                                disabled={!county}
                            >
                                <option value="">Selecione uma freguesia</option>
                                {parishes.map((par) => (
                                    <option key={par} value={par}>
                                        {par}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block uppercase tracking-wide text-[#4a2e2a] text-xs font-bold mb-2" htmlFor="grid-description">
                            Descrição
                        </label>
                        <textarea className="appearance-none block w-full bg-[#f2e3c6] text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-[#4a2e2a]" id="grid-description" placeholder="Descrição do Evento" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <button className="bg-[#4a2e2a] hover:bg-[#635346] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={handleCreateEvent}>
                        Criar Evento
                    </button>
                </form>
            </main>
            <Footer className="mt-auto" />
        </div>
    );
}
