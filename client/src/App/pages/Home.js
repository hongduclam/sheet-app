import React from 'react';
import PropTypes from 'prop-types';
import Import from "../components/Import";
import Export from "../components/Export";
import {Container, Row, Col, Fade} from 'reactstrap'

function Home(props) {
  const [gridData, setGridData] = React.useState();
  const handleOnImport = React.useCallback((importData) => {
    setGridData(importData)
  }, [])

  return (
    <Container fluid>
      <Fade in={!gridData} tag="div">
        {
          !gridData && <Row>
            <Col md={2}>
              <Import onImport={handleOnImport}/>
            </Col>
          </Row>
        }
      </Fade>
      {
        <Fade in={!!gridData} tag="div">
          {
            gridData && <Row>
              <Col md={12}>
                <Export data={gridData}/>
              </Col>
            </Row>
          }
        </Fade>
      }
    </Container>
  );
}

Home.propTypes = {};
Home.defaultProps = {};

export default Home;
