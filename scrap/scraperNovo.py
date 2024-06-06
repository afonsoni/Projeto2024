import requests
import pandas as pd
from bs4 import BeautifulSoup
from dateutil.parser import parse
from dateutil.relativedelta import relativedelta, SU, FR, SA, MO, TU, WE, TH
from datetime import datetime, timedelta
import re
import sys
import os
from fake_useragent import UserAgent
import json

# Verificar se o arquivo de mapeamento foi fornecido
if len(sys.argv) != 2:
    print("Uso: python3 scraper.py MAPA_TXT")
    sys.exit(1)

# Caminho para o arquivo de mapeamento
mapa_txt = sys.argv[1]

# Configurar o User-Agent
ua = UserAgent()
headers = {'User-Agent': ua.random}

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
    if re.search(r'\bS\.?$', nome):
        palavras = descricao.split()
        if palavras:
            santo_nome = palavras[0]
            nome = re.sub(r'S\.?', f'São {santo_nome}', nome)
            descricao = re.sub(r'\b' + santo_nome + r'\b', '', descricao, 1).strip()
    return nome, descricao

# Função para corrigir nomes específicos
def corrigir_nome_especifico(nome, descricao):
    nome, descricao = corrigir_nome_festa(nome, descricao)
    if ',' in nome:
        nome = nome.split(',')[0]
    nome = nome.rstrip(':')
    return nome, descricao

# Função para calcular a data da Páscoa
def calcular_pascoa(ano):
    a = ano % 19
    b = ano // 100
    c = ano % 100
    d = b // 4
    e = b % 4
    f = (b + 8) // 25
    g = (b - f + 1) // 3
    h = (19 * a + b - d - g + 15) % 30
    i = c // 4
    k = c % 4
    l = (32 + 2 * e + 2 * i - h - k) % 7
    m = (a + 11 * h + 22 * l) // 451
    mes = (h + l - 7 * m + 114) // 31
    dia = ((h + l - 7 * m + 114) % 31) + 1
    return datetime(ano, mes, dia)

# Função para calcular eventos móveis
def calcular_eventos_moveis(ano):
    pascoa = calcular_pascoa(ano)
    domingo_ramos = pascoa - timedelta(days=7)
    sexta_santa = pascoa - timedelta(days=2)
    sabado_aleluia = pascoa - timedelta(days=1)
    segunda_pascoa = pascoa + timedelta(days=1)
    domingo_pascoela = pascoa + timedelta(days=7)
    segundo_domingo_pascoa = pascoa + timedelta(days=14)
    quinta_ascensao = pascoa + timedelta(days=39)
    domingo_espirito_santo = pascoa + timedelta(days=49)
    domingo_lazaro = pascoa - timedelta(days=14)
    penultima_sexta_quaresma = pascoa - timedelta(days=15)
    quinto_domingo_pascoa = pascoa + timedelta(days=35)
    terceiro_domingo_pascoa = pascoa + timedelta(days=21)
    segundo_domingo_quaresma = pascoa - timedelta(days=35)
    terca_feira_gorda = pascoa - timedelta(days=47)
    quinta_feira_santa = pascoa - timedelta(days=3)
    dia_corpo_deus = pascoa + timedelta(days=60)
    quarto_domingo_quaresma = pascoa - timedelta(days=21)
    domingo_santissima_trindade = pascoa + timedelta(days=56)
    quinta_feira_santa_40_dias = pascoa + timedelta(days=39)
    segunda_pascoela = pascoa + timedelta(days=8)
    terca_pascoela = pascoa + timedelta(days=9)
    domingo_pascoela_impares = pascoa + timedelta(days=7) if ano % 2 != 0 else None
    num_domingos_quaresma = pascoa - timedelta(days=49) + relativedelta(weekday=SU(+1))
    quinta_antes_domingo_gordo = pascoa - timedelta(days=52)

    return {
        "Domingo de Ramos": domingo_ramos,
        "Sexta-feira Santa": sexta_santa,
        "Sábado de Aleluia": sabado_aleluia,
        "Domingo de Páscoa": pascoa,
        "Segunda-feira de Páscoa": segunda_pascoa,
        "Domingo de Pascoela": domingo_pascoela,
        "2º domingo depois da Páscoa": segundo_domingo_pascoa,
        "5ª feira da Ascensão": quinta_ascensao,
        "Domingo do Espírito Santo": domingo_espirito_santo,
        "Domingo de Lázaro": domingo_lazaro,
        "penúltima sexta-feira da Quaresma": penultima_sexta_quaresma,
        "quinto domingo depois de Páscoa": quinto_domingo_pascoa,
        "domingo terceiro de Páscoa": terceiro_domingo_pascoa,
        "2º domingo da Quaresma": segundo_domingo_quaresma,
        "terça-feira gorda": terca_feira_gorda,
        "quinta-feira santa": quinta_feira_santa,
        "dia de corpo de deus": dia_corpo_deus,
        "4º domingo da quaresma": quarto_domingo_quaresma,
        "domingo da santíssima trindade": domingo_santissima_trindade,
        "5ª feira da ascensão (40 dias após a páscoa)": quinta_feira_santa_40_dias,
        "segunda-feira de pascoela": segunda_pascoela,
        "terça-feira de pascoela": terca_pascoela,
        "domingo de pascoela (nos anos ímpares)": domingo_pascoela_impares,
        "num dos domingos da quaresma": num_domingos_quaresma,
        "quinta-feira santa": quinta_feira_santa,
        "domingo de lázaro (domingo anterior ao de ramos)": domingo_lazaro,
        "quinta-feira anterior a domingo gordo": quinta_antes_domingo_gordo
    }

