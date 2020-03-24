var mitoArray = [
    [0.4,4,10],
    [0.41,4,10],
    [0.42,5,11],
    [0.43,5,11],
    [0.44,5,12],
    [0.45,5,12],
    [0.46,6,13],
    [0.47,6,13],
    [0.48,6,14],
    [0.49,6,14],
    [0.5,7,15],
    [0.51,7,15],
    [0.52,7,16],
    [0.53,8,17],
    [0.54,8,17],
    [0.55,8,18],
    [0.56,8,18],
    [0.57,9,19],
    [0.58,9,20],
    [0.59,9,20],
    [0.6,10,21],
    [0.61,10,22],
    [0.62,11,23],
    [0.63,11,23],
    [0.64,11,24],
    [0.65,12,25],
    [0.66,12,25],
    [0.67,12,26],
    [0.68,13,27],
    [0.69,13,28]
  ]



function cboxInput(cbox, inputClass, inputPlaceholder, tagName) {
    if (!tagName) {var tagName = "div"}
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

function sumtable(lymphdiv, heading, txtBeforeSum) {
    totals = []
    var str = []
    var ans = []
    var table = document.getElementById($(lymphdiv + " table:visible").attr("id"))
    if (!table) {return}
    var nrOfRows = table.rows.length;
    var nrOfCells = table.rows[0].cells.length
    for (var i = 1; i < nrOfRows; i++) {
        for (var j = 0; j < 7 ; j++) {
            if (isNaN(totals[j])){
                totals.push(0)}
            try {
                var child = table.rows[i].cells[j].firstChild
                if (child.value) {          
                    var colValue = child.value
                    if (!isNaN(colValue)) {
                        totals[j]+=parseFloat(colValue)
                    }
                    str.push(table.rows[0].cells[j].firstChild.textContent + colValue)
                } else if (child.innerHTML) {
                    var colValue = child.innerHTML
                    str.push(table.rows[0].cells[j].firstChild.textContent + colValue)
                } 
            } catch {
                continue
            }  
        }
        if (str[2] != null){
            ans.push(str.join(", ") + "<br/>");
        }
        str = []
    }
    if (totals.reduce((a, b) => a + b) == 0) {
        return
    } else {
        $('#results_block').append(heading + "<br/>" + ans.join("") + txtBeforeSum + "<br/>")
        for (var i = 0; i < totals.length; i++) {
            if (totals[i] === 0) {
                continue
            } else {
                str.push(table.rows[0].cells[i].firstChild.textContent + totals[i] + "<br/>")
            }
        } 
        $('#results_block').append(str.join("") + "<br/>")
    }
}
function getMitoScore(score){
    return score >= $("#field_diameter").nval()
}




$(document).ready(function(){
    $('body').on("keyup", '.only_numbers', function (){
        replacetext(this)
    })
    $('body').on("click", "#copy_result_btn", function () {
        copyToClipboard('#results_block')
    });
    // show/hide elements

    $("input[name=tumor_size]").on("click", function(){
        show_hide("#tumor_size_greatest_dim", "#tumor_size_table_div")
    })
    $("input[name=mitotic_rate_radio]").on("click", function(){
        show_hide("#mitotic_rate_radio_present", "#mitotic_rate_info_div")
    })

    $("#calculator_button").on("click", function(){
       $(".hidden_calc").toggle()     
       $("#field_diameter").prop("disabled", $("#calculator_div").is(":visible"))
    })
    $("#calculator_calculate").on("click", function(){
        const fieldDia = $("#field_diameter").nval()
        if (!fieldDia) {
            const x = $("#eyepiece_magnification").nval()*$("#objective_magnification").nval()*$("#known_microfield_D").nval()
            const fieldDia = x/($("#eyepiece_magnification2").nval()*$("#objective_magnification2").nval())
            document.getElementById("field_diameter").value = fieldDia
        }
        if (fieldDia < 0.4) {return alert("Field diameter too small")}
        if (fieldDia > 0.69) {return alert("Field diameter too large")}
        for (i = 0; i < mitoArray.length; i++) {
            if (fieldDia == mitoArray[i][0]){
                var s1 = mitoArray[i][1]
                var s2 = mitoArray[i][2]
                if ($("#n_mitoses").nval() <= s1) {var score = 1}
                else if ($("#n_mitoses").nval() >= s2) {var score = 3}
                else if (s1 < $("#n_mitoses").nval() < s2 ) {var score = 2}
            } else {
                continue
            }
        }
        if ($("#nuclear_pleomorphism_radio_score1").is(":checked")){var nuclearScore = 1}
        if ($("#nuclear_pleomorphism_radio_score2").is(":checked")){var nuclearScore = 2}
        if ($("#nuclear_pleomorphism_radio_score3").is(":checked")){var nuclearScore = 3}
        if ($("#glandular_dif_score1").is(":checked")){var glandScore = 1}
        if ($("#glandular_dif_score2").is(":checked")){var glandScore = 2}
        if ($("#glandular_dif_score3").is(":checked")){var glandScore = 3}

        if (!(nuclearScore && glandScore && score)){
            return alert("check Glandular (Acinar)/Tubular Differentiation , Nuclear Pleomorphism AND Mitotic Rate score")
        } else {
            var Ograde = nuclearScore + glandScore + score
            document.getElementById("overall_grade").innerHTML = "Overall Grade " + Ograde
        }
    })


    $('#histologic_type, #histotype_other_div').change(function () {
       
        if (($('#histologic_type').val().indexOf("Invasive carcinoma, type cannot be determined") >= 0)||
            ($('#histologic_type').val().indexOf("Invasive carcinoma with features of (specify):") >= 0)||            
            ($('#histotype_other').val().indexOf("Other type not listed (specify)") >= 0)) {
            $('#histotype_text_div').slideDown("slow");
        } else {
            $('#histotype_text_div').slideUp("slow");
        }
        if ($('#histologic_type').val().indexOf("Other histologic type") >= 0) {
            $('#histotype_other_div').slideDown("slow");
        } else {
            $('#histotype_other_div').slideUp("slow");
        }
    });

    //returns number value instead of string
    $.fn.nval = function() {
        return Number(this.val())
        };
    

})

















