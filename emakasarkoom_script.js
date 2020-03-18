var totals = [0,0,0]

function cboxInput(cbox) {
    if (cbox.checked) {
    
    var input = document.createElement("input")
    input.type = "text"      
    input.className = cbox.className
    input.id = cbox.id + "_text"
    input.placeholder = "Täpsusta"
    var div = document.createElement("div")
    div.id = cbox.id + "_div"
    div.style = "display: none"
    div.appendChild(input)


    cbox.parentNode.appendChild(div)
            $(div).slideDown()
    } else {
        $("#" + cbox.id + "_div").slideUp('slow', function(){
            $(this).remove()
        })
    }
}

//rbutton - Which radio button?; create_box - boolean if true creates an input box, or DOES NOT delete one; relate - if == "sibling" creates inputbox after next sibling
function radioInput(rbutton, create_box, relate){
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

function disable_class(cbox) {
    $("." + cbox.classList[0] + ":input").not(cbox).prop("disabled", cbox.checked)
}


//cbox/hide_this - this or other but add "." or "#" when needed; hide - if hide then hides instead;
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
    var nrOfRows = table.rows.length;
    var nrOfCells = table.rows[0].cells.length
    for (var i = 1; i < nrOfRows; i++) {
        for (var j = 0; j < nrOfCells ; j++) {
            var colValue = table.rows[i].cells[j].firstChild.value;
            if (!isNaN(colValue) && colValue) {
                if (isNaN(totals[j])){totals.push(0)}
                totals[j]+=parseFloat(colValue)
                str.push(table.rows[0].cells[j].firstChild.textContent + colValue)
            } else {
                totals[j] = null
                str.push(table.rows[0].cells[j].firstChild.textContent + colValue)
            }
        }
        if (str[1] != null){
            ans.push(str.join(", ") + "<br/>");
        }
        str = []
    }
    if (totals.reduce((a, b) => a + b) == 0) {
        return
    } else {
        $('#results_block').append(heading + "<br/>" + ans.join("") + txtBeforeSum + "<br/>")
        for (var i = 0; i < totals.length; i++) {
            if (totals[i] === null) {
                continue
            } else {
                str.push(table.rows[0].cells[i].firstChild.textContent + totals[i] + "<br/>")
            }
        } 
        $('#results_block').append(str.join("") + "<br/>")
    }
}


