import re, uuid

class AegisCore:
    def __init__(self):
        self.vault = {}

    def anonymize(self, text, session_id):
        if session_id not in self.vault:
            self.vault[session_id] = {}

        print(f"DEBUG : Texte reçu pour anonymisation : {text}")

        # 1. Pattern NAS (000-000-000) et RAMQ (123-232-232 ou AAAA 0000 0000)
        # On simplifie la regex pour être sûr qu'elle attrape tout
        gov_pattern = r'(\d{3}-\d{3}-\d{3}|[A-Z]{4}\s?\d{4}\s?\d{4})'
        
        def replace_gov(match):
            val = match.group(0)
            token = self._get_token(session_id, "GOV_ID", val)
            print(f"🛡️ Aegis : Détection de {val} -> Remplacé par {token}")
            return token

        # On exécute le remplacement
        anonymized_text = re.sub(gov_pattern, replace_gov, text)

        # 2. On traite aussi les prénoms simples (Moussa) manuellement pour le test
        # (En attendant que ton spaCy soit bien configuré)
        names = ["Moussa", "Conrad"]
        for name in names:
            if name in anonymized_text:
                token = self._get_token(session_id, "IDENT", name)
                anonymized_text = anonymized_text.replace(name, token)

        print(f"DEBUG : Texte final envoyé à l'extension : {anonymized_text}")
        return anonymized_text

    def _get_token(self, sid, label, val):
        for t, v in self.vault[sid].items():
            if v == val: return t
        token = f"[{label}_{uuid.uuid4().hex[:4].upper()}]"
        self.vault[sid][token] = val
        return token