import React from 'react';
import Header from '../components/Header';
import Descricao from '../components/Descricao';
import Festas from '../components/Festas';
import Mapa from '../components/Mapa';
import Criar_Festa from '../components/Criar';
import imagemDescricao from '../fotos_juntas.png';

export default function Home() {

    const districtMap = {
        Aveiro: generateDistrictJSX('Aveiro', AveiroSvg),
        Beja: generateDistrictJSX('Beja', BejaSvg),
        Braga: generateDistrictJSX('Braga', BragaSvg),
        Bragança: generateDistrictJSX('Bragança', BragancaSvg),
        CasteloBranco: generateDistrictJSX('Castelo Branco', CasteloBrancoSvg),
        Coimbra: generateDistrictJSX('Coimbra', CoimbraSvg),
        Évora: generateDistrictJSX('Évora', EvoraSvg),
        Faro: generateDistrictJSX('Faro', FaroSvg),
        Guarda: generateDistrictJSX('Guarda', GuardaSvg),
        Leiria: generateDistrictJSX('Leiria', LeiriaSvg),
        Lisboa: generateDistrictJSX('Lisboa', LisbonSvg),
        Portalegre: generateDistrictJSX('Portalegre', PortalegreSvg),
        Porto: generateDistrictJSX('Porto', PortoSvg),
        Santarém: generateDistrictJSX('Santarém', SantaremSvg),
        Setúbal: generateDistrictJSX('Setúbal', SetubalSvg),
        VianadoCastelo: generateDistrictJSX('Viana do Castelo', VianaDoCasteloSvg),
        VilaReal: generateDistrictJSX('Vila Real', VilaRealSvg),
        Viseu: generateDistrictJSX('Viseu', ViseuSvg)
    };
    
    // Função para decodificar uma string contendo sequências de escape Unicode
    const decodeUnicodeEscape = (str) => {
        return str.replace(/\\x([0-9A-Fa-f]{2})/g, (match, p1) => {
            return String.fromCharCode(parseInt(p1, 16));
        });
    };

    // Função para manipular o clique no contêiner SVG
    const handleSvgClick = (event) => {
        // Verifica se o clique ocorreu em um dos caminhos (paths)
        if (event.target.tagName === 'path') {
            if (!selectedDistrict) {
                // Obtém o ID do path clicado (que corresponde ao nome do distrito)
                let districtEncoded = event.target.getAttribute('class');
                // Decodifica o nome do distrito
                let district = decodeUnicodeEscape(districtEncoded);
                // Constrói a mensagem com o nome do concelho
                let messageText = `${district} (Distrito) selecionado!`;

                // Exibe a mensagem correspondente e atualiza o distrito selecionado
                // showMessage(messageText, district);
        
            } else {
                let messageText = ""
                if (!event.target.classList.contains("selected")) {
                    let concelhoEncoded = event.target.getAttribute('class');
                    let concelho = decodeUnicodeEscape(concelhoEncoded);
                    messageText = `${selectedDistrict} (Distrito) e ${concelho} (Concelho) selecionado!`;
                    console.log(concelho)

                    if (selectedConcelho) {
                        selectedConcelho.classList.remove('selected')
                    }
                    event.target.classList.add('selected');
                    // setSelectedConcelho(event.target);
                    // setSelectedConcelhoName(concelho);
                } else {
                    event.target.classList.remove('selected')
                    // setSelectedConcelho(null);
                    // setSelectedConcelhoName(null);
                    messageText = `${selectedDistrict} (Distrito) selecionado!`;
                }

                // setMessage(messageText);
            }
        }
    };

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
