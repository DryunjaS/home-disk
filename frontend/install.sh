#!/usr/bin/env bash

# Загружаем переменные из .env
set -o allexport
source .env
set +o allexport

echo $DB_USER $DB_PASSWORD $DB_NAME $DB_HOST $DB_PORT

# Проверяем, заданы ли переменные
if [[ -z "$DB_USER" || -z "$DB_PASSWORD" || -z "$DB_NAME" ]]; then
  echo "❌ Ошибка: не все переменные окружения загружены!"
  echo "Проверьте файл .env и убедитесь, что он содержит:"
  echo "DB_USER=username"
  echo "DB_PASSWORD=password"
  echo "DB_NAME=database"
  exit 1
fi

GREEN="\033[0;32m"
DEFAULT="\033[39m"

print_green(){
  echo -e "${GREEN}${1}${DEFAULT}"
}

print_green "Обновление системы.."
sudo apt update

print_green "Установка Node.."
sudo apt install -y curl ca-certificates
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
source ~/.bashrc
nvm install 22.11.0

npm install -g pm2

print_green "Установка базы данных.."
sudo apt install -y curl ca-certificates
sudo install -d /usr/share/postgresql-common/pgdg
sudo curl -o /usr/share/postgresql-common/pgdg/apt.postgresql.org.asc --fail https://www.postgresql.org/media/keys/ACCC4CF8.asc
sudo sh -c 'echo "deb [signed-by=/usr/share/postgresql-common/pgdg/apt.postgresql.org.asc] https://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
sudo apt update
sudo apt -y install postgresql

print_green "Настройка базы данных.."
# Настройка PostgreSQL через одну команду
sudo -u postgres psql -c "CREATE USER \"$DB_USER\" WITH PASSWORD '$DB_PASSWORD';"
echo "Пользователь $DB_USER успешно создан"

sudo -u postgres psql -c "CREATE DATABASE \"$DB_NAME\" OWNER \"$DB_USER\";"
echo "БД $DB_NAME успешно создана"

sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE \"$DB_NAME\" TO \"$DB_USER\";"
echo "Привилегии для БД $DB_NAME успешно переданы пользователю $DB_USER"



print_green "Запуск приложения.."
env $(cat .env | xargs) npm run start
