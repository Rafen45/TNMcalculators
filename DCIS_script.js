
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


$(document).ready(function(){

    $('body').on("change", ".addunits", function(){
        appendunits(this)
    })
    $('body').on("keyup", '.only_numbers', function (){
        replacetext(this)
    })
    $('body').on("click", '.only_numbers', function (){
        $(this).val(null)
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
    $("input[name='margins_radio']").on("change", function(){
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
    $("input[name='margins_radio']").on("change", function(){
        show_hide("#margins_positive", "#margins_positive_div")
    })
    $("input[name='margins_positive_location']:not('#margins_positive_CA')").on("click", function(){
        cboxInput(this, " ", "Specify extent")
    })
    $("#margins_positive_CA").on("click", function(){
        cboxInput(this, null, "Specify")
        disable_class(this)
    })
    $(".distal_metastases").on("change", function(){
            show_hide(".distal_metastases", "#distal_metastases_note")
    })
    //returns number value instead of string
    $.fn.nval = function() {
        return Number(this.val())
     };

    //table controls
    $('body').on("click", "#regional_lymph_nodes_add_row", function () {
        addNewRow()
    });
    $('body').on("click", ".remove-row", function() {
        if ($(this).closest('tr').parent().find("tr").length <= 2 ) {
            return
        } else {
            $(this).closest('td').parent().remove();
        }
    });
    function addNewRow() {
        var rowToAdd = $("#regional_lymph_nodes_specified_table tbody tr:last").clone();
        $(rowToAdd).find('input').each(function(){
            $(this).val(null);
        });
        $("#regional_lymph_nodes_specified_table tbody").append(rowToAdd);
    }
    $('#regional_lymph_nodes').change(function () {
        if ($('#regional_lymph_nodes').val() === "Involved by tumor cells") {
            $('#regional_lymph_nodes_block_general').slideUp("slow");
            $('#regional_lymph_nodes_block_specified').slideDown("slow");
        } else if ($('#regional_lymph_nodes').val() === "Uninvolved by tumor cells") {
            $('#regional_lymph_nodes_block_specified').slideUp("slow");
            $('#regional_lymph_nodes_block_general').slideDown("slow");
        } else {
            $('#regional_lymph_nodes_block_specified').slideUp("slow");
        }
    });




    function addCheckbox(cbox_class, heading, text_if_notchecked) {
        if (document.querySelector('input[class*="'+ cbox_class +'"]:checked')) {
            $('#results_block').append(heading);
            var cbox_list = [];
            $.each($('input[class*="'+ cbox_class +'"]:checked'), function () {
                cbox_list.push($(this).val());
                if ( $("#" + $(this).attr("id") + "_text").val() ){
                    cbox_list.push("(" + $("#" + $(this).attr("id") + "_text").val() + ")");
                }
            });
            $('#results_block').append(cbox_list.join(", ") + "<br/>");
        } else if (text_if_notchecked){
            $('#results_block').append(text_if_notchecked);
        }
    }

    //adds all visible inputs under input_div_id  extra_text - adds text before input box value if it has no label.
    function addGenericInput(parameters) {
        var input_div_id =  parameters.input_div_id
        var heading =  parameters.heading
        var extra_text = parameters.extra_text
        var text_if_notchecked = parameters.text_if_notchecked
        var join = parameters.join

        var divid = $(input_div_id + " :input:visible")
        var str = []
        if (!join) {join = "<br/>"}
        divid.each(function(){
            var tagname = document.getElementById($(this).prop("id")).tagName
            if ($(this).is(":checked") || tagname == "SELECT") {
                str.push($(this).val())
            } else if (!["radio", "checkbox"].includes($(this).attr("type")) && $(this).val()) {
                if ($(input_div_id + " label[for=" + $(this).prop("id")+ "]").text() != "") {
                    str.push($(input_div_id + " label[for=" + $(this).prop("id")+ "]").text() +  $(this).val())
                } else {
                    if (!extra_text) {
                        str.push($(this).val())
                    } else {
                        str.push(extra_text + $(this).val())
                    }
                }
            }
        })       
        if (!str[0]) {
            if (!text_if_notchecked) {
                return
            } else {
                $('#results_block').append(text_if_notchecked  + "<br/>")
            }
        } else {
            $('#results_block').append(heading + str.join(join)  + "<br/>")
        }
    }


    function addExtraFindingsText() {
        if ($('#extra_findings_text').val()) {
            $('#results_block').append('Ancillary studies: ' + $('#extra_findings_text').val());
            $('#results_block').append('<br/>');
        }
    }

    function addComments() {
        if ($('#invasion_comments_text').val()) {
            $('#results_block').append("Extra comments: " + $('#invasion_comments_text').val());
            $('#results_block').append('<br/>');
        }
    }

    function calcGradeM(){
        if ($(".distal_metastases").is(':checked')) {
            return 'M1'

        } else {
            return 'M0'
        }
    }
    
    function calcGradeN() {
        var axilMacro = $("#axillary_lymph_nodes_macrometa").nval()           
        var axilMicro = $("#axillary_lymph_nodes_micrometa").nval()       
        var infClavMacro = $("#infraclavicular_lymph_nodes_macrometa").nval()       
        var infClavMicro = $("#infraclavicular_lymph_nodes_micrometa").nval()
        var intMamSentinel = $("#int_mammary_lymph_nodes_guardians").nval()
        var intMamMacro =  $("#int_mammary_lymph_nodes_macrometa").nval()
        var intMamMicro =  $("#int_mammary_lymph_nodes_micrometa").nval()
        
        if ($("#supraclavicular_lymph_nodes_ls").nval() > 0 ) {
            return 'pN3c'         
        } else if ((axilMacro + axilMicro < 9 && axilMacro > 0 && $("#meta_internal_mammary").is(":checked"))  || ((4 < axilMacro + axilMicro < 9  && axilMacro > 0) && (intMamSentinel > 0 && intMamMacro + intMamMicro > 0 ))) {
            return 'pN3b'
        } else if (((axilMacro + axilMicro > 10) && axilMacro > 0) || (infClavMacro + infClavMicro > 0)) {
            return 'pN3a';
        } else if ($("#meta_internal_mammary").is(":checked") && ((axilMacro + axilMicro) == 0) ) {
            return 'pN2b';
        } else if (4 < axilMacro + axilMicro < 9  && axilMacro > 0) {
            return 'pN2a';
        } else if ((intMamSentinel > 0 && (intMamMacro + intMamMicro > 0 ) ) && (0 < axilMacro + axilMicro < 4  && axilMacro > 0)) {
            return 'pN1c';
        } else if ($("#int_mammary_ipsi").is(":checked") && intMamSentinel > 0 && intMamMacro + intMamMicro > 0 ) {
            return 'pN1b';
        } else if (0 < axilMacro + axilMicro < 4  && axilMacro > 0) {
            return 'pN1a';
        } else if (totals[5] > 0) {
            return 'pN1mi';
        } else if ($("#mol_studies_pcr_pos").is(":checked")) {
            return 'pN0 (mol+)';
        } else if (totals[6] > 0) {
            return 'pN0 (i+)';
        } else if ($("#regional_lymph_nodes").val() != "No lymph nodes submitted or found") {
            return 'N0'        
        } else {
            return 'NX'
        }
    }
    function calcGradeT() {
            if ($("#histologic_type_Ductal_carcinoma_in_situ:visible").is(":checked")) {
                return'pTis';
            } else if ($(".histologic_type_Paget_disease:visible").is(":checked").length > 1) {
                return 'pTis';
            } else {
                return 'T0';
            }
        
        
    }


    const extentObj = {
        input_div_id: "#tumor_parameters_div",
        heading: "</br>Size of DCIS</br>",
        extra_text: null,
        text_if_notchecked: null,
        join: "</br> &#8212; "
    }
    const histoObj = {
        input_div_id: "#histologic_type_div",
        heading: "</br>Histologic Type: ",
        //extra_text: null,
        //text_if_notchecked: null,
        join: " "
    }
    const archPatternObj = {
        input_div_id: "#architectural_patterns_div",
        heading: "</br>Architectural Patterns: ",
        extra_text: "Specification: ",
        //text_if_notchecked: null,
        join: ", "
    }
    const nuclearGradeObj = {
        input_div_id: "#nuclear_grade_div",
        heading: "</br>Nuclear Grade: ",
        join: ""
    }
    const necrosisObj = {
        input_div_id: "#necrosis_div",
        heading: "</br>Necrosis: ",
        join: ""
    }
    const marginsObj = {
        input_div_id: "#margins_div",
        heading: "</br>Margins: ",
        //extra_text: null,
        //text_if_notchecked: null,
        join: ", "
    }
    
    const lymphTabFoot = {
        input_div_id: "#lymph_nodes_table_footer_div",
        heading: "</br>"
        //extra_text: null,
        //text_if_notchecked: null,
        //join: ", "
    }
    const distMetastasesObj = {
        input_div_id: "#distal_metastases_div",
        heading: "</br>Distal metastases in: ",
        //extra_text: null,
        //text_if_notchecked: null,
        join: ", "
    }

    $('#calc_results_btn').on("click", function () {
        $('#results_block').empty();
        addCheckbox("tumor_site_chkbx", "Tumor Site: ")
        addGenericInput(extentObj)
        addGenericInput(histoObj)
        addGenericInput(archPatternObj)
        addGenericInput(nuclearGradeObj)
        addGenericInput(necrosisObj)
        addGenericInput(marginsObj)
        $('#results_block').append(sumtable("#lymph_nodes_tables", "<br/>Lymphnodes: ", "<br/>Total nr of lymphnodes examined: "))
        addGenericInput(lymphTabFoot)
        addGenericInput(distMetastasesObj)
        $("#results_block").append(calcGradeT() + calcGradeN() + calcGradeM() + "<br/>")
        addExtraFindingsText();
        addComments();
        $('#results_title').show();
        $('#results_block').show();
        $('#copy_result').text('');
        $('#results_copy_block').show();
    });

})