import React from 'react';
import PropTypes from 'prop-types';
import Import from "../components/Import";
import Export from "../components/Export";
import {Container, Row, Col} from 'reactstrap'
import * as XLSX from "xlsx";
import {uploadFile} from "../apis";

function Home(props) {
  const [gridData, setGridData] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const handleOnImport = React.useCallback((importData) => {
    console.log({
      importData
    })
    setGridData(importData)
  }, [])

  const handleOnExport = React.useCallback((exportData) => {
    console.log({
      exportData
    })
    setLoading(true);
    const ws = XLSX.utils.aoa_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, gridData.sheetName || 'Sheet 1');
    const wopts = {bookType: 'xlsx', bookSST: false, type: 'array'};
    const wbout =  XLSX.write(wb, wopts);
    const file = new Blob([wbout], {type:"application/octet-stream"});
    uploadFile(file).then(rs => {
      XLSX.writeFile(wb, rs.data.name)
    }).catch(() => {
      alert("Something went wrong!")
    }).finally(() => {
      setLoading(false)
    })
  }, [])

  return (
    <Container fluid>
      <Row>
        <Col md={3}>
          <Import onImport={handleOnImport}/>
        </Col>
        <Col md={9}>
          <div>
            {
              gridData.data && gridData.data.length &&
              <Export data={gridData.data} cols={gridData.cols} loading={loading} onExport={handleOnExport}/>
            }
          </div>
        </Col>
      </Row>
    </Container>
  );
}

Home.propTypes = {};
Home.defaultProps = {};

export default Home;
