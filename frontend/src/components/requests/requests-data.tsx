type Material = 'Plastic' | 'Glass' | 'Cardboard' | 'Carton' | 'Paper';

export type RequestRow = {
    Username: string;
    Location: string;
    material1: Material;
    material2?: Material;
    material3?: Material;
    Date: string;
    startTime: string;
    endTime: string;
    Compatibility: number;
    status: "incoming" | "accepted" | "completed";
};

export const RequestsData: RequestRow[] = [
    {
        Username: "John Doe",
        Location: "somewhere",
        material1: 'Plastic',
        Date: "1,Jan 2026",
        startTime: "12pm",
        endTime: "2pm",
        Compatibility: 0,
        status: "accepted",
    },
    {
        Username: "John Doe",
        Location: "somewhere",
        material1: 'Plastic',
        material2: 'Cardboard',
        Date: "1, Jan 2026",
        startTime: "12pm",
        endTime: "3pm",
        Compatibility: 100,
        status: "accepted",
    },
    {
        Username: "Sara Doe",
        Location: "a house",
        material1: 'Plastic',
        material2: 'Cardboard',
        material3: 'Glass',
        Date: "2, Feb 2026",
        startTime: "12pm",
        endTime: "3pm",
        Compatibility: 100,
        status: "accepted",
    },
    {
        Username: "Sara Doe",
        Location: "a house",
        material1: 'Plastic',
        material2: 'Cardboard',
        material3: 'Glass',
        Date: "2, Feb 2026",
        startTime: "12pm",
        endTime: "3pm",
        Compatibility: 100,
        status: "incoming",
    },
    {
        Username: "Sara Doe",
        Location: "a house",
        material1: 'Plastic',
        material2: 'Cardboard',
        material3: 'Glass',
        Date: "2, Feb 2026",
        startTime: "12pm",
        endTime: "3pm",
        Compatibility: 100,
        status: "accepted",
    },
    {
        Username: "Sara Doe",
        Location: "a house",
        material1: 'Plastic',
        material2: 'Cardboard',
        material3: 'Glass',
        Date: "2, Feb 2026",
        startTime: "12pm",
        endTime: "3pm",
        Compatibility: 100,
        status: "completed",
    },
    {
        Username: "Sara Doe",
        Location: "a house",
        material1: 'Plastic',
        material2: 'Cardboard',
        material3: 'Glass',
        Date: "2, Feb 2026",
        startTime: "12pm",
        endTime: "3pm",
        Compatibility: 100,
        status: "completed",
    },
    {
        Username: "Sara Doe",
        Location: "a house",
        material1: 'Plastic',
        material2: 'Cardboard',
        material3: 'Glass',
        Date: "2, Feb 2026",
        startTime: "12pm",
        endTime: "3pm",
        Compatibility: 100,
        status: "accepted",
    },
    {
        Username: "Sara Doe",
        Location: "a house",
        material1: 'Plastic',
        material2: 'Cardboard',
        material3: 'Glass',
        Date: "2, Feb 2026",
        startTime: "12pm",
        endTime: "3pm",
        Compatibility: 100,
        status: "accepted",
    },
    {
        Username: "Sara Doe",
        Location: "a house",
        material1: 'Plastic',
        material2: 'Cardboard',
        material3: 'Glass',
        Date: "2, Feb 2026",
        startTime: "12pm",
        endTime: "3pm",
        Compatibility: 100,
        status: "incoming",
    },
    {
        Username: "Johnny test",
        Location: "Periwinkle drive",
        material1: 'Plastic',
        material2: 'Cardboard',
        Date: "2, Feb 2026",
        startTime: "12pm",
        endTime: "3pm",
        Compatibility: 10,
        status: "incoming",
    },

];