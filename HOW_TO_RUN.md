# Запуск тестов в разных средах

## Конфигурация

Все настройки для разных сред находятся в `config/credentials.json`:

```json
{
    "test": {
        "apiUrl": "...",
        "authToken": "Bearer ...",
        "new12": { "username": "...", "password": "..." }
    },
    "accept": {
        "apiUrl": "...",
        "authToken": "Bearer ...",
        "acceptUser1": { "username": "...", "password": "..." }
    },
    "prod": {
        "apiUrl": "...",
        "authToken": "Bearer ...",
        "prodUser1": { "username": "...", "password": "..." }
    }
}
```

## Запуск тестов

### Test среда (по умолчанию):
```bash
npm test tests/specs/account/combinedLoggedTest.spec.ts
# или с явным указанием
TEST_ENV=test TEST_USER=new12 npm test tests/specs/account/combinedLoggedTest.spec.ts
```

### Accept среда:
```bash
TEST_ENV=accept TEST_USER=acceptUser1 npm test tests/specs/account/combinedLoggedTest.spec.ts
```

### Prod среда:
```bash
TEST_ENV=prod TEST_USER=prodUser1 npm test tests/specs/account/combinedLoggedTest.spec.ts
```

### Запуск всех тестов скопом:
```bash
# Test среда
npm test tests/specs/account/*.spec.ts

# Accept среда
TEST_ENV=accept TEST_USER=acceptUser1 npm test tests/specs/account/*.spec.ts

# Prod среда
TEST_ENV=prod TEST_USER=prodUser1 npm test tests/specs/account/*.spec.ts
```

## Добавление новых пользователей

Просто добавьте в `credentials.json` в нужную среду:

```json
"test": {
    "apiUrl": "...",
    "authToken": "...",
    "newUser": {
        "username": "newuser@gmail.com",
        "password": "Password123!"
    }
}
```

И запускайте:
```bash
TEST_ENV=test TEST_USER=newUser npm test
```

## Что нужно менять для новых сред

В `credentials.json` добавьте новую среду:
1. `apiUrl` - URL API для этой среды
2. `authToken` - Bearer токен для API
3. Пользователей с логинами/паролями

Всё! Больше нигде ничего менять не нужно.
