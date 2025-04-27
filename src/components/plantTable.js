import { useMemo, useState, useEffect } from 'react';
import { Table, Modal, Button,Row,Col, Tabs,Tab } from 'react-bootstrap';
import { 
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender
} from '@tanstack/react-table';

const PlantTable = ({ data }) => {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const columns = useMemo(() => [
    {
      header: 'Nombre común',
      accessorKey: 'Nombre común',
    },
    {
      header: 'Familia',
      accessorKey: 'Familia',
    },
    {
      header: 'Nombre científico',
      accessorKey: 'Nombre científico',
    },
    {
      header: 'Parte de la planta utilizada',
      accessorKey: 'Parte de la planta utilizada',
    },
    {
      header: 'Uso tradicional',
      accessorKey: 'Uso tradicional',
    },
    {
      header: 'Habitat',
      accessorKey: 'Hábitat',
    },
    {
      header: 'Pais',
      accessorKey: 'Country',
    }
  ], []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleRowClick = (row) => {
    const commonName = row.getValue('Nombre común');
    const family = row.getValue('Familia');
    const scientificName = row.getValue('Nombre científico');
    const query = `${commonName || ''} ${family || ''} ${scientificName || ''}`
  .trim()
  .replace(/\s+/g, '+');
    setSearchQuery(query);
    setShowModal(true);
  };

  const [images, setImages] = useState([]);

useEffect(() => {
  if (searchQuery) {
    fetch(`https://commons.wikimedia.org/w/api.php?action=query&generator=images&titles=${searchQuery}&prop=imageinfo&iiprop=url&format=json&origin=*`)
      .then(res => res.json())
      .then(data => {
        const imageData = Object.values(data.query?.pages || {});
        setImages(imageData);
      });
  }
}, [searchQuery]);

  return (
    <>
      <Table striped bordered hover responsive>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th 
                  key={header.id} 
                  onClick={header.column.getToggleSortingHandler()}
                  style={{ cursor: 'pointer' }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {{
                    asc: ' 🔼',
                    desc: ' 🔽',
                  }[header.column.getIsSorted()] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr 
              key={row.id} 
              onClick={() => handleRowClick(row)}
              style={{ cursor: 'pointer' }}
              className="hover-highlight"
            >
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for Google Image Search */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)}
        size="xl"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Image Search Results</Modal.Title>
        </Modal.Header>


        <Modal.Body style={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
  {/* Bing iframe - the only working embedded option */}
  <div style={{ flex: 1, minHeight: '400px' }}>
    <iframe
      src={`https://www.bing.com/images/search?q=${encodeURIComponent(searchQuery)}`}
      title="Bing Image Search"
      width="100%"
      height="100%"
      style={{ border: 'none' }}
    />
  </div>

  {/* Search engine buttons */}
  <div className="mt-3">
    <h6>Search on other engines:</h6>
    <Row className="g-2">
      <Col xs={6} md={3}>
        <Button 
          variant="outline-danger" 
          href={`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}&tbm=isch`} 
          target="_blank"
          className="w-100 mb-2"
          size="sm"
        >
          Google
        </Button>
      </Col>
      <Col xs={6} md={3}>
        <Button 
          variant="outline-primary" 
          href={`https://yandex.com/images/search?text=${encodeURIComponent(searchQuery)}`} 
          target="_blank"
          className="w-100 mb-2"
          size="sm"
        >
          Yandex
        </Button>
      </Col>
      <Col xs={6} md={3}>
        <Button 
          variant="outline-success" 
          href={`https://duckduckgo.com/?q=${encodeURIComponent(searchQuery)}&iax=images&ia=images`} 
          target="_blank"
          className="w-100 mb-2"
          size="sm"
        >
          DuckDuckGo
        </Button>
      </Col>
      <Col xs={6} md={3}>
        <Button 
          variant="outline-dark" 
          href={`https://www.ecosia.org/images?q=${encodeURIComponent(searchQuery)}`} 
          target="_blank"
          className="w-100 mb-2"
          size="sm"
        >
          Ecosia
        </Button>
      </Col>
      <Col xs={6} md={3}>
        <Button 
          variant="outline-warning" 
          href={`https://unsplash.com/s/photos/${encodeURIComponent(searchQuery)}`} 
          target="_blank"
          className="w-100 mb-2"
          size="sm"
        >
          Unsplash
        </Button>
      </Col>
      <Col xs={6} md={3}>
        <Button 
          variant="outline-info" 
          href={`https://www.pexels.com/search/${encodeURIComponent(searchQuery)}/`} 
          target="_blank"
          className="w-100 mb-2"
          size="sm"
        >
          Pexels
        </Button>
      </Col>
      <Col xs={6} md={3}>
        <Button 
          variant="outline-secondary" 
          href={`https://pixabay.com/images/search/${encodeURIComponent(searchQuery)}/`} 
          target="_blank"
          className="w-100 mb-2"
          size="sm"
        >
          Pixabay
        </Button>
      </Col>
      <Col xs={6} md={3}>
        <Button 
          variant="outline-dark" 
          href={`https://search.yahoo.com/search?p=${encodeURIComponent(searchQuery)}&ei=UTF-8&fr=sfp&iscqry=`} 
          target="_blank"
          className="w-100 mb-2"
          size="sm"
        >
          Yahoo
        </Button>
      </Col>
    </Row>
  </div>
</Modal.Body>



        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowModal(false)}
          >
            Close
          </Button>
          <Button 
            variant="primary" 
            href={`https://www.google.com/search?q=${searchQuery}&tbm=isch`} 
            target="_blank"
          >
            Open in New Tab
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PlantTable;