# Deploy no EasyPanel

## 1. Suba o código para o GitHub
O EasyPanel vai fazer o build automaticamente a partir do Dockerfile.

## 2. Crie um novo serviço no EasyPanel
- Tipo: **App**
- Source: GitHub (seu repositório)
- Build: detecta o Dockerfile automaticamente

## 3. Configure as Variáveis de Ambiente
No painel do serviço, vá em **Environment** e adicione:

### Obrigatórias
```
NEXT_PUBLIC_BASE_URL=https://SEU-DOMINIO.com        ← URL real do seu site (com https)
ADMIN_PASSWORD=uma_senha_forte_aqui                 ← senha do painel admin (mín. 12 chars)
```

### E-mail de notificação (opcional — para receber e-mail a cada pedido)
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seuemail@gmail.com
SMTP_PASS=sua_senha_de_app_gmail
SMTP_NOTIFY_EMAIL=dona@afroditejoias.com.br
```
> Gmail: crie uma "Senha de App" em https://myaccount.google.com/apppasswords

### Evolution API — WhatsApp (opcional — configure também no painel admin)
```
EVOLUTION_URL=https://evolution.seuservidor.com
EVOLUTION_API_KEY=sua_api_key
EVOLUTION_INSTANCE=nome_da_instancia
EVOLUTION_OWNER_PHONE=5511999999999
```

## 4. Configure os Volumes (persistência de dados — OBRIGATÓRIO)
Sem os volumes, **todos os dados são perdidos** a cada redeploy!

Em **Volumes**, adicione:
| Container Path | O que guarda |
|---|---|
| `/app/data` | Produtos, pedidos, clientes, cupons, configurações |
| `/app/public/uploads` | Fotos dos produtos enviadas pelo admin |

## 5. Porta
- Porta interna: **3000**

## 6. Domínio
Configure seu domínio em **Domains** → aponta para a porta 3000.
Ative HTTPS no EasyPanel (certificado Let's Encrypt automático).

---

## Acesso ao Painel Admin
Após o deploy, acesse: `https://SEU-DOMINIO.com/admin`
- Senha: o valor que você definiu em `ADMIN_PASSWORD`

> ⚠️ **Nunca deixe `ADMIN_PASSWORD` em branco** — o sistema não permite acesso sem senha definida.

---

## Primeira configuração após deploy
1. Acesse `/admin/configuracoes`
2. Preencha o número de WhatsApp da loja (campo "Dados da Loja")
3. Adicione os produtos em `/admin/produtos`
4. Configure o Evolution API se quiser receber notificações no WhatsApp
