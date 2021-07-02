import * as uuid from 'uuid';

export function uploadFile(file, fileName) {
  const formData = new FormData();
  formData.append("name", `${fileName}`);
  formData.append("file", file);
  return fetch("/upload", {
    method: 'post',
    body: formData
  }).then(rs => rs.json())
}

export function downloadFile(fileName) {
  return fetch(`/download?name=${fileName}`, {
    method: 'get',
  }).then(rs => rs.blob())
}

export function getListFiles() {
  return fetch("/list-files", {
    method: 'get',
  }).then(rs => rs.json())
}
