import React, { useMemo } from 'react';
import { Card, Container, Row, Col, Table, Badge } from 'react-bootstrap';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const AnalysisComponent2 = ({ plants }) => {
  // Main analysis function
  const { wordFrequency, topWords, countryDistribution, plantParts } = useMemo(() => {
    if (!plants || plants.length === 0) return {
      wordFrequency: {},
      topWords: [],
      countryDistribution: {},
      plantParts: {}
    };

    const stopwords = new Set([
        "como", "para", "contra", "utiliza", "utilizan", "utilizado", "emplean", "emplea", "sobre",
        "cuando", "también", "aplica", "toma", "después", "todo", "local", "tiene", "tres",
        "hecha", "puede", "bien", "cualquier", "debajo", "como","poco",
        "arequipa","norte","valdizán","loreto","cajamarca","huancayo","ambo","urrunaga","piura","trujillo",
        "puno","cusco","hualgayoc","jauja","huaylas","huaraz","ayacucho","huacho","sicuani","pachacamac","hojas",
        "flores","frutos","fruto","planta","semillas","raíz","ramas","cáscara","corteza","savia","polvo","aceite",
        "jugo","tintura","pomada","emplasto","cataplasma","infusión","cocimiento","maceración","preparado","hervido",
        "hervida","cocina","agua","cuerpo","tipo","caso","casos","general","mucho","todas","algunas","parte","persona",
        "personas","hecho","tener","hacer","comer","comen","bebe","ayuda","evita","según","vida","tierra","humo","color",
        "mañana","durante","recién","después","externo","interno","aplicaciones","lavado","lavados","baños","fricciones",
        "gargarismos","colocan","aplican","poco","mucho","excesivo","cantidad","dosis","chicha","vino","aguardiente","vinagre",
        "leche","miel","azúcar","huevo","cebolla","limón","maíz","arroz","ajos","higos","rocoto","paico","chupos","chancaca",
        "olivo","algodón","caliente","frío","fuerte","suave","verde","verdes","seco","secos","negro","negra","empleado","este"

      ]);
      
      const allUses = plants
        .map(plant => plant['Uso tradicional'] || '')
        .join(' ')
        .toLowerCase()
        .match(/\p{L}+/gu)  // preserve accented words
        ?.filter(word => word.length > 3 && !stopwords.has(word)) || [];

    const wordFrequency = allUses.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {});

    // Country distribution
    const countryDistribution = plants.reduce((acc, plant) => {
      acc[plant.Country] = (acc[plant.Country] || 0) + 1;
      return acc;
    }, {});

    // Plant parts analysis
    const plantParts = plants.reduce((acc, plant) => {
      const parts = (plant['Parte de la planta utilizada'] || '').split(/,\s*/);
      parts.forEach(part => {
        if (part) acc[part] = (acc[part] || 0) + 1;
      });
      return acc;
    }, {});

    return {
      wordFrequency,
      topWords: Object.entries(wordFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 550),
      countryDistribution,
      plantParts: Object.entries(plantParts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
    };
  }, [plants]);

  // Chart data configurations
  const charts = {
    wordUsage: {
      data: {
        labels: topWords.map(([word]) => word),
        datasets: [{
          label: 'Word Frequency',
          data: topWords.map(([_, count]) => count),
          backgroundColor: [
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(153, 102, 255, 0.6)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Top Traditional Use Terms' },
          legend: { display: false }
        }
      }
    },
    countryData: {
      data: {
        labels: Object.keys(countryDistribution),
        datasets: [{
          label: 'Plants per Country',
          data: Object.values(countryDistribution),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Plant Distribution by Country' }
        }
      }
    },
    plantParts: {
      data: {
        labels: plantParts.map(([part]) => part),
        datasets: [{
          data: plantParts.map(([_, count]) => count),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Plant Parts Utilization' }
        }
      }
    }
  };

  return (
    <Container className="my-4">
      <h2 className="mb-4 text-center">
        <Badge bg="success">Plant Data Analysis Dashboard</Badge>
      </h2>
      
      <Row className="g-4">
        {/* Word Frequency Chart */}
        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body style={{maxHeight:"50vh", overflowY:"auto"}}>
              <Card.Title className="text-center">Traditional Uses</Card.Title>
              <div style={{ height: '300px' }}>
                <Bar data={charts.wordUsage.data} options={charts.wordUsage.options} />
              </div>
              <Table striped bordered hover size="sm" className="mt-3">
                <thead>
                  <tr>
                    <th>Term</th>
                    <th>Count</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {topWords.map(([word, count]) => (
                    <tr key={word}>
                      <td>{word}</td>
                      <td>{count}</td>
                      <td>{((count / plants.length) * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Country Distribution */}
        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title className="text-center">By Country</Card.Title>
              <div style={{ height: '300px' }}>
                <Bar data={charts.countryData.data} options={charts.countryData.options} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Plant Parts Pie Chart */}
        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title className="text-center">Plant Parts Used</Card.Title>
              <div style={{ height: '300px' }}>
                <Pie data={charts.plantParts.data} options={charts.plantParts.options} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Raw Data Summary */}
        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title className="text-center">Dataset Summary</Card.Title>
              <Table striped bordered hover>
                <tbody>
                  <tr>
                    <td>Total Plants</td>
                    <td>{plants.length}</td>
                  </tr>
                  <tr>
                    <td>Countries Represented</td>
                    <td>{Object.keys(countryDistribution).length}</td>
                  </tr>
                  <tr>
                    <td>Most Common Country</td>
                    <td>
                      {Object.entries(countryDistribution)
                        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
                      {' '}({Math.max(...Object.values(countryDistribution))})
                    </td>
                  </tr>
                  <tr>
                    <td>Most Used Plant Part</td>
                    <td>
                      {plantParts[0]?.[0] || 'N/A'}
                      {' '}({plantParts[0]?.[1] || 0})
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AnalysisComponent2;