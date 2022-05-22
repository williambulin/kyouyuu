let elements = document.getElementsByTagName('include');
for (let element of elements) {
  let src = element.getAttribute('src');

  let xhr = new XMLHttpRequest();
  xhr.open('GET', src, false);
  xhr.send();

  if (xhr.status == 200) {
    element.innerHTML = xhr.responseText;
  }

  let scripts = element.getElementsByTagName('script');
  for (let script of scripts) {
    script.remove();

    let scriptElement = document.createElement('script');
    for (let attribute of script.attributes) {
      scriptElement.setAttribute(attribute.name, attribute.value);
    }
    document.body.appendChild(scriptElement);
  }

  // if (script != null) {
  //   let scriptElement = document.createElement('script');
  //   scriptElement.src = script;
  //   element.parentNode.insertBefore(scriptElement, element);
  // }
}
