class PostHogClient {
    constructor(apiKey, projectId, host = "https://eu.posthog.com") {
        this.apiKey = apiKey;
        this.projectId = projectId;
        this.host = host;
        this.baseUrl = `${host}/api/projects/${projectId}`;
    }

    // Get latest events
    async getEvents(options = {}) {
        const {
            limit = 100,
            offset = 0,
            before = null,
            after = null,
            event = null,
            person = null,
            properties = null,
        } = options;

        const params = new URLSearchParams({
            limit: limit.toString(),
            offset: offset.toString(),
        });

        if (before) params.append("before", before);
        if (after) params.append("after", after);
        if (event) params.append("event", event);
        if (person) params.append("person", person);
        if (properties) {
            params.append("properties", JSON.stringify(properties));
        }

        const url = `${this.baseUrl}/events/?${params}`;

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching events:", error);
            throw error;
        }
    }

    // Get events with specific filters
    async getFilteredEvents(eventName, startDate, endDate, limit = 100) {
        const options = {
            event: eventName,
            after: startDate,
            before: endDate,
            limit: limit,
        };

        return await this.getEvents(options);
    }

    // Get recent events (last 24 hours)
    async getRecentEvents(limit = 100) {
        const now = new Date();
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        const options = {
            after: yesterday.toISOString(),
            limit: limit,
        };

        return await this.getEvents(options);
    }

    // Get events for a specific person
    async getPersonEvents(personId, limit = 100) {
        const options = {
            person: personId,
            limit: limit,
        };

        return await this.getEvents(options);
    }
}

// Usage example
async function main() {
    // Initialize the client
    const posthog = new PostHogClient(
        "phx_iCTiDXJSBjpvQ431frYONuT6OEWFah56KrCXUZMF3Y98bOM", // Replace with your API key
        "40395", // Replace with your project ID
    );

    try {
        // Get latest 50 events
        console.log("Fetching latest events...");
        const latestEvents = await posthog.getEvents({ limit: 10 });
        console.log(`Found ${latestEvents.results.length} events`);
        console.log(
            "First event:",
            JSON.stringify(latestEvents.results[0], null, 2),
        );

        // Get recent events (last 24 hours)
        console.log("\nFetching recent events...");
        const recentEvents = await posthog.getRecentEvents(20);
        console.log(`Found ${recentEvents.results.length} recent events`);

        // Get specific event type
        console.log("\nFetching specific event type...");
        const specificEvents = await posthog.getFilteredEvents(
            "$pageview", // Event name
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Last 7 days
            new Date().toISOString(),
            10,
        );
        console.log(`Found ${specificEvents.results.length} pageview events`);

        // Process events
        latestEvents.results.forEach((event, index) => {
            console.log(`\nEvent ${index + 1}:`);
            console.log(`- Event: ${event.event}`);
            console.log(`- Timestamp: ${event.timestamp}`);
            console.log(
                `- Person: ${event.person?.distinct_ids?.[0] || "Anonymous"}`,
            );
            console.log(
                `- Properties:`,
                Object.keys(event.properties).slice(0, 3),
            ); // Show first 3 property keys
        });
    } catch (error) {
        console.error("Error:", error.message);
    }
}

// Alternative using async/await with error handling
async function getPostHogEvents() {
    const API_KEY = "phx_iCTiDXJSBjpvQ431frYONuT6OEWFah56KrCXUZMF3Y98bOM";
    const PROJECT_ID = "40395";
    const HOST = "https://eu.posthog.com"; // or your self-hosted instance

    const url = `${HOST}/api/projects/${PROJECT_ID}/events/?limit=100`;

    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(
                `PostHog API error: ${response.status} ${response.statusText}`,
            );
        }

        const data = await response.json();

        console.log(`Total events: ${data.count}`);
        console.log(`Returned events: ${data.results.length}`);

        return data.results;
    } catch (error) {
        console.error("Failed to fetch PostHog events:", error);
        throw error;
    }
}

// Run the example
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { PostHogClient, getPostHogEvents };
