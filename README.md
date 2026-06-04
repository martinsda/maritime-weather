# ⚓ Maritime Weather Briefing

Um gerador **automático de briefings meteorológicos diários** para navegação à vela. Combina dados de múltiplas fontes para fornecer previsões **precisas, horárias e contextualizadas** para a rota **Lisboa → Cascais**.

## 📋 O que faz

O sistema gera automaticamente um relatório meteorológico abrangente **todos os dias às 07:00 UTC** que inclui:

### 1. **TODAY — HOURLY FORECAST** (Previsão Horária)
- Tabela horária com **vento** (velocidade, direção, rajadas), **temperatura**, **precipitação** e escala **Beaufort**
- Comparação automática entre múltiplos modelos meteorológicos para avaliar confiança da previsão
- Resumo executivo com picos de vento, evolução de direção e temperatura

### 2. **TIDES** (Marés — Porto de Lisboa)
- Altura das marés em **Zero Hidrográfico (ZH)** — datum oficial das cartas portuguesas
- Análise de **correntes de maré** para otimizar passagens de barra
- Recomendação de **janela horária ideal** para saída e regresso

### 3. **MULTI-DAY FORECAST** (Previsão de 7 dias)
- Condições meteorológicas por dia, incluindo **avisos de trovoada**
- Estatísticas semanais: dias calmos, rajadas máximas, direções dominantes

