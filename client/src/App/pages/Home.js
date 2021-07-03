import React from 'react';
import Import from "../components/Import";
import Export from "../components/Export";
import {Col, Container, Row} from 'reactstrap'
import FileSelectList from "../components/FileSelectList";
import * as XLSX from "xlsx";
import {deleteFile, saveFile} from "../apis";
import {debounce} from "../helpers";
import FileActions from "../components/FileActions";

const HomeContext = React.createContext();

export function useHomeContext() {
  return React.useContext(HomeContext);
}

function Home() {
  const [gridData, setGridData] = React.useState();
  const [loading, setLoading] = React.useState();
  const [selectedItem, setSelectedItem] = React.useState();
  const [reloadFileList, setReloadFileList] = React.useState(true);
  console.log({
    gridData
  })
  return (
    <HomeContext.Provider value={{
      gridData,
      setGridData,
      selectedItem,
      setSelectedItem,
      setLoading,
      loading,
      reloadFileList,
      setReloadFileList
    }}>
      <Container fluid>
        <Row>
          <Col md={2}>
            <Import />
            <hr />
            <FileSelectList />
            <hr />
            <FileActions />
          </Col>
          <Col md={10}>
            <Export />
          </Col>
        </Row>
      </Container>
    </HomeContext.Provider>
  );
}

Home.propTypes = {};
Home.defaultProps = {};

export default Home;
