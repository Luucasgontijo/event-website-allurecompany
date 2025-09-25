# 🚀 Deploy Allure Events - Guia Específico

## 📋 Informações do Servidor
- **IP**: 31.97.40.181
- **Usuário**: root
- **SSH**: `ssh root@31.97.40.181`

## 🎯 Passos Rápidos para Deploy

### 1. **Upload dos Arquivos**
```bash
# Na sua máquina local (pasta do projeto)
cd /Users/luc/Documents/allure/allure-events-react

# Upload dos arquivos necessários
scp allure-events-dist.tar.gz root@31.97.40.181:/tmp/
scp setup-vps.sh root@31.97.40.181:/tmp/
```

### 2. **Conectar no Servidor**
```bash
ssh root@31.97.40.181
```

### 3. **Executar Setup (no servidor)**
```bash
# Ir para pasta dos arquivos
cd /tmp

# Tornar script executável
chmod +x setup-vps.sh

# IMPORTANTE: Editar o script para colocar seu domínio
nano setup-vps.sh
# Alterar as linhas:
# DOMAIN="seu-dominio.com"  # Coloque seu domínio real
# EMAIL="seu-email@exemplo.com"  # Coloque seu email real

# Executar setup automático
./setup-vps.sh
```

### 4. **Fazer Deploy dos Arquivos (no servidor)**
```bash
# Ir para diretório do projeto
cd /var/www/allure-events

# Extrair arquivos do projeto
tar -xzf /tmp/allure-events-dist.tar.gz

# Mover arquivos para lugar correto
mv dist/* .
rmdir dist

# Configurar permissões
chown -R www-data:www-data .
chmod -R 755 .
```

### 5. **Testar**
- Acesse seu domínio no navegador
- Ou acesse pelo IP temporariamente: http://31.97.40.181

## 🔧 Comandos Úteis para seu Servidor

### Verificar Status
```bash
# Status do Nginx
systemctl status nginx

# Logs em tempo real
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Testar configuração do Nginx
nginx -t
```

### Gerenciar Nginx
```bash
# Iniciar
systemctl start nginx

# Parar
systemctl stop nginx

# Reiniciar
systemctl restart nginx

# Recarregar configuração
systemctl reload nginx
```

### Atualizar Site
```bash
# Script de deploy rápido
cd /var/www/allure-events
./deploy.sh
```

## 🌐 Configuração de Domínio

### Se você tem um domínio:
1. **Configure o DNS** apontando para: `31.97.40.181`
2. **Aguarde propagação** (pode levar até 24h)
3. **Execute o setup** com seu domínio no script

### Se ainda não tem domínio:
1. **Use o IP temporariamente** para testar
2. **Configure domínio depois** e execute SSL

## 🔐 SSL/HTTPS

### Com domínio configurado:
```bash
# Instalar certificado SSL
certbot --nginx -d seudominio.com -d www.seudominio.com

# Renovar certificados
certbot renew
```

## 📊 Monitoramento

### Verificar uso do sistema:
```bash
# CPU e memória
htop

# Espaço em disco
df -h

# Processos do Nginx
ps aux | grep nginx
```

## 🔧 Troubleshooting Comum

### Site não carrega:
```bash
# Verificar se Nginx está rodando
systemctl status nginx

# Verificar configuração
nginx -t

# Ver logs de erro
tail -f /var/log/nginx/error.log
```

### Permissões:
```bash
# Corrigir permissões
cd /var/www/allure-events
chown -R www-data:www-data .
chmod -R 755 .
```

### Firewall:
```bash
# Verificar firewall
ufw status

# Permitir HTTP/HTTPS
ufw allow 80
ufw allow 443
ufw allow ssh
```

## 📱 Próximos Passos

1. ✅ **Execute o setup automático**
2. ✅ **Faça deploy dos arquivos**
3. ✅ **Teste pelo IP ou domínio**
4. ✅ **Configure Google Apps Script**
5. ✅ **Teste formulário completo**
6. ✅ **Configure SSL se tiver domínio**

---

## 🆘 Comandos de Emergência

```bash
# Resetar Nginx para configuração padrão
rm /etc/nginx/sites-enabled/allure-events
systemctl reload nginx

# Backup do site atual
cp -r /var/www/allure-events /var/www/allure-events.backup.$(date +%Y%m%d)

# Restaurar backup
# cp -r /var/www/allure-events.backup.YYYYMMDD /var/www/allure-events
```

**Está tudo pronto! Execute os passos acima e seu site estará no ar! 🚀**