import React from 'react';
import PropTypes from 'prop-types';
import CanvasDatagrid from "canvas-datagrid";
import {Button, Spinner, Row, Col, Fade} from "reactstrap";
import * as XLSX from "xlsx";
import {uploadFile} from "../apis";


function parseData(json) {
  const updateData = [...json]
  var L = 0;
  updateData.forEach(function(r) {
    if (L < r.length)
      L = r.length;
  });
  console.log(L);
  for (var i = json[0].length; i < L; ++i) {
    updateData[0][i] = "";
  }
  return updateData;
}

function Export({data = {}}) {
  let canvasGrid = null;
  const gridRef = React.useRef(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    gridRef.current.innerHTML = ''
    canvasGrid = CanvasDatagrid({
      parentNode: gridRef.current,
      data: parseData(data.data),
      showNewRow: true,
      scrollHeight: 500,
      scrollWidth: 500
    });
    return () => gridRef.current.innerHTML = ''
  }, [data])

  const handleExport = React.useCallback(() => {
    setLoading(true);
    const ws = XLSX.utils.aoa_to_sheet(canvasGrid.data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, data.sheetName || 'Sheet 1');
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
    <Row>
      <Col md={2} style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', alignContent: 'flex-end'}}>
        <div>
          <h5>
            {data.sheetName}
          </h5>
          <Button onClick={handleExport} style={{float: 'right'}}>
            Export File
            {' '}
            {loading && <Spinner size="sm">{' '}</Spinner>}
          </Button>
        </div>
      </Col>
      <Col md={10}>
        <div id={'grid_container'} className="grid_container" ref={gridRef}
             style={{overflow: 'auto', maxHeight: 'calc(100vh - 150px)'}}/>
      </Col>
    </Row>
  );
}

Export.propTypes = {};
Export.defaultProps = {};

export default Export;
