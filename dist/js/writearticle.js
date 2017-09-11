$ = function(id) { return document.getElementById(id); };

  $$ = function(tag) { return document.getElementsByTagName(tag); };

  

  window.onload = function() {
      $('title').contentEditable = true;

      $('editor').contentEditable = true;

      $('size').onchange = function() {

          var s = parseInt($('size').value);

          $('editor').focus();

          document.execCommand('FontSize', false, s);

     }

     $('color').onchange = function() {

         $('editor').focus();

         document.execCommand('ForeColor', false, $('color').value);

     };

     $('fontfamily').onchange = function() {
         $('editor').focus();
         document.execCommand('FontName',false,$('fontfamily').value);
     }

     $('bold').onclick = function() {

         $('editor').focus();

         document.execCommand('Bold');

     };

     $('italic').onclick = function() {        

         $('editor').focus();

         document.execCommand('Italic');

     };

     $('underline').onclick = function() {

         $('editor').focus();

         document.execCommand('Underline');

     };

 

     $('submit').onclick = function() {

         $('editor').contentEditable = false;

         $('toolbar').style.visibility = 'hidden';

         $('edit').style.display = 'block';

         $('submit').style.display = 'none';

         $('editor').className = 'display';

     }

     $('edit').onclick = function() {

         $('editor').contentEditable = true;

         $('toolbar').style.visibility = 'visible';

         $('edit').style.display = 'none';

         $('editor').className = 'editable';

         $('submit').style.display = 'block';

     }

 };