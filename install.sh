#!/usr/bin/env bash

sed -i 's/\r//' .env
set -o allexport
source ./backend/.env
set +o allexport

echo "Переменные загружены:"
echo "DB_USER=$DB_USER"
echo "DB_PASSWORD=$DB_PASSWORD"
echo "DB_NAME=$DB_NAME"
echo "DB_HOST=$DB_HOST"
echo "DB_PORT=$DB_PORT"

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

print_green "Сборка приложения.."

cd backend
npm install
npm install -g typescript 
npm install --save-dev @types/node 
tsc

cd ../frontend
sed -i 's|http://localhost:5000/|/|' .env
npm install
npm install -g pm2
npm run build


print_green "Копирование.."
cp -r ./dist ../backend/dist/
cd ../backend
ls -al .

print_green "Установка базы данных.."
sudo apt install -y curl ca-certificates
sudo install -d /usr/share/postgresql-common/pgdg
sudo curl -o /usr/share/postgresql-common/pgdg/apt.postgresql.org.asc --fail https://www.postgresql.org/media/keys/ACCC4CF8.asc
sudo sh -c 'echo "deb [signed-by=/usr/share/postgresql-common/pgdg/apt.postgresql.org.asc] https://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
sudo apt update
sudo apt -y install postgresql

print_green "Настройка базы данных.."

USER_EXISTS=$(sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'")
if [ "$USER_EXISTS" != "1" ]; then
    sudo -u postgres psql -c "CREATE USER \"$DB_USER\" WITH PASSWORD '$DB_PASSWORD';"
    echo "Пользователь $DB_USER создан"
else
    echo "Пользователь $DB_USER уже существует"
    sudo -u postgres psql -c "ALTER USER \"$DB_USER\" WITH PASSWORD '$DB_PASSWORD';"
fi

DB_EXISTS=$(sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'")
if [ "$DB_EXISTS" != "1" ]; then
    sudo -u postgres psql -c "CREATE DATABASE \"$DB_NAME\" OWNER \"$DB_USER\";"
    echo "База данных $DB_NAME создана"
else
    echo "База данных $DB_NAME уже существует"
fi

sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE \"$DB_NAME\" TO \"$DB_USER\";"
echo "Привилегии для базы $DB_NAME переданы пользователю $DB_USER"

print_green "Запуск приложения.."

env $(cat .env | xargs) pm2 start ./dist/server.js
