import os
import re
import json
import pandas as pd
from bs4 import BeautifulSoup
import requests
from fake_useragent import UserAgent


# Configurar o User-Agent
ua = UserAgent()
headers = {'User-Agent': ua.random}

df = pd.read_excel('FreguesiasPortugalMetadata.xlsx')

'''
Casos de linhas:
freg , conc , data - nome : desc
freg , conc , data - nome . desc (ponto não pode ser antecedido por letra maiúscula)
freg , conc , data : nome . desc
freg , conc , data - nome , +desc
freg , conc , data : nome , +desc
freg , conc , data - nome
conc , data : nome . desc
conc , data : nome , +desc
freg , conc - data+nome : desc
conc , data - nome , +desc
conc , data - nome . desc
conc , data - nome
freg , conc , data+nome . desc

Ver se frase contém travessão ou dois pontos
Dividir a frase pelo primeiro travessão específico - ou dois pontos :
Feita a divisão, pegando na primeira parte:
Divide-se a primeira parte por vírgulas
- Se houver 2 elementos, o primeiro é o concelho e o segundo é a data
    - Há um outlier: freguesia, concelho. Tem de se ver sempre se o segundo elemento é um concelho através do mapeamento. Se for, é o concelho, senão é a data
- Se houver 3 elementos, o primeiro é a freguesia, o segundo é o concelho e o terceiro é a data
Para filtrar a freguesia e o concelho, é necessário ir ao mapeamento e filtrar pela região onde se inserem na web
Dividir a segunda parte pela primeira ocasião de dois pontos, vírgula ou ponto final. Apenas se divide a primeira vez.
O primeiro será o nome e o segundo será a descrição
No caso de haver uma vírgula, o nome é o primeiro elemento e a descrição é a junção dos dois.
Nos restantes casos, o nome é o primeiro elemento e a descrição é o segundo
'''

def concelho_exists_in_regiao(concelho,regiao):
    # filtrar pela região e concelho. O concelho não precisa de estar acentuado, nem em maiúsculas, nem tem de estar completo
    filtered_df = df[(df['provincia'] == regiao) & (df['concelho'].str.contains(concelho, case=False))]
    if filtered_df.empty:
        return None, None
    else:
    # ir buscar o primeiro concelho e distrito
        concelho = filtered_df['concelho'].iloc[0]
        distrito = filtered_df['distrito'].iloc[0]
        return concelho, distrito

def freguesia_exists_in_regiao(freguesia, concelho, regiao):
    # filtrar pela região e freguesia. A freguesia não precisa de estar acentuado, nem em maiúsculas, nem tem de estar completo
    filtered_df = df[(df['provincia'] == regiao) & (df['concelho'].str.contains(concelho, case=False)) & (df['freguesia'].str.contains(freguesia, case=False))]
    if filtered_df.empty:
        return None, None, None
    else:
    # ir buscar o primeiro concelho e distrito
        freguesia = filtered_df['freguesia'].iloc[0]
        concelho = filtered_df['concelho'].iloc[0]
        distrito = filtered_df['distrito'].iloc[0]
        return freguesia, concelho, distrito
    

def two_elements(part, regiao):
    # Em princípio o primeiro elemento é concelho, o segundo é a data.
    # Tem de se ver primeiro se o segundo elemento é um concelho através do mapeamento.
    locais = concelho_exists_in_regiao(part[1],regiao)
    # Se o segundo elemento estiver nos concelhos, é porque o segundo elemento é um concelho e o primeiro é freguesia, senão é data
    if locais != 0:
        freguesia, concelho, distrito = freguesia_exists_in_regiao(part[0],part[1],regiao)
        data = None
    else:
        freguesia = None
        concelho, distrito = concelho_exists_in_regiao(part[0],regiao)
        data = part[1]
    return freguesia, concelho, distrito, data

def three_elements(part, regiao):
    freguesia, concelho, distrito = freguesia_exists_in_regiao(part[0],part[1],regiao)
    data = part[2]
    return freguesia, concelho, distrito, data

def get_nome_descricao(part):
    # Use a lookahead assertion to capture all characters until the first match of the separator pattern
    match = re.search(r'^(.*?)(?=([^A-Z]\.|,|:))', part)
    if match:
        # se existir um ponto no group(2), é porque se tem de juntar os dois grupos
        if '.' in match.group(2):
            nome = match.group(1).strip() + match.group(2).strip()
        else:
            nome = match.group(1).strip()
        # Find the separator after the captured part
        separator_match = re.search(r'[^A-Z]\.|,|:', part[match.end():])
        if separator_match:
            separator = separator_match.group()
            descricao = part[match.end():].split(separator, 1)[1].strip()
        else:
            descricao = part[match.end():].strip()
    else:
        nome = part
        descricao = None
    
    descricao = descricao[0].upper() + descricao[1:] if descricao else None

    return {
        "nome": nome,
        "descricao": descricao
    }

