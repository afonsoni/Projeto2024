import json
import pandas as pd

'''
Dá-me uma script que me dê uma lista dos distritos, uma lista de concelhos e uma lista de freguesias, por exemplo:

{
  "Distrito": ["Aveiro", "Porto"...],
  "Concelho": ["Maia", "Matosinhos",...],
  "Freguesia": ["Paranhos", "União das freguesias do Préstimo e Macieira de Alcoba",...]
}
'''

# Caminho para o ficheiro Excel
file_path = 'FreguesiasPortugalMetadata.xlsx'

data = pd.read_excel(file_path)

# Obter os distritos
distritos = data['distrito'].unique().tolist()

# Obter os concelhos
concelhos = data['concelho'].unique().tolist()

# Obter as freguesias
freguesias = data['freguesia'].unique().tolist()

# Guardar os resultados num dicionário
data = {
    'Distrito': distritos,
    'Concelho': concelhos,
    'Freguesia': freguesias
}

# Guardar o resultado num ficheiro JSON
with open('distritos_concelhos_freguesias.json', 'w') as f:
    json.dump(data, f)

print('Ficheiro JSON criado com sucesso!')
