<div align="center">
<img src="https://github.com/HugoaMoraes/IconDigital/assets/102623594/a6c43865-6821-472b-9c05-65878d4e8780" width="200px" />
</div>

# Calculadora de Serviços de Digitalização - API

Esta é a API do sistema de cálculo de tempo para serviços de digitalização. A API fornece endpoints para calcular tempos de serviço e gerar relatórios em PDF.

## Autor

- [@hugo.amoraes](https://github.com/HugoaMoraes)

## Versão

`v.3.0.0`

## Links

<div align="center">
  <a href="https://linktr.ee/hug.odesign" target="_blank">
    <img src="https://img.shields.io/static/v1?message=Linktree&logo=linktree&label=&color=1de9b6&logoColor=white&labelColor=&style=for-the-badge" height="25" alt="linktree logo"  />
  </a>
  <a href="https://www.linkedin.com/in/hugoamoraes/" target="_blank">
    <img src="https://img.shields.io/static/v1?message=LinkedIn&logo=linkedin&label=&color=0077B5&logoColor=white&labelColor=&style=for-the-badge" height="25" alt="linkedin logo"  />
  </a>
  <a href="https://api.whatsapp.com/send?phone=5561986391903" target="_blank">
    <img src="https://img.shields.io/static/v1?message=Whatsapp&logo=whatsapp&label=&color=25D366&logoColor=white&labelColor=&style=for-the-badge" height="25" alt="whatsapp logo"  />
  </a>
  <a href="https://www.instagram.com/hugo.amoraes/" target="_blank">
    <img src="https://img.shields.io/static/v1?message=Instagram&logo=instagram&label=&color=E4405F&logoColor=white&labelColor=&style=for-the-badge" height="25" alt="instagram logo"  />
  </a>
</div>

## Endpoints

### POST /api/calcular

Calcula os tempos estimados para os serviços de digitalização.

Exemplo de requisição:

```json
{
  "servicos": {
    "digitalizacao": {
      "paginas": 100,
      "tempoScanner": 10
    },
    "indexacao": {
      "quantidade": 50,
      "tempoPorArquivo": 10
    },
    "caixas": 5
  }
}
```

### POST /api/gerar-pdf

Gera um relatório PDF com os detalhes do serviço.

Exemplo de requisição:

```json
{
  "cadastro": {
    "nomeUsuario": "João Silva",
    "data": "2024-03-15",
    "nomeCliente": "Empresa ABC",
    "setor": "Arquivo"
  },
  "servicos": {
    "digitalizacao": {
      "paginas": 100,
      "tempoScanner": 10
    },
    "indexacao": {
      "quantidade": 50,
      "tempoPorArquivo": 10
    },
    "caixas": 5
  },
  "resultados": {
    "preparacao": "5.00",
    "digitalizacao": "0.17",
    "indexacao": "0.08",
    "remontagem": "3.75",
    "totalComMargem": "9.90"
  }
}
```

### GET /api/health

Endpoint de verificação de saúde da API.

## Como usar DEV

1. Instale as dependências:

```bash
npm install
```

2. Inicie o servidor DEV:

```bash
npm run dev
```

3. O servidor estará disponível em:

```bash
http://localhost:5173
```

4. Build:

```bash
npm run build
```

## Como usar PROD

1. Instale as dependências:

```bash
npm install
```

2. Inicie o servidor RECT:

```bash
node src/server.js
```

3. O servidor estará disponível em:

```bash
http://localhost:3001
```

## Screenshots

<div align="center">
<img src="https://github.com/user-attachments/assets/393d29a3-c3ba-4f5d-bd8d-edf80c9e9d81" width="auto" />
</div>

<div align="center">
<img src="https://github.com/user-attachments/assets/b5b70d9c-0560-4ccd-9a89-9ed7c0f7409f" width="auto" />
</div>

<div align="center">
<img src="https://github.com/user-attachments/assets/0ad142c0-e1b3-4d09-9d0c-8fa64866cf12" width="auto" />
</div>

## Diagrama

<div align="center">
<img src="https://github.com/user-attachments/assets/24d83928-5861-48b8-b6d7-c9f925b4eca5" width="auto" />
<img src="https://github.com/user-attachments/assets/2f2b6915-da67-4c03-bdf8-21f07f736091" width="auto" />
</div>

## Informações:

MVP em funcionamento!
