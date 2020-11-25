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

function refresh(){
    $("#notes").hide()
    $("#notelist").html("")
    notes.forEach(function(note, i){
        $("#notelist").append(`
            <li>
                <span class="left-note"><i class="fas fa-bars"></i></span>
                <span class="mid-note" onclick="doubleclick(this,`+i+`)">`+notes[i].display+`</span>
                <input class="edit-note edit-note-`+i+`" value="`+notes[i].title+`" style="display:none"/>
                <i class="fas fa-check confirm-edit edit-note-`+i+`" style="display:none"></i>
                <span class="right-note" onclick="del(`+i+`)"><i class="fas fa-trash notes-btn"></i></span>
            </li>
        `)
    })
    $("#notes").fadeIn()
}

function doubleclick(el, i) {
    if (el.getAttribute("data-dblclick") == null) {
        el.setAttribute("data-dblclick", 1);
        setTimeout(function () {
            if (el.getAttribute("data-dblclick") == 1) {
                edit(i);
            }
            el.removeAttribute("data-dblclick");
        }, 300);
    } else {
        el.removeAttribute("data-dblclick");
        edit_title(el,i);
    }
}

function edit_title(el,i){
    $(el).hide()
    $(".edit-note-"+i).show()
    $(".edit-note-"+i).enterKey(function(){
        notes[i].title = $(".edit-note-"+i).val();
        calc_display(notes[i])
        $(el).show()
        $(".edit-note-"+i).hide()
        refresh()
    })
    $(".confirm-edit").click(function(){
        notes[i].title = $(".edit-note-"+i).val();
        calc_display(notes[i])
        $(el).show()
        $(".edit-note-"+i).hide()
        refresh()
    })
}

function edit(i){
    $("#title").val(notes[i].title)
    $("#desc").val(notes[i].desc);
    $("#note").val(notes[i].note);
    $("#edited").attr("onclick","edited("+i+")");
    $(".notes").fadeOut(500);
    $.wait(500).then(editNote);
}

function editNote(){
    $(".notes-detail").fadeIn();
}
function calc_display(note){
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
function edited(i){
    limit = 17;
    notes[i].title = $("#title").val();
    notes[i].desc = $("#desc").val();
    notes[i].note = $("#note").val();
    calc_display(notes[i]);
    $("#edited").attr("onclick","");
    $(".notes-detail").fadeOut(500);
    $.wait(500).then(editedNote);
}
function editedNote(){
    $(".notes").fadeIn()
    refresh()
}

function del(i){
    if(confirm("Are you sure you want to delete?")){
        notes.splice(i,1)
        refresh()
    }
}

function test(){
    $(".ql-editor").scrollTop($("#asdf").scrollTop())
    alert($(".ql-editor").scrollTop()+" | "+$("#asdf").scrollTop())
}

function add_note(){
    notes.push({
        title : "New Note",
        desc : "",
        note : "",
        display : "New Note"
    })
    refresh()
}

function gen_nav_display(){
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
    console.log("success")
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
                name : $(children[x]).html(),
                chapters : []
            })
        }
        else if(tag == "H2"){
            j++
            k=-1
            temp[i].chapters.push({
                name : $(children[x]).html(),
                scenes : []
            })
        }
        else if(tag == "H3"){
            k++
            temp[i].chapters[j].scenes.push($(children[x]).html())
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
        title : "Note 1",
        desc : "",
        note : "",
        display : "Note 1"
    },
    {
       title : "Note 2",
        desc : "",
        note : "" ,
        display : "Note 2"
    },
    {
        title : "Note 3",
        desc : "",
        note : "",
        display : "Note 3"
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

$(".ql-editor").html(placeholder)

story = []
window.setInterval(function(){
    gen_nav()
},1000);