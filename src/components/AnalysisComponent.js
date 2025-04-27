import React, { useMemo } from 'react';
import { Card, Container, Row, Col, Table } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';

// Register Chart.js components
ChartJS.register(...registerables);

const AnalysisComponent = ({ plants }) => {
  // Analyze traditional uses
  const { wordFrequency, topWords } = useMemo(() => {
    if (!plants || plants.length === 0) return { wordFrequency: {}, topWords: [] };
    
    // Extract and clean all traditional uses
    const allUses = plants
      .map(plant => plant['Uso tradicional'] || '')
      .join(' ')
      .toLowerCase()
      .split(/\W+/)
      .filter(word => word.length > 3); // Filter out short words

    // Count word frequency
    const wordFrequency = allUses.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {});

    // Get top 10 words
    const topWords = Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    return { wordFrequency, topWords };
  }, [plants]);

  // Prepare chart data
  const chartData = {
    labels: topWords.map(([word]) => word),
    datasets: [
      {
        label: 'Word Frequency',
        data: topWords.map(([_, count]) => count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Top 10 Traditional Uses',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Frequency',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Traditional Use Terms',
        },
      },
    },
  };

  return (
    <Container className="my-4">
      <h2 className="mb-4">Plant Usage Analysis</h2>
      
      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Word Frequency Chart</Card.Title>
              <div style={{ height: '400px' }}>
                <Bar data={chartData} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Top 10 Traditional Uses</Card.Title>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Word</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {topWords.map(([word, count]) => (
                    <tr key={word}>
                      <td>{word}</td>
                      <td>{count}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AnalysisComponent;