import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

interface PostHogEvent {
    id: string;
    distinct_id: string;
    properties: {
        [key: string]: any;
        $set?: {
            email?: string;
            name?: string;
            [key: string]: any;
        };
    };
    event: string;
    timestamp: string;
    person: {
        is_identified: boolean;
        distinct_ids: string[];
        properties: {
            email?: string;
            name?: string;
            [key: string]: any;
        };
    };
    elements: any[];
    elements_chain: string;
}

interface PostHogEventsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: PostHogEvent[];
}

interface EventSearchCriteria {
    eventName: string;
    email?: string;
    personEmail?: string;
    screenName?: string;
    maxAgeMinutes?: number;
}

class PostHogHelper {
    private apiKey: string;
    private projectId: string;
    private host: string;
    private baseUrl: string;

    constructor(
        apiKey?: string,
        projectId: string = "40395",
        host: string = "https://eu.posthog.com",
    ) {
        // Use environment variable if apiKey is not provided
        this.apiKey = apiKey || process.env.POSTHOG_API_KEY || "";

        if (!this.apiKey) {
            throw new Error(
                "PostHog API key is required. Please set POSTHOG_API_KEY environment variable or pass it to the constructor.",
            );
        }

        this.projectId = projectId;
        this.host = host;
        this.baseUrl = `${host}/api/projects/${projectId}`;
    }

    /**
     * Fetch recent events from PostHog
     */
    async getRecentEvents(limit: number = 10): Promise<PostHogEventsResponse> {
        const url = `${this.baseUrl}/events/?limit=${limit}`;

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(
                    `PostHog API error: ${response.status} ${response.statusText}`,
                );
            }

            const data: PostHogEventsResponse = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching PostHog events:", error);
            throw error;
        }
    }

    /**
     * Search for a specific event in recent events
     */
    async findEventInRecent(
        criteria: EventSearchCriteria,
        limit: number = 20,
    ): Promise<PostHogEvent | null> {
        const events = await this.getRecentEvents(limit);

        for (const event of events.results) {
            // Check event name
            console.log(
                `Checking event: ${event.event} (ID: ${event.properties.$screen_name})`,
            );
            if (event.event !== criteria.eventName) {
                continue;
            }

            // Check if event is within max age
            if (criteria.maxAgeMinutes) {
                const eventTime = new Date(event.timestamp).getTime();
                const now = Date.now();
                const ageMinutes = (now - eventTime) / (1000 * 60);

                if (ageMinutes > criteria.maxAgeMinutes) {
                    continue;
                }
            }

            // Check email in properties.$set
            if (criteria.email) {
                const emailInSet = event.properties.$set?.email;
                if (emailInSet !== criteria.email) {
                    continue;
                }
            }

            // Check email in person.properties
            if (criteria.personEmail) {
                const personEmail = event.person?.properties?.email;
                if (personEmail !== criteria.personEmail) {
                    continue;
                }
            }

            // Check screen name
            if (criteria.screenName !== undefined) {
                const actualScreenName = event.properties.$screen_name;
                if (actualScreenName !== criteria.screenName) {
                    continue;
                }
            }

            // If all criteria match, return the event
            return event;
        }

        return null;
    }

    /**
     * Validate event properties
     */
    validateEvent(
        event: PostHogEvent,
        expectedEventName: string,
        expectedEmail: string,
        expectedScreenName?: string,
    ): {
        isValid: boolean;
        errors: string[];
    } {
        const errors: string[] = [];

        // Validate event name
        if (event.event !== expectedEventName) {
            errors.push(
                `Event name mismatch: expected "${expectedEventName}", got "${event.event}"`,
            );
        }

        // Validate email in properties.$set
        const emailInSet = event.properties.$set?.email;
        if (emailInSet !== expectedEmail) {
            errors.push(
                `Email in properties.$set mismatch: expected "${expectedEmail}", got "${emailInSet}"`,
            );
        }

        // Validate email in person.properties
        const personEmail = event.person?.properties?.email;
        if (personEmail !== expectedEmail) {
            errors.push(
                `Email in person.properties mismatch: expected "${expectedEmail}", got "${personEmail}"`,
            );
        }

        // Validate screen name if provided
        if (expectedScreenName !== undefined) {
            const actualScreenName = event.properties.$screen_name;
            if (actualScreenName !== expectedScreenName) {
                errors.push(
                    `Screen name mismatch: expected "${expectedScreenName}", got "${actualScreenName || "N/A"}"`,
                );
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
        };
    }

    /**
     * Wait for event to appear (with retry logic)
     */
    async waitForEvent(
        criteria: EventSearchCriteria,
        options: {
            maxRetries?: number;
            retryDelayMs?: number;
            searchLimit?: number;
        } = {},
    ): Promise<PostHogEvent> {
        const {
            maxRetries = 10,
            retryDelayMs = 3000,
            searchLimit = 10,
        } = options;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            console.log(
                `Searching for PostHog event (attempt ${attempt}/${maxRetries})...`,
            );

            const event = await this.findEventInRecent(criteria, searchLimit);

            if (event) {
                console.log(`✓ Found event: ${event.event} (ID: ${event.id})`);
                return event;
            }

            if (attempt < maxRetries) {
                console.log(
                    `Event not found, waiting ${retryDelayMs}ms before retry...`,
                );
                await new Promise((resolve) =>
                    setTimeout(resolve, retryDelayMs),
                );
            }
        }

        throw new Error(
            `Event not found after ${maxRetries} attempts. Criteria: ${JSON.stringify(criteria)}`,
        );
    }

    /**
     * Get all events of a specific type
     */
    async getEventsByType(
        eventName: string,
        limit: number = 50,
    ): Promise<PostHogEvent[]> {
        const events = await this.getRecentEvents(limit);
        return events.results.filter((event) => event.event === eventName);
    }

    /**
     * Get events for a specific user email
     */
    async getEventsByEmail(
        email: string,
        limit: number = 50,
    ): Promise<PostHogEvent[]> {
        const events = await this.getRecentEvents(limit);
        return events.results.filter(
            (event) =>
                event.properties.$set?.email === email ||
                event.person?.properties?.email === email,
        );
    }

    /**
     * Print event summary for debugging
     */
    printEventSummary(event: PostHogEvent): void {
        console.log("\n=== PostHog Event Summary ===");
        console.log(`Event: ${event.event}`);
        console.log(`ID: ${event.id}`);
        console.log(`Timestamp: ${event.timestamp}`);

        // Screen name if available
        const screenName = event.properties.$screen_name;
        if (screenName) {
            console.log(`Screen: ${screenName}`);
        }

        console.log(
            `Email (properties.$set): ${event.properties.$set?.email || "N/A"}`,
        );
        console.log(
            `Email (person.properties): ${event.person?.properties?.email || "N/A"}`,
        );
        console.log(`Name: ${event.properties.$set?.name || "N/A"}`);
        console.log(`Distinct ID: ${event.distinct_id}`);
        console.log(`Person Identified: ${event.person?.is_identified}`);
        console.log("============================\n");
    }
}

