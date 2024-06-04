import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-cover bg-[#4a2e2a] text-white py-4 mt-auto"> {/* Adicione a classe mt-auto para que o rodapé seja alinhado à parte inferior */}
            <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
                <div className="mb-4 md:mb-0">
                    <span className="block text-sm sm:text-center">© 2023 Festas e Romarias. All Rights Reserved.</span>
                    <span className="block text-sm sm:text-center">Created by Joana Pereira, Afonso Ferreira, and Fernando Alves.</span>
                </div>
                <div className="flex flex-col items-start md:items-center md:flex-row md:justify-between">
                    <div className="text-sm mr-6">
                        <p className="mb-1">Phone: (123) 456-7890</p>
                        <p>Email: <a href="mailto:contact@festaseromarias.com" className="hover:underline">contact@festaseromarias.com</a></p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
