limit_short = 7
limit_long = 10

$.wait = function(ms) {
    var defer = $.Deferred();
    setTimeout(function() { defer.resolve(); }, ms);
    return defer;
};

$.fn.enterKey = function (fnc) {
    return this.each(function () {
        $(this).keypress(function (ev) {
            var keycode = (ev.keyCode ? ev.keyCode : ev.which);
            if (keycode == '13') {
                fnc.call(this, ev);
            }
        })
    })
}

const reorder = (event, originalArray) => {
    const movedItem = originalArray.find((item, index) => index === event.oldIndex);
    const remainingItems = originalArray.filter((item, index) => index !== event.oldIndex);
  
    const reorderedItems = [
        ...remainingItems.slice(0, event.newIndex),
        movedItem,
        ...remainingItems.slice(event.newIndex)
    ];
  
    return reorderedItems;
}

  /* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
function openNav() {
    refresh()
    $(".openbtn").css("opacity",0);
    document.getElementById("mySidebar").style.width = "25%";
    document.getElementById("main").style.marginLeft = "25%";
    $(".chapters").show()
}

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function closeNav() {
    $(".openbtn").css("opacity",1);
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
    $(".chapters").hide() 
}

function toggle_folder(i){
    notes[i].type = notes[i].type == "folder-open" ? "folder-close" : "folder-open"
    refresh()
}

function rearrange_note(evt){
    i1 = evt.from.classList.item(0)
    i2 = evt.to.classList.item(0)
    j1 = evt.oldIndex
    j2 = evt.newIndex
    console.log(i1+" "+i2+" "+j1+" "+j2)
    notes[i2].notes.splice(j2,0,notes[i1].notes[j1])
    notes[i1].notes.splice(j1,1)
}

function refresh(){
    $("#notes").hide()
    $("#notelist").html("")
    temp = ""
    notes.forEach(function(note, i){
        temp += `
            <li class="folder-li" style="background-color:`+notes[i].color+`">
                <span>
                    <span class="left-note"><i class="fas fa-bars"></i></span>
                    <span class="mid-note" onclick="doubleclick(this,`+i+`,-1)">`+notes[i].display+`</span>
                    <input class="edit-note edit-note-`+i+`-1" value="`+notes[i].title+`" style="display:none"/>
                    <i class="fas fa-check confirm-edit edit-note-`+i+'-1'+`" style="display:none"></i>
                    <span class="right-note" onclick="toggle_folder(`+i+`)"><i class="fas fa-chevron-`+ (note.type=='folder-open'?'up':'down') +` notes-btn"></i></span>
                    <span class="right-note" onclick="del(`+i+`,-1)"><i class="fas fa-trash notes-btn"></i></span>
                    <span class="right-note circle" onclick="edit_color(`+i+`)" style="background-color:`+notes[i].color+`;margin-top:8px"></span>
                </span>
                <div id="color-`+i+`" class="row" style="display:none">
                    <div class="col-md-2">
                        <span class="remove circle" style="background-color:#d0d7dc;margin-top:8px" onclick="recolor('#d0d7dc',`+i+`)"></span>
                    </div>
                    <div class="col-md-2">
                        <span class="circle" style="background-color:#9ac1ea;margin-top:8px" onclick="recolor('#9ac1ea',`+i+`)"></span>
                    </div>
                    <div class="col-md-2">
                        <span class="circle" style="background-color:#a2e9a0;margin-top:8px" onclick="recolor('#a2e9a0',`+i+`)"></span>
                    </div>
                    <div class="col-md-2">
                        <span class="circle" style="background-color:#f6df79;margin-top:8px" onclick="recolor('#f6df79',`+i+`)"></span>
                    </div>
                    <div class="col-md-2">
                        <span class="circle" style="background-color:#d8b5fd;margin-top:8px" onclick="recolor('#d8b5fd',`+i+`)"></span>
                    </div>
                    <div class="col-md-2">
                        <span class="circle" style="background-color:#ceb292;margin-top:8px" onclick="recolor('#ceb292',`+i+`)"></span>
                    </div>
                </div>
            
        `
        temp+="<ul class='"+i+"'>"
        if(note.type=="folder-open" && note.notes && note.notes.length){
            note.notes.forEach(function(n,j){
                temp+=`
                    <li class="note-li">
                        <span class="left-note"><i class="fas fa-bars"></i></span>
                        <span class="mid-note nt-`+i+''+j+`" onclick="doubleclick(this,`+i+`,`+j+`)">`+n.display+`</span>
                        <input class="edit-note edit-note-`+i+''+j+`" value="`+n.title+`" style="display:none"/>
                        <i class="fas fa-check confirm-edit edit-note-`+i+j+`" style="display:none"></i>
                        <span class="right-note" onclick="del(`+i+`,`+j+`)"><i class="fas fa-trash notes-btn"></i></span>
                    </li>
                `
            })
            
        }
        temp+="</ul></li>"
    })
    $("#notelist").append(temp)
    applySortable()
    $("#notes").fadeIn()
}

function edit_color(i){
    $("#color-"+i).show()
}

function recolor(color,i){
    notes[i].color = color
    refresh()
}

function applySortable(){
    sortable_option = {
        group: {
            name: "sortable-child",
            pull: true,
            put: true,
        },
        animation: 250,
        forceFallback: true,
        onEnd:function(evt){
            rearrange_note(evt)
            refresh()
        }
    }
    notelist_children = $("#notelist").children()
    for(i=0;i<notelist_children.length;i++){
        new_sortable = $(notelist_children[i]).find("ul")[0]
        new Sortable(new_sortable,sortable_option)
    }
}

function doubleclick(el,i,j) {
    if (el.getAttribute("data-dblclick") == null) {
        el.setAttribute("data-dblclick", 1);
        setTimeout(function () {
            if (el.getAttribute("data-dblclick") == 1) {
                if(j!=-1){
                    edit(i,j);
                }   
            }
            el.removeAttribute("data-dblclick");
        }, 300);
    } else {
        el.removeAttribute("data-dblclick");
        edit_title(el,i,j);
    }
}

function edit_title(el,i,j){
    $(el).hide()
    $(".edit-note-"+i+j).show()
    $(".edit-note-"+i+j).enterKey(function(){
        if(j==-1){
            notes[i].title = $(".edit-note-"+i+""+j).val();
            calc_display(notes[i],12)
        }
        else{
            notes[i].notes[j].title = $(".edit-note-"+i+""+j).val();
            calc_display(notes[i].notes[j],8)
            
        }
        $(".edit-note-"+i+""+j).hide()
        $(el).show()
        refresh()
    })
    $(".confirm-edit").click(function(){
        if(j==-1){
            notes[i].title = $(".edit-note-"+i+""+j).val();
            calc_display(notes[i],limit_long)
        }
        else{
            notes[i].notes[j].title = $(".edit-note-"+i+""+j).val();
            calc_display(notes[i].notes[j],limit_short)
            
        }
        $(".edit-note-"+i+""+j).hide()
        $(el).show()
        refresh()
    })
}

function edit(i,j){
    $("#title").val(notes[i].notes[j].title)
    $("#desc").val(notes[i].notes[j].desc);
    $("#note").val(notes[i].notes[j].note);
    $("#edited").attr("onclick","edited("+i+","+j+")");
    $(".notes").fadeOut(500);
    $.wait(500).then(editNote);
}

function editNote(){
    $(".notes-detail").fadeIn();
}
function calc_display(note,limit=8){
    if(note.title.length==0){
        note.display = "[Untitled]"
    }
    else if(note.title.length>20){
        note.display = note.title.slice(0,limit-3)+"..."
    }
    else{
        note.display = note.title
    }
}
function edited(i,j){
    notes[i].notes[j].title = $("#title").val();
    notes[i].notes[j].desc = $("#desc").val();
    notes[i].notes[j].note = $("#note").val();
    calc_display(notes[i].notes[j],limit_short);
    $("#edited").attr("onclick","");
    $(".notes-detail").fadeOut(500);
    $.wait(500).then(editedNote);
}
function editedNote(){
    $(".notes").fadeIn()
    refresh()
}

function del(i,j){
    if(j!=-1){
        if(confirm("Are you sure you want to delete?")){
            notes[i].notes.splice(j,1)
            refresh()
        }
    }
    else{
        if(confirm("Are you sure you want to delete?")){
            if(confirm("Warning : This will delete all notes inside this category!")){
                notes.splice(i,1)
                refresh()
            }
        }
    }
    
}

function add_note(){
    if(notes == [] || notes.length==0){
        notes.push({
            title : "New Category",
            display : "New Category",
            type : "folder-open",
            notes : [
                {
                    title : "New Note",
                    desc : "",
                    note : "",
                    display : "New Note",
                    type : "note"
                }
            ]
        })
        refresh()
        edit_title($(".nt-00").get(0),0,0)
    }
    else{
        notes[0].notes.push({
            title : "New Note",
            desc : "",
            note : "",
            display : "New Note",
            type : "note"
        })
        refresh()
        edit_title($(".nt-0"+(notes[0].notes.length-1)).get(0),0,notes[0].notes.length-1)
    }
}

function add_category(){
    notes.push({
        title : "New Category",
        display : "New Category",
        type : "folder-open",
        notes : []
    })
    refresh()
}

function gen_nav_display(){
    if(story.length==1 && story[0].name==""){
        $("#side-nav").html("")
    }
    else{
        temp = "<ul>"
        story.forEach(function(section, i){
            temp+="<a href='#nav"+i+"'><li>"+section.name+"</li></a>"
            if(section.chapters && section.chapters.length){
                temp+="<ul>"
                section.chapters.forEach(function(chapter,j){
                    temp+="<a href='#nav"+i+j+"'><li>"+chapter.name+"</li></a>"
                    if(chapter.scenes && chapter.scenes.length){
                        temp+="<ul>"
                        chapter.scenes.forEach(function(scene,k){
                            temp+="<a href='#nav"+i+j+k+"'><li>"+scene+"</li>"
                        })
                        temp+="</ul>"
                    }
                })
                temp+="</ul>"
            }
        })
        temp+="</ul>"
        $("#side-nav").html(temp)
    }
}

function gen_nav(){
    temp = []
    children = $(".ql-editor").children()
    i = -1
    j = -1
    k = -1

    for(x=0;x<children.length;x++){
        tag = $(children[x]).prop("tagName")
        if(tag == "H1"){
            i++
            j=-1
            k=-1
            temp.push({
                name : $(children[x]).text() == "" ? "&nbsp" : $(children[x]).text(),
                chapters : []
            })
        }
        else if(tag == "H2"){
            if(i==-1){
                temp.push({
                    name: "&nbsp;",
                    chapters: []
                })
                i++
            }
            j++
            k=-1
            temp[i].chapters.push({
                name : $(children[x]).text() == "" ? "&nbsp" : $(children[x]).text(),
                scenes : []
            })
        }
        else if(tag == "H3"){
            if(j==-1){
                if(i==-1){
                    temp.push({
                        name: "&nbsp;",
                        chapters: []
                    })
                    i++
                }
                temp[i].chapters.push({
                    name: "&nbsp;",
                    scenes: []
                })
                j++
            }
            k++
            temp[i].chapters[j].scenes.push($(children[x]).text() == "" ? "&nbsp" : $(children[x]).text())
        }
        if(tag != "P"){
            $(children[x]).attr("id","nav"+(i==-1?"":i)+(j==-1?"":j)+(k==-1?"":k))
        }
    }
    story = temp
    gen_nav_display()
}

$(".notes-detail").hide()

var quill = new Quill('#editor', {
  theme: 'snow'
});

notes = [
    {
        title : "Category 1",
        display : "Category 1",
        type : "folder-open",
        color : "#b9bdaa",
        notes: [
            {
               title : "Note 1",
                desc : "",
                note : "" ,
                display : "Note 1",
                type : "note"
            },
            {
                title : "Note 2",
                desc : "",
                note : "",
                display : "Note 2",
                type : "note"
            }
        ]
    },
    {
        title : "Category 2",
        display : "Category 2",
        type : "folder-open",
        color:"#b9bdaa",
        notes: [
            {
               title : "Note 3",
                desc : "",
                note : "" ,
                display : "Note 3",
                type : "note"
            },
            {
                title : "Note 4",
                desc : "",
                note : "",
                display : "Note 4",
                type : "note"
            }
        ]
    }
]

new Sortable(notelist, {
    animation: 150,
    ghostClass: 'sortable-ghost',
    handle: ".left-note",
    onEnd: function(evt){
        notes = reorder(evt,notes)
        refresh()
    }
 });

placeholder = '<h1>Section 1</h1><h2>Chapter 1</h2><h3>Scene 1</h3><p><span style="color: rgb(0, 0, 0);">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla iaculis metus efficitur, viverra felis vitae, porttitor eros. Pellentesque at pretium ante, eget vehicula lorem. Maecenas pharetra nunc nec nulla porttitor porta. Ut rutrum tempor odio, ac accumsan lorem. Fusce at tellus aliquam, convallis neque quis, pulvinar velit. In tincidunt id enim et varius. Mauris et est bibendum, interdum risus nec, malesuada sem. Ut nibh ex, gravida at tristique at, volutpat molestie est. Etiam tempor, nisl eu sollicitudin fermentum, erat lorem condimentum diam, vitae dapibus velit arcu vel odio. Maecenas eu leo ac purus venenatis elementum. Integer tincidunt augue eget blandit luctus.</span></p><h3>Scene 2</h3><p><span style="color: rgb(0, 0, 0);">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla iaculis metus efficitur, viverra felis vitae, porttitor eros. Pellentesque at pretium ante, eget vehicula lorem. Maecenas pharetra nunc nec nulla porttitor porta. Ut rutrum tempor odio, ac accumsan lorem. Fusce at tellus aliquam, convallis neque quis, pulvinar velit. In tincidunt id enim et varius. Mauris et est bibendum, interdum risus nec, malesuada sem. Ut nibh ex, gravida at tristique at, volutpat molestie est. Etiam tempor, nisl eu sollicitudin fermentum, erat lorem condimentum diam, vitae dapibus velit arcu vel odio. Maecenas eu leo ac purus venenatis elementum. Integer tincidunt augue eget blandit luctus.</span></p><h3>Scene 3</h3><p><span style="color: rgb(0, 0, 0);">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla iaculis metus efficitur, viverra felis vitae, porttitor eros. Pellentesque at pretium ante, eget vehicula lorem. Maecenas pharetra nunc nec nulla porttitor porta. Ut rutrum tempor odio, ac accumsan lorem. Fusce at tellus aliquam, convallis neque quis, pulvinar velit. In tincidunt id enim et varius. Mauris et est bibendum, interdum risus nec, malesuada sem. Ut nibh ex, gravida at tristique at, volutpat molestie est. Etiam tempor, nisl eu sollicitudin fermentum, erat lorem condimentum diam, vitae dapibus velit arcu vel odio. Maecenas eu leo ac purus venenatis elementum. Integer tincidunt augue eget blandit luctus.</span></p><h2>Chapter 2</h2><h3>Scene 1</h3><p><span style="color: rgb(0, 0, 0);">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla iaculis metus efficitur, viverra felis vitae, porttitor eros. Pellentesque at pretium ante, eget vehicula lorem. Maecenas pharetra nunc nec nulla porttitor porta. Ut rutrum tempor odio, ac accumsan lorem. Fusce at tellus aliquam, convallis neque quis, pulvinar velit. In tincidunt id enim et varius. Mauris et est bibendum, interdum risus nec, malesuada sem. Ut nibh ex, gravida at tristique at, volutpat molestie est. Etiam tempor, nisl eu sollicitudin fermentum, erat lorem condimentum diam, vitae dapibus velit arcu vel odio. Maecenas eu leo ac purus venenatis elementum. Integer tincidunt augue eget blandit luctus.</span></p><h3>Scene 2</h3><p><span style="color: rgb(0, 0, 0);">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla iaculis metus efficitur, viverra felis vitae, porttitor eros. Pellentesque at pretium ante, eget vehicula lorem. Maecenas pharetra nunc nec nulla porttitor porta. Ut rutrum tempor odio, ac accumsan lorem. Fusce at tellus aliquam, convallis neque quis, pulvinar velit. In tincidunt id enim et varius. Mauris et est bibendum, interdum risus nec, malesuada sem. Ut nibh ex, gravida at tristique at, volutpat molestie est. Etiam tempor, nisl eu sollicitudin fermentum, erat lorem condimentum diam, vitae dapibus velit arcu vel odio. Maecenas eu leo ac purus venenatis elementum. Integer tincidunt augue eget blandit luctus.</span></p><h3>Scene 3</h3><p><span style="color: rgb(0, 0, 0);">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla iaculis metus efficitur, viverra felis vitae, porttitor eros. Pellentesque at pretium ante, eget vehicula lorem. Maecenas pharetra nunc nec nulla porttitor porta. Ut rutrum tempor odio, ac accumsan lorem. Fusce at tellus aliquam, convallis neque quis, pulvinar velit. In tincidunt id enim et varius. Mauris et est bibendum, interdum risus nec, malesuada sem. Ut nibh ex, gravida at tristique at, volutpat molestie est. Etiam tempor, nisl eu sollicitudin fermentum, erat lorem condimentum diam, vitae dapibus velit arcu vel odio. Maecenas eu leo ac purus venenatis elementum. Integer tincidunt augue eget blandit luctus.</span></p><h1>Section 2</h1><h2>Chapter 1</h2><h3>Scene 1</h3><p><span style="color: rgb(0, 0, 0);">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla iaculis metus efficitur, viverra felis vitae, porttitor eros. Pellentesque at pretium ante, eget vehicula lorem. Maecenas pharetra nunc nec nulla porttitor porta. Ut rutrum tempor odio, ac accumsan lorem. Fusce at tellus aliquam, convallis neque quis, pulvinar velit. In tincidunt id enim et varius. Mauris et est bibendum, interdum risus nec, malesuada sem. Ut nibh ex, gravida at tristique at, volutpat molestie est. Etiam tempor, nisl eu sollicitudin fermentum, erat lorem condimentum diam, vitae dapibus velit arcu vel odio. Maecenas eu leo ac purus venenatis elementum. Integer tincidunt augue eget blandit luctus.</span></p><h3>Scene 2</h3><p><span style="color: rgb(0, 0, 0);">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla iaculis metus efficitur, viverra felis vitae, porttitor eros. Pellentesque at pretium ante, eget vehicula lorem. Maecenas pharetra nunc nec nulla porttitor porta. Ut rutrum tempor odio, ac accumsan lorem. Fusce at tellus aliquam, convallis neque quis, pulvinar velit. In tincidunt id enim et varius. Mauris et est bibendum, interdum risus nec, malesuada sem. Ut nibh ex, gravida at tristique at, volutpat molestie est. Etiam tempor, nisl eu sollicitudin fermentum, erat lorem condimentum diam, vitae dapibus velit arcu vel odio. Maecenas eu leo ac purus venenatis elementum. Integer tincidunt augue eget blandit luctus.</span></p><h3>Scene 3</h3><p><span style="color: rgb(0, 0, 0);">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla iaculis metus efficitur, viverra felis vitae, porttitor eros. Pellentesque at pretium ante, eget vehicula lorem. Maecenas pharetra nunc nec nulla porttitor porta. Ut rutrum tempor odio, ac accumsan lorem. Fusce at tellus aliquam, convallis neque quis, pulvinar velit. In tincidunt id enim et varius. Mauris et est bibendum, interdum risus nec, malesuada sem. Ut nibh ex, gravida at tristique at, volutpat molestie est. Etiam tempor, nisl eu sollicitudin fermentum, erat lorem condimentum diam, vitae dapibus velit arcu vel odio. Maecenas eu leo ac purus venenatis elementum. Integer tincidunt augue eget blandit luctus.</span></p><h2>Chapter 2</h2><h3>Scene 1</h3><p><span style="color: rgb(0, 0, 0);">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla iaculis metus efficitur, viverra felis vitae, porttitor eros. Pellentesque at pretium ante, eget vehicula lorem. Maecenas pharetra nunc nec nulla porttitor porta. Ut rutrum tempor odio, ac accumsan lorem. Fusce at tellus aliquam, convallis neque quis, pulvinar velit. In tincidunt id enim et varius. Mauris et est bibendum, interdum risus nec, malesuada sem. Ut nibh ex, gravida at tristique at, volutpat molestie est. Etiam tempor, nisl eu sollicitudin fermentum, erat lorem condimentum diam, vitae dapibus velit arcu vel odio. Maecenas eu leo ac purus venenatis elementum. Integer tincidunt augue eget blandit luctus.</span></p><h3>Scene 2</h3><p><span style="color: rgb(0, 0, 0);">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla iaculis metus efficitur, viverra felis vitae, porttitor eros. Pellentesque at pretium ante, eget vehicula lorem. Maecenas pharetra nunc nec nulla porttitor porta. Ut rutrum tempor odio, ac accumsan lorem. Fusce at tellus aliquam, convallis neque quis, pulvinar velit. In tincidunt id enim et varius. Mauris et est bibendum, interdum risus nec, malesuada sem. Ut nibh ex, gravida at tristique at, volutpat molestie est. Etiam tempor, nisl eu sollicitudin fermentum, erat lorem condimentum diam, vitae dapibus velit arcu vel odio. Maecenas eu leo ac purus venenatis elementum. Integer tincidunt augue eget blandit luctus.</span></p><h3>Scene 3</h3><p><span style="color: rgb(0, 0, 0);">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla iaculis metus efficitur, viverra felis vitae, porttitor eros. Pellentesque at pretium ante, eget vehicula lorem. Maecenas pharetra nunc nec nulla porttitor porta. Ut rutrum tempor odio, ac accumsan lorem. Fusce at tellus aliquam, convallis neque quis, pulvinar velit. In tincidunt id enim et varius. Mauris et est bibendum, interdum risus nec, malesuada sem. Ut nibh ex, gravida at tristique at, volutpat molestie est. Etiam tempor, nisl eu sollicitudin fermentum, erat lorem condimentum diam, vitae dapibus velit arcu vel odio. Maecenas eu leo ac purus venenatis elementum. Integer tincidunt augue eget blandit luctus.</span></p>'

placeholder2= '<h3 id="nav000">Scene without a chapter nor section</h3><p>[content]</p><p><br></p><p><br></p><h2 id="nav01">Chapter without a section</h2><h3 id="nav010">A normal scene inside a chapter</h3><p>[content]</p><p><br></p><p><br></p><h1 id="nav1">Normal section</h1><h2 id="nav10">normal chapter</h2><h3 id="nav100">normal scene</h3><p>[content]</p>'

$(".ql-editor").html(placeholder2)

story = []
//gen_nav()
window.setInterval(function(){
    gen_nav()
},1000);

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function drop_down_templates() {
    document.getElementById("templates").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn') && !event.target.matches('.dropicon')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}