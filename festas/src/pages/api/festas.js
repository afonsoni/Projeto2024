export default async function handler(req, res) {
    if (req.method === 'GET') {
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
            }
            ORDER BY (?dataInicio)
        `;

        try {
            const response = await fetch('http://localhost:7200/repositories/FestasRomarias', {
                method: 'POST',  // GraphDB typically requires POST for SPARQL queries
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
            res.status(200).json(data);
        } catch (error) {
            console.error('Error fetching data from GraphDB:', error);
            res.status(500).json({ error: 'Failed to fetch data' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
