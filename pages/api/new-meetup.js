// this is a api route: /api/new-meetup
// only runs on server (ie. backend)

import { MongoClient } from "mongodb";

// only POST req are trigerred
export default async function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body;
    console.log(data);

    // now this code should never run on client's browser(ie. frontend) as it
    // would expose our private information
    // we have also given name of db as meetups after mongodb.net/
    const client = await MongoClient.connect("mongodb://0.0.0.0/0");
    const db = client.db();

    const meetupsCollection = db.collection("meetups");

    const result = await meetupsCollection.insertOne(data);

    console.log(result);

    client.close();

    res.status(201).json({ message: "Meetup inserted!" });
  }
}