# Função para converter expressões como 'primeiro domingo de outubro' para uma data normal
def convert_to_date(text, year):
    eventos_moveis = calcular_eventos_moveis(year)
    text_lower = text.lower()
    for evento, data in eventos_moveis.items():
        if data and evento.lower() in text_lower:
            return data.strftime('%d-%m-%Y')

    month_mapping = {
        'janeiro': 1, 'fevereiro': 2, 'março': 3, 'abril': 4,
        'maio': 5, 'junho': 6, 'julho': 7, 'agosto': 8,
        'setembro': 9, 'outubro': 10, 'novembro': 11, 'dezembro': 12
    }
    
    weekday_mapping = {
        'domingo': SU, 'segunda': MO, 'terça': TU, 'quarta': WE, 'quinta': TH, 'sexta': FR, 'sábado': SA
    }

    for month_name, month_number in month_mapping.items():
        if month_name in text_lower:
            break
    else:
        return text  # Retorna o texto original se não encontrar o mês
    
    if 'semana' in text_lower:
        if 'primeira' in text_lower:
            nth = 1
        elif 'segunda' in text_lower:
            nth = 2
        elif 'terceira' in text_lower:
            nth = 3
        elif 'quarta' in text_lower:
            nth = 4
        else:
            return text  # Retorna o texto original se não encontrar a ocorrência
        first_day_of_month = datetime(year, month_number, 1)
        target_date = first_day_of_month + relativedelta(weeks=nth-1, weekday=MO(0))
        return target_date.strftime('%d-%m-%Y')
    
    for weekday_name, weekday in weekday_mapping.items():
        if weekday_name in text_lower:
            break
    else:
        return text  # Retorna o texto original se não encontrar o dia da semana

    nth = re.search(r'\b(primeiro|segundo|terceiro|quarto|quinto|último)\b', text_lower)
    if nth:
        nth = {
            'primeiro': 1, 'segundo': 2, 'terceiro': 3, 'quarto': 4, 'quinto': 5, 'último': -1
        }[nth.group(0)]
    else:
        return text  # Retorna o texto original se não encontrar a ocorrência

    first_day_of_month = datetime(year, month_number, 1)
    if nth == -1:
        next_month = first_day_of_month + relativedelta(months=1)
        last_day_of_month = next_month - relativedelta(days=1)
        target_date = last_day_of_month + relativedelta(weekday=weekday(-1))
    else:
        target_date = first_day_of_month + relativedelta(weekday=weekday(nth))
    
    return target_date.strftime('%d-%m-%Y')

# Função para analisar as datas mais complexas, agora com a conversão adicional
def parse_complex_date(date_str):
    if any(keyword in date_str.lower() for keyword in ['primeiro', 'segundo', 'terceiro', 'quarto', 'quinto', 'último', 'semana']):
        return convert_to_date(date_str, datetime.now().year)
    
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
        parsed_date = parse(date_str, dayfirst=True, fuzzy=True).strftime('%d-%m-%Y')
        return parsed_date
    except ValueError:
        day = re.search(r'\d+', date_str)
        day = day.group(0) if day else '1'
        
        try:
            date = datetime.strptime(f"{day}-{month_number}-{datetime.now().year}", "%d-%m-%Y")
            formatted_date = date.strftime('%d-%m-%Y')
            return formatted_date
        except ValueError:
            return "sem data"  # Retorna "sem data" se houver erro na formatação da data

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

# Função para analisar descrições e extrair períodos de datas
def extrair_periodo(descricao):
    pattern = r'(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})'
    datas = re.findall(pattern, descricao)
    if len(datas) == 2:
        data_inicio = parse(datas[0], dayfirst=True).strftime('%d-%m-%Y')
        data_fim = parse(datas[1], dayfirst=True).strftime('%d-%m-%Y')
    else:
        data_inicio = data_fim = ''
    return data_inicio, data_fim

