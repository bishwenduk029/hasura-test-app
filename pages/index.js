import { useState } from "react";
import useSWR from "swr";
import Head from "next/head";

const API_URL = "http://localhost:3000/api/restaurants";

async function fetchRestaurants(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

export default function Home(props) {
  const initialData = props.data;
  let restaurants = [];
  const [offset, setoffset] = useState(0);
  const { data } = useSWR(
    offset !== 0 ? `${API_URL}?offset=${offset}&size=${5}` : null,
    fetchRestaurants,
    { initialData }
  );
  if (data) {
    console.log(data);
    restaurants = [...restaurants, ...data.restaurants];
  } else {
    restaurants = initialData.restaurants;
  }

  return (
    <div className="container">
      <Head>
        <title>Hasura Test Apps</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">
          Welcome to <a href="https://hasura.io/">Hasura Test App!</a>
        </h1>
        <p>List of Restaurants</p>

        <div>
          <table id="table">
            <thead>
              <tr>
                {Object.keys(restaurants[0]).map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {restaurants.map((restaurant) => (
                <tr key={restaurant._id}>
                  {Object.keys(restaurant).map((columnName) => {
                    if (Array.isArray(restaurant[columnName])) {
                      return <td>{restaurant[columnName][0].grade}</td>;
                    }

                    if (typeof restaurant[columnName] === "object") {
                      return (
                        <td>{`${restaurant[columnName].building}, ${restaurant[columnName].street} - ${restaurant[columnName].zipcode}`}</td>
                      );
                    }

                    return <td>{restaurant[columnName]}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel Logo" className="logo" />
        </a>
      </footer>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .table {
          text-align: left;
        }

        #table {
          font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
          border-collapse: collapse;
          width: 100%;
        }

        #table td,
        #table th {
          border: 1px solid #ddd;
          padding: 8px;
        }

        #table tr:nth-child(even) {
          background-color: #f2f2f2;
        }

        #table tr:hover {
          background-color: #ddd;
        }

        #table th {
          padding-top: 12px;
          padding-bottom: 12px;
          text-align: left;
          background-color: grey;
          color: white;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .logo {
          height: 1em;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}

export async function getStaticProps() {
  const data = await fetchRestaurants(`${API_URL}?offset=0&size=10`);
  return {
    props: {
      data,
    },
  };
}