$(document).ready(function (){

    $('body').on("keyup", '.only_numbers', function (){
        replacetext(this)
    })
    $("input[name='myometrial_invasion']").on("click", function(){
        show_hide('#myometrial_invasion_present' ,  '#myometrial_invasion_details')
    });
    $("input[name='other_organ_involvement']").on("click", function(){
        show_hide('#other_organ_involvement_present','#organ_involvement_table')
    });
    $("input[name='margins']").on("click", function(){
        show_hide('#margins_uninvolved','#margins_uninvolved_dist')
    });
    $("input[name='margins']").on("click", function(){
        show_hide('#margins_involved','#margins_involved_text')
    });
    $("input[name='lymphovascular_invasion']").on("click", function(){
        show_hide('#lymphovascular_invasion_CD', '#lymphovascular_invasion_CD_div')
    });



    //table controls
    $('body').on("click", "#regional_lymph_nodes_add_row", function () {
        addNewRow()
    });

    $('body').on("click", ".remove-row", function() {
        $(this).closest('td').parent().remove();
    });

    function addNewRow() {
        var rowToAdd = $("#regional_lymph_nodes_specified_table tbody tr:last").clone();
        $(rowToAdd).find('input').each(function(){
        $(this).val(null);
        });
        $("#regional_lymph_nodes_specified_table tbody").append(rowToAdd);
    }

    $('#regional_lymph_nodes').change(function () {
        if ($('#regional_lymph_nodes').val() === "Saadetud, täpsustatud") {
            $('#regional_lymph_nodes_block_general').slideUp("slow");
            $('#regional_lymph_nodes_block_specified').slideDown("slow");
        } else if ($('#regional_lymph_nodes').val() === "Saadetud, täpsustamata") {
            $('#regional_lymph_nodes_block_specified').slideUp("slow");
            $('#regional_lymph_nodes_block_general').slideDown("slow");
        } else {
            $('#regional_lymph_nodes_block_specified').slideUp("slow");
        }
    });


    $('#tumor_type').change(function () {
        if ($('#tumor_type').val().indexOf("Endomeetriumi strooma sarkoom, madal aste") >= 0) {
            $('#tumor_type_extra_info').slideDown("slow");
        } else {
            $('#tumor_type_extra_info').slideUp("slow");
        }
        if (($('#tumor_type').val().indexOf("Muu") >= 0) || ($('#tumor_type').val().indexOf("Adenosarkoom teiste heteroloogsete elementidega") >= 0)) { 
            $('#histotype_text_div').slideDown("slow");
        } else {
            $('#histotype_text_div').slideUp("slow");
        }
        if ($('#tumor_type').val().indexOf("Adenosarkoom") >= 0) {
            $('#histologic_grade_div').slideDown("slow");
        } else {
            $('#histologic_grade_div').slideUp("slow");
        }
    });
    
    function addTumorSize() {
        if ($("#tumor_another").is(":checked")) {
            $('#results_block').append("Tuumori suurus: ");
            $('#results_block').append("täpsustamata mõõt " + $('#tumor_another_text').val() + " cm");
            $('#results_block').append('<br/>');
        } else if ($("#tumor_X").is(":checked")) {
            $('#results_block').append("Tuumori suurus: ");
            $('#results_block').append("ei saa mõõa,  " + $('#tumor_X_text').val());
            $('#results_block').append('<br/>');
        } else if ($('#tumor_max').val()) {
            $('#results_block').append("Tuumori suurus: ");
            $('#results_block').append($('#tumor_max').val() + " cm");
            var lm1 = parseFloat($('#tumor_additional1').val());
            var lm2 = parseFloat($('#tumor_additional2').val());

            if (lm1 > 0) {
                $('#results_block').append(" X " + lm1 + " cm");
            }
            if (lm2 > 0) {
                $('#results_block').append(" X " + lm2 + " cm");
            }
            $('#results_block').append('<br/>');
        }


    }
  


    function addGenericRadioB(rbutton_name, heading, extra_text, text_if_notchecked){
        if(document.querySelector('input[name=' + rbutton_name + ']:checked')) {
            if (heading) {$('#results_block').append(heading);}
            $('#results_block').append($('input[name=' + rbutton_name + ']:checked').val() + '<br/>');
            if ($('#' + rbutton_name + "_text").val()){
                $('#results_block').append(extra_text + $('#' + rbutton_name + "_text").val() + '<br/>');
            }
        } else if (text_if_notchecked) {
            $('#results_block').append(text_if_notchecked + '<br/>');
        }
    }

    //adds all visible inputs under input_div_id
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
                    str.push($(input_div_id + " label[for=" + $(this).prop("id")+ "]").text() + ": " + $(this).val())
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

    function calcGradeT() {
        if ($('#tumor_type').val().indexOf("Adenosarkoom") >= 0){
            if ($(".organ_involvement[id*='_bladder_mucosa']:visible, .organ_involvement[id*='_rectal_mucosa']:visible").is(":checked")) {
                return'T4';
            } else if ($(".abdominal_structures:visible").is(":checked").length > 1) {
                return 'T3b';
            } else if ($(".abdominal_structures:visible").is(":checked").length > 0) {
                return 'T3a';
            } else if ($('.pelvic_tissues:visible').is(":checked")) {
                return 'T2b';
            }else if ($(".adnexa:visible").is(":checked")){
                return 'T2a'
            } else if (($("#myometrial_invasion_percent :visible").val() > 50) || $("[id=estimated_MI_o50]:visible").is(":checked")) {
                return 'T1c';
            } else if (((50 > $("#myometrial_invasion_percent :visible").val() < 0) || $("[id=estimated_MI_u50]:visible").is(":checked") && $("#endocervix_present:checked"))) {
                return 'T1b';
            }else if ($("#endocervix_present, #endocervix_endometrium").is(":checked")) {
                return 'T1a';
            } else {
                return 'T0';
            }
        } else {
            if ($(".organ_involvement[id*='_bladder'], .organ_involvement[id*='_bowel']").is(':checked')) {
                return'T4';
            } else if ($(".abdominal_structures:visible").is(":checked").length > 1) {
                return 'T3b';
            } else if ($(".abdominal_structures:visible").is(":checked").length > 0) {
                return 'T3a';
            } else if ($('.pelvic_tissues:visible').is(":checked")) {
                return 'T2b';
            }else if ($(".adnexa").is(":checked")){
                return 'T2a'
            } else if ($("#tumor_max").val() > 5) {
                return 'T1b';
            } else if ($("#tumor_max").val() > 0) {
                return 'T1a';
            } else {
                return 'T0';
            }
        }
        
    }
    function calcGradeN() {
        if (totals[1] > 0) {
            return 'N1'         
        } else if (totals[2] > 0) {
            return 'N0(i+)'
        } else if (totals[0] > 0) {
            return 'N0';
        } else {
            return 'NX'
        }
    }

    function calcFigo(T, N, M) {
        var figo = null
        if ($('#tumor_type').val().indexOf("Adenosarkoom") >= 0) {
            if(M === "M1") {
                figo = 'IVB'
            } else if (T === 'T4') {
                figo = 'IVA'
            } else if (N === 'N1') {
                figo = 'IIIC'
            } else if (T === 'T3b') {
                figo = 'IIIB'
            } else if (T === 'T3a') {
                figo = 'IIIA'
            } else if (T === 'T2b') {
                figo = 'IIB'
            } else if (T === 'T2a') {
                figo = 'IIA'
            } else if (T === 'T1c') {
                figo = 'IC'
            } else if (T === 'T1b') {
                figo = 'IB'
            } else if (T === 'T1a') {
                figo = 'IA'
            }
        } else {
            if(M === "M1") {
                figo = 'IVB'
            } else if (T === 'T4') {
                figo = 'IVA'
            } else if (N === 'N1') {
                figo = 'IIIC'
            } else if (T === 'T3b') {
                figo = 'IIIB'
            } else if (T === 'T3a') {
                figo = 'IIIA'
            } else if (T === 'T2b') {
                figo = 'IIB'
            } else if (T === 'T2a') {
                figo = 'IIA'
            } else if (T === 'T1b') {
                figo = 'IB'
            } else if (T === 'T1a') {
                figo = 'IA'
            } else if (T === 'T1') {
                figo = 'I'
            } 
        }
        if (figo != null) {
            return  ("Figo staadium: " + figo) 
        } else {
            return "Figo staadiumi ei saa hinnata."
        }
    }



    function calcGradeM(){
        if ($(".distal_metastases").is(':checked')) {
            return 'M1'

        } else {
            return 'M0'
        }
    }
    function addExtraFindingsText() {
        if ($('#extra_findings_text').val()) {
            $('#results_block').append('Lisauuringud: ' + $('#extra_findings_text').val());
            $('#results_block').append('<br/>');
        }
    }

    function addComments() {
        if ($('#invasion_comments_text').val()) {
            $('#results_block').append("Lisakommentaarid: " + $('#invasion_comments_text').val());
            $('#results_block').append('<br/>');
        }
    }

   const dist_meta  = {
    input_div_id: "#dist_meta_div",
    heading: "<br/>Kaugmetastaasid: ",
    join: ", "
   }

   const ascitic_obj ={
    input_div_id: "#ascitic_div",
    heading: "<br/>Peritoneaalvedelik: ",
    extra_text: "Täpsustus: "
   }

   const lymphovascular_obj ={
    input_div_id: "#lymphovascular_div",
    heading: "<br/>Lümfovaskulaarne invasioon: ",
    extra_text: "Täpsustus: "
   }

   const margins_obj ={
    input_div_id: "#margins_div",
    heading: "<br/> Piirid: <br/>",
    extra_text: "Täpsustus: "
   }

   const myometrial_obj ={
    input_div_id: "#myometrial_invasion_table",
    heading: "<br/>Müometriaalne invasioon: ",
    extra_text: "Täpsustus: "
   }

   const cervix_obj ={
    input_div_id: "#cervix_involvement_div",
    heading: "<br/>Emakakaela kanali limaskesta haaratus: ",
    extra_text: "Täpsustus: "
   }

   const histologic_obj ={
    input_div_id: "#histologic_grade_div",
    heading: "<br/>Histoloogiline aste: ",
    extra_text: "Täpsustus: "
   }

   const tumor_type_obj ={
    input_div_id: "#tumor_type_div",
    heading: "<br/>Tuumori histoloogiline tüüp: ",
    extra_text: "Täpsustus: "
   }


    $('#calc_results_btn').on("click", function () {
        $('#results_block').empty();
        
        addTumorSize(); 
        addGenericInput(tumor_type_obj)
        addGenericInput(histologic_obj)
        addGenericInput(cervix_obj)
        addGenericInput(myometrial_obj)
        addGenericRadioB("other_organ_involvement", "Teiste kudede/organite haaratus: ", "Täpsustus: ")
        addCheckbox("organ_involvement", "Haaratud koed/organid: ");
        addGenericInput(margins_obj)
        addGenericInput(lymphovascular_obj)
        addGenericInput(ascitic_obj)
        $('#results_block').append(sumtable("#lymph_nodes_tables", "<br/>Lümfisõlmed: ", "Kokku: "))
        addGenericInput(dist_meta)

        $('#results_block').append('<br/>TNM Klassifikatsioon: ' + calcGradeT() + calcGradeN() + calcGradeM() + '<br/>');
        $('#results_block').append(calcFigo(calcGradeT(), calcGradeN(), calcGradeM()) + '<br/>');
        addExtraFindingsText();
        addComments();
        
        $('#results_title').show();
        $('#results_block').show();
        $('#copy_result').text('');
        $('#results_copy_block').show();
    });

})