# Função para separar as informações de cada festa
def parse_festa(festa_text, trimester):
    for sep in ['–', ':']:
        partes = festa_text.split(sep)
        if len(partes) >= 2:
            break

    if len(partes) < 2:
        return {
            "Nome": '',
            "Data Início": 'sem data',
            "Data Fim": 'sem data',
            "Freguesia": '',
            "Concelho": '',
            "Distrito": '',
            "Descrição": festa_text
        }
    
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
        data = 'sem data'
    
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

    if "carnaval" in nome_festa.lower() or "carnaval" in descricao.lower():
        return None

    eventos_moveis = {
        "domingo de ramos": "Domingo de Ramos",
        "sexta-feira santa": "Sexta-feira Santa",
        "sábado de aleluia": "Sábado de Aleluia",
        "domingo de páscoa": "Domingo de Páscoa",
        "segunda-feira de páscoa": "Segunda-feira de Páscoa",
        "domingo de pascoela": "Domingo de Pascoela",
        "2º domingo depois da páscoa": "2º domingo depois da Páscoa",
        "5ª feira da ascensão": "5ª feira da Ascensão",
        "domingo do espírito santo": "Domingo do Espírito Santo",
        "domingo de lázaro": "Domingo de Lázaro",
        "penúltima sexta-feira da quaresma": "penúltima sexta-feira da Quaresma",
        "quinto domingo depois de páscoa": "quinto domingo depois de Páscoa",
        "domingo terceiro de páscoa": "domingo terceiro de Páscoa",
        "2º domingo da quaresma": "2º domingo da Quaresma",
        "terça-feira gorda": "terça-feira gorda",
        "quinta-feira santa": "quinta-feira santa",
        "dia de corpo de deus": "dia de corpo de deus",
        "4º domingo da quaresma": "4º domingo da quaresma",
        "domingo da santíssima trindade": "domingo da santíssima trindade",
        "5ª feira da ascensão (40 dias após a páscoa)": "5ª feira da ascensão (40 dias após a páscoa)",
        "segunda-feira de pascoela": "segunda-feira de pascoela",
        "terça-feira de pascoela": "terça-feira de pascoela",
        "domingo de pascoela (nos anos ímpares)": "domingo de pascoela (nos anos ímpares)",
        "num dos domingos da quaresma": "num dos domingos da quaresma",
        "quinta-feira santa": "quinta-feira santa",
        "domingo de lázaro (domingo anterior ao de ramos)": "domingo de lázaro (domingo anterior ao de ramos)",
        "quinta-feira anterior a domingo gordo": "quinta-feira anterior a domingo gordo",
    }
    
    if data.lower() in eventos_moveis:
        data_inicio = convert_to_date(eventos_moveis[data.lower()], datetime.now().year)
        data_fim = data_inicio
    else:
        data_inicio, data_fim = extrair_periodo(descricao)
        if not data_inicio:
            data_inicio = data_fim = data

    festa = {
        "Nome": nome_festa,
        "Data Início": data_inicio,
        "Data Fim": data_fim,
        "Freguesia": localidade,
        "Concelho": concelho,
        "Distrito": distrito,
        "Descrição": descricao
    }
    return festa

# Função para processar uma URL e extrair as festas
def processar_url(url, nome_arquivo):
    response = requests.get(url, headers=headers)
    if response.status_code == 403:
        print(f"Acesso negado: 403 Forbidden para {url}")
        return []

    content = response.content
    soup = BeautifulSoup(content, 'html.parser')

    trimesters = ['1º trimestre', '2º trimestre', '3º trimestre', '4º trimestre']
    festas_data = {trimester: extract_festas_by_trimester(soup, trimester) for trimester in trimesters}

    rows = []
    for trimester, festas in festas_data.items():
        if not festas:
            continue
        for festa in festas:
            if festa is not None:
                rows.append(festa)

    return rows

# Ler as URLs e nomes dos arquivos a partir do arquivo de texto
urls_file = 'urls.txt'
with open(urls_file, 'r') as file:
    lines = file.readlines()

all_festas = {}

for line in lines:
    url, nome_arquivo = line.strip().split()
    festas = processar_url(url, nome_arquivo)
    all_festas[nome_arquivo] = festas

output_dir = 'csv&json'
os.makedirs(output_dir, exist_ok=True)

# Salvar todas as festas em um único CSV
all_festas_list = []
for region, festas in all_festas.items():
    for festa in festas:
        all_festas_list.append([region] + list(festa.values()))

columns = ['Região', 'Nome', 'Data Início', 'Data Fim', 'Freguesia', 'Concelho', 'Distrito', 'Descrição']
df = pd.DataFrame(all_festas_list, columns=columns)

output_csv = os.path.join(output_dir, 'todas_festas.csv')
df.to_csv(output_csv, index=False)

# Salvar as festas agrupadas por região em um JSON
output_json = os.path.join(output_dir, 'todas_festas.json')
with open(output_json, 'w', encoding='utf-8') as f:
    json.dump(all_festas, f, ensure_ascii=False, indent=4)

print(f"Dados extraídos e salvos em '{output_csv}' e '{output_json}'.")
