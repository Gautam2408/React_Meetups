import Head from "next/head";
import classes from "./MeetupDetail.module.css";
import { MongoClient, ObjectId } from "mongodb";
export default function MeetupDetails(props) {
  return (
    <>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </Head>
      <section className={classes.detail}>
        <img src={props.meetupData.image} alt="first image" />
        <h1>{props.meetupData.title}</h1>
        <address>{props.meetupData.address}</address>
        <p>{props.meetupData.description}</p>
      </section>
    </>
  );
}

/*
NextJS needs to pre-generate all versions of this dynamic page in advance for all the supported 
IDs. Because since this is dynamic, NextJS needs to know for which ID values it should pre-generate 
the page. Because how would it pre-generate this page otherwise? We get the ID from the URL here.
Great, but keep in mind that this is not pre-generated when a user visits this page with a specific 
value in the URL, but during the build process. So here we need to pre-generated for all the URLs, 
for all the meetup ID values users might be entering at runtime.

fallback key tells NextJS whether your paths array contains all supported parameter values or just 
some of them. If you set fall back to false, you say that your paths contains all supported meetup 
ID values. That means that if the user enters anything that's not supported here, for example, M3
he or she would see a 404 error. If you set fall back to true on the other hand, NextJS would try to 
generate a page for this meetup ID dynamically on the server for the incoming request.
*/

export async function getStaticPaths() {
  const client = await MongoClient.connect("mongodb://0.0.0.0/");
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  // we are telling mongodb to only retrieve _id & no other field values
  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  client.close();

  return {
    fallback: false,
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
}

export async function getStaticProps(context) {
  // as we can't use useRouter() hook here
  const meetupId = context.params.meetupId;

  //fetch data for a single meetup
  const client = await MongoClient.connect("mongodb://0.0.0.0/");
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const selectedMeetup = await meetupsCollection.findOne({
    _id: new ObjectId(meetupId),
  });

  client.close();

  const x = JSON.stringify(selectedMeetup);

  return {
    props: {
      meetupData: JSON.parse(x),
    },
  };
}
