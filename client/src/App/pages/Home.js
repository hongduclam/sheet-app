import React from 'react';
import PropTypes from 'prop-types';
import Import from "../components/Import";
import Export from "../components/Export";
import {Container, Row, Col, Fade} from 'reactstrap'

const HomeContext = React.createContext();

export function useHomeContext() {
  return React.useContext(HomeContext);
}

function Home() {
  const [gridData, setGridData] = React.useState();
  const [selectedItem, setSelectedItem] = React.useState();
  return (
    <HomeContext.Provider value={{
      gridData,
      setGridData,
      selectedItem,
      setSelectedItem
    }}>
      <Container fluid>
        <Fade in={!selectedItem} tag="div">
          {
            !selectedItem && <Row>
              <Col md={2}>
                <Import />
              </Col>
            </Row>
          }
        </Fade>
        {
          <Fade in={!!selectedItem} tag="div">
            {
              selectedItem && <Row>
                <Col md={12}>
                  <Export />
                </Col>
              </Row>
            }
          </Fade>
        }
      </Container>
    </HomeContext.Provider>
  );
}

Home.propTypes = {};
Home.defaultProps = {};

export default Home;
