import { useEffect, useState } from "react";
import { Input, Button, Typography, Alert, Table, Pagination } from "antd";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

export default function Home() {
  const [count, setCount] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [id, setId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchAll, setSearchAll] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  // Fetch product count for pagination
  useEffect(() => {
    fetch('/api/products/count')
      .then((response) => {
        if (!response.ok) {
          throw new Error(` ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        setCount(data.count);
      })
      .catch((error) => {
        console.error(` ${error}`);
      });
  }, []);

  // Fetch all products or a specific product based on search state
  useEffect(() => {
    if (!id) {
      fetch(`/api/products?page=${page}&limit=${limit}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(` ${response.statusText}`);
          }
          return response.json();
        })
        .then((data) => {
          setProducts(data);
          setError(null);
        })
        .catch((error) => {
          setError(`Failed to fetch products: ${error.message}`);
        });
    } else if (id !== null) {
      fetch(`/api/products/${id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(` ${response.statusText}`);
          }
          return response.json();
        })
        .then((data) => {
          setProducts([data]);
          setError(null);
        })
        .catch((error) => {
          setError(`Failed to fetch product: ${error.message}`);
        });
    }
  }, [searchAll, id, page, limit]);

  const handleSearch = () => {
    if (id) {
      setSearchAll(false); // Trigger search for specific ID
    } else {
      setSearchAll(true); // Show all products if no ID provided
    }
  };

  const handlePageChange = (page: number, pageSize?: number) => {
    setPage(page);
    if (pageSize) {
      setLimit(pageSize);
    }
    window.scrollTo(0, 0);
  };

  return (
    <div style={{ padding: 20 }}>

      <Typography.Title level={2}>Home</Typography.Title>
      <Typography.Text>
        Welcome to the Home page! Here you can view all products or search for a specific product by ID.
      </Typography.Text>
      <Typography.Text type="secondary">Product Count: {count}</Typography.Text>

      <div style={{ marginTop: 20 }}>
        <Input
          placeholder="Enter Product ID"
          type="number"
          value={id !== null ? id.toString() : ""}
          onChange={(e) => setId(parseInt(e.target.value) || null)}
          style={{ width: 200, marginRight: 10 }}
        />
        <Button type="primary" onClick={handleSearch}>
          Search
        </Button>
      </div>

      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          style={{ marginTop: 20 }}
        />
      )}

      <Table
        dataSource={products}
        rowKey="id"
        columns={[
          {
            title: "ID",
            dataIndex: "id",
            key: "id",
          },
          {
            title: "Title",
            dataIndex: "name",
            key: "name",
          },
          {
            title: "Price",
            dataIndex: "price",
            key: "price",
          },
          {
            title: "Description",
            dataIndex: "description",
            key: "description",
          },
        ]}
        pagination={false}
      />

      {searchAll && (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Pagination
            current={page}
            pageSize={limit}
            total={count}
            onChange={handlePageChange}
            showSizeChanger
            pageSizeOptions={['5', '10', '20', '50']}
          />
        </div>
      )}
    </div>
  );
}