export default PostHogHelper;
export type { PostHogEvent, PostHogEventsResponse, EventSearchCriteria };

import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

interface PostHogEvent {
    id: string;
    distinct_id: string;
    properties: {
        [key: string]: any;
        $set?: {
            email?: string;
            name?: string;
            [key: string]: any;
        };
    };
    event: string;
    timestamp: string;
    person: {
        is_identified: boolean;
        distinct_ids: string[];
        properties: {
            email?: string;
            name?: string;
            [key: string]: any;
        };
    };
    elements: any[];
    elements_chain: string;
}

interface PostHogEventsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: PostHogEvent[];
}

interface EventSearchCriteria {
    eventName: string;
    email?: string;
    personEmail?: string;
    screenName?: string;
    maxAgeMinutes?: number;
}

class PostHogHelper {
    private apiKey: string;
    private projectId: string;
    private host: string;
    private baseUrl: string;

    constructor(
        apiKey?: string,
        projectId: string = "40395",
        host: string = "https://eu.posthog.com",
    ) {
        // Use environment variable if apiKey is not provided
        this.apiKey = apiKey || process.env.POSTHOG_API_KEY || "";

        if (!this.apiKey) {
            throw new Error(
                "PostHog API key is required. Please set POSTHOG_API_KEY environment variable or pass it to the constructor.",
            );
        }

        this.projectId = projectId;
        this.host = host;
        this.baseUrl = `${host}/api/projects/${projectId}`;
    }

    /**
     * Fetch recent events from PostHog
     */
    async getRecentEvents(limit: number = 10): Promise<PostHogEventsResponse> {
        const url = `${this.baseUrl}/events/?limit=${limit}`;

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(
                    `PostHog API error: ${response.status} ${response.statusText}`,
                );
            }

