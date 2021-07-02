import React from 'react';
import PropTypes from 'prop-types';
import CanvasDatagrid from "canvas-datagrid";
import {Button, Spinner} from "reactstrap";

function Export({data = [], cols = [], onExport, loading}) {
  let canvasGrid = null;
  const gridRef = React.useRef(null);

  React.useEffect(() => {
    gridRef.current.innerHTML = ''
    canvasGrid = CanvasDatagrid({
      parentNode: gridRef.current,
      data,
      showNewRow: true,
      scrollHeight: 500,
      scrollWidth: 500
    });
    return () => gridRef.current.innerHTML = ''
  }, [data])

  const handleExport = React.useCallback(() => {
    onExport(canvasGrid.data)
  }, [data])

  return (
    <div>
      <div id={'grid_container'} className="grid_container" ref={gridRef}
           style={{overflow: 'auto', maxHeight: 'calc(100vh - 250px)'}}/>
      <br/>
      {
        <Button onClick={handleExport} style={{float: 'right'}}>
          Export File
          {' '}
          {loading && <Spinner size="sm">{' '}</Spinner>}
        </Button>
      }
    </div>
  );
}

Export.propTypes = {};
Export.defaultProps = {};

export default Export;
