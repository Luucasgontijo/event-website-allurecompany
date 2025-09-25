#!/bin/bash

# 🚀 Script de Setup Inicial para VPS
# Execute este script na sua VPS após fazer upload dos arquivos

set -e

echo "🎯 Allure Events - Setup de Produção"
echo "=================================="

# Variáveis (CONFIGURE ESTAS ANTES DE EXECUTAR)
DOMAIN="${DOMAIN:-31.97.40.181}"  # Usar IP como padrão ou domínio se configurado
EMAIL="${EMAIL:-admin@allure-events.com}"
PROJECT_DIR="/var/www/allure-events"

# Carregar variáveis de ambiente se existir arquivo
if [ -f .env.production ]; then
    source .env.production
    echo "📋 Carregadas variáveis do .env.production"
fi

echo "📋 Configurações:"
echo "   Domínio: $DOMAIN"
echo "   Email: $EMAIL"
echo "   Diretório: $PROJECT_DIR"
echo ""

read -p "🤔 As configurações estão corretas? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cancelado. Edite as variáveis no topo do script."
    exit 1
fi

echo "🚀 Iniciando setup..."

# 1. Atualizar sistema
echo "📦 Atualizando sistema..."
sudo apt update && sudo apt upgrade -y

# 2. Instalar Nginx
echo "🌐 Instalando Nginx..."
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx

# 3. Instalar Certbot para SSL
echo "🔒 Instalando Certbot..."
sudo apt install certbot python3-certbot-nginx -y

# 4. Configurar firewall
echo "🛡️ Configurando firewall..."
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
sudo ufw --force enable

# 5. Criar diretório do projeto
echo "📁 Criando diretório do projeto..."
sudo mkdir -p $PROJECT_DIR
sudo chown -R $USER:$USER $PROJECT_DIR

# 6. Configurar Nginx
echo "⚙️ Configurando Nginx..."
sudo tee /etc/nginx/sites-available/allure-events > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    root $PROJECT_DIR;
    index index.html;

    # Configuração para SPA (Single Page Application)
    location / {
        try_files \$uri \$uri/ /index.html;
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

    # Cabeçalhos de segurança
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
}
EOF

# 7. Ativar site
echo "🔗 Ativando site..."
sudo ln -sf /etc/nginx/sites-available/allure-events /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 8. Configurar SSL
echo "🔐 Configurando SSL com Let's Encrypt..."
sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --email $EMAIL --agree-tos --no-eff-email

# 9. Configurar renovação automática do SSL
echo "🔄 Configurando renovação automática do SSL..."
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -

# 10. Criar script de deploy
echo "📜 Criando script de deploy..."
tee $PROJECT_DIR/deploy.sh > /dev/null <<EOF
#!/bin/bash
# Script de deploy para Allure Events

echo "🚀 Iniciando deploy..."

cd $PROJECT_DIR

# Fazer backup
BACKUP_DIR="\${PROJECT_DIR}.backup.\$(date +%Y%m%d_%H%M%S)"
sudo cp -r $PROJECT_DIR \$BACKUP_DIR
echo "💾 Backup criado em: \$BACKUP_DIR"

# Aqui você pode adicionar comandos para atualizar o código
# Por exemplo, se usar Git:
# git pull origin main

echo "📁 Atualizando permissões..."
sudo chown -R www-data:www-data $PROJECT_DIR
sudo chmod -R 755 $PROJECT_DIR

echo "🔄 Recarregando Nginx..."
sudo systemctl reload nginx

echo "✅ Deploy concluído!"
EOF

chmod +x $PROJECT_DIR/deploy.sh

# 11. Configurar permissões
echo "🔐 Configurando permissões..."
sudo chown -R www-data:www-data $PROJECT_DIR
sudo chmod -R 755 $PROJECT_DIR

echo ""
echo "🎉 Setup concluído com sucesso!"
echo "================================"
echo ""
echo "📋 Próximos passos:"
echo "1. Faça upload dos arquivos do projeto para: $PROJECT_DIR"
echo "2. Execute: sudo chown -R www-data:www-data $PROJECT_DIR"
echo "3. Teste o site: https://$DOMAIN"
echo ""
echo "📁 Comandos úteis:"
echo "   Deploy: $PROJECT_DIR/deploy.sh"
echo "   Logs: sudo tail -f /var/log/nginx/access.log"
echo "   Status: sudo systemctl status nginx"
echo ""
echo "🔧 Para fazer upload dos arquivos:"
echo "   scp allure-events-dist.tar.gz usuario@$DOMAIN:$PROJECT_DIR/"
echo "   ssh usuario@$DOMAIN"
echo "   cd $PROJECT_DIR && tar -xzf allure-events-dist.tar.gz && mv dist/* . && rmdir dist"
echo ""