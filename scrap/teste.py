import re

def teste(part):
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
        return None
    
    descricao = descricao[0].upper() + descricao[1:] if descricao else None

    return {
        "nome": nome,
        "descricao": descricao
    }

second_part = "Festa do S. Menino Jesus: da Gertrudes e do Manuel alvorada com. gaiteiros, peditório: com os mesmos acompanhando a Velha, o Bailador e a Bailadeira"
print(teste(second_part))
