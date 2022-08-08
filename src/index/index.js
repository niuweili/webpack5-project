import { helloworld } from './helloworld';
import { common } from '../../common';

 function component() {
  const element = document.createElement('div');

  element.innerHTML = [
    helloworld(),
    common(),
  ].join('\n\n');
   return element;
 }

 document.body.appendChild(component());