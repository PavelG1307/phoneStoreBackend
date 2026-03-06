#!/usr/bin/env bash
# Дамп БД прода в дев.
# Требует: .env.prod и .env.dev с переменными DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
# Использование: ./scripts/dump-prod-to-dev.sh   или   npm run db:prod-to-dev

set -e
cd "$(dirname "$0")/.."

DUMP_FILE="${DUMP_FILE:-./dump.sql}"

# --- Дамп с продакшена ---
echo "Загрузка настроек из .env.prod..."
if ! [ -f .env.prod ]; then
  echo "Ошибка: создайте .env.prod с DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME"
  exit 1
fi
set -a
source .env.prod
set +a

echo "Дамп production БД в $DUMP_FILE..."
export PGPASSWORD="$DB_PASSWORD"
pg_dump -h "$DB_HOST" -p "${DB_PORT:-5432}" -U "$DB_USER" -d "$DB_NAME" \
  --clean --if-exists --no-owner --no-acl \
  -f "$DUMP_FILE"
unset PGPASSWORD

# --- Восстановление в дев ---
echo "Загрузка настроек из .env.dev..."
if ! [ -f .env.dev ]; then
  echo "Ошибка: создайте .env.dev с DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME"
  exit 1
fi
set -a
source .env.dev
set +a

echo "Восстановление в dev БД..."
export PGPASSWORD="$DB_PASSWORD"
psql -h "$DB_HOST" -p "${DB_PORT:-5432}" -U "$DB_USER" -d "$DB_NAME" -f "$DUMP_FILE" -q
unset PGPASSWORD

echo "Готово. Дамп сохранён в $DUMP_FILE (можно удалить или оставить для бэкапа)."
