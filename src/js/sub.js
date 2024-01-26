export function tab(tab01, tab02, tab03) {
  const tab_elements = document.getElementsByName('tab-radio');
  const tab_panel_a = document.querySelector(tab01);
  const tab_panel_b = document.querySelector(tab02);
  const tab_panel_c = document.querySelector(tab03);

  tab_elements.forEach( function(tab_element) {
    tab_element.addEventListener('click', function(){
       if (tab_element.id == 'tab-a'){
          tab_panel_a.style.display = 'block';
          tab_panel_b.style.display = 'none';
          tab_panel_c.style.display = 'none';
       }else if (tab_element.id == 'tab-b'){
          tab_panel_a.style.display = 'none';
          tab_panel_b.style.display = 'block';
          tab_panel_c.style.display = 'none';
       }else if (tab_element.id == 'tab-c'){
          tab_panel_a.style.display = 'none';
          tab_panel_b.style.display = 'none';
          tab_panel_c.style.display = 'block';
       }
       // 選択されたかどうかを示すクラス名「selected」の付与と削除
       tab_elements.forEach( function(tab_element) {
          tab_element.nextElementSibling.classList.remove('selected');
       });
       tab_element.nextElementSibling.classList.add('selected');
    });
 });
};