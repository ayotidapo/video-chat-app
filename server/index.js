const express = require("express");
const OpenTok = require("opentok");

const app = express();

const API_KEY = `*****`;
const SECRET_KEY = `****************`;

const opentok = new OpenTok(API_KEY, SECRET_KEY);

const port = process.env.PORT || 3000;

app.use(express.json());

app.listen(port, () => console.log("Server listening at port " + port));

app.get("/sessionId", (req, res) => {
  //res.redirect("http://google.com");
  opentok.createSession({ mediaMode: "routed" }, function (error, session) {
    if (error) {
      console.log("Error creating session:", error);
      res.json({ error });
    } else {
      const { sessionId } = session;
      const tokenOptions = { role: "publisher" };
      const token = opentok.generateToken(sessionId, tokenOptions);
      app.set("sessionId", sessionId);
      const data = {
        sessionId,
        token,
      };
      res.json({ data: data });
    }
    //console.log(sessionId + "1");
  });
});

app.post("/startBroadcast", (req, res) => {
  const sessionId = req.body.sessionId;
  const broadcastOptions = {
    outputs: {
      hls: {},
      rtmp: [
        {
          id: "Facebook",
          serverUrl: "rtmps://live-api-s.facebook.com:443/rtmp/",
          streamName:
            "3986287044730803?s_bl=1&s_sml=3&s_sw=0&s_vt=api-s&a=Abz2knQPaPTHR8-d",
        },
        {
          id: "Youtube",
          serverUrl: "rtmps://live-api-s.facebook.com:443/rtmp/",
          streamName: "0ug1-de04-q9q6-a6e1",
        },
      ],
    },
  };

  opentok.startBroadcast(sessionId, broadcastOptions, (err, broadcast) => {
    console.log(sessionId + "20");
    if (err) {
      console.log(err);
      //res.status(500).send("", err);
      //  return `An error occured!: ${err}`;
      res.json(err);
    } else {
      app.set("broadcastId", broadcast.id);
      res.json(broadcast);
      console.log("success");
      return broadcast;
    }
  });
});

app.get("/stopBroadcast", (req, res) => {
  const broadcastId = app.get("broadcastId");
  opentok.stopBroadcast(broadcastId, (err, broadcast) => {
    if (err) {
      console.log(err);
      //res.status(500).send("An error occured!");
    } else {
      app.set("broadcastId", null);
      console.log("broadcast has been stoped");
      res.json(broadcast);
    }
  });
});
