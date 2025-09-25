#!/bin/bash

# 🚀 Script de Deploy Automático via Git
# Execute este script no servidor para fazer deploy

set -e

# Configurações
PROJECT_DIR="/var/www/allure-events"
GIT_REPO="https://github.com/seu-usuario/allure-events-react.git"  # CONFIGURAR SEU REPO
BRANCH="main"
BACKUP_DIR="/var/backups/allure-events"

echo "🚀 Allure Events - Deploy Automático"
echo "===================================="

# Função para criar backup
create_backup() {
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_path="${BACKUP_DIR}/backup_${timestamp}"
    
    echo "💾 Criando backup..."
    sudo mkdir -p "$BACKUP_DIR"
    
    if [ -d "$PROJECT_DIR" ]; then
        sudo cp -r "$PROJECT_DIR" "$backup_path"
        echo "✅ Backup criado em: $backup_path"
    else
        echo "⚠️  Diretório do projeto não existe ainda"
    fi
}

# Função para instalar Node.js se necessário
install_nodejs() {
    if ! command -v node &> /dev/null; then
        echo "📦 Instalando Node.js..."
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
    else
        echo "✅ Node.js já instalado: $(node --version)"
    fi
}

# Função para clonar ou atualizar repositório
update_repository() {
    if [ ! -d "$PROJECT_DIR/.git" ]; then
        echo "📥 Clonando repositório..."
        sudo rm -rf "$PROJECT_DIR"
        sudo git clone "$GIT_REPO" "$PROJECT_DIR"
        sudo chown -R $USER:$USER "$PROJECT_DIR"
    else
        echo "🔄 Atualizando repositório..."
        cd "$PROJECT_DIR"
        git fetch origin
        git reset --hard origin/$BRANCH
    fi
}

# Função para configurar ambiente
setup_environment() {
    cd "$PROJECT_DIR"
    
    echo "⚙️ Configurando ambiente..."
    
    # Verificar se existe .env.production
    if [ ! -f ".env.production" ]; then
        echo "📝 Criando arquivo .env.production..."
        cat > .env.production << EOF
# Configurações de Produção - Gerado automaticamente
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/SEU_SCRIPT_ID_AQUI/exec
VITE_APP_TITLE=Allure Events Admin
VITE_APP_VERSION=1.0.0
VITE_PRODUCTION_URL=https://$(hostname -I | awk '{print $1}')
VITE_API_BASE_URL=https://script.google.com/macros/s
EOF
        echo "⚠️  Configure o VITE_GOOGLE_SCRIPT_URL no arquivo .env.production"
    fi
}

# Função para build da aplicação
build_application() {
    cd "$PROJECT_DIR"
    
    echo "📦 Instalando dependências..."
    npm ci --only=production
    
    echo "🔨 Fazendo build da aplicação..."
    npm run build
    
    echo "📁 Movendo arquivos para produção..."
    # Backup dos arquivos atuais se existirem
    if [ -f "index.html" ]; then
        rm -rf .backup_temp
        mkdir .backup_temp
        mv index.html assets/ .backup_temp/ 2>/dev/null || true
    fi
    
    # Mover arquivos do build
    mv dist/* .
    rmdir dist
    
    echo "✅ Build concluído!"
}

# Função para configurar permissões
setup_permissions() {
    echo "🔐 Configurando permissões..."
    sudo chown -R www-data:www-data "$PROJECT_DIR"
    sudo chmod -R 755 "$PROJECT_DIR"
    
    # Manter permissões de escrita para deploy
    sudo chmod -R g+w "$PROJECT_DIR"
    sudo usermod -a -G www-data $USER
}

# Função para recarregar Nginx
reload_nginx() {
    echo "🔄 Recarregando Nginx..."
    sudo nginx -t
    sudo systemctl reload nginx
    echo "✅ Nginx recarregado!"
}

# Função para verificar status
check_status() {
    echo "🏥 Verificando status dos serviços..."
    
    # Verificar Nginx
    if systemctl is-active --quiet nginx; then
        echo "✅ Nginx: Ativo"
    else
        echo "❌ Nginx: Inativo"
    fi
    
    # Verificar certificado SSL (se existir)
    if [ -f "/etc/letsencrypt/live/*/cert.pem" ]; then
        local cert_path=$(ls /etc/letsencrypt/live/*/cert.pem 2>/dev/null | head -1)
        if [ -n "$cert_path" ]; then
            local expiry=$(openssl x509 -enddate -noout -in "$cert_path" | cut -d= -f2)
            echo "🔒 SSL: Válido até $expiry"
        fi
    fi
    
    # Verificar arquivos do projeto
    if [ -f "$PROJECT_DIR/index.html" ]; then
        echo "✅ Aplicação: Arquivos encontrados"
    else
        echo "❌ Aplicação: Arquivos não encontrados"
    fi
}

# Função principal
main() {
    echo "🎯 Iniciando deploy..."
    
    # Verificar se está rodando como usuário correto
    if [ "$EUID" -eq 0 ]; then
        echo "❌ Não execute este script como root!"
        echo "   Use: bash deploy-git.sh"
        exit 1
    fi
    
    # Executar etapas
    create_backup
    install_nodejs
    update_repository
    setup_environment
    build_application
    setup_permissions
    reload_nginx
    check_status
    
    echo ""
    echo "🎉 Deploy concluído com sucesso!"
    echo "================================="
    echo ""
    echo "🌐 Acesse sua aplicação:"
    local server_ip=$(hostname -I | awk '{print $1}')
    echo "   HTTP:  http://$server_ip"
    echo "   HTTPS: https://$server_ip (se SSL configurado)"
    echo ""
    echo "📋 Próximos passos:"
    echo "   1. Configure VITE_GOOGLE_SCRIPT_URL em $PROJECT_DIR/.env.production"
    echo "   2. Execute: cd $PROJECT_DIR && npm run build && sudo systemctl reload nginx"
    echo "   3. Teste o formulário de eventos"
    echo ""
    echo "📊 Logs úteis:"
    echo "   Nginx: sudo tail -f /var/log/nginx/access.log"
    echo "   Errors: sudo tail -f /var/log/nginx/error.log"
    echo ""
}

# Executar script principal
main "$@"