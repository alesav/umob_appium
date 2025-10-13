/**
 * ═══════════════════════════════════════════════════════════════════════════
 * POSTHOG API CLIENT - README
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * This script fetches and displays events from PostHog Analytics API.
 * 
 * USAGE:
 * ------
 * 
 * 1. Display latest 20 events with full details:
 *    node posthog.cjs
 * 
 * 2. Search for a specific event by name and return JSON:
 *    node posthog.cjs --event "$identify"
 *    node posthog.cjs --event "Application Opened"
 *    node posthog.cjs --event "$screen"
 * 
 * 3. Search for event with custom search limit:
 *    node posthog.cjs --event "$identify" --limit 50
 * 
 * COMMAND LINE OPTIONS:
 * --------------------
 * --event <name>    Search for specific event by name (exact match)
 * --limit <number>  Number of recent events to search (default: 50)
 * --help, -h        Show this help message
 * 
 * EXAMPLES:
 * ---------
 * # Find the most recent $identify event
 * node posthog.cjs --event "$identify"
 * 
 * # Find login screen event
 * node posthog.cjs --event "$screen"
 * 
 * # Search last 100 events for "Logged In"
 * node posthog.cjs --event "Logged In" --limit 100
 * 
 * OUTPUT:
 * -------
 * When searching for a specific event, the script will:
 * - Search through recent events (default: 50)
 * - Return the FULL event object as JSON if found
 * - Exit with error if event not found
 * 
 * CONFIGURATION:
 * --------------
 * API Key:     Set in PostHogClient constructor
 * Project ID:  Set in PostHogClient constructor
 * Host:        Default: https://eu.posthog.com
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

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

    // Search for a specific event by name in recent events
    async findEventByName(eventName, searchLimit = 50) {
        console.error(`🔍 Searching for event "${eventName}" in last ${searchLimit} events...`);
        
        const latestEvents = await this.getEvents({ limit: searchLimit });
        
        for (const event of latestEvents.results) {
            if (event.event === eventName) {
                console.error(`✅ Found event "${eventName}" (ID: ${event.id})`);
                return event;
            }
        }
        
        throw new Error(`Event "${eventName}" not found in the last ${searchLimit} events`);
    }

    // Print detailed event information
    printEventDetails(event, index) {
        const separator = "=".repeat(80);
        
        console.log(`\n${separator}`);
        console.log(`EVENT #${index + 1}`);
        console.log(separator);
        
        // Basic event info
        console.log(`📌 Event Name:      ${event.event}`);
        console.log(`🆔 Event ID:        ${event.id}`);
        console.log(`⏰ Timestamp:       ${event.timestamp}`);
        console.log(`🔑 Distinct ID:     ${event.distinct_id}`);
        
        // Person information
        if (event.person) {
            console.log(`\n👤 PERSON INFO:`);
            console.log(`   - Identified:    ${event.person.is_identified}`);
            console.log(`   - Distinct IDs:  ${event.person.distinct_ids?.join(", ") || "N/A"}`);
            
            if (event.person.properties?.email) {
                console.log(`   - Email:         ${event.person.properties.email}`);
            }
            if (event.person.properties?.name) {
                console.log(`   - Name:          ${event.person.properties.name}`);
            }
        }
        
        // Email from properties.$set
        if (event.properties.$set?.email) {
            console.log(`\n📧 Email ($set):    ${event.properties.$set.email}`);
        }
        if (event.properties.$set?.name) {
            console.log(`👤 Name ($set):     ${event.properties.$set.name}`);
        }
        
        // Screen / URL information
        console.log(`\n📱 SCREEN / URL INFO:`);
        const screenName = event.properties.$screen_name;
        const currentUrl = event.properties.$current_url;
        const pathname = event.properties.$pathname;
        const host = event.properties.$host;
        
        if (screenName) {
            console.log(`   - Screen Name:   ${screenName}`);
        }
        if (currentUrl) {
            console.log(`   - Current URL:   ${currentUrl}`);
        }
        if (pathname) {
            console.log(`   - Pathname:      ${pathname}`);
        }
        if (host) {
            console.log(`   - Host:          ${host}`);
        }
        if (!screenName && !currentUrl && !pathname && !host) {
            console.log(`   - No screen/URL data available`);
        }
        
        // Device information
        console.log(`\n📲 DEVICE INFO:`);
        const deviceType = event.properties.$device_type;
        const osName = event.properties.$os_name || event.properties.$os;
        const osVersion = event.properties.$os_version;
        const appVersion = event.properties.$app_version;
        const deviceName = event.properties.$device_name;
        const manufacturer = event.properties.$device_manufacturer;
        
        if (deviceType) console.log(`   - Device Type:   ${deviceType}`);
        if (deviceName) console.log(`   - Device Name:   ${deviceName}`);
        if (manufacturer) console.log(`   - Manufacturer:  ${manufacturer}`);
        if (osName) console.log(`   - OS:            ${osName} ${osVersion || ""}`);
        if (appVersion) console.log(`   - App Version:   ${appVersion}`);
        
        // Location information
        const city = event.properties.$geoip_city_name;
        const country = event.properties.$geoip_country_name;
        const timezone = event.properties.$geoip_time_zone;
        
        if (city || country) {
            console.log(`\n🌍 LOCATION:`);
            if (city) console.log(`   - City:          ${city}`);
            if (country) console.log(`   - Country:       ${country}`);
            if (timezone) console.log(`   - Timezone:      ${timezone}`);
        }
        
        // Feature flags
        const featureFlags = event.properties.$active_feature_flags;
        if (featureFlags && featureFlags.length > 0) {
            console.log(`\n🚩 ACTIVE FEATURE FLAGS:`);
            featureFlags.forEach(flag => console.log(`   - ${flag}`));
        }
        
        // Session info
        const sessionId = event.properties.$session_id;
        if (sessionId) {
            console.log(`\n🔐 Session ID:      ${sessionId}`);
        }
    }
}

// Parse command line arguments
function parseArgs() {
    const args = process.argv.slice(2);
    const options = {
        eventName: null,
        limit: 50,
        showHelp: false,
    };

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case "--event":
            case "-e":
                options.eventName = args[++i];
                break;
            case "--limit":
            case "-l":
                options.limit = parseInt(args[++i], 10);
                break;
            case "--help":
            case "-h":
                options.showHelp = true;
                break;
        }
    }

    return options;
}

// Show help message
function showHelp() {
    console.log(`
╔═══════════════════════════════════════════════════════════════════════════╗
║                      POSTHOG API CLIENT - HELP                            ║
╚═══════════════════════════════════════════════════════════════════════════╝

USAGE:
  node posthog.cjs [options]

OPTIONS:
  --event <name>    Search for specific event by name (exact match)
  --limit <number>  Number of recent events to search (default: 50)
  --help, -h        Show this help message

EXAMPLES:
  # Display latest 20 events with full details
  node posthog.cjs

  # Find the most recent $identify event
  node posthog.cjs --event "$identify"

  # Find Logged In event
  node posthog.cjs --event "Logged In"

  # Search last 100 events for $screen
  node posthog.cjs --event "$screen" --limit 100

OUTPUT:
  - Default mode: Displays 20 latest events with detailed formatting
  - Search mode: Returns full event object as JSON (parseable)

COMMON EVENT NAMES:
  $identify              - User identification event
  $screen                - Screen view event
  Application Opened     - App launch event
  Logged In              - User login event
  Application Backgrounded - App backgrounded event
`);
}

// Search for a specific event
async function searchEvent(eventName, limit) {
    const posthog = new PostHogClient(
        "phx_iCTiDXJSBjpvQ431frYONuT6OEWFah56KrCXUZMF3Y98bOM",
        "40395",
    );

    try {
        const event = await posthog.findEventByName(eventName, limit);
        
        // Output the full event object as JSON to stdout
        console.log(JSON.stringify(event, null, 2));
        
        process.exit(0);
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
}

// Display all recent events
async function displayAllEvents() {
    const posthog = new PostHogClient(
        "phx_iCTiDXJSBjpvQ431frYONuT6OEWFah56KrCXUZMF3Y98bOM",
        "40395",
    );

    try {
        console.log("\n🔍 FETCHING LATEST 20 POSTHOG EVENTS...\n");
        
        const latestEvents = await posthog.getEvents({ limit: 20 });
        
        console.log(`✅ Found ${latestEvents.results.length} events (Total: ${latestEvents.count})\n`);
        
        latestEvents.results.forEach((event, index) => {
            posthog.printEventDetails(event, index);
        });
        
        console.log("\n" + "=".repeat(80));
        console.log("✅ COMPLETED - Displayed 20 latest events");
        console.log("=".repeat(80) + "\n");
        
    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
}

// Main entry point
async function main() {
    const options = parseArgs();

    if (options.showHelp) {
        showHelp();
        return;
    }

    if (options.eventName) {
        // Search mode: find specific event and return JSON
        await searchEvent(options.eventName, options.limit);
    } else {
        // Display mode: show all recent events with details
        await displayAllEvents();
    }
}

// Run the script
if (require.main === module) {
    main().catch(error => {
        console.error("❌ Fatal error:", error.message);
        process.exit(1);
    });
}

module.exports = { PostHogClient };
