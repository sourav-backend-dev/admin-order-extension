import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import axios from 'axios';
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request }) => {
  try {
    console.log("Loader function started"); // Log to confirm loader execution started
    const { cors } = await authenticate.admin(request);
    console.log("Authentication successful"); // Log to confirm authentication passed

    const url = new URL(request.url);
    const orderId = url.searchParams.get("orderId");
    console.log("Order ID:", orderId); // Log to confirm orderId extraction

    const apiUrl = `https://imv3.azurewebsites.net/shipment/hatleydev/order/${orderId}`;
    console.log("API URL:", apiUrl); // Log to confirm API URL formation

    const token = "DQQcT4pRJkot19izJ5CqjX0ft5C3UydSXO3K";

    console.log("Token set"); // Log to confirm token setup

    const response = await axios.get(apiUrl, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    console.log("API call successful"); // Log to confirm API call success
    const responseData = response.data;
    console.log('Response Data from Azure API:', responseData); // Log the response data

    return cors(json(responseData));
  } catch (error) {
    console.error("Error in loader:", error);
    return json({ error: error.message }, { status: 500 });
  }
};

// export default function Data() {
//   const loaderData = useLoaderData();

//   console.log(loaderData);

//   return loaderData;
// }
