$.wait = function(ms) {
    var defer = $.Deferred();
    setTimeout(function() { defer.resolve(); }, ms);
    return defer;
};

$(".notes-detail").hide()

var quill = new Quill('#editor', {
  theme: 'snow'
});

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

notes = [
    {
        title : "Note 1",
        desc : "",
        note : "",
    },
    {
       title : "Note 2",
        desc : "",
        note : "" ,
    },
    {
        title : "Note 3",
        desc : "",
        note : "",
    }
]
function refresh(){
    $("#notes").hide()
    $("#note-list").html("")
    notes.forEach(function(note, i){
        $("#note-list").append(`
            <li onclick="edit(`+i+`)">
                <span class="left-note">`+notes[i].title+`</span>
                <span class="right-note" onclick="del(`+i+`)"><i class="fas fa-trash notes-btn"></i></span>
            </li>
        `)
    })
    $("#notes").fadeIn()
}

function add_note(){
    notes.push({
        title : "New Note",
        desc : "",
        note : ""
    })
    refresh()
}

function del(i){
    notes.splice(i,1)
    refresh()
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
function edited(i){
    notes[i].title = $("#title").val()
    notes[i].desc = $("#desc").val();
    notes[i].note = $("#note").val();
    $("#edited").attr("onclick","");
    $(".notes-detail").fadeOut(500);
    $.wait(500).then(editedNote);
}
function editedNote(){
    $(".notes").fadeIn()
}