import React, {ReactElement, useState} from "react";
import {AuctionManager, Item} from "./utils/auction";
import {Card, CardContent, CardHeader, List, ListItem, ListItemText, ListSubheader, Snackbar} from "@material-ui/core";

export interface ItemListProps {
    items: Item[];
    currentItem?: Item;
    auction: AuctionManager;
}

export function ItemList(props: ItemListProps): ReactElement {
    const [warningMessage, setWarningMessage] = useState("");

    async function openItem(item: Item): Promise<void> {
        if (props.currentItem) {
            setWarningMessage("You already have an item open for bidding, so cannot open another.");
            return;
        }
        if (item.closed && !window.confirm(`Are you sure you want to re-open a previously auctioned item (${item.title}) for bidding?`)) {
            return;
        }
        await props.auction.openItem(item.id);
    }

    function generateListItem(item: Item): ReactElement {
        return (
            <ListItem key={item.id} button onClick={() => openItem(item)}>
                <ListItemText primary={item.title} secondary={`${item.donator} — ${item.country}`} />
            </ListItem>
        )
    }

    const openItems = props.items.filter(x => !x.closed && x.id != props.currentItem?.id);
    const open = openItems.length == 0 ? <></> : <><ListSubheader>Pending items</ListSubheader>{openItems.map(generateListItem)}</>
    const currentItems = props.items.filter(x => x.id == props.currentItem?.id);
    const current = currentItems.length == 0 ? <></> : <><ListSubheader>Current item</ListSubheader>{currentItems.map(generateListItem)}</>
    const closedItems = props.items.filter(x => x.closed && x.id != props.currentItem?.id);
    const closed = closedItems.length == 0 ? <></> : <><ListSubheader>Closed items</ListSubheader>{closedItems.map(generateListItem)}</>

    return (
        <>
        <Card style={{width: 400, margin: 20}}>
            <CardHeader title="Items" />
            <CardContent>
                <List>
                    {open}
                    {current}
                    {closed}
                </List>
            </CardContent>
        </Card>
        <Snackbar message={warningMessage} open={warningMessage != ""} autoHideDuration={6000} onClose={() => setWarningMessage("")} />
        </>
    )
}
