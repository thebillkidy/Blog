/* Author: Armstrong Chiu
   URL: http://thewebdesignerpro.com/     */

   function onWindowResize( event ) {
    ww = window.innerWidth;
      wh = window.innerHeight,
    wwh = ww/2, whh = wh/2;	
    
    renderer.setSize( ww, wh );
    camera.aspect = ww / wh;
    camera.updateProjectionMatrix();
    
    document.body.style.width = cntnr.style.width = ww+'px';
    document.body.style.height = cntnr.style.height = wh+'px';	
  
    if (ww > wh) {
      cntnt.style.fontSize = cntnt2.style.fontSize = ((ww+wh)/2)*0.022+'px';
    } else {
      cntnt.style.fontSize = cntnt2.style.fontSize = ((ww+wh)/2)*0.028+'px';
    }
  }
  