import React from 'react';
import Header from '../components/Header';
import Festa from '../components/Festa';

const festas = [
    {
        "Freguesia": "Vila Chã da Braciosa",
        "Concelho": "Miranda do Douro",
        "Distrito": "Bragança",
        "Data": "1 de Janeiro",
        "Nome da Festa": "Festa do Menino Jesus",
        "Descrição": "alvorada com gaiteiros, peditório com os mesmos acompanhando a Velha, o Bailador e a Bailadeira."
    },
    // Adicione mais festas aqui
];

export default function Home() {
    return (
        <div>
            <Header />
            <main className="flex">
                <div className="w-1/2 p-4">
                    {festas.map((festa, index) => (
                        <Festa key={index} festa={festa} />
                    ))}
                </div>
                <div className="w-1/2 p-4">
                    {/* Substitua com o seu mapa SVG */}
                    <div className="border p-4 rounded shadow-md bg-white">
                        <h2 className="text-xl font-semibold">Mapa</h2>
                        <div className="mt-4">
                            <h2 className="text-xl font-semibold">Mapa</h2>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
