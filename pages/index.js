import MeetupList from "@/components/meetups/MeetupList";
import { MongoClient } from "mongodb";
import Head from "next/head";
import { Fragment } from "react";
// const DUMMY_LIST = [
//   {
//     id: "m1",
//     title: "A first Meetup",
//     image:
//       "https://media.istockphoto.com/id/513247652/photo/panoramic-beautiful-view-of-mount-ama-dablam.jpg?s=1024x1024&w=is&k=20&c=ZKAEiIpjE9z6pmpZFVvnG_ymfsrZD7wFVPoB0LpLDYA=",
//     address: "abc",
//     description: "This is a first meetup",
//   },
//   {
//     id: "m2",
//     title: "A second Meetup",
//     image:
//       "https://cdn.pixabay.com/photo/2015/06/19/21/24/avenue-815297_1280.jpg",
//     address: "xyz",
//     description: "This is a second meetup",
//   },
// ];
export default function HomePage(props) {
  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
        <meta
          name="description"
          content="Browse a huge list of highlt active React meetups"
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
}

/*
Great for search engines then because now, data is NOT fetched in a second component render
cycle on the client but initially, before this page is pre-rendered, during the build process.
*/
export async function getStaticProps() {
  // fetch data from API
  // instead of directly executing this mongodb we could have send a fetch request to the route
  // same as we did while adding new meetup. But we don't want to add extra overhead of doing

  const client = await MongoClient.connect("mongodb://127.0.0.1:27017");
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  // find will by default find all objects
  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },

    /*
    revalidate set to 10(some number), this page will not just be generated during the build process, but
    it will also be generated every 10 seconds on the server, at least if there are requests for this
    page. And then these regenerated pages would replace the old pre-generated pages.
    */
    revalidate: 10,
  };
}

// /*
// So you want to pre-generate the page dynamically on the fly after deployment on the server. Not during
// the build process and not every couple of seconds, but for every incoming request. This code only runs
// on the server. getStaticProps is actually better. Because there you pre-generate an HTML file, that file
// can then be stored and served by a CDN. And that simply is faster than regenerating and fetching that data
// for every incoming request. So your page will be faster when working with getStaticProps, because then it
// can be cached and reused, instead of regenerated all the time.
// */
// export async function getServerSideProps(context) {
//   const req = context.req;
//   const res = context.res;

//   // fetch data from an API

//   return {
//     props: {
//       meetups: DUMMY_LIST,
//     },
//   };
// }
