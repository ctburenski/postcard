#! /usr/bin/env bash
set -euo pipefail
trap 'echo Error received, destroying test environment; docker compose down -v > /dev/null' ERR 

echo "Running test"
docker-compose -f docker-compose.yml -f docker-compose.test.yml up -d --build --force-recreate > /dev/null
echo
echo
echo "Test results:"
echo
docker compose logs -f backend
# docker compose logs -f frontend
echo
echo
echo "Destroying test environment"
docker compose down -v > /dev/null
exit 1
