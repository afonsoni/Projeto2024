import json

'''
Este script vai pegar num JSON com festas e noutro com regiões, distritos, concelhos e freguesias e juntá-los num só JSON.
O JSON original com festas tem a seguinte estrutura:
{
    "Aveiro": [
        {
            "Nome": "Cortejo dos Reis",
            "Data Início": "06-01-2024",
            "Data Fim": "06-01-2024",
            "Freguesia": "Talhadas",
            "Concelho": "Sever do Vouga",
            "Descrição": "com pequeno auto teatral e leilão das ofertas",
            "Região": "beira_litoral"
        },
        {
            "Nome": "Romaria dos Santos Mártires",
            "Data Início": "07-01-2024",
            "Data Fim": "07-01-2024",
            "Freguesia": "Travassô",
            "Concelho": "Águeda",
            "Descrição": "Procissão dos Nus, antigamente composta por fiéis amortalhados em cumprimento das suas promessas: No dia seguinte, nova procissão, em que as crianças passam por debaixo do andor de Santa Clara, para não se atrasarem no falar.",
            "Região": "beira_litoral"
        }
    ],
    "Beja": [
        {
            "Nome": "Festa de Santo Amaro",
            "Data Início": "15-01-2024",
            "Data Fim": "15-01-2024",
            "Freguesia": "Vila Nova de Milfontes",
            "Concelho": "Odemira",
            "Descrição": "Procissão e leilão de ofertas",
            "Região": "baixo_alentejo"
        }
    ]
}

O JSON com as regiões, distritos, concelhos e freguesias tem a seguinte estrutura:
{
  "Regiao": [
    "minho",
    "douro_litoral",
    "beira_alta",
    "beira_baixa",
    "beira_litoral",
    "tras_os_montes",
    "ribatejo",
    "estremadura",
    "alentejo",
    "algarve"
  ],
  "Distrito": [
    "Aveiro",
    "Beja",
    "Braga",
    "Bragan\u00e7a",
    "Castelo Branco",
    "Coimbra",
    "\u00c9vora",
    "Faro",
    "Guarda",
    "Leiria",
    "Lisboa",
    "Portalegre",
    "Porto",
    "Santar\u00e9m",
    "Set\u00fabal",
    "Viana do Castelo",
    "Vila Real",
    "Viseu"
  ]

{
  "Regiao": [
    ...
  ],
  "Distrito": [
    ...
  ],
  "Concelho": [
    ...
  ],
  "Freguesia": [
    ...
  ],
  "Festas": [
      {
            "Nome": "Cortejo dos Reis",
            "Descrição": "com pequeno auto teatral e leilão das ofertas",
            "Data Início": "06-01-2024",
            "Data Fim": "06-01-2024",
            "Região": "beira_litoral",
            "Distrito": "Aveiro",
            "Concelho": "Sever do Vouga",
            "Freguesia": "Talhadas"
      },
  ]
      ...
  }'''

regioes_distritos_concelhos_freguesias = 'distritos_concelhos_freguesias.json'
festas = 'festas.json'

with open(regioes_distritos_concelhos_freguesias, 'r') as f:
    regioes_distritos_json = json.load(f)

with open(festas, 'r') as f:
    festas_json = json.load(f)

# Combina os dados
combined_json = {
    "Regiao": regioes_distritos_json["Regiao"],
    "Distrito": regioes_distritos_json["Distrito"],
    "Concelho": regioes_distritos_json["Concelho"],
    "Freguesia": regioes_distritos_json["Freguesia"],
    "Festas": []
}

for distrito, festas in festas_json.items():
    for festa in festas:
        festa_combined = {
            "Nome": festa["Nome"],
            "Descrição": festa["Descrição"],
            "Data Início": festa["Data Início"],
            "Data Fim": festa["Data Fim"],
            "Região": festa["Região"],
            "Distrito": distrito,
            "Concelho": festa["Concelho"],
            "Freguesia": festa["Freguesia"]
        }
        combined_json["Festas"].append(festa_combined)

# Salva o JSON combinado em um arquivo
with open('festas_combinadas.json', 'w', encoding='utf-8') as f:
    json.dump(combined_json, f, ensure_ascii=False, indent=4)

# Imprime o JSON combinado
print(json.dumps(combined_json, ensure_ascii=False, indent=4))