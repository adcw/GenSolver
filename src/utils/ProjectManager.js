export const download = (filename, text) => {
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:application/json;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};

export const downloadState = (state) => {
  download(state.project_name ?? "Untitled Project", JSON.stringify(state));
};

export const utf8_to_b64 = (str) => {
  return window.btoa(decodeURI(encodeURIComponent(str)));
};

export const b64_to_utf8 = (str) => {
  return decodeURIComponent(encodeURI(window.atob(str)));
};
