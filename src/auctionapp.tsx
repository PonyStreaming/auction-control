import React, {ReactElement, useEffect, useState} from "react";
import {AuctionManager, Bid, BidEvent, DeleteBidEvent, Item, OpenItemEvent} from "./utils/auction";
import {CurrentItem} from "./currentitem";
import {BidList} from "./bids";
import './auctionapp.css';
import {ItemList} from "./items";
import {Stats} from "./stats";

export interface AuctionAppProps {
    auction: AuctionManager;
}

export function AuctionApp(props: AuctionAppProps): ReactElement {
    const [currentItem, setCurrentItem] = useState(props.auction.getCurrentItem() || undefined);
    const [currentBids, setCurrentBids] = useState([] as Bid[]);
    const [items, setItems] = useState([] as Item[]);

    useEffect(() => {
        const updateCurrentItem = (e: Event) => {
            if (!(e instanceof OpenItemEvent)) {
                return;
            }
            setCurrentItem(e.currentItem || undefined);
            setItems(props.auction.getItems());
        }

        const closeItem = (e: Event) => {
            setCurrentItem(undefined);
            setItems(props.auction.getItems());
        }

        props.auction.addEventListener('openitem', updateCurrentItem);
        props.auction.addEventListener('closeitem', closeItem);
        setItems(props.auction.getItems());

        return () => {
            props.auction.removeEventListener('openitem', updateCurrentItem);
            props.auction.removeEventListener('closeitem', closeItem);
        }
    }, [props.auction]);

    useEffect(() => {
        if (!currentItem) {
            setCurrentBids([]);
            return;
        }

        (async () => {
            setCurrentBids(await props.auction.getItemBids(currentItem.id));
        })();
    }, [props.auction, currentItem]);

    useEffect(() => {
        const bidCreated = (e: Event) => {
            if (!(e instanceof BidEvent)) {
                return;
            }
            setCurrentBids(currentBids.concat(e.bid));
        }

        const bidDeleted = (e: Event) => {
            if (!(e instanceof DeleteBidEvent)) {
                return;
            }
            console.log(e, e.bidId, currentBids);
            setCurrentBids(currentBids.filter(x => x.id != e.bidId));
        }

        props.auction.addEventListener('bid', bidCreated);
        props.auction.addEventListener('deletebid', bidDeleted);

        return () => {
            props.auction.removeEventListener('bid', bidCreated);
            props.auction.removeEventListener('deletebid', bidDeleted);
        }
    }, [props.auction, currentBids]);

    return (
        <div className="AuctionApp">
            <CurrentItem item={currentItem} auction={props.auction} />
            <BidList bids={currentBids} auction={props.auction} />
            <ItemList items={items} currentItem={currentItem} auction={props.auction} />
            <Stats auction={props.auction} />
        </div>
    )
}