// Emergency room sticker printer in case of database outage
// Copyright (C) 2019 Tobias Hermann

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});

Date.prototype.toTimeInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(11,19);
});

function formatDate(date){
    var formattedDate = new Date(date);
    var d = formattedDate.getDate();
    var m =  formattedDate.getMonth() + 1;
    var y = formattedDate.getFullYear();
    
    return d + "." + m + "." + y
}

function populateDropdowns(){
    casetypes = ["1A", "1S", "DA", "FL", "PP"];
    poes = ["MZEN-EH", "WZEN-EHC", "WZEN-EHI", "WZEN-EHK", "SZEN-EH"]
    foes = ["MAUFN", "MORTHO", "MHNO", "MGYN", "MDERMA", "MNEURO", "MALLG-CH", "MAN-I", "MIN-KARD", "MSTR", "MGEB-H", "MIN-NEPH", "MIN-GAST", "MIN-HÄON", "MIN-INF", "WAUFN-C", "WAUFN", "WUNF-CH", "WHNO", "WMKG", "WAUGEN", "WNEURO", "WNEU-CH", "WALLG-CH", "WGYN", "WAUFN", "WAN-I", "WIN-KARD", "WSTR", "WACH-I", "WPNKJ", "WKI-H/O", "WKI-PAED", "WKI-CH", "WGEB-H", "WKI-NEO", "WAUF-N", "WIN-NEPH", "WNP-I", "WIN-KART", "WIN-GAST", "WHO-I", "WIN-HÄON", "WIN-INF", "SAUFN-C", "SUNF-CH", "SHNO", "SMKG", "SAUGEN", "SNEURO", "SNEU-CH", "SALLG-CH", "SGYN", "SAUFN", "SAN-I", "SIN-KARD", "SSTR", "SACH-I", "SPNKJ", "SKI-H/O", "SKI-PAED", "SKI-CH", "SGEB-H", "SKI-NEO", "SAUF-N", "SIN-NEPH", "SNP-I", "SIN-KART", "SIN-GAST", "SHO-I", "SIN-HÄON", "SIN-INF"];
    sexes = ['männlich', 'weiblich', 'unbekannt']

    // add casetypes
    $.each(casetypes, function(key, value) {   
        $('#casetype')
            .append($("<option></option>")
                       .attr("value",value)
                       .text(value)); 
   });

    // add poes
    $.each(poes, function(key, value) {   
        $('#poe')
            .append($("<option></option>")
                        .attr("value",value)
                        .text(value)); 
    });
    
    // add foes
    $.each(foes, function(key, value) {   
        $('#foe')
            .append($("<option></option>")
                        .attr("value",value)
                        .text(value)); 
    });

    // add sexes
    $.each(sexes, function(key, value) {   
        $('#sex')
            .append($("<option></option>")
                        .attr("value",value)
                        .text(value)); 
    });
}

function updateStickers(){
    // do the ones where the fields map one on one
    fields = ['caseno', 'casetype', 'poe', 'foe', 'name', 'firstname', 'casetime', 'street', 'zip', 'city', 'telephone', 'insurance', 'insurancenum', 'insurancetype']
    $.each(fields, function(key, value){
        $('[name="'+value+'"]').html($('#'+value).val())
    });

    // do corner cases by hand
    
    $('[name="birthday"]').html(formatDate($('#birthday').val()))
    $('[name="casedate"]').html(formatDate($('#casedate').val()))

    var sex;
    switch($('#sex').val()){
        case 'männlich':
            sex = 'M'
            break;
        case 'weiblich':
            sex = 'W'
            break;
        case 'unbekannt':
            sex = 'U'
            break;
    }
    $('td[name="sex"]').html(sex)
    // $('td[name="name"]').html($('#name').val())
    // $('td[name="name"]').html($('#name').val())
    // $('td[name="name"]').html($('#name').val())
}


function initForm() {
    // duplicate sticker templates dom
    var $sticker = $("#stickertemplate").clone();
    $('.stickercontainer').html($sticker);
    var $stickerbarcode = $("#stickertemplatebarcode").clone();
    $('.stickercontainerbarcode').html($stickerbarcode);

    
    // add options to select dropdowns
    populateDropdowns()

    // register cb if form content changed
    $(".nofakle-form").change(updateStickers)

    // register cb for print button
    $("#printbutton").click(function(){
        window.print()
    });

    // register cb for reset button
    $("#resetbutton").click(function(){
        if(confirm("Sicher? Alle nicht gedruckten Daten gehen verloren!")){
            clearForm();
        }
    });

    // clear form
    clearForm()

    // warn user to use chrome/ium
    if(navigator.userAgent.indexOf("Chrom") == -1){
        alert("Falscher Browser! Diese Seite funktioniert leider nur in Google Chrome so richtig.")
    }
}

function clearForm(){

    // erase fields content
    $("#mainform").trigger("reset");

    // set current date and time
    $("#casedate").val(new Date().toDateInputValue());
    $("#casetime").val(new Date().toTimeInputValue());
    
    // focus first input
    $("#caseno").focus()
}

$(document).ready(initForm);