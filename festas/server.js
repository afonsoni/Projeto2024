import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Servir os arquivos estáticos do React
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'build')));

// API endpoints
app.get('/api/festas', async (req, res) => {
    const district = req.query.district || '';
    const county = req.query.county || '';

    const query = `
        PREFIX : <http://rpcw.di.uminho.pt/festas&romarias/>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        SELECT ?nome ?dataInicio ?dataFim ?desc ?regiao ?distrito ?concelho ?freguesia WHERE { 
            ?s rdf:type :Festa ;
               :nome ?nome ;
               :descricao ?desc ;
               :dataInicio ?dataInicio ;
               :dataFim ?dataFim ;
               :ocorreRegiao ?r ;
               :ocorreDistrito ?d .
            ?r :nome ?regiao .
            ?d :nome ?distrito .
            OPTIONAL { ?s :ocorreConcelho ?c . ?c :nome ?concelho . }
            OPTIONAL { ?s :ocorreFreguesia ?f . ?f :nome ?freguesia . }
            ${district ? `FILTER(?distrito = "${district}")` : ''}
            ${county ? `FILTER(?concelho = "${county}")` : ''}
        }
        ORDER BY (?dataInicio)
    `;

    try {
        const response = await fetch('http://localhost:7200/repositories/FestasRomarias', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/sparql-query',
                'Accept': 'application/sparql-results+json',
            },
            body: query
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();
        const formattedData = data.results.bindings.map(item => ({
            "Nome da Festa": item.nome.value,
            "Descrição": item.desc.value,
            "Data Inicio": item.dataInicio.value,
            "Data Fim": item.dataFim.value,
            "Distrito": item.distrito.value,
            "Região": item.regiao.value,
            "Concelho": item.concelho ? item.concelho.value : '',
            "Freguesia": item.freguesia ? item.freguesia.value : ''
        }));

        res.status(200).json(formattedData);
    } catch (error) {
        console.error('Error fetching data from GraphDB:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// Catch-all handler for any request that doesn't match an API route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
