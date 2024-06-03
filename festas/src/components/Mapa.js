import React, { useState } from 'react';
import { ReactComponent as PortugalMap } from '../assets/mapa/portugal_map.svg'; // Importar arquivo SVG do mapa de Portugal
import { ReactComponent as AveiroSvg } from '../assets/mapa/aveiro.svg';
import { ReactComponent as BejaSvg } from '../assets/mapa/beja.svg';
import { ReactComponent as BragaSvg } from '../assets/mapa/braga.svg';
import { ReactComponent as BragancaSvg } from '../assets/mapa/braganca.svg';
import { ReactComponent as CasteloBrancoSvg } from '../assets/mapa/castelo_branco.svg';
import { ReactComponent as CoimbraSvg } from '../assets/mapa/coimbra.svg';
import { ReactComponent as EvoraSvg } from '../assets/mapa/evora.svg';
import { ReactComponent as FaroSvg } from '../assets/mapa/faro.svg';
import { ReactComponent as GuardaSvg } from '../assets/mapa/guarda.svg';
import { ReactComponent as LeiriaSvg } from '../assets/mapa/leiria.svg';
import { ReactComponent as LisbonSvg } from '../assets/mapa/lisboa.svg';
import { ReactComponent as PortalegreSvg } from '../assets/mapa/portalegre.svg';
import { ReactComponent as PortoSvg } from '../assets/mapa/porto.svg';
import { ReactComponent as SantaremSvg } from '../assets/mapa/santarem.svg';
import { ReactComponent as SetubalSvg } from '../assets/mapa/setubal.svg';
import { ReactComponent as VianaDoCasteloSvg } from '../assets/mapa/viana_do_castelo.svg';
import { ReactComponent as VilaRealSvg } from '../assets/mapa/vila_real.svg';
import { ReactComponent as ViseuSvg } from '../assets/mapa/viseu.svg';
import './Mapa.css';

const Mapa = () => {
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedCounty, setSelectedCounty] = useState(null);

    const decodeURIComponent = (str) => {
        return str.replace(/%([0-9A-F]{2})/g, (match, p1) => {
            return String.fromCharCode('0x' + p1);
        });
    }

    const handleDistrictClick = (event) => {
        if (event.target.tagName === 'path') {
            if (!selectedDistrict) {
                let districtEncoded = event.target.getAttribute('class');
                let district = decodeURIComponent(districtEncoded);
                setSelectedDistrict(district);
            }
        }
    };

    const handleCountyClick = (event) => {
        if (event.target.tagName === 'path') {
            if (!selectedCounty) {
                let countyEncoded = event.target.getAttribute('class');
                let county = decodeURIComponent(countyEncoded);
                setSelectedCounty(county);
            }
        }
    };
    const close = () => {
        setSelectedDistrict(null);
    }

    const districtMap = {
        Aveiro: <AveiroSvg />,
        Beja: <BejaSvg />,
        Braga: <BragaSvg />,
        Braganca: <BragancaSvg />,
        CasteloBranco: <CasteloBrancoSvg />,
        Coimbra: <CoimbraSvg />,
        Evora: <EvoraSvg />,
        Faro: <FaroSvg />,
        Guarda: <GuardaSvg />,
        Leiria: <LeiriaSvg />,
        Lisboa: <LisbonSvg />,
        Portalegre: <PortalegreSvg />,
        Porto: <PortoSvg />,
        Santarem: <SantaremSvg />,
        Setubal: <SetubalSvg />,
        VianadoCastelo: <VianaDoCasteloSvg />,
        VilaReal: <VilaRealSvg />,
        Viseu: <ViseuSvg />,
    };

    return (
        <div className="border p-4 rounded bg-white bg-opacity-90 h-full overflow-y-auto" style={{ fontFamily: 'serif', color: '#4a2e2a' }}>
            <h2 className="text-2xl font-bold mb-4 px-4">Mapa de Festas</h2>
            <div onClick={handleDistrictClick}>
                {selectedDistrict ? (
                    <>
                        {districtMap[selectedDistrict]}
                        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            <a onClick={close}>Fechar</a>
                        </button>
                    </>
                ) : (
                    <PortugalMap />
                )}
            </div>
            
        </div>
    );
}

export default Mapa;
