/**
 * Scooter Coordinates Helper
 * Contains types and utilities for fetching scooter coordinates from the API
 */

// Define types for the scooter data
export interface ScooterCoordinates {
    longitude: number;
    latitude: number;
}

export interface Scooter {
    id: string;
    coordinates: ScooterCoordinates;
    [key: string]: any; // For other properties we might not know about
}

const API_URL = "https://backend-test.umobapp.com/api/tomp/mapboxmarkers";
const AUTH_TOKEN =
    "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IkFGNkFBNzZCMUFEOEI4QUJCQzgzRTAzNjBEQkQ4MkYzRjdGNDE1MDMiLCJ4NXQiOiJyMnFuYXhyWXVLdThnLUEyRGIyQzhfZjBGUU0iLCJ0eXAiOiJhdCtqd3QifQ.eyJzdWIiOiJiMzI0ZDRlNy01OGNmLTRkZTMtOWE2Yi04N2YxYzcyYzM0ZjUiLCJ1bmlxdWVfbmFtZSI6IjRiaWdmb290KzE4QGdtYWlsLmNvbSIsInByZWZlcnJlZF91c2VybmFtZSI6IjRiaWdmb290KzE4QGdtYWlsLmNvbSIsImdpdmVuX25hbWUiOiJBbGVrcyIsImZhbWlseV9uYW1lIjoiU2F2IiwiZW1haWwiOiI0YmlnZm9vdCsxOEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6IkZhbHNlIiwicGhvbmVfbnVtYmVyIjoiKzMxOTcwMTA1ODc3MjQiLCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOiJUcnVlIiwib2lfcHJzdCI6InVNb2JfQXBwX09wZW5JZGRpY3QiLCJvaV9hdV9pZCI6IjRkYTQ1MTk2LTA2OTEtYjg4MC04MTM2LTNhMTZlNTk4OWY2NSIsImNsaWVudF9pZCI6InVNb2JfQXBwX09wZW5JZGRpY3QiLCJvaV90a25faWQiOiIyYTlhNjMwNS1hMjYxLTgwMjQtOTQ5Yy0zYTE2ZTU5ODlmN2EiLCJhdWQiOiJ1TW9iIiwic2NvcGUiOiJvZmZsaW5lX2FjY2VzcyB1TW9iIiwianRpIjoiY2QyM2VlMzktMTE2Mi00ZDhmLTkyMDgtZDgxMDdiZTc2MGYxIiwiaXNzIjoiaHR0cHM6Ly9iYWNrZW5kLXRlc3QudW1vYmFwcC5jb20vIiwiZXhwIjoxNzQyMTk0ODc2LCJpYXQiOjE3MzQ0MTg4NzZ9.u6ndZq46MDie48o9UNmzjTzAmSpyEJcHEmgKWkKB_UT0EC6vQXSIifrrD3KtFy9gD_Y0DFa3k043uRvEp7Cp1Gnu1OEWl6BKjIi0FOZ4yHTHPgTLhSQWSFfxJx_0yjtanvmC5aFg-t6kGvA76S8QMlbNYOKJf9R3mv3fPmnC1jIRMlZeIuikzHBJ1D3czlx1Pk3lFjsWoQcdZbWEpsRY4PEv28uLfh46COq2myEHDA_mk9WG-V7ocPuNRYiHamHcjttHem5Y_yNNUfoXDPwsQSlehtAuZnB6dyIL1C5OrNl5ZfyFiD1p6XWuBAFUmh5wOSWE23Fmm8fruD2UXSPPWg";

/**
 * Fetches scooter coordinates from the umob API
 * @returns Promise<Scooter[]> Array of scooter objects with coordinates
 */
export const fetchScooterCoordinates = async (): Promise<Scooter[]> => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: AUTH_TOKEN,
                "Accept-Language": "en",
                "X-Requested-With": "XMLHttpRequest",
                "App-Version": "1.23316.3.23316",
                "App-Platform": "android",
            },
            body: JSON.stringify({
                regionId: "",
                stationId: "",
                longitude: 4.4743720514863075,
                latitude: 51.91731373726902,
                radius: 101.6137310913994,
                zoomLevel: 15.25,
                subOperators: [],
                assetClasses: [23],
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

        const data = await response.json();
        console.log("Fetched scooter coordinates:", JSON.stringify(data));
        return data.assets;
    } catch (error) {
        console.error("Error fetching scooter coordinates:", error);
        throw error;
    }
};

/**
 * Helper function to find a scooter by ID pattern
 * @param scooters Array of scooter objects
 * @param idPattern String pattern to search for in scooter IDs
 * @returns Scooter object if found
 * @throws Error if no scooter matches the pattern
 */
export const findScooterById = (
    scooters: Scooter[],
    idPattern: string,
): Scooter => {
    const targetScooter = scooters.find((scooter) =>
        scooter.id.includes(idPattern),
    );

    if (!targetScooter) {
        throw new Error(`No scooter found with ID pattern: ${idPattern}`);
    }

    return targetScooter;
};

/**
 * Helper function to find a Felyx scooter specifically
 * @param scooters Array of scooter objects
 * @returns Felyx scooter object if found
 * @throws Error if no Felyx scooter is found
 */
export const findFelyxScooter = (scooters: Scooter[]): Scooter => {
    return findScooterById(scooters, "Felyx");
};

/**
 * Helper function to find a Check scooter specifically
 * @param scooters Array of scooter objects
 * @returns Check scooter object if found
 * @throws Error if no Check scooter is found
 */
export const findCheckScooter = (scooters: Scooter[]): Scooter => {
    return findScooterById(scooters, "Check");
};
