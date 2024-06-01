import React from 'react';
import Header from '../components/Header';
import Festa from '../components/Festa';
import { ReactComponent as PortugalMap } from '../assets/portugal_map.svg'; // Importar arquivo SVG do mapa de Portugal
import { ReactComponent as AveiroSvg } from '../assets/aveiro.svg';
import { ReactComponent as BejaSvg } from '../assets/beja.svg';
import { ReactComponent as BragaSvg } from '../assets/braga.svg';
import { ReactComponent as BragancaSvg } from '../assets/braganca.svg';
import { ReactComponent as CasteloBrancoSvg } from '../assets/castelo branco.svg';
import { ReactComponent as CoimbraSvg } from '../assets/coimbra.svg';
import { ReactComponent as EvoraSvg } from '../assets/evora.svg';
import { ReactComponent as FaroSvg } from '../assets/faro.svg';
import { ReactComponent as GuardaSvg } from '../assets/guarda.svg';
import { ReactComponent as LeiriaSvg } from '../assets/leiria.svg';
import { ReactComponent as LisbonSvg } from '../assets/lisboa.svg';
import { ReactComponent as PortalegreSvg } from '../assets/portalegre.svg';
import { ReactComponent as PortoSvg } from '../assets/porto.svg';
import { ReactComponent as SantaremSvg } from '../assets/santarem.svg';
import { ReactComponent as SetubalSvg } from '../assets/setubal.svg';
import { ReactComponent as VianaDoCasteloSvg } from '../assets/viana do castelo.svg';
import { ReactComponent as VilaRealSvg } from '../assets/vila real.svg';
import { ReactComponent as ViseuSvg } from '../assets/viseu.svg';

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
                    <div className="border p-4 rounded shadow-md bg-white" onClick={handleSvgClick}>
                        {selectedDistrict ? (
                            <>
                                {districtMap[selectedDistrict]}
                                <div className="custom-button">
                                    <a onClick={closeMessage}>Fechar</a>
                                </div>
                            </>
                        ) : (
                            <PortugalMap className="map-svg" width="800px" height="600px" />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
