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

// Endpoint para obter distritos
app.get('/api/distritos', async (req, res) => {
    const query = `
        PREFIX : <http://rpcw.di.uminho.pt/festas&romarias/>
        SELECT DISTINCT ?district WHERE {
            ?s a :Distrito;
               :nome ?district
        } ORDER BY ?district
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
        const districts = data.results.bindings.map(b => b.district.value);
        res.status(200).json(districts);
    } catch (error) {
        console.error('Error fetching data from GraphDB:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// Endpoint para obter concelhos por distrito
// http://localhost:3000/api/concelhos?distrito=Porto
app.get('/api/concelhos', async (req, res) => {
    const { distrito } = req.query;

    const query = `
        PREFIX : <http://rpcw.di.uminho.pt/festas&romarias/>
        SELECT DISTINCT ?concelho WHERE {
            ?s a :Distrito;
               :nome '${distrito}' ;
               :temConcelho ?c.
            ?c :nome ?concelho .
        } ORDER BY ?concelho
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
        const concelhos = data.results.bindings.map(b => b.concelho.value);
        res.status(200).json(concelhos);
    } catch (error) {
        console.error('Error fetching data from GraphDB:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// Endpoint para obter freguesias por concelho
// http://localhost:3000/api/freguesias?concelho=Porto
app.get('/api/freguesias', async (req, res) => {
    const { concelho } = req.query;

    const query = `
        PREFIX : <http://rpcw.di.uminho.pt/festas&romarias/>
        SELECT DISTINCT ?freguesia WHERE {
            ?s a :Concelho;
               :nome '${concelho}' ;
               :temFreguesia ?freg.
            ?freg :nome ?freguesia .
        } ORDER BY ?freguesia
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
        const freguesias = data.results.bindings.map(b => b.freguesia.value);
        res.status(200).json(freguesias);
    } catch (error) {
        console.error('Error fetching data from GraphDB:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// Endpoint para obter a região por distrito
// http://localhost:3000/api/regiao?distrito=Porto
app.get('/api/regiao', async (req, res) => {
    const { distrito } = req.query;


    const query = `
        PREFIX : <http://rpcw.di.uminho.pt/festas&romarias/>
        SELECT DISTINCT ?regiao WHERE {
            ?s rdf:type :Distrito ;
               :nome '${distrito}' ;
               :pertenceRegiao ?r .
            ?r :nome ?regiao .
        } ORDER BY ?regiao
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

        if (data.results.bindings.length === 0) {
            throw new Error(`No region found for district: ${distrito}`);
        }

        const regiao = data.results.bindings[0].regiao.value;
        res.status(200).json({ regiao });
    } catch (error) {
        console.error('Error fetching region by district:', error);
        res.status(500).json({ error: 'Failed to fetch region by district' });
    }
});

// Endpoint para obter o próximo ID disponível
app.get('/api/next_id', async (req, res) => {
    const query = `
        PREFIX : <http://rpcw.di.uminho.pt/festas&romarias/>
        SELECT (COUNT(?s) AS ?n_festas) WHERE {
            ?s rdf:type :Festa .
        }
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
        const n_festas = parseInt(data.results.bindings[0].n_festas.value, 10);
        const next_id = n_festas + 1;

        res.status(200).json({ next_id });
    } catch (error) {
        console.error('Error fetching next ID:', error);
        res.status(500).json({ error: 'Failed to fetch next ID' });
    }
});

// Endpoint para criar uma nova festa

app.post('/api/criar_festa', async (req, res) => {
    try {
        const { nome, dataInicio, dataFim, distrito, concelho, freguesia, descricao } = req.body;


        // Obter o próximo ID disponível
        const idResponse = await fetch('http://localhost:3000/api/next_id');
        const idData = await idResponse.json();
        const id = idData.next_id;

        // Obter a região correspondente ao distrito
        const regiaoResponse = await fetch(`http://localhost:3000/api/regiao?distrito=${distrito}`);
        const regiaoData = await regiaoResponse.json();
        const regiao = regiaoData.regiao;

        console.log('Creating festa:', { id, nome, dataInicio, dataFim, distrito, concelho, freguesia, descricao, regiao });

        // Construa sua consulta SPARQL para inserir os dados na ontologia
        const query = `
            PREFIX : <http://rpcw.di.uminho.pt/festas&romarias/>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

            INSERT DATA {
                :${id} rdf:type :Festa ;
                        :nome '${nome}' ;
                        :descricao '${descricao}' ;
                        :dataInicio '${dataInicio}';
                        :dataFim '${dataFim}' ;
                        :ocorreRegiao :r ;
                        :ocorreDistrito :d ;
                        :ocorreConcelho :c;
                        :ocorreFreguesia :f .

                :r rdf:type :Regiao ;
                            :nome '${regiao}' .

                :d rdf:type :Distrito ;
                               :nome '${distrito}' .

                :c rdf:type :Concelho ;
                               :nome '${concelho}' .

                :f rdf:type :Freguesia ;
                               :nome '${freguesia}' .
            }
        `;

        const response = await fetch('http://localhost:7200/repositories/FestasRomarias/statements', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/sparql-update',
                'Accept': 'application/json',
            },
            body: query
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        // Se a inserção for bem-sucedida, envie uma resposta de sucesso
        // print cpdigo status
        res.status(201).json({ message: 'Festa criada com sucesso!' });
    } catch (error) {
        console.error('Error creating festa:', error);
        res.status(500).json({ error: 'Failed to create festa' });
    }
});

// Catch-all handler for any request that doesn't match an API route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
