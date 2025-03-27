import { config as baseConfig } from '../wdio.shared.conf.js';

export const config: WebdriverIO.Config = {
    ...baseConfig,
    // ============
    // Specs
    // ============
    specs: [
        '/Users/alesav/Dev/umob/appium-boilerplate/tests/specs/account/addAdress.spec.ts',
    ],
    exclude: [
        // Exclude this one because the test can only be executed on emulators/simulators
        '../tests/specs/**/app.biometric.login.spec.js',
    ],

    // =============================
    // Browserstack specific config
    // =============================
    // User configuration
    user: process.env.BROWSERSTACK_USER || 'developer_pUAMFT',
    key: process.env.BROWSERSTACK_ACCESS_KEY || '4uh6DGLDcCcE61V5FRr6',
    // Use browserstack service
    services: ['browserstack'],

    // ============
    // Capabilities
    // ============
    // For all capabilities please check
    // http://appium.io/docs/en/writing-running-appium/caps/#general-capabilities
    capabilities: [
        {
            // Set URL of the application under test
            'appium:app': process.env.BROWSERSTACK_APP_ID || 'bs://2ec2a97d829560f31e29ac4beab05e3ff5b051b9',

            'bstack:options': {
                // Set your BrowserStack config
                debug: true,

                // Specify device and os_version for testing
                platformName: "android",
                deviceName: 'Xiaomi Redmi Note 11',
                platformVersion: '11.0',

                // Set other BrowserStack capabilities
                appiumVersion: "2.12.1",
                projectName: 'wdio-test-project',
                buildName: 'android',
                sessionName: 'wdio-test'
            }
        },
    ] as WebdriverIO.Capabilities[]
};
