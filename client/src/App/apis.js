import * as uuid from 'uuid';

export function uploadFile(file) {
  const formData = new FormData();
  formData.append("name", `${uuid.v1()}.xlsx`);
  formData.append("file", file);
  return fetch("/upload", {
    method: 'post',
    body: formData
  }).then(rs => rs.json())
}