            const data: PostHogEventsResponse = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching PostHog events:", error);
            throw error;
        }
    }

    /**
     * Search for a specific event in recent events
     */
    async findEventInRecent(
        criteria: EventSearchCriteria,
        limit: number = 20,
    ): Promise<PostHogEvent | null> {
        const events = await this.getRecentEvents(limit);

        for (const event of events.results) {
            // Check event name
            console.log(
                `Checking event: ${event.event} (ID: ${event.properties.$screen_name})`,
            );
            if (event.event !== criteria.eventName) {
                continue;
            }

            // Check if event is within max age
            if (criteria.maxAgeMinutes) {
                const eventTime = new Date(event.timestamp).getTime();
                const now = Date.now();
                const ageMinutes = (now - eventTime) / (1000 * 60);

                if (ageMinutes > criteria.maxAgeMinutes) {
                    continue;
                }
            }

            // Check email in properties.$set
            if (criteria.email) {
                const emailInSet = event.properties.$set?.email;
                if (emailInSet !== criteria.email) {
                    continue;
                }
            }

            // Check email in person.properties
            if (criteria.personEmail) {
                const personEmail = event.person?.properties?.email;
                if (personEmail !== criteria.personEmail) {
                    continue;
                }
            }

            // Check screen name
            if (criteria.screenName !== undefined) {
                const actualScreenName = event.properties.$screen_name;
                if (actualScreenName !== criteria.screenName) {
                    continue;
                }
            }

            // If all criteria match, return the event
            return event;
        }

        return null;
    }

    /**
     * Validate event properties
     */
    validateEvent(
        event: PostHogEvent,
        expectedEventName: string,
        expectedEmail: string,
        expectedScreenName?: string,
    ): {
        isValid: boolean;
        errors: string[];
    } {
        const errors: string[] = [];

        // Validate event name
        if (event.event !== expectedEventName) {
            errors.push(
                `Event name mismatch: expected "${expectedEventName}", got "${event.event}"`,
            );
        }

        // Validate email in properties.$set
        const emailInSet = event.properties.$set?.email;
        if (emailInSet !== expectedEmail) {
            errors.push(
                `Email in properties.$set mismatch: expected "${expectedEmail}", got "${emailInSet}"`,
            );
        }

        // Validate email in person.properties
        const personEmail = event.person?.properties?.email;
        if (personEmail !== expectedEmail) {
            errors.push(
                `Email in person.properties mismatch: expected "${expectedEmail}", got "${personEmail}"`,
            );
        }

        // Validate screen name if provided
        if (expectedScreenName !== undefined) {
            const actualScreenName = event.properties.$screen_name;
            if (actualScreenName !== expectedScreenName) {
                errors.push(
                    `Screen name mismatch: expected "${expectedScreenName}", got "${actualScreenName || "N/A"}"`,
                );
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
        };
    }

    /**
     * Wait for event to appear (with retry logic)
     */
    async waitForEvent(
        criteria: EventSearchCriteria,
        options: {
            maxRetries?: number;
            retryDelayMs?: number;
            searchLimit?: number;
        } = {},
    ): Promise<PostHogEvent> {
        const {
            maxRetries = 10,
            retryDelayMs = 3000,
            searchLimit = 20,
        } = options;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            console.log(
                `Searching for PostHog event (attempt ${attempt}/${maxRetries})...`,
            );

            const event = await this.findEventInRecent(criteria, searchLimit);

            if (event) {
                console.log(`✓ Found event: ${event.event} (ID: ${event.id})`);
                return event;
            }

            if (attempt < maxRetries) {
                console.log(
                    `Event not found, waiting ${retryDelayMs}ms before retry...`,
                );
                await new Promise((resolve) =>
                    setTimeout(resolve, retryDelayMs),
                );
            }
        }

        throw new Error(
            `Event not found after ${maxRetries} attempts. Criteria: ${JSON.stringify(criteria)}`,
        );
    }

    /**
     * Get all events of a specific type
     */
    async getEventsByType(
        eventName: string,
        limit: number = 50,
    ): Promise<PostHogEvent[]> {
        const events = await this.getRecentEvents(limit);
        return events.results.filter((event) => event.event === eventName);
    }

    /**
     * Get events for a specific user email
     */
    async getEventsByEmail(
        email: string,
        limit: number = 50,
    ): Promise<PostHogEvent[]> {
        const events = await this.getRecentEvents(limit);
        return events.results.filter(
            (event) =>
                event.properties.$set?.email === email ||
                event.person?.properties?.email === email,
        );
    }

    /**
     * Print event summary for debugging
     */
    printEventSummary(event: PostHogEvent): void {
        console.log("\n=== PostHog Event Summary ===");
        console.log(`Event: ${event.event}`);
        console.log(`ID: ${event.id}`);
        console.log(`Timestamp: ${event.timestamp}`);

        // Screen name if available
        const screenName = event.properties.$screen_name;
        if (screenName) {
            console.log(`Screen: ${screenName}`);
        }

        console.log(
            `Email (properties.$set): ${event.properties.$set?.email || "N/A"}`,
        );
        console.log(
            `Email (person.properties): ${event.person?.properties?.email || "N/A"}`,
        );
        console.log(`Name: ${event.properties.$set?.name || "N/A"}`);
        console.log(`Distinct ID: ${event.distinct_id}`);
        console.log(`Person Identified: ${event.person?.is_identified}`);
        console.log("============================\n");
    }
}

export default PostHogHelper;
export type { PostHogEvent, PostHogEventsResponse, EventSearchCriteria };
