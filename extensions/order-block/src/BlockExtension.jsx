import {
  reactExtension,
  useApi,
  AdminBlock,
  BlockStack,
  Text,
  Divider,
  Heading,
  Button,
} from '@shopify/ui-extensions-react/admin';

import {useCallback, useState} from "react";
import shippingData from './order.json';


// The target used here must match the target used in the extension's toml file (./shopify.extension.toml)
const TARGET = 'admin.order-details.block.render';
const idNumber = '5613424607321';

export default reactExtension(TARGET, () => <App />);

function App() {


  const {data} = useApi(TARGET);
  //console.log({data});
  const { rates } = shippingData;
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);



  const getResponse = useCallback(async () => {
    try {
      const res = await fetch(`/api/fetchorder?orderId=${idNumber}`);
      
      console.log('Response:', res); // Log the full response for debugging
      if (!res.ok) {
        throw new Error(`Network response was not ok: ${res.statusText}`);
      }
      const contentType = res.headers.get("content-type");
      console.log('Content-Type:', contentType); // Log content type for debugging
      if (!contentType || !contentType.includes("application/json")) {
        throw new TypeError("Expected JSON response");
      }
      const result = await res.json();
      console.log('Parsed JSON:', result); // Log parsed JSON for debugging
      setResponseData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    }
  }, []);

  getResponse();

  const rateList = rates.map(rate => ({
    id: rate.id,
    carrier: rate.carrier,
    service: rate.service,
    rate: rate.rate
  }));





  const [showRates, setShowRates] = useState(false);

  const handleToggleRates = () => {
    setShowRates(!showRates);
  };


  return (
    // The AdminBlock component provides an API for setting the title of the Block extension wrapper.
    <AdminBlock title="Return Item">
      <BlockStack gap>
       <Heading size="3">
        Shipment Options
       </Heading>
       <Button onClick={handleToggleRates}>
       {showRates ? 'Hide Rates' : 'Show Rates'}
       </Button>
       <Divider/>
      </BlockStack>
      <BlockStack gap="small">
      {showRates && rateList.map((rate, index) => (
          <BlockStack key={index} gap="small">
            <Text>ID: {rate.id}</Text>
            <Text>Carrier: {rate.carrier}</Text>
            <Text>Service: {rate.service}</Text>
            <Text>Rate: {rate.rate} CAD</Text>
            <Button>Buy Rate</Button>
          </BlockStack>
        ))}
      </BlockStack>
    </AdminBlock>
  );
}
