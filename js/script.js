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
    var d = String(formattedDate.getDate());
    var m = String(formattedDate.getMonth() + 1);
    var y = String(formattedDate.getFullYear());
    
    return d.padStart(2, '0') + "." + m.padStart(2, '0') + "." + y.padStart(4, '0')
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

function checksum2of5(caseno){
    factor = 3;
    sum = 0;
    while(caseno > 0){
        digit = caseno % 10;
        sum += factor * digit;

        caseno = parseInt(caseno / 10);
        factor = (factor==1)? 3 : 1;
    }
    return (10 - sum % 10);
}

function updateStickers(){
    // do the ones where the fields map one on one
    fields = ['casetype', 'poe', 'foe', 'name', 'firstname', 'casetime', 'street', 'zip', 'city', 'telephone', 'insurance', 'insurancenum', 'insurancetype']
    $.each(fields, function(key, value){
        $('[name="'+value+'"]').html($('#'+value).val())
    });

    // do corner cases by hand

    // remove leading zeros from caseno string
    casenostr = $('#caseno').val().replace(/^0+/, '');
    // cut first 9 chars
    casenostr = casenostr.substring(0, 9);

    // checksum calculated by default 2of5 interleaved algorithm doens't 
    // seem to match the one printed on stickers
    caseno = parseInt(casenostr);
    checksum = checksum2of5(caseno);
    $('[name="casenobc"]').html(""+caseno+checksum);
    
    $('[name="caseno"]').html(casenostr);

    $('[name="birthday"]').html(formatDate($('#birthday').val()));
    $('[name="casedate"]').html(formatDate($('#casedate').val()));

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
    };
    $('td[name="sex"]').html(sex);
}

function updateQR() {
    a = "\b14.07.1230\t\t\tu\t\t\t\t\t\t\tMusterstr.\t22\t\tde\t99999\tBerlin\t\t\t1234567890\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tMüstermünö\tHerr\tMustlörß\t\t\t\t\t";

    var title;
    switch($('#sex').val()){
        case 'männlich':
            title = 'Herr'
            break;
        case 'weiblich':
            title = 'Frau'
            break;
        case 'unbekannt':
            title = 'Herr'
            break;
    };


    qrSAP = "\t\t\t" +
            $('#sex').val() + "\t\t\t\t\t\t\t"+
            $('#street').val() + "\t\t\tde\t"+
            $('#zip').val() + "\t"+
            $('#city').val() + "\t\t\t"+
            $('#telephone').val() + "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t"+
            $('#name').val() + "\t"+
            title + "\t"+
            $('#firstname').val() + "\t\t\t\t" +
            formatDate($('#birthday').val()) + "\t";


    qrEcare = $('#name').val() + "\t"+
            $('#firstname').val() + "\t" +
            $('#street').val() + "\t\t\t" +
            $('#zip').val() + "\t" +
            $('#city').val() + "\t\t\t" +
            $('#telephone').val() + "\t\t\t" +
            formatDate($('#birthday').val()) + "\t\t\t\t\t\t\t\t\t\t" +
            "\b".repeat($('#name').val().length);
    
    $('#qrsap').html("");
    $('#qrsap').qrcode({
        text : qrSAP,
        render	: "canvas",
        background : "#ffffff",
        foreground : "#000000",
        width : 200,
        height: 200
    });            

    $('#qrecare').html("");
    $('#qrecare').qrcode({
        text : qrEcare,
        render	: "canvas",
        background : "#ffffff",
        foreground : "#000000",
        width : 200,
        height: 200
    });            

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
    $(".nofakle-form").change(function(){
        updateStickers();
        updateQR();
    });

    // register cb for print button
    $("#printbutton").click(function(){
        window.print();
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
        alert("Falscher Browser! Diese Seite funktioniert leider nur in Google Chrome so richtig. Insbesondere werden die Ausdrucke mit diesem Browser nicht zu gebrauchen sein!")
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