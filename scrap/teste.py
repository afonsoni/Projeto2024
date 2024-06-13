# import re

# def teste(part):
#     # Use a lookahead assertion to capture all characters until the first match of the separator pattern
#     match = re.search(r'^(.*?)(?=([^A-Z]\.|,|:))', part)
#     if match:
#         # se existir um ponto no group(2), é porque se tem de juntar os dois grupos
#         if '.' in match.group(2):
#             nome = match.group(1).strip() + match.group(2).strip()
#         else:
#             nome = match.group(1).strip()
#         # Find the separator after the captured part
#         separator_match = re.search(r'[^A-Z]\.|,|:', part[match.end():])
#         if separator_match:
#             separator = separator_match.group()
#             descricao = part[match.end():].split(separator, 1)[1].strip()
#         else:
#             descricao = part[match.end():].strip()
#     else:
#         return None
    
#     descricao = descricao[0].upper() + descricao[1:] if descricao else None

#     return {
#         "nome": nome,
#         "descricao": descricao
#     }

# second_part = "Festa do S. Menino Jesus: da Gertrudes e do Manuel alvorada com. gaiteiros, peditório: com os mesmos acompanhando a Velha, o Bailador e a Bailadeira"
# print(teste(second_part))


import re
import pandas as pd

df = pd.read_excel('FreguesiasPortugalMetadata.xlsx')


def freguesia_exists_in_regiao(freguesia, concelho, regiao):
    # Substituir "da" e "de" por um padrão opcional na expressão regular
    freguesia_pattern = re.sub(r'\b(de|da|do)\b', r'(de|da|do)?', freguesia, flags=re.IGNORECASE)
    # filtrar pela região e freguesia. A freguesia não precisa de estar acentuado, nem em maiúsculas, nem tem de estar completo
    if concelho:
        filtered_df = df[(df['provincia'] == regiao) & 
                        (df['concelho'].str.contains(concelho, case=False)) & 
                        (df['freguesia'].str.contains(freguesia_pattern, case=False, regex=True))]
        print(filtered_df)
    else:
        filtered_df = df[(df['provincia'] == regiao) & 
                        (df['freguesia'].str.contains(freguesia_pattern, case=False, regex=True))]
    if filtered_df.empty:
        return None, None, None
    else:
    # ir buscar o primeiro concelho e distrito
        freguesia = filtered_df['freguesia'].iloc[0].strip()
        concelho = filtered_df['concelho'].iloc[0].strip()
        distrito = filtered_df['distrito'].iloc[0].strip()
        return freguesia, concelho, distrito
    
freguesia, concelho, distrito = freguesia_exists_in_regiao('Vila Chã da Braciosa', 'Miranda do Douro', 'tras_os_montes')
print(concelho, distrito)