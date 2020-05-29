import React, {ReactElement, useEffect, useState} from 'react';
import './App.css';
import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
} from "@material-ui/core";
import {AuctionManager} from "./utils/auction";
import {AuctionApp} from "./auctionapp";


function App(): ReactElement {
  const [password, setPassword] = useState(localStorage["auctionPassword"] || "");
  const [loggedIn, setLoggedIn] = useState(false);
  const [ready, setReady] = useState(false);
  const [auctionManager, setAuctionManager] = useState(null as null | AuctionManager);

  function logIn() {
    localStorage["auctionPassword"] = password;
    setLoggedIn(true);
  }

  useEffect(() => {
    if (!loggedIn) {
      return;
    }
    let am = new AuctionManager(password);

    const onReady = () => {
      setReady(true);
    }

    am.addEventListener('ready', onReady);
    setAuctionManager(am);

    return () => {
      am.removeEventListener('ready', onReady);
      setAuctionManager(null);
    }
  }, [password, loggedIn]);

  if (!loggedIn) {
    return (
        <Grid container justify="center" style={{padding: 20, width: "100%"}} spacing={3}>
          <Grid item xs={4}>
            <Card style={{width: 500}}>
              <CardContent>
                <Grid justify="flex-end" container spacing={2}>
                  <Grid item xs={12}>
                    <TextField value={password} onChange={(e) => setPassword(e.target.value)} onKeyPress={(e) => { if (e.key === "Enter") { logIn(); }}} type="password" label="Password" style={{width: "100%"}}/>
                  </Grid>
                  <Grid item xs={3} style={{textAlign: "right"}}>
                    <Button variant="contained" color="primary" onClick={logIn}>Log in</Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
    );
  }

  if (!ready || !auctionManager) {
    return <p>Loading...</p>
  }

  return <AuctionApp auction={auctionManager} />
}

export default App;
