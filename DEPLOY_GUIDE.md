# Guia de Deploy - Allure Events Admin

## 📋 Pré-requisitos na VPS

1. **Servidor Web** (Nginx recomendado)
2. **Node.js** (para servir arquivos estáticos - opcional)
3. **SSL Certificate** (Let's Encrypt gratuito)
4. **Domínio** configurado apontando para sua VPS

## 🚀 Passo 1: Preparar Arquivos para Upload

Os arquivos de produção estão na pasta `dist/`:
```bash
# Na sua máquina local, comprimir arquivos para upload
cd /Users/luc/Documents/allure/allure-events-react
tar -czf allure-events-dist.tar.gz dist/
```

## 🖥️ Passo 2: Configurar VPS

### 2.1 Conectar na VPS
```bash
ssh usuario@seu-servidor.com
# ou
ssh usuario@IP_DA_VPS
```

### 2.2 Instalar Nginx (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 2.3 Criar diretório do projeto
```bash
sudo mkdir -p /var/www/allure-events
sudo chown -R $USER:$USER /var/www/allure-events
```

## 📁 Passo 3: Upload dos Arquivos

### Opção A: SCP (da sua máquina local)
```bash
# Upload do arquivo comprimido
scp allure-events-dist.tar.gz usuario@seu-servidor:/var/www/allure-events/

# Na VPS, extrair arquivos
ssh usuario@seu-servidor
cd /var/www/allure-events
tar -xzf allure-events-dist.tar.gz
mv dist/* .
rmdir dist
rm allure-events-dist.tar.gz
```

### Opção B: Git (na VPS)
```bash
cd /var/www/allure-events
git clone https://github.com/seu-usuario/allure-events-react.git .
npm install
npm run build
mv dist/* .
rmdir dist
```

## 🌐 Passo 4: Configurar Nginx

### 4.1 Criar configuração do site
```bash
sudo nano /etc/nginx/sites-available/allure-events
```

### 4.2 Configuração Nginx
```nginx
server {
    listen 80;
    server_name seu-dominio.com www.seu-dominio.com;
    root /var/www/allure-events;
    index index.html;

    # Configuração para SPA (Single Page Application)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Otimizações para arquivos estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }

    # Compressão GZIP
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;
}
```

### 4.3 Ativar site
```bash
sudo ln -s /etc/nginx/sites-available/allure-events /etc/nginx/sites-enabled/
sudo nginx -t  # Testar configuração
sudo systemctl reload nginx
```

## 🔒 Passo 5: Configurar SSL (HTTPS)

### 5.1 Instalar Certbot
```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 5.2 Obter certificado SSL
```bash
sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com
```

### 5.3 Renovação automática
```bash
sudo crontab -e
# Adicionar linha:
0 12 * * * /usr/bin/certbot renew --quiet
```

## ⚙️ Passo 6: Configurar Variáveis de Ambiente

### 6.1 Configurar Google Apps Script URL
Antes do build, configure a URL do seu Google Apps Script:

```bash
# Criar arquivo .env.production
echo "VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/SEU_SCRIPT_ID/exec" > .env.production
```

## 🔄 Passo 7: Script de Atualização

### 7.1 Criar script de deploy
```bash
nano deploy.sh
```

```bash
#!/bin/bash
# Script de deploy automático

echo "🚀 Iniciando deploy..."

# Fazer backup
sudo cp -r /var/www/allure-events /var/www/allure-events.backup.$(date +%Y%m%d_%H%M%S)

# Atualizar código
cd /var/www/allure-events
git pull origin main

# Instalar dependências e build
npm install
npm run build

# Mover arquivos de produção
rm -rf static_backup
mkdir static_backup
mv *.html *.js *.css assets/ static_backup/ 2>/dev/null || true
mv dist/* .
rmdir dist

# Recarregar Nginx
sudo systemctl reload nginx

echo "✅ Deploy concluído!"
```

```bash
chmod +x deploy.sh
```

## 🧪 Passo 8: Testar

1. **Testar HTTP**: `http://seu-dominio.com`
2. **Testar HTTPS**: `https://seu-dominio.com`
3. **Testar funcionalidades do formulário**

## 📊 Passo 9: Monitoramento

### 9.1 Logs do Nginx
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 9.2 Status do serviço
```bash
sudo systemctl status nginx
```

## 🔧 Troubleshooting

### Problema: Página não carrega
```bash
# Verificar permissões
sudo chown -R www-data:www-data /var/www/allure-events
sudo chmod -R 755 /var/www/allure-events
```

### Problema: Rotas não funcionam
- Verificar se a configuração `try_files $uri $uri/ /index.html;` está presente

### Problema: SSL não funciona
```bash
sudo certbot certificates
sudo certbot renew --dry-run
```

## 📱 Configurações Adicionais

### Configurar firewall
```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
sudo ufw enable
```

### Configurar backup automático
```bash
# Adicionar ao crontab
0 2 * * * tar -czf /backups/allure-events-$(date +\%Y\%m\%d).tar.gz /var/www/allure-events
```

## 🌟 Próximos Passos

1. **Configurar domínio personalizado**
2. **Configurar Google Apps Script com URL de produção**
3. **Testar todas as funcionalidades**
4. **Configurar monitoramento de uptime**
5. **Configurar analytics (Google Analytics)**

---

## 📞 Comandos Rápidos

```bash
# Deploy rápido
./deploy.sh

# Verificar status
sudo systemctl status nginx
sudo certbot certificates

# Logs
sudo tail -f /var/log/nginx/access.log

# Backup manual
sudo tar -czf /tmp/allure-backup-$(date +%Y%m%d).tar.gz /var/www/allure-events
```