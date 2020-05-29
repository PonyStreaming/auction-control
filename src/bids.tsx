import React, {ReactElement} from "react";
import {AuctionManager, Bid} from "./utils/auction";
import {
    Card,
    CardContent,
    CardHeader,
    IconButton,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText
} from "@material-ui/core";
import Delete from '@material-ui/icons/Delete';
import {reverse} from "./utils/reverse";

export interface BidListProps {
    bids: Bid[];
    auction: AuctionManager;
}

export function BidList(props: BidListProps): ReactElement {
    return (
        <Card style={{width: 400, margin: 20}}>
            <CardHeader title="Current Bids" />
            <CardContent>
                <List>
                    {Array.from(reverse(props.bids).entries()).slice(0, 10).map(([i, x]) => (
                        <ListItem selected={i === 0} key={x.id}>
                            <ListItemText primary={`${x.bidderDisplayName} — $${(x.bid / 100).toFixed(2)}`} />
                            <ListItemSecondaryAction>
                                <IconButton onClick={() => props.auction.deleteBid(x.itemId, x.id)}><Delete /></IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </Card>
    )
}