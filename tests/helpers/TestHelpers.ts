import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import submitTestRun from "./SendResults.js";

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Types
export interface Credentials {
    username: string;
    password: string;
}

export interface ScreenDimensions {
    centerX: number;
    centerY: number;
    screenWidth: number;
    screenHeight: number;
}

export interface ScooterAsset {
    id: string;
    coordinates: {
        longitude: number;
        latitude: number;
    };
}

export interface APIResponse {
    assets: ScooterAsset[];
}

/**
 * Get API configuration (URL and AUTH_TOKEN) for the current environment
 */
export function getApiConfig(environment: string = "test") {
    try {
        const credentialsPath = path.resolve(
            __dirname,
            "../../config/credentials.json",
        );
        const credentials = JSON.parse(
            fs.readFileSync(credentialsPath, "utf8"),
        );

        if (!credentials[environment]) {
            console.warn(
                `Environment '${environment}' not found. Using 'test' environment.`,
            );
            environment = "test";
        }

        return {
            apiUrl: credentials[environment].apiUrl,
            authToken: credentials[environment].authToken,
        };
    } catch (error) {
        console.error("Error loading API config:", error);
        throw new Error("Failed to load API configuration");
    }
}
/**
 * Function to load credentials based on environment and user
 * @param environment - Environment name (default: "test")
 * @param userKey - User key (default: null, uses first available user)
 * @returns Object with username and password
 */
export function getCredentials(
    environment: string = "test",
    userKey: string | null = null,
): Credentials {
    try {
        const credentialsPath = path.resolve(
            __dirname,
            "../../config/credentials.json",
        );
        const credentials = JSON.parse(
            fs.readFileSync(credentialsPath, "utf8"),
        );

        // Check if environment exists
        if (!credentials[environment]) {
            console.warn(
                `Environment '${environment}' not found in credentials file. Using 'test' environment.`,
            );
            environment = "test";
        }

        const envUsers = credentials[environment];

        // If no specific user is requested, use the first user in the environment
        if (!userKey) {
            userKey = Object.keys(envUsers)[0];
        } else if (!envUsers[userKey]) {
            console.warn(
                `User '${userKey}' not found in '${environment}' environment. Using first available user.`,
            );
            userKey = Object.keys(envUsers)[0];
        }

        // Return the user credentials
        return {
            username: envUsers[userKey].username,
            password: envUsers[userKey].password,
        };
    } catch (error) {
        console.error("Error loading credentials:", error);
        throw new Error("Failed to load credentials configuration");
    }
}

/**
 * Get screen center coordinates
 * @returns Object with centerX, centerY, screenWidth, screenHeight
 */
export const getScreenCenter = async (): Promise<ScreenDimensions> => {
    // Get screen dimensions
    const { width, height } = await driver.getWindowSize();

    return {
        centerX: Math.round(width / 2),
        centerY: Math.round(height / 2),
        screenWidth: width,
        screenHeight: height,
    };
};

/**
 * Fetch scooter coordinates from API
 * @returns Array of scooter assets
 */
export const fetchScooterCoordinates = async (): Promise<ScooterAsset[]> => {
    try {
        const apiConfig = getApiConfig(ENV);

        const response = await fetch(apiConfig.apiUrl, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: apiConfig.authToken,
                "Accept-Language": "en",
                "X-Requested-With": "XMLHttpRequest",
                "App-Version": "1.23776.3.23776",
                "App-Platform": "android",
            },
            body: JSON.stringify({
                regionId: "",
                stationId: "",
                longitude: 4.481574296951294,
                latitude: 51.92120617890777,
                radius: 1166.6137310913994,
                zoomLevel: 15.25,
                subOperators: [],
                assetClasses: [23, 24, 17],
                operatorAvailabilities: [2, 1, 3],
                showEmptyStations: false,
                skipCount: 0,
                sorting: "",
                defaultMaxResultCount: 10,
                maxMaxResultCount: 1000,
                maxResultCount: 10,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: APIResponse = await response.json();
        console.log("Fetched scooter coordinates:", JSON.stringify(data));
        return data.assets;
    } catch (error) {
        console.error("Error fetching scooter coordinates:", error);
        throw error;
    }
};

/**
 * Handle test execution with proper error handling and result submission
 * @param testId - Unique test identifier
 * @param testFunction - Test function to execute
 * @returns Promise<void>
 */
export async function executeTest(
    testId: string,
    testFunction: () => Promise<void>
): Promise<void> {
    let testStatus = "Pass";
    let screenshotPath = "";
    let testDetails = "";
    let error: Error | null = null;

    try {
        await testFunction();
    } catch (e) {
        error = e as Error;
        console.error("Test failed:", error);
        testStatus = "Fail";
        testDetails = error.message;

        // Capture screenshot on failure
        screenshotPath = "./screenshots/" + testId + ".png";
        await driver.saveScreenshot(screenshotPath);
    } finally {
        // Submit test run result
        try {
            await submitTestRun(testId, testStatus, testDetails, screenshotPath);
            console.log("Test run submitted successfully");
        } catch (submitError) {
            console.error("Failed to submit test run:", submitError);
        }

        // If there was an error in the main try block, throw it here to fail the test
        if (error) {
            throw error;
        }
    }
}

// Environment configuration
export const ENV: string = process.env.TEST_ENV || "test";
export const USER: string = process.env.TEST_USER || "new12";

// Environment helpers
export const isTest = ENV === "test";
export const isAccept = ENV === "accept";
export const isProd = ENV === "prod";

/**
 * Helper to skip a test if running in Accept environment
 * Useful for tests that involve real money or irreversible actions
 */
export function skipIfAccept(testContext: Mocha.Context) {
    if (isAccept) {
        console.log(">>> SKIPPING TEST: Not allowed in Accept environment");
        testContext.skip();
    }
}

// Common error messages for nearby assets
export const NEARBY_ASSETS_ERROR_MESSAGES: string[] = [
    "No vehicles nearby right now",
    "NO VEHICLES NEARBY",
    "No vehicles nearby",
];

// Target scooter configuration
export const TARGET_SCOOTER_ID: string = "UmobMock:ROTTERDAM_MOPED_1";
export const TEST_VEHICLE_ID: string = "MOP_YFTZ22";
