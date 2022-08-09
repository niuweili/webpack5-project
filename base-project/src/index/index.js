import { helloworld } from './helloworld';
import { common } from '../../common';

function component() {
  const element = document.createElement('div');
  element.innerHTML = [
    helloworld(),
    common(),
  ].join('<br/>');
  return element;
}

const button = document.createElement('h3')
button.innerHTML = '点击加载text.js'
button.addEventListener('click', () => {
  import("./text.js").then(data => {
    const text = document.createElement('p')
    text.innerHTML = data.default()
    document.body.appendChild(text);

  })
})
document.body.appendChild(component());
document.body.appendChild(button);
