import React from 'react';
import CanvasDatagrid from "canvas-datagrid";
import {Col, Row, Spinner} from "reactstrap";
import {downloadFile} from "../apis";
import {parseGridData} from "../helpers";
import {useHomeContext} from "../pages/Home";


function Export() {
  const {selectedItem, setLoading, loading, setGridData, handleSave} = useHomeContext()
  const [isChanged, setIsChanged] = React.useState(false)

  let canvasGrid = null;
  const gridRef = React.useRef(null);

  const handleOnDataChange = () => {
    setIsChanged(true);
  }

  function renderGrid(gridData) {
    canvasGrid && canvasGrid.removeEventListener('endedit', handleOnDataChange)
    gridRef.current.innerHTML = ''
    canvasGrid = CanvasDatagrid({
      parentNode: gridRef.current,
      data: gridData.data,
      showNewRow: true
    });
    canvasGrid.addEventListener('endedit', handleOnDataChange)
  }

  React.useEffect(() => {
    if(isChanged) {
      handleSave();
      setIsChanged(false);
    }
  }, [isChanged])

  React.useEffect(() => {
    gridRef && (gridRef.current.innerHTML = '')
    if (selectedItem) {
      setLoading('load-grid')
      downloadFile(selectedItem.name).then(fileBlog => {
        parseGridData(fileBlog).then(gridData => {
          setGridData(gridData)
          renderGrid(gridData);
          setLoading(false)
        })
      })
    }
    return () => {
      canvasGrid && canvasGrid.removeEventListener('endedit', handleSave)
      gridRef.current.innerHTML = ''
    }
  }, [selectedItem])

  return (
    <Row style={{minHeight: 'calc(100vh - 100px)'}}>
      <Col md={12}>
        {loading === 'load-grid' && <Spinner>{' '}</Spinner>}
        <div id={'grid_container'} className="grid_container" ref={gridRef}
             style={{overflow: 'auto', height: `calc(100vh - 100px)`}}/>
      </Col>
    </Row>
  );
}

Export.propTypes = {};
Export.defaultProps = {};

export default Export;
