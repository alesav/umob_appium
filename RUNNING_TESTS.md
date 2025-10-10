# Running Tests in Different Environments

## ✅ Setup Complete!

`cross-env` has been installed and npm scripts have been added to `package.json`.

## How to Run Tests

### Test Environment (default)
```bash
npm run android.app.test
```
This uses credentials from `credentials.json["test"]`.

### Accept Environment
```bash
npm run android.app.test.accept
```
This uses credentials from `credentials.json["accept"]`.

### Production Environment
```bash
npm run android.app.test.prod
```
This uses credentials from `credentials.json["prod"]`.

## How It Works

1. The npm script sets `TEST_ENV` environment variable
2. Tests read this variable: `const ENV = process.env.TEST_ENV || "test"`
3. `getCredentials(ENV, USER)` loads the correct user credentials
4. `getApiConfig(ENV)` loads the correct API URL and auth token
5. All tests automatically use the right environment configuration

## Selecting Different Users

You can also specify which user to use:

```bash
# Test environment with specific user
cross-env TEST_USER=new45 npm run android.app.test

# Accept environment with specific user
cross-env TEST_ENV=accept TEST_USER=acceptUser1 npm run android.app.test

# Production environment with specific user
cross-env TEST_ENV=prod TEST_USER=prodUser1 npm run android.app.test
```

## Running from VSCode

You can run these commands:
1. From the integrated terminal (Ctrl+`)
2. From the NPM Scripts panel in VSCode Explorer
3. By clicking "Run Script" in package.json

All methods will work correctly with `cross-env`!

## What Gets Switched Automatically

When you change environments, the following automatically update:
- ✅ API URL (for fetching scooter coordinates)
- ✅ Auth Token (for API authentication)
- ✅ User credentials (username/password for login)

No code changes needed - just run the appropriate npm script!
