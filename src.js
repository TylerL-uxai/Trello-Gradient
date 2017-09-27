// initialize data

if (localStorage.getItem("trello-data")){
  var unparsed = localStorage.getItem("trello-data");
  var initData = JSON.parse(unparsed);
} else {
var initData = [{
  'title': 'mylist',
  'order': 0,
  'body': [
    {
      'content': 'card 1',
      'order': 0,
    },
    {
      'content': 'card 2',
      'order': 1,
    },
    {
      'content': 'card 3',
      'order': 2,
    },
    {
      'content': 'card 4',
      'order': 3,
    },
    {
      'content': 'card 5',
      'order': 4,
    },
    {
      'content': 'card 6',
      'order': 5,
    },
    {
      'content': 'card 7',
      'order': 6,
    }
  ]
},{
  'title': 'mylist2',
  'order': 1,
  'body': [
    {
      'content': 'card 1',
      'order': 0,
    },
    {
      'content': 'card 2',
      'order': 1,
    },
    {
      'content': 'card 3',
      'order': 2,
    },
        {
      'content': 'card 4',
      'order': 3,
    },
  ]
}];
}
console.log(initData);
updateLocalStorage();

// create lists
function createLists(callback){
  initData.map(function (list,index) {
    if (index < 3){
    $('#container')
     .append(
     '<div class=\"list-wrapper list-num'+list.order+'\"><ul id=\"sortable'+list.order+'\" class=\"connectedSortable\"><div class=\"list-title\"><select class=\"selectList'+list.order+' options\"><option value="-1" selected>Choose a list...</option></select><div class="new-list inline-list">+ New List</div></div></ul></div>');
    createListItems(list.order);
    }
    });
  listsDropDown();
  initCardComment();
  if (callback){callback();}
  return true;
}

function createListItems(listNumber){
  console.log('data is...', initData);

  initData[listNumber].body.forEach(function(item){
    if (item.order < 10) {
    $('#sortable'+listNumber).append('<li style=\"background-color: hsl(202, 100%,'+(38+item.order*2)+'%)\" class=\"list-item\">'+item.content+'</li>');
    } else {
          $('#sortable'+listNumber).append('<li style=\"background-color: hsl(202, 100%, 58%)\" class=\"list-item\">'+item.content+'</li>');
    }
  });
}

function init (){
  $( function() {
    $( '.connectedSortable' ).sortable({
          receive: function (event, ui) {
            if (this === ui.item.parent()[0]){
             updateData(event,ui);
            }
          },
                update: function (event, ui) {
            if (this === ui.item.parent()[0]){
             updateData(event,ui);
            }
          },
       cancel: '.list-title',
      connectWith: ".connectedSortable"
    }).disableSelection();

  });
}
// init lists
createLists(function(){
  init();
});

function updateData(event, ui){

  var lists = $('.connectedSortable').toArray();

  lists.forEach(function(item, index){

    var listItems = $(item).find('li').toArray();
    initData[index].body = [];
    listItems.forEach(function(itm, idx){
      console.log(itm, item);
      initData[index].body.push({'content':itm.innerHTML, 'order': idx});
      $(itm).remove();
    });

  });
  updateLocalStorage();
  lists.forEach(function(item, index){
    createListItems(index);
  });

}

/*
* New List
***************/

var newListBox ='<div class=\"list-wrapper list-num0\"><input class=\"new-list-box\" type=\"text\"></input></div>';


function watchNewListInput (){
  $('.new-list-box').keypress(function (e) {
    // console.log(e);
    if (e.which == 13) {

      addList($(this));
      //console.log($(this).parent().attr("class").split(' ')[1].slice(-1));
      return false;
    }
  });
}
function addList(list) {
  console.log('add list', list.val());
//  $('#container').append(newList);
  initData.forEach(function(item, index){
    item.order += 1;
  });

  initData.unshift({'title': list.val(),
  'order': 0, body: []});
  initData.forEach(function(item, index){
    item.order = index;
  });
  console.log('new initData...', initData);
  $('.list-wrapper').remove();
  updateLocalStorage();
  createLists(init);
}

$(document).on('click', '.new-list', newListInput);

function newListInput(list){
  if ($('.list-num0')) {
    $('.list-num0').html(newListBox);
    watchNewListInput();
  } else {
    $('#container').append(newListBox);
    watchNewListInput();
  }
}
/*
* List Dropdown
******************/