### 4. **Formatos de Saída**
- 📄 **Markdown** (`output/YYYY-MM-DD_lisbon-cascais-briefing.md`) — salvo no repositório
- 🌐 **HTML** (`index.html`) — publicado em [GitHub Pages](https://martinsda.github.io/maritime-weather/)
- 📧 **Email** — enviado via SMTP (configuração opcional)

---

## 📡 Fontes de Dados

| Fonte | Tipo | Parâmetros | Cobertura |
|-------|------|-----------|-----------|
| **Windy API** — iconEu | Modelo meteorológico | Vento (u/v), pressão, temperatura, rajadas | 3-hourly |
| **Windy API** — gfsWave | Modelo oceanográfico | Ondas, swell primário/secundário | — |
| **Open-Meteo** | API meteorológica pública | Temperatura, precipitação, chuva, vento, humidade, probabilidade | Hourly, 7 dias |
| **Open-Meteo** — ECMWF IFS | Modelo europeu ECMWF | Vento de alta precisão (primário para velocidade) | 2 dias, hourly |
| **Porto de Lisboa** — PDF (parsed) | Tábua de marés oficial | Horas e alturas de marés (ZH) | Anual |

### 🔄 Prioridade de Dados

**Vento:** `ECMWF IFS` (via Open-Meteo) → `ICON-EU` (Windy) → Open-Meteo
- ECMWF é o modelo europeu de referência
- ICON-EU fornece cross-check de 3 em 3 horas
- Divergências >5kt indicam baixa confiança

**Temperatura / Precipitação:** Open-Meteo (Live)
- API pública, sem chave necessária, atualizado continuamente

**Rajadas:** `ECMWF IFS` → `ICON-EU` → Open-Meteo (fallback)

**Marés:** Porto de Lisboa (dados oficiais pré-parseados)

---

## 🚀 Instalação & Execução

### Pré-requisitos
- **Node.js** ≥18
- **Variáveis de ambiente** (opcional para funcionalidade completa):
  - `WINDY_API_KEY` — [Obter em api.windy.com](https://api.windy.com/)
  - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_TO` — para envio por email

### Setup Local

```bash
# Clonar repositório
git clone https://github.com/martinsda/maritime-weather.git
cd maritime-weather

# Instalar dependências
npm install

# Gerar briefing
npm run generate
```

Outputs:
- `output/YYYY-MM-DD_lisbon-cascais-briefing.md` — relatório markdown
- `index.html` — página web atualizada

### Automação via GitHub Actions

O repositório executa **diariamente às 07:00 UTC** via GitHub Actions:

```yaml
on:
  schedule:
    - cron: '0 7 * * *'
```

Pipeline:
1. Checkout do código
2. Setup Node.js 20
3. Executa `scripts/generate-briefing.js`
4. Commit automático dos novos arquivos
5. Deploy para GitHub Pages

---

## 📁 Estrutura do Projeto

```
maritime-weather/
├── scripts/
│   └── generate-briefing.js      # Script principal (880 linhas)
├── data/
│   └── tides-2026.json           # Dados de marés pré-parseados (Porto de Lisboa)
├── output/                        # Briefings históricos (markdown)
│   └── 2026-06-04_lisbon-cascais-briefing.md
├── index.html                     # Página GitHub Pages (regenerada diariamente)
├── package.json
└── .github/workflows/
    └── daily-maritime-briefing.yml
```

---

## ⚙️ Configuração

### Localização Geográfica

A rota está hardcoded em `scripts/generate-briefing.js` (linhas 25-33):

```javascript
const CONFIG = {
  lat:       38.682,      // Lisboa
  lon:      -9.219,       // Cascais
  elev:      16,
  timezone:  'Europe/Lisbon',
  route:     'Lisbon → Cascais',
  port:      'Lisbon / Tagus Bar',
  depHour:   14,          // Saída típica (hora local)
  retHour:   17,          // Regresso típico (hora local)
};
```

Para adaptar a uma rota diferente, edite estas variáveis.

### Chave Windy API

Se `WINDY_API_KEY` não está definida:
- ✓ Open-Meteo continua funcionando (completo, sem chave)
- ⚠️ ICON-EU (3-hourly cross-check) é skipped

### Marés Customizadas

As marés vêm de um PDF oficial do Porto de Lisboa, pré-parseado em `data/tides-YYYY.json`:

```json
{
  "2026-06-04": {
    "HW1": { "time": "06:42", "height": 2.31 },
    "LW1": { "time": "12:24", "height": 0.52 },
    "HW2": { "time": "19:06", "height": 2.28 },
    "LW2": { "time": "...": null }
  },
  ...
}
```

Para outro porto, parse o PDF oficial e coloque em `data/tides-YYYY.json`.

---

## 🛠️ Desenvolvimento

### Modificar o Briefing

`scripts/generate-briefing.js` é estruturado em seções:

- **Helpers** (linhas 44–70) — Conversões de unidades (kts, Beaufort, WMO)
- **API Fetchers** (linhas 73–144) — Fetch das 4 APIs
- **buildHourlyTable()** (linhas 148–368) — Tabela horária com lógica de prioridade
- **buildTidalSection()** (linhas 373–510) — Análise de correntes + passagem ideal
- **buildMultiDayTable()** (linhas 514–558) — Previsão de 7 dias
- **HTML/Email builders** (linhas 562–759) — Renderização
- **main()** (linhas 792–876) — Orquestração

### Testar Localmente

```bash
# Defina variáveis de teste
export WINDY_API_KEY=your-key-here

# Rode o script
npm run generate
```

Abra `index.html` num navegador para ver o resultado.

---

## 📊 Exemplo de Saída

### HTML (GitHub Pages)
![Screenshot mockup](https://martinsda.github.io/maritime-weather/)
- Tabelas responsivas, cores temáticas (azul marinho)
- Destaques automáticos (picos de vento, dias perigosos)

### Markdown (Repo + Email)
```markdown
# MARITIME WEATHER BRIEFING
**Date**: 4 June 2026
**Route**: Lisbon → Cascais

## TODAY — HOURLY FORECAST
| Time | Temp | Direction | Wind (kt) | Gust (kt) | BFT | Precip % | Rain (mm) |
...
**Wind summary**: Peak 18.5kt from 240° WSW...

## TIDES — Lisbon / Tagus Bar
HW1: 06:42 UTC — 2.31m (ZH)
LW1: 12:24 UTC — 0.52m (ZH)
...
**Passage window**: Depart 14:00 → seaward (Cascais)...

## MULTI-DAY FORECAST
| Date | Condition | Max°C | Rain % | Wind Max (kt) |
...
```

---

## 🔐 Secrets & CI

Se hospedar em seu próprio GitHub:

1. **Vá para**: Settings → Secrets and variables → Actions
2. **Adicione**:
   - `WINDY_API_KEY` — Obter em https://api.windy.com/
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_TO` (opcionais)

3. **Ative** Pages:
   - Settings → Pages → Source: **Deploy from a branch** → `master`

---

## 📚 Dependências

```json
{
  "marked": "^12.0.0",        // Markdown → HTML
  "nodemailer": "^8.0.1",     // SMTP
  "pdf-parse": "^2.4.5",      // (não usado atualmente)
  "pdfjs-dist": "^5.5.207"    // (não usado atualmente)
}
```

---

## 🌐 Links

- **Website**: https://martinsda.github.io/maritime-weather/
- **Repositório**: https://github.com/martinsda/maritime-weather
- **Windy API Docs**: https://api.windy.com/
- **Open-Meteo API**: https://open-meteo.com/
- **Porto de Lisboa — Marés**: https://www.portodelisboa.pt/mares

---

## 📄 Licença

MIT — Veja `LICENSE` se aplicável.

---

## 📝 Notas

- ⏰ Gerado automaticamente **todos os dias às 07:00 UTC**
- 🔄 Histórico completo em `/output/`
- 📧 Email enviado diariamente (se SMTP configurado)
- 🗺️ Adaptável a outras rotas/portos editando `CONFIG`
- 🎯 Objetivo: suportar decisões de navegação com dados atualizados de múltiplas fontes

---

**Criado com ⚓ para navegadores à vela.**
