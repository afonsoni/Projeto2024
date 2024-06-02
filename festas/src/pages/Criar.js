import React, { useState } from 'react';
import Header from '../components/Header';


export default function Criar() {
    const [formData, setFormData] = useState({
        nome: '',
        data: '',
        freguesia: '',
        concelho: '',
        distrito: '',
        descricao: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aqui você pode adicionar a lógica para enviar os dados do formulário para onde quiser
        console.log(formData);
        // Resetar os campos depois de enviar
        setFormData({
            nome: '',
            data: '',
            freguesia: '',
            concelho: '',
            distrito: '',
            descricao: ''
        });
    };

    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main className="flex-grow flex items-center justify-center px-4">
                <div className="w-full max-w-md p-8 rounded-lg shadow-md bg-white">
                    <h2 className="text-xl font-semibold mb-4">Criar Evento</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome:</label>
                            <input
                                type="text"
                                id="nome"
                                name="nome"
                                value={formData.nome}
                                onChange={handleChange}
                                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="data" className="block text-sm font-medium text-gray-700">Data:</label>
                            <input
                                type="date"
                                id="data"
                                name="data"
                                value={formData.data}
                                onChange={handleChange}
                                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="freguesia" className="block text-sm font-medium text-gray-700">Freguesia:</label>
                            <input
                                type="text"
                                id="freguesia"
                                name="freguesia"
                                value={formData.freguesia}
                                onChange={handleChange}
                                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="concelho" className="block text-sm font-medium text-gray-700">Concelho:</label>
                            <input
                                type="text"
                                id="concelho"
                                name="concelho"
                                value={formData.concelho}
                                onChange={handleChange}
                                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="distrito" className="block text-sm font-medium text-gray-700">Distrito:</label>
                            <input
                                type="text"
                                id="distrito"
                                name="distrito"
                                value={formData.distrito}
                                onChange={handleChange}
                                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">Descrição:</label>
                            <textarea
                                id="descricao"
                                name="descricao"
                                value={formData.descricao}
                                onChange={handleChange}
                                rows="4"
                                className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                            ></textarea>
                        </div>
                        <button type="submit" className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600">Criar Evento</button>
                    </form>
                </div>
            </main>
        </div>
    );
};

