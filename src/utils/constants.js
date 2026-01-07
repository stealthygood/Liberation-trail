export const SCREENS = {
    DISCLAIMER: 'DISCLAIMER',
    TITLE: 'TITLE',
    ROLE_SELECT: 'ROLE_SELECT',
    COUNTRY_SELECT: 'COUNTRY_SELECT',
    INCOMING_TRANSMISSION: 'INCOMING_TRANSMISSION',
    EVENT: 'EVENT',
    REDACTION: 'REDACTION',
    PRESS_BRIEFING: 'PRESS_BRIEFING',
    DRONE_STRIKE: 'DRONE_STRIKE',
    SUPER_PAC: 'SUPER_PAC',
    RANDOM_EVENT: 'RANDOM_EVENT',
    DEATH: 'DEATH',
    VICTORY: 'VICTORY',
    SANCTIONS: 'SANCTIONS'
};

export const ROLES = [
    {
        id: 'DIPLOMAT',
        name: 'CAREER DIPLOMAT',
        description: 'Speaks softly, carries a big stick, and a bigger offshore account'
    },
    {
        id: 'OPERATIVE',
        name: 'INTELLIGENCE OPERATIVE',
        description: 'Democracy doesn\'t install itself'
    },
    {
        id: 'CONSULTANT',
        name: 'ENERGY SECTOR CONSULTANT',
        description: 'What\'s good for Exxon is good for America'
    },
    {
        id: 'CONTRACTOR',
        name: 'DEFENSE CONTRACTOR',
        description: 'Peace doesn\'t pay the shareholders'
    }
];

export const COUNTRIES = [
    {
        id: 'VENEZUELA',
        name: 'VENEZUELA',
        reserves: '303B',
        democracyScore: 'Needs Liberation'
    },
    {
        id: 'IRAN',
        name: 'IRAN',
        reserves: '208B',
        democracyScore: 'Regime Change Pending'
    },
    {
        id: 'LIBYA',
        name: 'LIBYA',
        reserves: '48B',
        democracyScore: 'Successfully Liberated (2011)'
    },
    {
        id: 'IRAQ',
        name: 'IRAQ',
        reserves: '145B',
        democracyScore: 'Mission Accomplished™'
    },
    {
        id: 'CANADA',
        name: 'CANADA',
        reserves: '170B',
        democracyScore: 'Too polite to invade'
    }
];
