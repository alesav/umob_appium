import fs from "fs";
import path from "path";
import { ENV } from "./TestHelpers.js";

const submitTestRun = async (
    testId: string,
    status: string,
    details: string = "",
    screenshot: string | null | undefined = null,
) => {
    try {
        // Create a FormData instance
        const formData = new FormData();

        // Add the JSON data as a string field
        formData.append(
            "data",
            JSON.stringify({
                status,
                details,
                environment: ENV,
                hash: "60e35107-893f-4204-980f-e0150c9b8884",
            }),
        );

        // Add the screenshot file if provided
        if (screenshot) {
            // Read the file as a buffer
            const fileBuffer = fs.readFileSync(screenshot);

            // Get the filename from the path
            const filename = path.basename(screenshot);

            // Create a Blob from the buffer
            const blob = new Blob([fileBuffer], { type: "image/png" });

            // Create a File object from the blob
            const file = new File([blob], filename, { type: "image/png" });

            formData.append("file", file);
        }

        const postUrl = "https://umobqa.smspm.com/api/v2/runs/" + testId;

        console.log("POST URL:" + postUrl);
        const response = await fetch(postUrl, {
            method: "POST",
            // Don't set Content-Type header - browser will set it automatically with boundary
            body: formData,
        });

        console.log("Response:" + JSON.stringify(response));

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error submitting test run:", error);
        throw error;
    }
};

export default submitTestRun;