function listsDropDown() {
  var optionsArr = $(".options");
  console.log('options are...', optionsArr);
  $.each(initData, function() {
      optionsArr.append(new Option(this.title, this.order));
  });
  optionsArr = [].slice.call(optionsArr);
  optionsArr.forEach(function (item, index){
    $('.selectList'+index+' option[value='+index+']').attr("selected", "selected");
  });

}
$(document).on("change", "select", function() {
    console.log('change option');
    var listValInData = $(this).val();
    console.log('listValInData', $(this).val());
    // list number
    var listNum = $(this).attr("class").split(' ')[0].slice(-1);
    console.log('List number is...', $(this).attr("class").split(' ')[0].slice(-1));

  console.log('listValInData is...', listValInData);
  if (listValInData == -1){
    console.log('choose a list...');
          $('.list-num'+listNum).find('li').remove();
    $('.list-num'+listNum).find('.add-card').remove();
  } else if (listNum === listValInData) {
      createListItems(listValInData);
    } else {
      console.log('initial data before unshift...', initData);

      var insertedData = initData[listValInData].order;
      console.log('inserted Data is...', insertedData);
      var removedValue = initData.splice(listNum, 1, initData[insertedData]);

      if (removedValue[0].order < 2){
        initData.splice(initData[insertedData].order, 1,removedValue[0]);

      } else {
      initData.splice(initData[insertedData].order, 1,removedValue[0]);

      }
      console.log('removed value...', removedValue);
      $('.list-wrapper').remove();
      initData.forEach(function(item, index){
        item.order = index;
      });
      updateLocalStorage();

      createLists(init);
      if (listValInData < 3){
        $('.list-num'+listValInData).after('<div class=\"list-wrapper list-num'+listValInData+' placeholder\"><ul id=\"sortable'+listValInData+'\" class=\"connectedSortable\"><div class=\"list-title\"><select class=\"selectList'+listValInData+' options\"><option value="-1" selected>Choose a list...</option></select></div></ul></div>');
        $.each(initData, function(){
          $('.selectList'+listValInData).append(new Option(this.title, this.order));
        });
        $('.list-wrapper').get(listValInData).remove();

      }
     }
  });
/*
* Add cards
***********/

var addCard = '<textarea class="add-card" placeholder="Write an item..."></textarea>'
function initCardComment(){
  $('.connectedSortable').after(addCard);
  $('input[type="text"]').mousedown(function(e){ e.stopPropagation(); });

  function getCaret(el) {
      if (el.selectionStart) {
          return el.selectionStart;
      } else if (document.selection) {
          el.focus();
          var r = document.selection.createRange();
          if (r == null) {
              return 0;
          }
          var re = el.createTextRange(), rc = re.duplicate();
          re.moveToBookmark(r.getBookmark());
          rc.setEndPoint('EndToStart', re);
          return rc.text.length;
      }
      return 0;
  }

$('.add-card').keypress(function (e) {
  if (e.which == 13) {
    var content = this.value;
            var caret = getCaret(this);
            if(event.shiftKey){
                this.value = content.substring(0, caret - 1) + "\n" + content.substring(caret, content.length);
                event.stopPropagation();
            } else {
    addCardFunc($(this));
    console.log($(this).parent().attr("class").split(' ')[1].slice(-1));

    return false;}
  }
});

}
function addCardFunc (list) {
  var listNum = list.parent().attr("class").split(' ')[1].slice(-1);
  var txt = list.val();
  txt = txt.replace(/\r?\n/g, '<br />');
  initData[listNum].body.push({'content': txt});
  initData[listNum].body.forEach(function(item,index){
    item.order = index;
  });
  $('.list-wrapper').remove();
  createLists(init);
  updateLocalStorage();
}

initCardComment();

//localStorage.setItem('trello-data', initData);
//console.log( localStorage.getItem("trello-data") );
function updateLocalStorage(){
  localStorage.setItem('trello-data', JSON.stringify(initData));
  var unparsed = localStorage.getItem("trello-data");
  console.log('unparsed');
  console.log(JSON.parse(unparsed));
}

/*
* Double click to edit card
***********/
$('.list-item').click(function(){
    var name = $(this).text();
    $(this).html('');
    $('<input></input>')
        .attr({
            'type': 'text',
            'name': 'fname',
            'id': 'txt_fullname',
            'size': '30',
            'value': name
        })
        .appendTo(this);
    $('#txt_fullname').focus();
});

$(document).on('blur','#txt_fullname', function(){
    var name = $(this).val();
    //alert('Make an AJAX call and pass this parameter >> name=' + name);
    //$(this).text(name);
    $(this).parent().text(name);
});
