import requests
import pandas as pd
from bs4 import BeautifulSoup
import json
from dateutil.parser import parse
from datetime import datetime
import re
import sys
import os
from fake_useragent import UserAgent

# Verificar se a URL e o nome do arquivo foram fornecidos
if len(sys.argv) != 4:
    print("Uso: python3 scraper.py URL NOME_ARQUIVO MAPA_TXT")
    sys.exit(1)

# URL da página a ser extraída
url = sys.argv[1]

# Nome base dos arquivos de saída
nome_arquivo = sys.argv[2]

# Caminho para o arquivo de mapeamento
mapa_txt = sys.argv[3]

# Configurar o User-Agent
ua = UserAgent()
headers = {'User-Agent': ua.random}

# Fazer a requisição HTTP para obter o conteúdo da página
response = requests.get(url, headers=headers)
if response.status_code == 403:
    print("Acesso negado: 403 Forbidden")
    sys.exit(1)

content = response.content

# Analisar o conteúdo HTML
soup = BeautifulSoup(content, 'html.parser')

# Função para carregar o mapeamento de concelho e distrito a partir de um arquivo de texto
def carregar_mapeamento(file_path):
    mapeamento = {}
    with open(file_path, 'r', encoding='utf-8') as file:
        for line in file:
            localidade, concelho, distrito = map(str.strip, line.split(','))
            mapeamento[localidade] = (concelho, distrito)
    return mapeamento

# Carregar o mapeamento
mapeamento = carregar_mapeamento(mapa_txt)

# Função para obter concelho e distrito a partir da localidade
def obter_concelho_distrito(localidade):
    return mapeamento.get(localidade, ("", ""))

# Função para corrigir nomes de festas incompletos e remover da descrição
def corrigir_nome_festa(nome, descricao):
    # Verificar se o nome termina com 'S.' ou 'S ' e procurar a próxima palavra na descrição
    if re.search(r'\bS\.?$', nome):
        # Buscar a primeira palavra na descrição
        palavras = descricao.split()
        if palavras:
            santo_nome = palavras[0]
            nome = re.sub(r'S\.?', f'São {santo_nome}', nome)
            # Remover a primeira ocorrência da palavra na descrição
            descricao = re.sub(r'\b' + santo_nome + r'\b', '', descricao, 1).strip()
    return nome, descricao

# Função para corrigir nomes específicos
def corrigir_nome_especifico(nome, descricao):
    nome, descricao = corrigir_nome_festa(nome, descricao)
    # Truncar o nome na primeira vírgula, se houver
    if ',' in nome:
        nome = nome.split(',')[0]
    # Remover os dois-pontos no final do nome, se existirem
    nome = nome.rstrip(':')
    return nome, descricao

# Função para extrair os dados de cada trimestre
def extract_festas_by_trimester(soup, trimester):
    festas = []
    header = soup.find(string=re.compile(f'{trimester}', re.IGNORECASE))
    if header:
        print(f"Encontrado: {trimester}")
        next_elements = header.find_all_next(['p', 'ul'])
        for element in next_elements:
            if element.name == 'p' and trimester not in element.text:
                break
            if element.name == 'ul':
                items = element.find_all('li')
                for item in items:
                    festas.append(parse_festa(item.get_text(strip=True), trimester))
    else:
        print(f"Não encontrado: {trimester}")
    return festas

# Função para analisar as datas mais complexas
def parse_complex_date(date_str):
    try:
        return parse(date_str, fuzzy=True).strftime('%d-%m-%Y')
    except ValueError:
        return date_str

# Função para separar as informações de cada festa
def parse_festa(festa_text, trimester):
    for sep in ['–', ':']:
        partes = festa_text.split(sep)
        if len(partes) >= 2:
            break

    if len(partes) < 2:
        return [trimester, '', '', '', '', '', festa_text]
    
    local_data = partes[0].split(',')
    if len(local_data) >= 3:
        localidade = local_data[0].strip()
        concelho = local_data[1].strip()
        data = parse_complex_date(local_data[2].strip())
    elif len(local_data) == 2:
        localidade = local_data[0].strip()
        concelho = ""
        data = parse_complex_date(local_data[1].strip())
    else:
        localidade = local_data[0].strip() if len(local_data) > 0 else ''
        concelho = ''
        data = ''
    
    nome_descricao = partes[1].split(':') if ':' in festa_text else partes[1].split('–')
    if len(nome_descricao) < 2:
        nome_descricao = partes[1].split('.') if '.' in partes[1] else partes[1].split(',')
    
    nome_festa = nome_descricao[0].strip() if len(nome_descricao) > 0 else ''
    descricao = ':'.join(nome_descricao[1:]).strip() if len(nome_descricao) > 1 else ''
    
    nome_festa, descricao = corrigir_nome_especifico(nome_festa, descricao)
    
    if descricao.endswith(':'):
        descricao = descricao[:-1] + '.'

    freguesia, distrito = obter_concelho_distrito(localidade)

    if not concelho and freguesia:
        concelho = freguesia

    return [trimester, nome_festa, data, localidade, concelho, distrito, descricao]

trimesters = ['1º trimestre', '2º trimestre', '3º trimestre', '4º trimestre']
festas_data = {trimester: extract_festas_by_trimester(soup, trimester) for trimester in trimesters}

columns = ['Trimestre', 'Nome', 'Data', 'Freguesia', 'Concelho', 'Distrito', 'Descrição']
rows = []
for trimester, festas in festas_data.items():
    if not festas:
        continue
    for festa in festas:
        rows.append(festa)

df = pd.DataFrame(rows, columns=columns)

print(df)

output_dir = 'csv&json'
os.makedirs(output_dir, exist_ok=True)

output_csv = os.path.join(output_dir, f'{nome_arquivo}.csv')
df.to_csv(output_csv, index=False)

output_json = os.path.join(output_dir, f'{nome_arquivo}.json')
df.to_json(output_json, orient='records', force_ascii=False, indent=4)

print(f"Dados extraídos e salvos em '{output_csv}' e '{output_json}'.")
