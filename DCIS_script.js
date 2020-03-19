
function cboxInput(cbox, inputClass, inputPlaceholder, tagName) {
    if (!tagName) {var tagName = "div"}
    if (!inputClass) {var inputClass = ""}
    if (!inputPlaceholder) {var inputPlaceholder = "Specify"}
    
    if (cbox.type === "radio") {
        var cboxId = cbox.name
        $("#" + cboxId + "_" + tagName).slideUp('slow', function(){
            $(this).remove()
        })
    } else {
        var cboxId = cbox.id
    }

    if (cbox.checked) {
        var input = document.createElement("input")
        input.type = "text"      
        if (inputClass) {input.className = cbox.className + " " + inputClass }
        input.id = cboxId + "_text"
        input.placeholder = inputPlaceholder
        var div = document.createElement(tagName)
        div.id = cboxId + "_"+ tagName
        div.style = "display: none"
        div.appendChild(input)        
        if (cbox.nextSibling.nextSibling) {
            $(div).insertAfter(cbox.nextSibling.nextSibling)
        } else {
            cbox.parentNode.appendChild(div)
        }
        $(div).slideDown()
    } else {
        $("#" + cboxId + "_"+ tagName).slideUp('slow', function(){
            $(this).remove()
        })
    }
}

function radioInput(rbutton, create_box, relate, inputClass, inputPlaceholder){
    if (create_box && (document.getElementById(rbutton.name + "_text") == null || relate == 'sibling')) {
        var input = document.createElement("input")
        input.type = "text"      
        input.id = rbutton.name + "_text"
        input.placeholder = "Täpsusta"
        var div = document.createElement("div")
        div.id = rbutton.name + "_div"
        div.style = "display: none"
        div.appendChild(input)
        if (relate == "sibling"){
            $("#" + rbutton.name + "_div").slideUp('slow', function(){
                $(this).remove()
            })
            document.getElementById(rbutton.id).nextElementSibling.after(div)
            $(div).slideDown()             
        } else {
            document.getElementById(rbutton.id).parentNode.appendChild(div)
            $(div).slideDown() 
        }
    } else if  (create_box) {

        return
    } else  {
        $("#" + rbutton.name + "_div").slideUp('slow', function(){
            $(this).remove()
        })
        
    } 
}


function appendunits(input){
    var units = $(input).attr("placeholder")
    if ($(input).val()) {
        $(input).val($(input).val() + " " + units)
    }
}

function disable_class(cbox) {
    $("." + cbox.classList[0] + ":input").not(cbox).prop("disabled", cbox.checked)
}

function show_hide(cbox, hide_this, hide) {
    if (hide == null){
        if ($(cbox).is(":checked")){
            $(hide_this).slideDown('slow')
        } else  {
            $(hide_this).slideUp('slow')
        } 
    } else {
        if ($(cbox).is(":checked")) {
            $(hide_this).slideUp('slow')
        } else {
            $(hide_this).slideDown('slow')
        } 
    }
        
}

function replacetext(input) {
    var str = $(input).val()
    str = str.replace(/[^0-9,\.]+/g, "");
    str = str.replace(/[,\.]+/g, ".")
    input.value = str
}


$(document).ready(function(){

$('body').on("change", ".addunits", function(){
    appendunits(this)
})
$('body').on("keyup", '.only_numbers', function (){
    replacetext(this)
})
$("#tumor_site_Other").on("click", function(){
    cboxInput(this)
})
$("#tumor_site_Clock_position").on("click", function(){
    cboxInput(this, "addunits", "o'clock")
})
$("#tumor_site_Distance_from_nipple").on("click", function(){
    cboxInput(this, "addunits", "cm")
})
$("#architectural_pattern_Other").on("click", function(){
    cboxInput(this)
})
$("#show_nuclear_grade_info_table").on("click", function(){
    show_hide("#show_nuclear_grade_info_table", "#nuclear_grade_info_table")
})
$("#margins_uninvolved").on("click", function(){
    show_hide("#margins_uninvolved", "#margins_uninvolved_div")
})
$("input[name='margins_uninvolved_radio']:not('#margins_uninvolved_CD')").on("change", function(){
    cboxInput(this, "only_numbers addunits", "mm")
})
$("#margins_uninvolved_CD").on("change", function(){
    cboxInput(this)
})
$("#specify_closest_margin_CA").on("change", function(){
    cboxInput(this)
})
$("#specify_closest_margin_CA").on("change", function(){
    show_hide("#specify_closest_margin_CA", "#specify_closest_margin_div", "hide")
})
$("#margins_positive").on("change", function(){
    show_hide("#margins_positive", "#margins_positive_div")
})

})