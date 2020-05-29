import React, {ReactElement, useEffect, useState} from "react";
import {Card, CardContent} from "@material-ui/core";
import {AuctionManager} from "./utils/auction";
import moment from "moment-timezone";

export interface StatsProps {
    auction: AuctionManager;
}

export function Stats(props: StatsProps): ReactElement {
    const [totalRaised, setTotalRaised] = useState(undefined as number | undefined);
    const [time, setTime] = useState(moment());

    useEffect(() => {
        async function updateTotal() {
            setTotalRaised(await props.auction.getTotalCents());
        }

        props.auction.addEventListener('openitem', updateTotal);
        props.auction.addEventListener('closeitem', updateTotal);
        updateTotal();

        return () => {
            props.auction.removeEventListener('openitem', updateTotal);
            props.auction.removeEventListener('closeite,', updateTotal);
        }
    }, [props.auction]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(moment());
        }, 1000);

        return () => {
            clearInterval(interval);
        }
    })

    return (
        <Card style={{width: 400, margin: 20}}>
            <CardContent>
                <p>Current time: {time.tz("America/New_York").format("HH:mm:ss")} EDT</p>
                <p>Total raised: {totalRaised === undefined ? 'loading': '$' + (totalRaised/100).toFixed(2)}</p>
            </CardContent>
        </Card>
    )
}