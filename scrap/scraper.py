import requests
import pandas as pd
from bs4 import BeautifulSoup
from dateutil.parser import parse
from dateutil.relativedelta import relativedelta, SU, FR, SA, MO, TU, WE, TH
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

# Função para converter expressões como 'primeiro domingo de outubro' para uma data normal
def convert_to_date(text, year):
    month_mapping = {
        'janeiro': 1, 'fevereiro': 2, 'março': 3, 'abril': 4,
        'maio': 5, 'junho': 6, 'julho': 7, 'agosto': 8,
        'setembro': 9, 'outubro': 10, 'novembro': 11, 'dezembro': 12
    }
    
    weekday_mapping = {
        'domingo': SU, 'segunda': MO, 'terça': TU, 'quarta': WE, 'quinta': TH, 'sexta': FR, 'sábado': SA
    }

    text = text.lower()
    for month_name, month_number in month_mapping.items():
        if month_name in text:
            break
    else:
        return text  # Retorna o texto original se não encontrar o mês
    
    if 'semana' in text:
        if 'primeira' in text:
            nth = 1
        elif 'segunda' in text:
            nth = 2
        elif 'terceira' in text:
            nth = 3
        elif 'quarta' in text:
            nth = 4
        else:
            return text  # Retorna o texto original se não encontrar a ocorrência
        # Encontra o primeiro dia do mês
        first_day_of_month = datetime(year, month_number, 1)
        # Calcula o primeiro dia da semana nth
        target_date = first_day_of_month + relativedelta(weeks=nth-1, weekday=MO(0))
        return target_date.strftime('%d-%m-%Y')
    
    for weekday_name, weekday in weekday_mapping.items():
        if weekday_name in text:
            break
    else:
        return text  # Retorna o texto original se não encontrar o dia da semana

    nth = re.search(r'\b(primeiro|segundo|terceiro|quarto|quinto|último)\b', text)
    if nth:
        nth = {
            'primeiro': 1, 'segundo': 2, 'terceiro': 3, 'quarto': 4, 'quinto': 5, 'último': -1
        }[nth.group(0)]
    else:
        return text  # Retorna o texto original se não encontrar a ocorrência

    # Encontra o primeiro dia do mês
    first_day_of_month = datetime(year, month_number, 1)
    if nth == -1:
        # Encontrar a última ocorrência do dia da semana no mês
        next_month = first_day_of_month + relativedelta(months=1)
        last_day_of_month = next_month - relativedelta(days=1)
        target_date = last_day_of_month + relativedelta(weekday=weekday(-1))
    else:
        # Adiciona os dias necessários para chegar ao nth dia da semana
        target_date = first_day_of_month + relativedelta(weekday=weekday(nth))
    
    return target_date.strftime('%d-%m-%Y')

# Função para analisar as datas mais complexas, agora com a conversão adicional
def parse_complex_date(date_str):
    print(f"Parsing date: {date_str}")
    if any(keyword in date_str.lower() for keyword in ['primeiro', 'segundo', 'terceiro', 'quarto', 'quinto', 'último', 'semana']):
        converted_date = convert_to_date(date_str, datetime.now().year)
        print(f"Converted date using custom logic: {converted_date}")
        return converted_date
    
    month_mapping = {
        'janeiro': 1, 'fevereiro': 2, 'março': 3, 'abril': 4,
        'maio': 5, 'junho': 6, 'julho': 7, 'agosto': 8,
        'setembro': 9, 'outubro': 10, 'novembro': 11, 'dezembro': 12
    }
    for month_name, month_number in month_mapping.items():
        if month_name in date_str.lower():
            date_str = date_str.lower().replace(month_name, str(month_number))
            break
    else:
        return date_str  # Retorna o texto original se não encontrar o mês
    
    try:
        # Tenta converter usando dateutil.parser.parse
        parsed_date = parse(date_str, dayfirst=True, fuzzy=True).strftime('%d-%m-%Y')
        print(f"Parsed using dateutil: {parsed_date}")
        return parsed_date
    except ValueError:
        day = re.search(r'\d+', date_str)
        day = day.group(0) if day else '1'
        
        try:
            date = datetime.strptime(f"{day}-{month_number}-{datetime.now().year}", "%d-%m-%Y")
            formatted_date = date.strftime('%d-%m-%Y')
            print(f"Parsed using manual method: {formatted_date}")
            return formatted_date
        except ValueError:
            print(f"Error parsing date manually: {date_str}")
            return date_str  # Retorna o texto original se houver erro na formatação da data

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

# Função para separar as informações de cada festa
def parse_festa(festa_text, trimester):
    print(f"Parsing festa: {festa_text}")
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

    festa = [trimester, nome_festa, data, localidade, concelho, distrito, descricao]
    print(f"Parsed festa: {festa}")
    return festa

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
