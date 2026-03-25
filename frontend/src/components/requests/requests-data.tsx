type Material = 'Plastic' | 'Glass' | 'Cardboard' | 'Carton' | 'Paper';

export type RequestRow = {
    id: string;
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
    { id: "req-1",  Username: "John Doe",     Location: "somewhere",       material1: 'Plastic',                                  Date: "1, Jan 2026", startTime: "12pm", endTime: "2pm", Compatibility: 0,   status: "accepted"  },
    { id: "req-2",  Username: "John Doe",     Location: "somewhere",       material1: 'Plastic', material2: 'Cardboard',          Date: "1, Jan 2026", startTime: "12pm", endTime: "3pm", Compatibility: 100, status: "accepted"  },
    { id: "req-3",  Username: "Sara Doe",     Location: "a house",         material1: 'Plastic', material2: 'Cardboard', material3: 'Glass', Date: "2, Feb 2026", startTime: "12pm", endTime: "3pm", Compatibility: 100, status: "accepted"  },
    { id: "req-4",  Username: "Sara Doe",     Location: "a house",         material1: 'Plastic', material2: 'Cardboard', material3: 'Glass', Date: "2, Feb 2026", startTime: "12pm", endTime: "3pm", Compatibility: 100, status: "incoming"  },
    { id: "req-5",  Username: "Sara Doe",     Location: "a house",         material1: 'Plastic', material2: 'Cardboard', material3: 'Glass', Date: "2, Feb 2026", startTime: "12pm", endTime: "3pm", Compatibility: 100, status: "accepted"  },
    { id: "req-6",  Username: "Sara Doe",     Location: "a house",         material1: 'Plastic', material2: 'Cardboard', material3: 'Glass', Date: "2, Feb 2026", startTime: "12pm", endTime: "3pm", Compatibility: 100, status: "completed" },
    { id: "req-7",  Username: "Sara Doe",     Location: "a house",         material1: 'Plastic', material2: 'Cardboard', material3: 'Glass', Date: "2, Feb 2026", startTime: "12pm", endTime: "3pm", Compatibility: 100, status: "completed" },
    { id: "req-8",  Username: "Sara Doe",     Location: "a house",         material1: 'Plastic', material2: 'Cardboard', material3: 'Glass', Date: "2, Feb 2026", startTime: "12pm", endTime: "3pm", Compatibility: 100, status: "accepted"  },
    { id: "req-9",  Username: "Sara Doe",     Location: "a house",         material1: 'Plastic', material2: 'Cardboard', material3: 'Glass', Date: "2, Feb 2026", startTime: "12pm", endTime: "3pm", Compatibility: 100, status: "accepted"  },
    { id: "req-10", Username: "Sara Doe",     Location: "a house",         material1: 'Plastic', material2: 'Cardboard', material3: 'Glass', Date: "2, Feb 2026", startTime: "12pm", endTime: "3pm", Compatibility: 100, status: "incoming"  },
    { id: "req-11", Username: "Johnny test",  Location: "Periwinkle drive", material1: 'Plastic', material2: 'Cardboard',          Date: "2, Feb 2026", startTime: "12pm", endTime: "3pm", Compatibility: 10,  status: "incoming"  },
    { id: "req-12", Username: "Your Mom",     Location: "1234 blvd",       material1: 'Plastic', material2: 'Carton',             Date: "2, Feb 2026", startTime: "12pm", endTime: "3pm", Compatibility: 10,  status: "incoming"  },
];