def parse_festa(festa, trimester, regiao):
    # Dividir a frase pelo primeiro travessão específico – ou dois pontos :
    if '–' in festa:
        # Dividir a frase apenas pelo primeiro travessão
        parts = festa.split('–', 1)
    elif ':' in festa:
        # Dividir a frase apenas pelos primeiros dois pontos
        parts = festa.split(':', 1)
    else:
        return None

    # Dividir a primeira parte por vírgulas
    first_part = parts[0].strip()
    first_part = first_part.split(',')
    if len(first_part) == 2:
        freguesia, concelho, distrito, data = two_elements(first_part, regiao)
    elif len(first_part) == 3:
        freguesia, concelho, distrito, data = three_elements(first_part,regiao)
    else:
        return None

    # Dividir a segunda parte pela primeira ocasião de dois pontos, vírgula ou ponto final
    second_part = parts[1].strip()
    # Regex que verifica qual é o primeiro dos três elementos a aparecer, ":" ou "," ou "."
    # Se for um ponto, não pode ser antecedido por letra maiúscula
    nome, descricao = get_nome_descricao(second_part)
    if data is None:
        data = nome

    return {
        "nome": nome,
        "data_inicio": data,
        "data_fim": None,
        "freguesia": freguesia,
        "concelho": concelho,
        "distrito": distrito,
        "descricao": descricao,
        "regiao": trimester
    }

# Função para extrair os dados de cada trimestre
def extract_festas_by_trimester(soup, trimester, regiao):
    # Abrir ficheiro para inserir festa
    with open('festas.txt', 'a') as festas_file:
        festas_file.write(f"Região: {regiao}\n")
        festas_file.write(f"Trimestre: {trimester}\n")

    with open('outros.txt', 'a') as outros_files:
        outros_files.write(f"Região: {regiao}\n")
        outros_files.write(f"Trimestre: {trimester}\n")

    festas = []
    others = []
    header = soup.find(string=re.compile(f'{trimester}', re.IGNORECASE))
    if header:
        print(f"Encontrado: {trimester}")
        print(f"Região: {regiao}")
        next_elements = header.find_all_next(['p', 'ul'])
        for element in next_elements:
            if element.name == 'p' and trimester not in element.text:
                break
            if element.name == 'ul':
                items = element.find_all('li')
                for item in items:
                    festa = (parse_festa(item.get_text(strip=True), trimester, regiao))
                    if (festa) != None :
                        festas.append(festa)
                        with open('festas.txt', 'a') as festas_file:
                            festas_file.write(f"{festa}\n")
                    else:
                        others.append(item.get_text(strip=True))
                        with open('outros.txt', 'a') as outros_files:
                            outros_files.write(f"{item.get_text(strip=True)}\n")
                
    else:
        print(f"Não encontrado: {trimester}")
    return festas

def process_url(url, regiao):
    response = requests.get(url, headers=headers)
    if response.status_code == 403:
        print(f"Acesso negado: 403 Forbidden para {url}")
        return []

    content = response.content
    soup = BeautifulSoup(content, 'html.parser')

    trimesters = ['1º trimestre', '2º trimestre', '3º trimestre', '4º trimestre']
    festas_data = {trimester: extract_festas_by_trimester(soup, trimester, regiao) for trimester in trimesters}

    rows = []
    for _, festas in festas_data.items():
        if not festas:
            continue
        for festa in festas:
            if festa is not None:
                rows.append(festa)

    return rows

# URLs são os links para as páginas de cada região
urls_file = 'urls.txt'
with open(urls_file, 'r') as file:
    lines = file.readlines()

output_dir = 'csv&json'
os.makedirs(output_dir, exist_ok=True)

all_festas = []
for line in lines:
    # Cada linha do ficheiro tem a URL e a região
    url, regiao = line.strip().split()
    # Extrair os dados da página
    festas = process_url(url, regiao)
    # Salvar todas as festas num único CSV
    for festa in festas:
        all_festas.append(list(festa.values()))

columns = ["festa_id", "nome", "data_inicio", "data_fim", "freguesia", "concelho", "distrito", "descricao", "regiao"]
df = pd.DataFrame(all_festas, columns=columns)

output_csv = os.path.join(output_dir, 'todas_festas.csv')
df.to_csv(output_csv, index=False)

# Salvar as festas agrupadas por região em um JSON
output_json = os.path.join(output_dir, 'todas_festas.json')
with open(output_json, 'w', encoding='utf-8') as f:
    json.dump(all_festas, f, ensure_ascii=False, indent=4)

# Reestruturar o JSON para que "Distrito" seja a classe e a "Região" esteja junto das outras propriedades
new_data = {"festas": []}
festa_id = 1
for region, events in all_festas.items():
    for event in events:
        event['regiao'] = region
        event['festa_id'] = festa_id
        festa_id += 1
        new_data["festas"].append(event)

# Salvar o novo JSON modificado
modified_json_path = os.path.join(output_dir, 'festas_para_ontologia.json')
with open(modified_json_path, 'w', encoding='utf-8') as f:
    json.dump(new_data, f, ensure_ascii=False, indent=4)

print(f"Dados extraídos e salvos em '{output_csv}', '{output_json}' e '{modified_json_path}'.")
