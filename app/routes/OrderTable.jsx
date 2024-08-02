import React from 'react';
import { DataTable } from '@shopify/polaris';

const OrderTable = ({ orders }) => {
  // Define columns for DataTable
  const columns = [
    { 
      header: 'Order Number', 
      key: 'orderNumber', 
      render: order => <span>{order.order_number}</span> 
    },
    { 
      header: 'Total Price', 
      key: 'totalPrice', 
      render: order => <span>{order.total_price}</span> 
    },
    { 
      header: 'Created At', 
      key: 'createdAt', 
      render: order => <span>{order.created_at}</span> 
    },
    // Add more columns as needed
  ];

  // Map order data to rows for DataTable
  const rows = orders.map(order => ({
    ...order,
    id: order.id, // Ensure each row has a unique identifier
  }));

  return (
    <DataTable
      columnContentTypes={['text', 'numeric', 'text']}
      headings={columns.map(column => column.header)}
      rows={rows}
    />
  );
};

export default OrderTable;
