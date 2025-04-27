import React, {useState,useMemo, useEffect} from 'react';
import { Container, Tab,Tabs, Row,Col,Badge } from 'react-bootstrap';
// import { SearchControls, PlantTable } from "./components"
import { getPlants } from './data/loader';
import Fuse from 'fuse.js';
import  SearchControls  from './components/SearchControls';
import  PlantTable  from './components/plantTable';
 import AnalysisComponent from './components/AnalysisComponent.js';
 import AnalysisComponent2 from './components/AnalysisComponent2.js';
 import Afflictions from './components/Afflictions.js';

function App() {

  const [activeTab, setActiveTab] = useState('plants'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTermUso, setSearchTermUso] = useState('');
  const allPlants = getPlants();

  // Transform to single array with country column
  const flattenedPlants = useMemo(() => {
    return Object.entries(allPlants).flatMap(([country, plants]) => 
      plants.map(plant => ({ ...plant, Country: country })))
  }, [allPlants]);

  // Fuse.js setup for flattened data
  const fuse = new Fuse(flattenedPlants, {
    keys: ['Nombre común', 'Nombre científico', 'Hábitat','Parte de la planta utilizada','Uso tradicional', 'Country'],
    threshold: 0.2,
  });

    // Fuse.js setup for flattened data
    const fuseUso = new Fuse(flattenedPlants, {
      keys: ['Uso tradicional'],
      threshold: 0.2,
    });

  const filteredPlants = searchTerm 
    ? fuse.search(searchTerm).map(r => r.item) 
    : flattenedPlants;

    const filteredPlantsUso = searchTermUso 
    ? fuseUso.search(searchTermUso).map(r => r.item) 
    : flattenedPlants;


    useEffect(()=>{

      if(searchTerm){
        setSearchTermUso(null)
      }

      if(searchTermUso){
        setSearchTerm(null)
      }


    },[searchTermUso,searchTerm])


  return (
    <div className="py-4">
      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
        <Tab eventKey="plants" title="Plantas">
          <Row>
          <Col sm={12} md={2}>
                <h4 className="mb-4 text-center">
        <Badge bg="primary">{searchTermUso}</Badge>
      </h4>
            <Afflictions plants={flattenedPlants} setFilter={setSearchTermUso} />
            </Col>
            <Col sm={12} md={9}>
            <SearchControls onSearch={setSearchTerm} searchTerm={searchTerm} />
            <PlantTable data={searchTerm ? filteredPlants : filteredPlantsUso } />
            </Col>


          </Row>

        </Tab>
        <Tab eventKey="analysis" title="Análisis">
          <AnalysisComponent2 plants={flattenedPlants} />
        </Tab>
      </Tabs>
    </div>
  );
}


export default App;
