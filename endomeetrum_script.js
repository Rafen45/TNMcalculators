    
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
        var str = input.value
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
        
$(document).ready(function(){

    $('body').on("keyup", '.only_numbers', function (){
        replacetext(this)
    })
    $('body').on("click", "#copy_result_btn", function () {
        copyToClipboard('#results_block')
    });
    // show/hide elements
    $("input[name='myometrial_invasion']").on("click", function(){
        show_hide('#myometrial_invasion_present' ,  '#myometrial_invasion_details')
    });
    $("input[name='other_organ_involvement']").on("click", function(){
        show_hide('#other_organ_involvement_present','#organ_involvement_table')
    });
    $("input[name='vaginal_cuff_margin']").on("click", function(){
        show_hide('#vaginal_cuff_uninv', '#vaginal_cuff_uninv_div')
    });
    $("input[name='Paracervical_margin']").on("click", function(){
        show_hide('#Paracervical_uninv', '#Paracervical_uninv_div')
    });

    $("input[name='lymphovascular_invasion']").on("click", function(){
        show_hide('#lymphovascular_invasion_CD', '#lymphovascular_invasion_CD_div')
    });
    $("input[name='lymph_nodes']").on("click", function(){
        show_hide('#lymph_nodes_pos', '#pelvic_node_metastases')
    });


    $('body').on("click", "#regional_lymph_nodes_add_row", function () {
        addNewRow()
    });

    $('body').on("click", ".remove-row", function() {
        $(this).closest('td').parent().remove();
    });  

    $('#tumor_type').change(function () {
        if (($('#tumor_type').val().indexOf("Endometrioidne kartsinoom, muu variant") >= 0)||
            ($('#tumor_type').val().indexOf("Segarakk kartsinoom") >= 0)||
            ($('#tumor_type').val().indexOf("muu") >= 0)) {
            $('#histotype_text_div').slideDown("slow");
        } else {
            $('#histotype_text_div').slideUp("slow");
        }
    });

    $('#tumor_type').change(function () {
        if (($('#tumor_type').val().indexOf("Endometrioidne") >= 0)||
            ($('#tumor_type').val().indexOf("Mutsinoosne") >= 0)) {
            $('#histologic_grade_div').slideDown("slow");
        } else {
            $('#histologic_grade_div').hide("slow");
        }
    });

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

    

    function addNewRow() {
        var rowToAdd = $("#regional_lymph_nodes_specified_table tbody tr:last").clone();
        $(rowToAdd).find('input').each(function(){
           $(this).val(null);
        });
        $("#regional_lymph_nodes_specified_table tbody").append(rowToAdd);
     }


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
  


    function addHistoType() {
        if (!($('#tumor_type').val() === "empty")) {
                $('#results_block').append('Histoloogiline tüüp:  ');                 
            if ($('#histotype_text').val() === "Muu") {
                $('#results_block').append($('#histotype_text').val());
            } else if ($('#histotype_text').val() === "Segarakk kartsinoom" || "Endometrioidne kartsinoom, muu variant") {
                $('#results_block').append($('#tumor_type').val() + '<br/>');
                if ($('#histotype_text').val()){
                    $('#results_block').append('Täpsustus: ' + $('#histotype_text').val());
                }    
            } else {
                $('#results_block').append($('#tumor_type').val());
            }
            $('#results_block').append('<br/>');
        }
    }


    function addMyoinvasion() {
        if (document.querySelector('input[name="myometrial_invasion"]:checked')) {
            var x = $('input[name="myometrial_invasion"]:checked').val();
            if (x === "Esineb") {
                $('#results_block').append(x + ' müometriaalne invasioon. ' + '<br/>');
                if ($("#myometrial_invasion_depth").val()){
                    $('#results_block').append("Müometriaalse invastiooni sügavus: " + $("#myometrial_invasion_depth").val() + 'mm' + "<br/>")
                }
                if ($("#myometrial_invasion_present_not_known").is(":checked")){
                    if ($("#myometrial_invasion_present_not_known").is(":checked") && $("input[name=estimated_mi_percent]").is(":checked")) {
                        $('#results_block').append('Hinnanguline müomeetriaalne invastioon: ' + $("input[name=estimated_mi_percent]:checked").val() + '%' + '<br/>')
                    }
                    if ($("#myometrial_invasion_depth_not_known").val() != "") { 
                        $('#results_block').append("Müometriaalse invastiooni sügavust ei saa hinnata." + "<br/>" + "Täpsustus: " + $("#myometrial_invasion_depth_not_known").val() + '<br/>');
                    }
                    if ($("#myometrial_invasion_percent_not_known").val() != "") {
                        $('#results_block').append("Müometriaalset paksust ei saa hinnata." + "<br/>" + "Täpsustus: " + $("#myometrial_invasion_percent_not_known").val() + '<br/>');
                    }
                } else {
                    $('#results_block').append("Müometriaalse invastiooni osakaal: " + $("#myometrial_invasion_percent").val() + '%' + "<br/>")
                }
            } else {
                $('#results_block').append('Müometriaalset invasiooni ' + x);
                if ($('#myometrial_invasion_text').val()) {
                    $('#results_block').append('<br/>' + 'Täpsustus: ' + $('#myometrial_invasion_text').val());
                }
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

    function addCheckbox(cbox_class, heading, text_if_notchecked) {
        if (document.querySelector('input[class="'+ cbox_class +'"]:checked')) {
            $('#results_block').append(heading);
            var cbox_list = [];
            $.each($('input[class="'+ cbox_class +'"]:checked'), function () {
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
        if ($(".organ_involvement[id*='_bladder_mucosa'], .organ_involvement[id*='_bowel_mucosa']").is(':checked')) {
            return'T4';
        } else if ($(".organ_involvement[id*=_parametrium], .organ_involvement[id*=_Vagina]").is(':checked')) {
            return 'T3b';
        } else if ($(".organ_involvement[id*=_ovary], .organ_involvement[id*=_fallopian_tube], *[id=uterine_serosa_present]").is(':checked')) {
            return 'T3a';
        } else if ($('#cervical_stroma_present').is(':checked')) {
            return 'T2';
        } else if (($("#myometrial_invasion_percent :visible").val() > 50) || $("[id=estimated_MI_o50]:visible").is(":checked")) {
            return 'T1b';
        } else if ((50 > $("#myometrial_invasion_percent :visible").val() < 0) || $("[id=estimated_MI_u50]:visible").is(":checked")) {
            return 'T1a';
        }else if ($('*[id=low_uterine_segment_NA], *[id=low_uterine_segment_present_sup]').is(":checked")) {
            return 'T1';
        } else {
            return 'T0';
        }
        
    }
    function calcGradeN() {
        if ($('#regional_lymph_nodes').val() == 'Ei ole saadetud / leitud') {
            return 'NX';
        } else if ($("#paraaortal_lymph_nodes_macrometa").val() > 0) {
            return 'N2a'
        } else if ($("#paraaortal_lymph_nodes_micrometa").val() > 0) {
            return 'N2mi'
        } else if ($("#paraaortal_lymph_nodes_ls").val() > 0) {
            return 'N2'
        } else if ($("#pelvic_lymph_nodes_macrometa").val() > 0) {
            return 'N1a'
        } else if ($("#pelvic_lymph_nodes_micrometa").val() > 0) {
            return 'N1mi'
        } else if ($("#pelvic_lymph_nodes_ls").val() > 0) {
            return 'N1'         
        } else if ($("input[name*=_metasmall]").val() > 0) {
            return 'N0(i+)'
        } else {
            return 'N0';
        }
    }
    function calcGradeM(){
        if ($(".distal_metastases").is(':checked')) {
            return 'M1'

        } else {
            return 'M0'
        }
    }
    function calcFigo(T, N, M) {
        var figo = null
        if(M === "M1") {
            figo = 'IVB'
        } else if (T === 'T4') {
            figo = 'IVA'
        } else if (N.includes('N2')) {
            figo = 'IIIC2'
        } else if (N.includes('N1')) {
            figo = 'IIIC1'
        } else if (T === 'T3b') {
            figo = 'IIIB'
        } else if (T === 'T3a') {
            figo = 'IIIA'
        } else if (T === 'T2') {
            figo = 'II'
        } else if (T === 'T1b') {
            figo = 'IB'
        } else if (T === 'T1a') {
            figo = 'IA'
        } else if (T === 'T1') {
            figo = 'I'
        }
        if (figo != null) {
            return  ("Figo staadium: " + figo) 
        } else {
            return "Figo staadiumi ei saa hinnata."
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

    $('#calc_results_btn').on("click", function () {
        $('#results_block').empty();

        addTumorSize();
        addHistoType();
        addCheckbox("localisation", "Tuumori asukoht: ");
        addGenericRadioB("histograde", "Histoloogiline aste: ", "Täpsustus: ")
        addMyoinvasion();
        addGenericRadioB("Adenomyosis", "Adenomüoos: ", "Täpsustus: ", "Adenomüoos puudub.")
        addGenericRadioB("uterine_serosa", "Perimeetriumi haaratus: ", "Täpsustus: ")
        addGenericRadioB("low_uterine_segment", "Emaka alumise segmendi haaratus: ", "Täpsustus: ")
        addGenericRadioB("cervical_stroma", "Emakakaela strooma haaratus: ", "Täpsustus: ")
        addGenericRadioB("other_organ_involvement", "Teiste kudede/organite haaratus: ", "Täpsustus: ")
        addCheckbox("organ_involvement", "Haaratud koed/organid: ");
        addGenericRadioB("vaginal_cuff_margin", "Tupeköndi piir: ", "Invasiivse kasvaja kaugus piirist (mm): ")
        addGenericRadioB("lymphovascular_invasion", "Lümfovaskulaarne invasioon: ", "Täpsustus: ")
        addGenericRadioB("ascitic_Fluid", "Peritoneaalvedelik: ", "Täpsustus: ")
        addCheckbox("distal_metastases", "Kaugmetastaasid: ")
        $('#results_block').append(sumtable("regional_lymph_nodes_specified_table", "Lümfisõlmed: ", "Kokku: "))
        $('#results_block').append('TNM Klassifikatsioon: ' + calcGradeT() + calcGradeN() + calcGradeM() + '<br/>');
        $('#results_block').append(calcFigo(calcGradeT(), calcGradeN(), calcGradeM()) + '<br/>');
        addExtraFindingsText();
        addComments();
        $('#results_title').show();
        $('#results_block').show();
        $('#copy_result').text('');
        $('#results_copy_block').show();
    });
});


            //hide_this.style.display = cbox.checked ? "block" : "none";