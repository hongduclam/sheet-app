import React from 'react';
import PropTypes from 'prop-types';
import {Button, Spinner} from "reactstrap";
import {useHomeContext} from "../pages/Home";
import {deleteFile, saveFile} from "../apis";
import * as XLSX from "xlsx";
import {debounce} from "../helpers";
import {toast} from "react-toastify";

function FileActions() {
  const {selectedItem, loading, setLoading, gridData, setSelectedItem, setReloadFileList, handleSave} = useHomeContext()

  function handleDelete() {
    setLoading('delete');
    return deleteFile(selectedItem.name).then(rs => {
      toast.success(rs.message)
      setSelectedItem(null);
      setReloadFileList(true)
    }).catch(() => {
      toast.error('Something went wrong!')
    }).finally(() => {
      setLoading(false)
    })
  }

  const handleExport = React.useCallback(() => {
    setLoading('export');
    handleSave().then(rs => {
      XLSX.writeFile(rs.wb, rs.fileName)
      toast.success('Export Successfully!')
    }).catch(() => {
      toast.error('Something went wrong!')
    }).finally(() => {
      setLoading(false)
    })
  }, [gridData, selectedItem])

  const handlSaveWithMessage = ()=> {
    handleSave(rs => toast.success('Save Successfully!'))
  }

  return (
    <div style={{textAlign: 'right'}}>
      {selectedItem && <strong>
        {selectedItem.name}
      </strong>}
      <br/>
      <Button disabled={!selectedItem} onClick={handleExport} color="secondary">
        Export
        {' '}
        {loading === 'export' && <Spinner size={'sm'}>{' '}</Spinner>}
      </Button>
      {' '}
      <Button disabled={!selectedItem} onClick={handlSaveWithMessage} color="primary">
        Save
        {' '}
        {loading === 'save' && <Spinner size={'sm'}>{' '}</Spinner>}
      </Button>
      {' '}
      <Button disabled={!selectedItem} onClick={handleDelete} color="danger">
        Delete
        {' '}
        {loading === 'delete' && <Spinner size={'sm'}>{' '}</Spinner>}
      </Button>
    </div>
  );
}

FileActions.propTypes = {};
FileActions.defaultProps = {};

export default FileActions;
