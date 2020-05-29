import React, {ReactElement} from "react";
import {AuctionManager, Item} from "./utils/auction";
import {Button, Card, CardContent, CardHeader, GridList, GridListTile} from "@material-ui/core";

export interface CurrentItemProps {
    item?: Item;
    auction: AuctionManager
}

export function CurrentItem(props: CurrentItemProps): ReactElement {
    let itemDetails = <>No item yet.</>
    if (props.item) {
        itemDetails = (
            <>
                <h2>{props.item.title}</h2>
                <GridList cellHeight={150} cols={2}>
                    {(props.item.images || []).map(x => <GridListTile key={x}><img src={x} alt="" /></GridListTile>)}
                </GridList>
                <p>{props.item.description}</p>
                <p>Start bid: ${(props.item.startBid / 100).toFixed(2)}</p>
                <Button variant="contained" color="primary" onClick={() => props.auction.closeItem()}>Close item</Button>
            </>
        );
    }
    return (
        <Card style={{width: 400, margin: 20}}>
            <CardHeader title="Current item" />
            <CardContent>
                {itemDetails}
            </CardContent>
        </Card>
    )
}