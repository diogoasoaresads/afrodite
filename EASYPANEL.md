# Deploy no EasyPanel

## 1. Suba o código para o GitHub
O EasyPanel vai fazer o build automaticamente a partir do Dockerfile.

## 2. Crie um novo serviço no EasyPanel
- Tipo: **App**
- Source: GitHub (seu repositório)
- Build: detecta o Dockerfile automaticamente

## 3. Configure as Variáveis de Ambiente
No painel do serviço, vá em **Environment** e adicione:

```
MP_ACCESS_TOKEN=APP_USR-xxxx-xxxx-xxxx-xxxx        ← seu token do Mercado Pago
MP_PUBLIC_KEY=APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxx ← sua public key do MP
NEXT_PUBLIC_MP_PUBLIC_KEY=APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxx
NEXT_PUBLIC_BASE_URL=https://SEU-DOMINIO.com        ← URL do seu site
ADMIN_PASSWORD=sua_senha_secreta_aqui               ← senha do painel admin
```

Pegue as credenciais em: https://www.mercadopago.com.br/developers/panel

## 4. Configure o Volume (persistência de dados)
Em **Volumes**, adicione:
- Container Path: `/app/data`   → para salvar pedidos e produtos
- Container Path: `/app/public/uploads` → para as fotos enviadas

## 5. Porta
- Porta interna: **3000**

## 6. Domínio
Configure seu domínio em **Domains** → aponta para a porta 3000.

---

## Acesso ao Painel Admin
Após o deploy, acesse: `https://SEU-DOMINIO.com/admin`
- Senha: o valor que você definiu em `ADMIN_PASSWORD`
