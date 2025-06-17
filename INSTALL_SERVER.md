# Comandos para configurações iniciais do servidor

### 1- O comando abaixo é utilizado para importar o arquivo de instalação do node manager:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```

### 2- O comando abaixo atualiza o gerenciador de pacotes do linux e o próprio linux:

```bash
sudo apt update
sudo apt upgrade
```

### 3- O comando abaixo é utilizado para atualizar o postgree pra última versão:

```bash
sudo apt install curl ca-certificates
sudo install -d /usr/share/postgresql-common/pgdg
sudo curl -o /usr/share/postgresql-common/pgdg/apt.postgresql.org.asc --fail https://www.postgresql.org/media/keys/ACCC4CF8.asc
. /etc/os-release
sudo sh -c "echo 'deb [signed-by=/usr/share/postgresql-common/pgdg/apt.postgresql.org.asc] https://apt.postgresql.org/pub/repos/apt $VERSION_CODENAME-pgdg main' > /etc/apt/sources.list.d/pgdg.list"
sudo apt update
sudo apt -y install postgresql-17
```

### 4- O comando abaixo é utilizado para instalar o certbot para depois ser gerado os certificados SSL do domínio:

```bash
sudo apt-get install certbot python3-certbot-nginx
```

 

### 5- O comando abaixo é utilizado para instalar a ultima versão estável do node usando nvm

```bash
nvm install latest
```

### 6- O comando abaixo é utilizado para setar a última versão estável do node usando nvm

```bash
nvm use default
```

### 6- O comando abaixo é utilizado para gerar o certificado com o certbot

```bash
nvm use default
```

### 7- O comando abaixo é utilizado para mover o diretório para dentro do dir do nginx

```bash
cd /etc/nginx/sites-available/
```

### 8- Abrir a configuração do nginx com o comando abaixo:

```bash
nano defaul
```

### 9- Caminho do certificado  na Máquina Virtual que deve ser inserido no nginx:

```bash
/etc/letsencrypt/live/www.atacanet.com.br/fullchain.pem

/etc/letsencrypt/live/www.atacanet.com.br/privkey.pem
```

f1

### 10- Salvar as alterações e rodar o comando para reiniciar o nginx:

```bash
systemctl reload nginx
```
