// desktop
var mobile = ('ontouchstart' in window);
if (!mobile){
  $(document.body).addClass('desktop');
}

// init state
var state = [1,1,1]
// initialize data

if (localStorage.getItem("trello-data1")){
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
    initData[index].order = index;
    if (index < 3){
      //console.log('create lists...', $('.selectList'+index));
    $('#container')
     .append(
     '<div class=\"list-wrapper list-num'+list.order+'\"><ul id=\"sortable'+list.order+'\" class=\"connectedSortable\"><div class=\"list-title\"><select class=\"selectList'+list.order+' options\"><option value="-1" selected>Choose a list...</option></select><div class="new-list inline-list">+ New List</div></div></ul></div>');
     console.log('list order...', list.order);
    createListItems(index);
    initCardComment(index);

    }
    });
  listsDropDown();

  if (callback){callback();}
  return true;
}

function createListItems(listNumber){
  if (initData[listNumber] && state[listNumber]){
    initData[listNumber].body.forEach(function(item){
      if (item.order < 10) {
      $('#sortable'+listNumber).append('<li style=\"background-color: hsl(202, 100%,'+(38+item.order*2)+'%)\" class=\"list-item\"><span class=\"card-content\">'+item.content+'</span></li>');
      } else {
            $('#sortable'+listNumber).append('<li style=\"background-color: hsl(202, 100%, 58%)\" class=\"list-item\">'+item.content+'</li>');
      }
    });
  } else {
    console.log('data or state is off');
  }
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
          cancel: '.txt_fullname, .list-title',

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

    var listItems = $(item).find('span').toArray();
    initData[index].body = [];
    listItems.forEach(function(itm, idx){
      initData[index].body.push({'content':itm.innerHTML, 'order': idx});
      //$(itm).remove();
    });

  });
  $('.list-item').remove();
  updateLocalStorage();
  lists.forEach(function(item, index){
    if (state[index]){
    createListItems(index);
  }
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
  stateCheck();
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
    if (state[index]){
      $('.selectList'+index+' option[value='+index+']').attr("selected", "selected");
    } else {
      console.log('state says 0')
    }
  });

}
$(document).on("change", "select", function() {
  stateCheck();

    var listValInData = $(this).val();

    // list number
    var listNum = $(this).attr("class").split(' ')[0].slice(-1);


  if (listValInData == -1){
    console.log('choose a list...');
    $('.list-num'+listNum).find('li').remove();
    $('.list-num'+listNum).find('.add-card').remove();
    stateCheck();
  } else if (listNum === listValInData) {
    stateCheck();
      createListItems(listValInData);
      initCardComment(listValInData);
    } else {
      stateCheck();
      var insertedData = initData[listValInData].order;
      var removedValue = initData.splice(listNum, 1, initData[insertedData]);

      if (listValInData < 3){
        initData.splice(initData[insertedData].order, 1,removedValue[0]);
        state[listValInData] = 0;
        stateCheck();
      } else {
        initData.splice(initData[insertedData].order, 1);
        initData.splice(3, 0,removedValue[0]);
        stateCheck();
      }
      stateCheck();
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

// var addCard = '<textarea class="add-card" placeholder="Write an item..."></textarea>'
function initCardComment(listNum){
  if (state[listNum] == 1){
  $('#sortable'+listNum).after('<textarea class="add-card card-in-list-num'+listNum+'" placeholder="Write an item..."></textarea>');

  }
  // what's this line of code doing?
  $('input[type="text"]').mousedown(function(e){ e.stopPropagation(); console.log('mousedown'); });

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

$('.add-card').unbind('keypress').bind('keypress',function (e) {
  if (e.which == 13) {
    var content = this.value;
    var caret = getCaret(this);
    if(event.shiftKey){
      this.value = content.substring(0, caret - 1) + "\n" + content.substring(caret, content.length);
      event.stopPropagation();
    } else {
      addCardFunc($(event.target));
      return false;
    }
  }

});

}
function addCardFunc (list) {
  var listNum = list.attr("class").split(' ')[1].slice(-1);
  var txt = list.val();
  console.log('listNum', listNum);
  txt = txt.replace(/\r?\n/g, '<br />');
  console.log(txt);
  initData[listNum].body.push({'content': txt});
  initData[listNum].body.forEach(function(item,index){
    item.order = index;
  });
  $('.list-wrapper').remove();
  stateCheck();
  createLists(init);
  updateLocalStorage();
}

// for (var x = 0; x < 3; x++){initCardComment(x)};

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
function editListItem(){
  //$(':focus').blur();


  var name = $(this).text();
  $(this).html('');
  $('<textarea>'+name+'</textarea>')
      .attr({
          'type': 'text',
          'name': 'fname',
          'class': 'txt_fullname',

      })
      .appendTo(this);

  $('.txt_fullname').focus().val('').val(name);


//  $('.connectedSortable').sortable({cancel: '.txt_fullname'});
  //$('.txt-fullname').unbind('mousedown');
  //$('.txt-fullname').unbind('click');
  $('.txt_fullname').on('keyup', function(e) {
    if (e.keyCode == 13){
      if (event.shiftKey) {
        console.log('shift key');
      } else {
        //this.blur();
        // TODO: save data
      }

    }
  });
  //$( ".txt_fullname").mousedown(function(e) {console.log('mousedown')});
  //$( ".txt_fullname").click(function(e) {$(this).prop("selected", false);});
}


$(document).on('click', '.card-content', editListItem);

$(document).on('blur','.txt_fullname', function(){
  if ($(this).val()===''){
    $(this).parent().parent().remove();
    // remember to save
  }
  $(this).parent().text($(this).val());


/*  if ($(this).val()){
    var name = $(this).val();
    //alert('Make an AJAX call and pass this parameter >> name=' + name);
    //$(this).text(name);
    $(this).parent().text(name);
  } else {
$(this).parent().text('name');
    // alert('Are you sure you want to delete this?');
  }*/
});


/*
* Handle ctrl + Z & ctrl + shift + Z
**********/

// check if 'choose a list' is selected
function stateCheck(){
  for (var x = 0; x < 3; x++){
    if ($('.selectList'+x).val() == -1){
        state[x] = 0;
    } else {
        state[x] = 1;
    }
  }
  console.log(state);
}


/*
* Search
**********/
function search(){
  var result = new Array();
  var searchValue = $('#search-bar').val();
  for (x in initData) {
    var returnArr = initData[x].body.filter(function (el){
      // console.log(el.content.indexOf(searchValue)  > -1);
      if (el.content.indexOf(searchValue) > -1) {
        return el;
      }
    });
    console.log(returnArr);
    result = result.concat(returnArr);
  }

  console.log(result);
  //console.log(initData);
}
