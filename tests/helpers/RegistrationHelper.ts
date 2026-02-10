import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generate random phone number (9 digits)
 * @returns {string} Random 9-digit phone number
 */
export function generateRandomPhone(): string {
    const phone = Math.floor(100000000 + Math.random() * 900000000).toString();
    console.log(`📱 Generated phone number: +31${phone}`);
    return phone;
}

/**
 * Generate random email in format: new{5 digits}@gmail.com
 * @returns {string} Random email address
 */
export function generateRandomEmail(): string {
    const randomDigits = Math.floor(10000 + Math.random() * 90000).toString();
    const email = `new${randomDigits}@gmail.com`;
    console.log(`📧 Generated email: ${email}`);
    return email;
}

/**
 * Save registration data to credentials.json
 * @param {string} email - User email
 * @param {string} phone - User phone number (9 digits)
 * @param {string} password - User password (default: "123Qwerty!")
 * @param {string} environment - Environment name (default: "test")
 */
export function saveRegistrationData(
    email: string,
    phone: string,
    password: string = "123Qwerty!",
    environment: string = "test",
): void {
    try {
        const credentialsPath = path.resolve(
            __dirname,
            "../../config/credentials.json",
        );

        // Read existing credentials
        const credentials = JSON.parse(
            fs.readFileSync(credentialsPath, "utf8"),
        );

        // Extract user key from email (e.g., "new12345" from "new12345@gmail.com")
        const userKey = email.split("@")[0];

        // Ensure environment exists
        if (!credentials[environment]) {
            credentials[environment] = {};
        }

        // Add new user to environment
        credentials[environment][userKey] = {
            username: email,
            password: password,
            phone: phone,
            createdAt: new Date().toISOString(),
        };

        // Save updated credentials with formatting
        fs.writeFileSync(credentialsPath, JSON.stringify(credentials, null, 4));

        console.log("\n" + "=".repeat(60));
        console.log("💾 REGISTRATION DATA SAVED TO CREDENTIALS.JSON");
        console.log("=".repeat(60));
        console.log(`Environment: ${environment}`);
        console.log(`User Key:    ${userKey}`);
        console.log(`Email:       ${email}`);
        console.log(`Phone:       +31${phone}`);
        console.log(`Password:    ${password}`);
        console.log(`Created:     ${new Date().toLocaleString()}`);
        console.log(`Location:    ${credentialsPath}`);
        console.log("=".repeat(60) + "\n");
    } catch (error) {
        console.error("❌ Failed to save registration data:", error);
        throw error;
    }
}

/**
 * Get the last registered user from credentials.json
 * @param {string} environment - Environment name (default: "test")
 * @returns {object} User credentials object or null
 */
export function getLastRegisteredUser(environment: string = "test"): any {
    try {
        const credentialsPath = path.resolve(
            __dirname,
            "../../config/credentials.json",
        );

        const credentials = JSON.parse(
            fs.readFileSync(credentialsPath, "utf8"),
        );

        if (!credentials[environment]) {
            console.log(`No users found in ${environment} environment`);
            return null;
        }

        // Get all users with createdAt timestamp
        const users = Object.entries(credentials[environment])
            .filter(([key, value]: [string, any]) => value.createdAt)
            .sort(
                ([, a]: [string, any], [, b]: [string, any]) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime(),
            );

        if (users.length === 0) {
            console.log(
                `No users with timestamp found in ${environment} environment`,
            );
            return null;
        }

        const [userKey, userData] = users[0];

        console.log("\n" + "=".repeat(60));
        console.log("👤 LAST REGISTERED USER");
        console.log("=".repeat(60));
        console.log(`User Key: ${userKey}`);
        console.log(`Email:    ${userData.username}`);
        console.log(`Phone:    +31${userData.phone || "N/A"}`);
        console.log(`Password: ${userData.password}`);
        console.log(
            `Created:  ${new Date(userData.createdAt).toLocaleString()}`,
        );
        console.log("=".repeat(60) + "\n");

        return {
            userKey,
            ...userData,
        };
    } catch (error) {
        console.error("❌ Failed to get last registered user:", error);
        return null;
    }
}

/**
 * Log registration info in a formatted way
 * @param {string} email - User email
 * @param {string} phone - User phone number
 * @param {string} password - User password
 */
export function logRegistrationInfo(
    email: string,
    phone: string,
    password: string,
): void {
    console.log("\n" + "═".repeat(60));
    console.log("🎉 REGISTRATION SUCCESSFUL");
    console.log("═".repeat(60));
    console.log("You can now login manually with these credentials:");
    console.log("");
    console.log(`   📧 Email:    ${email}`);
    console.log(`   📱 Phone:    +31${phone}`);
    console.log(`   🔑 Password: ${password}`);
    console.log("");
    console.log("These credentials are saved in config/credentials.json");
    console.log("═".repeat(60) + "\n");
}
