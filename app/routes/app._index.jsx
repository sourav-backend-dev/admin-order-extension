import { Page, DataTable,Badge,Text } from '@shopify/polaris';
import React from 'react';
import { useLoaderData } from '@remix-run/react';
import shopify from '../shopify.server'; 
import { json } from '@remix-run/react';


export async function loader({ request }) {
  const { admin, session } = await shopify.authenticate.admin(request);
  const data = await admin.rest.resources.Order.all({
    session: session,
    status: "any",
  });
  console.log()
  return json(data.data);
}

function OrdersTable() {
  const orders = useLoaderData();
  const rows = orders.map(order => [
    <Text variant="bodyMd" fontWeight="bold" as="span">
      #{order.order_number}
    </Text>,
    order.customer.admin_graphql_api_id ? order.customer.admin_graphql_api_id.split('/').pop() : 'No Customer Found',
    new Date(order.created_at).toLocaleString(),
    `$${order.total_price}`,
    order.financial_status === 'paid' ? <Badge status="success" progress="complete">Paid</Badge> : <Badge status="warning" progress="incomplete">Unpaid</Badge>,
    order.fulfillment_status === 'fulfilled' ? <Badge status="success" progress="complete">Fulfilled</Badge> : <Badge status="warning" progress="incomplete">Unfulfilled</Badge>,
  ]);

  const columns = [
    'Order Number',
    'Customer ID',
    'Created At',
    'Total Price',
    'Payment Status',
    'Fulfillment Status',
  ];

  return (
    <Page title="Orders">
      <DataTable
        columnContentTypes={['text', 'text', 'text', 'text', 'text', 'text']}
        headings={columns}
        rows={rows}
      />
    </Page>
  );
}

export default OrdersTable;
