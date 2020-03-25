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
    $('body').on("change", ".addunits", function(){
        appendunits(this)
    })
    $('body').on("click", '.only_numbers', function (){
        $(this).val(null)
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
    $("input[name=tumor_focality_radio]").on("click", function(){
        show_hide("#tumor_focality_radio_multi", "#nr_foci_div")
    })
    $("input[name=DCIS_radio]").on("click", function(){
        show_hide("#DCIS_radio_present", "#DCIS_present_div")
    })
    $("input[name=DCIS_radio]").on("click", function(){
        show_hide("#DCIS_radio_present", "#DCIS_div")
    })
    $("#show_nuclear_grade_info_table").on("click", function(){
        show_hide("#show_nuclear_grade_info_table", "#nuclear_grade_info_table")
    })
    $("input[name=LCIS_radio]").on("click", function(){
        show_hide("#LCIS_present", "#LCIS_text_div")
    })

    //DCIS margins div
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

    //invasive tumor margins div
    $("input[name='tumor_margins_radio']").on("change", function(){
        show_hide("#tumor_margins_uninvolved", "#tumor_margins_uninvolved_div")
    })
    $("input[name='tumor_margins_uninvolved_radio']:not('#tumor_margins_uninvolved_CD')").on("change", function(){
        cboxInput(this, "only_numbers addunits", "mm")
    })
    $("#tumor_margins_uninvolved_CD").on("change", function(){
        cboxInput(this)
    })
    $("#specify_closest_tumor_margin_CA").on("change", function(){
        cboxInput(this)
    })
    $("#specify_closest_tumor_margin_CA").on("change", function(){
        show_hide("#specify_closest_tumor_margin_CA", "#specify_closest_tumor_margin_div", "hide")
    })
    $("input[name='tumor_margins_radio']").on("change", function(){
        show_hide("#tumor_margins_positive", "#tumor_margins_positive_div")
    })
    $("input[name='tumor_margins_positive_location']:not('#tumor_margins_positive_CA')").on("click", function(){
        cboxInput(this, " ", "Specify extent")
    })
    $("#tumor_margins_positive_CA").on("click", function(){
        cboxInput(this, null, "Specify")
        disable_class(this)
    })
    $("#calculator_button").on("click", function(){
       $(".hidden_calc").toggle()
       $("#field_diameter").prop("disabled", $("#calculator_div").is(":visible"))
    })

    //create inputbox
    $("#tumor_site_Other").on("click", function(){
        cboxInput(this)
    })
    $("#tumor_site_Clock_position").on("click", function(){
        cboxInput(this, "only_numbers addunits", "o'clock")
    })
    $("#tumor_site_Distance_from_nipple").on("click", function(){
        cboxInput(this, "only_numbers addunits", "cm")
    })
    $("#architectural_pattern_Other").on("click", function(){
        cboxInput(this)
    })
    


    //field diameter and overall grade calculator
    $("#calculator_calculate").on("click", function(){
        const fieldDia = $("#field_diameter").nval()
        if ($("#calculator_div").is(":visible") && $("#eyepiece_magnification").nval() && $("#objective_magnification").nval() && $("#known_microfield_D").nval()) {
            const x = $("#eyepiece_magnification").nval()*$("#objective_magnification").nval()*$("#known_microfield_D").nval()
            const fieldDia = x/($("#eyepiece_magnification2").nval()*$("#objective_magnification2").nval())
            document.getElementById("field_diameter").value = fieldDia
        }
        if (fieldDia && fieldDia < 0.4) {return alert("Field diameter too small")}
        if (fieldDia &&fieldDia > 0.69) {return alert("Field diameter too large")}
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
            $("input[name=overall_grade_radio]").prop("checked", false)
            $("#overall_grade_radio_CD").prop("checked", true)
            alert("Check Glandular (Acinar)/Tubular Differentiation , Nuclear Pleomorphism AND Mitotic Rate score")
            $("#overall_grade_radio_CD_label").animate({fontSize: "150%", fontWeight : "150%"}, "slow").animate({fontSize: "100%"}, "slow")
            return
        } else {
            $("input[name=overall_grade_radio]").prop("checked", false)
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
    
    


    //returns number value instead of string
    $.fn.nval = function() {
        return Number(this.val())
        };
    

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
    if ($("#clinical_find_erythema").is(":checked") && $("#clinical_find_inv_skin_more").is(":checked")){
        return 'pT4d'
    } else if ($("#tumor_extension_smuscle_ivades_cwall").is(":checked") && ($("#tumor_extension_skin_satellite").is(":checked") || $("#tumor_extension_skin_present_invasive_ulcerative").is(":checked"))){
        return 'pT4c'
    } else if ($("#tumor_extension_skin_satellite").is(":checked") || $("#tumor_extension_skin_present_invasive_ulcerative").is(":checked")){
        return 'pT4b'
    } else if ($("#tumor_extension_smuscle_ivades_cwall").is(":checked")){
        return 'pT4a'
    /* } else if (){
        return 'pT4' */
    } else if ($("#tumor_max").nval() > 50 ){
        return 'pT3'
    } else if (20 < $("#tumor_max").nval() <= 50 ){
        return 'pT2'
    } else if (10 < $("#tumor_max").nval() <= 20 ){
        return 'pT1c'
    } else if (5 < $("#tumor_max").nval() <= 10 ){
        return 'pT1b'
    } else if (1 < $("#tumor_max").nval() <= 5 ){
        return 'pT1a'
    } else if (0 < $("#tumor_max").nval() <= 1){
        return 'pT1mi'
    } else if ($("#DCIS_present_spec_post_neoadjuvant").is(":checked")){
        return 'pTis'
    } else {
        return 'TX'
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
/*     addCheckbox("tumor_site_chkbx", "Tumor Site: ")
    addGenericInput(extentObj)
    addGenericInput(histoObj)
    addGenericInput(archPatternObj)
    addGenericInput(nuclearGradeObj)
    addGenericInput(necrosisObj)
    addGenericInput(marginsObj)
 */    $('#results_block').append(sumtable("#lymph_nodes_tables", "<br/>Lymphnodes: ", "<br/>Total nr of lymphnodes examined: "))
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













