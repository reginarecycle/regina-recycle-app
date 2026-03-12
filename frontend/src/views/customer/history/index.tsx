import { useState,useEffect } from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";

import{
    Tabs,
    TabsList,
    TabsTrigger
}from "@/components/ui/tabs";

import{
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell
} from "@/components/ui/table";


export default function HistoryPage(){
    const [history, setHistory ] = useState <any[]>([]);
    const [status, setStatus ] = useState("ALL");
    const [search, setSearch] = useState("");
    const [page, setPage ] = useState(1);

    const limit = 10;

    const fetchHistory = async () =>{
        try{
            let url =`/pickups/history?page=${page}&limit=${limit}`;
            if(status !== "ALL"){
                url +=`&status=${status}`;
            }

            if(search)
            {
              url +=`&search=${search}`;
            }

            const res = await fetch(url);
            const data = await res.json();

            setHistory(data.data || []);
        }
        catch(error){
            console.error("Failed to load history", error);

    }
};
    useEffect(()=> {
        fetchHistory();

    }, [page, status, search]);
return(
    <div className="space-y-6">
        {/*tite*/}
        <h2 className="text-xl font-semibold">
            Recycle History
        </h2>

        {/*tabs+search*/}
        <div className="flex items-center justify-between">
            <Tabs
            defaultValue="ALL"
            onValueChange={(value)=>{
                setStatus(value);
                setPage(1);
            }}
            >
                <TabsList>
                <TabsTrigger value="ALL">
                    ALL
                </TabsTrigger>

                 <TabsTrigger value="PENDING">
                    Pending
                </TabsTrigger>

                 <TabsTrigger value="COMPLETED">
                    Completed
                </TabsTrigger>

                <TabsTrigger value="CANCELLED">
                    Cancelled
                </TabsTrigger>

            </TabsList>
            </Tabs>

            <Input
            placeholder="Search for transaction id..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
            />
        </div>

        {/*table*/}

        <div className="border rounded-lg bg-white">
            <Table>

                <TableHeader>
                    <TableRow>
                        <TableHead>Location</TableHead>
                        <TableHead>Material</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>

                    </TableRow>
                </TableHeader>

                <TableBody>

                    {history.map((item) => (
                        <TableRow key={item.pickupId}>

                        <TableCell>
                            {item.location}
                        </TableCell>

                        <TableCell className="flex gap-2">
                            {item.materials?.map((m:string) => (
                                <Badge key={m}>
                                    {m}
                                </Badge>
                            ))}

                        </TableCell>

                        <TableCell>
                            {item.date}
                        </TableCell>

                        <TableCell>

                            <Badge>
                                {item.status}
                            </Badge>

                        </TableCell>

                        <TableCell>
                            <Button variant="ghost">
                                View More
                            </Button>
                        </TableCell>

                        </TableRow>
                     ) )}
                </TableBody>
            </Table>

        {/*pagination*/}
        <div className="flex items-center justify-between border-t px-4 py-3 text-sm ">
                    <span>
                        Showing{history.length} items
                    </span>

                    <div className="flex gap-2">
                        <Button 
                        variant="outline"
                        disabled={page===1}
                        onClick={()=> setPage(page -1)}
                        >
                            ← Previous
                        </Button>

                        <Button
                        variant="outline"
                        onClick={()=> setPage(page+1)}
                        >
                            Next → 
                        </Button>
            </div>
            </div>
            </div>
            </div>                

);
}