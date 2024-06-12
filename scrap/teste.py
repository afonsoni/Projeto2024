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


import pandas as pd


import pandas as pd

df = pd.read_excel('FreguesiasPortugalMetadata.xlsx')


def concelho_exists_in_regiao(concelho,regiao):
    print("Concelho_exists_in_regiao", concelho, regiao)
    # filtrar pela região e concelho. O concelho não precisa de estar acentuado, nem em maiúsculas, nem tem de estar completo
    filtered_df = df[(df['provincia'] == regiao) & (df['concelho'].str.contains(concelho, case=False))]
    print("Filtered_df", filtered_df)
    if filtered_df.empty:
        return None, None
    else:
    # ir buscar o primeiro concelho e distrito
        concelho = filtered_df['concelho'].iloc[0]
        distrito = filtered_df['distrito'].iloc[0]
        return concelho, distrito
    
concelho, distrito = concelho_exists_in_regiao("Vilar de Perdizes", "tras_os_montes")
print(concelho, distrito)