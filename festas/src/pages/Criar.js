import React from 'react';

const EventoForm = () => {
    return  (
        <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-8 mt-8 px-4 text-right text-[#4a2e2a]">Criar Evento</h2>

            <form className="w-full max-w-lg">
                <div className="mb-6">
                    <label className="block uppercase tracking-wide text-[#4a2e2a] text-xs font-bold mb-2" htmlFor="grid-name">
                        Nome do Evento
                    </label>
                    <input className="appearance-none block w-full bg-[#f2e3c6] text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-name" type="text" placeholder="Nome do Evento" />
                </div>
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-[#4a2e2a] text-xs font-bold mb-2" htmlFor="grid-start-date">
                            Data de Início
                        </label>
                        <input className="appearance-none block w-full bg-[#f2e3c6] text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-start-date" type="date" />
                    </div>
                    <div className="w-full md:w-1/2 px-3">
                        <label className="block uppercase tracking-wide text-[#4a2e2a] text-xs font-bold mb-2" htmlFor="grid-end-date">
                            Data de Fim
                        </label>
                        <input className="appearance-none block w-full bg-[#f2e3c6] text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-end-date" type="date" />
                    </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-[#4a2e2a] text-xs font-bold mb-2" htmlFor="grid-district">
                            Distrito
                        </label>
                        <input className="appearance-none block w-full bg-[#f2e3c6] text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-district" type="text" placeholder="Distrito" />
                    </div>
                    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-[#4a2e2a] text-xs font-bold mb-2" htmlFor="grid-county">
                            Concelho
                        </label>
                        <input className="appearance-none block w-full bg-[#f2e3c6] text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-county" type="text" placeholder="Concelho" />
                    </div>
                    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-[#4a2e2a] text-xs font-bold mb-2" htmlFor="grid-parish">
                            Freguesia
                        </label>
                        <input className="appearance-none block w-full bg-[#f2e3c6] text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-parish" type="text" placeholder="Freguesia" />
                    </div>
                </div>
                <div className="mb-6">
                    <label className="block uppercase tracking-wide text-[#4a2e2a] text-xs font-bold mb-2" htmlFor="grid-description">
                        Descrição
                    </label>
                    <textarea className="appearance-none block w-full bg-[#f2e3c6] text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-description" placeholder="Descrição do Evento" />
                </div>
            </form>
        </div>
    );
};

export default EventoForm;
