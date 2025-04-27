import React, { useMemo, useState } from 'react';
import { Card, Container, Table, Form, Badge } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const Afflictions = ({ plants, setFilter }) => {
  const [minCount, setMinCount] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  // Main analysis function
  const { wordFrequency, topWords } = useMemo(() => {
    if (!plants || plants.length === 0) return { wordFrequency: {}, topWords: [] };

    const stopwords = new Set([
      "como", "para", "contra", "utiliza", "utilizan", "utilizado", "emplean", "emplea", "sobre",
      "cuando", "también", "aplica", "toma", "después", "todo", "local", "tiene", "tres",
      "hecha", "puede", "bien", "cualquier", "debajo", "como", "poco",
      "arequipa", "norte", "valdizán", "loreto", "cajamarca", "huancayo", "ambo", "urrunaga", "piura", "trujillo",
      "puno", "cusco", "hualgayoc", "jauja", "huaylas", "huaraz", "ayacucho", "huacho", "sicuani", "pachacamac", "hojas",
      "flores", "frutos", "fruto", "planta", "semillas", "raíz", "ramas", "cáscara", "corteza", "savia", "polvo", "aceite",
      "jugo", "tintura", "pomada", "emplasto", "cataplasma", "infusión", "cocimiento", "maceración", "preparado", "hervido",
      "hervida", "cocina", "agua", "cuerpo", "tipo", "caso", "casos", "general", "mucho", "todas", "algunas", "parte", "persona",
      "personas", "hecho", "tener", "hacer", "comer", "comen", "bebe", "ayuda", "evita", "según", "vida", "tierra", "humo", "color",
      "mañana", "durante", "recién", "después", "externo", "interno", "aplicaciones", "lavado", "lavados", "baños", "fricciones",
      "gargarismos", "colocan", "aplican", "poco", "mucho", "excesivo", "cantidad", "dosis", "chicha", "vino", "aguardiente", "vinagre",
      "leche", "miel", "azúcar", "huevo", "cebolla", "limón", "maíz", "arroz", "ajos", "higos", "rocoto", "paico", "chupos", "chancaca",
      "olivo", "algodón", "caliente", "frío", "fuerte", "suave", "verde", "verdes", "seco", "secos", "negro", "negra", "empleado", "este"
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

    return {
      wordFrequency,
      topWords: Object.entries(wordFrequency)
        .sort((a, b) => b[1] - a[1])
    };
  }, [plants]);

  // Filter words based on count and search term
  const filteredWords = useMemo(() => {
    return topWords.filter(([word, count]) => 
      count >= minCount && 
      word.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [topWords, minCount, searchTerm]);

  // Chart data configuration
  const chartData = {
    labels: filteredWords.slice(0, 20).map(([word]) => word),
    datasets: [{
      label: 'Word Frequency',
      data: filteredWords.slice(0, 20).map(([_, count]) => count),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: { display: true, text: 'Top Traditional Use Terms' },
      tooltip: {
        callbacks: {
          label: (context) => {
            const percentage = ((context.raw / plants.length) * 100).toFixed(1);
            return `${context.raw} uses (${percentage}%)`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Frequency' }
      }
    }
  };

  const handleWordClick = (word) => {
    setFilter(word);
  };

  return (
    <Container className="my-4">
      {/* <h2 className="mb-4 text-center">
        <Badge bg="primary">Aflicción</Badge>
      </h2> */}

      {/* <Card className="mb-4 shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between mb-3">
            <Form.Group style={{ width: '200px' }}>
              <Form.Label>Minimum Count:</Form.Label>
              <Form.Control
                type="number"
                value={minCount}
                onChange={(e) => setMinCount(Number(e.target.value))}
                min="1"
              />
            </Form.Group>

            <Form.Group style={{ width: '300px' }}>
              <Form.Label>Search Terms:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Filter terms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form.Group>
          </div>

          <div style={{ height: '400px' }}>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </Card.Body>
      </Card> */}

      <Card className="shadow-sm">
        <Card.Body style={{ maxHeight: '50vh', overflowY: 'auto' }}>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>Aflicción</th>
                {/* <th>Count</th>
                <th>Percentage</th> */}
              </tr>
            </thead>
            <tbody>
              {filteredWords.map(([word, count]) => (
                <tr 
                  key={word} 
                  onClick={() => handleWordClick(word)}
                  style={{ cursor: 'pointer' }}
                  className="hover-highlight"
                >
                  <td>{word}</td>
                  {/* <td>{count}</td>
                  <td>{((count / plants.length) * 100).toFixed(1)}%</td> */}
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Afflictions;