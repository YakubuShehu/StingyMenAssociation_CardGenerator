// key variables
var mName, mPosition, mBranch, mNumber, mPhoto;

let cardCanvas = $("#cardPreviewCanvas")[0];
let ctx_CC = cardCanvas.getContext("2d");
ctx_CC.font = "600 50px Roboto, sans-serif";
ctx_CC.fillStyle = "#851c37";

let textCanvas = $("#detailEntryCanvas")[0];
let ctx_TC = textCanvas.getContext("2d");
ctx_TC.font = "600 50px Roboto, sans-serif";
ctx_TC.fillStyle = "#851c37";

let mugshotCanvas = $("#mugshotCanvas")[0];
let ctx_MSC = mugshotCanvas.getContext("2d");
let isImgUploaded = false;


let mainCanvas = $("#canvasRender")[0];
let ctx_MC = mainCanvas.getContext("2d");

let cardBackground = new Image(1896, 1089);

let countryCode = $("#inputCountry").val();

let randomNo = Math.floor(Math.random() * 7999999999).toString();


// border radius on the ID photo
function roundedImage(x, y, width, height, radius) {
    ctx_MSC.beginPath();
    ctx_MSC.moveTo(x + radius, y);
    ctx_MSC.lineTo(x + width - radius, y);
    ctx_MSC.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx_MSC.lineTo(x + width, y + height - radius);
    ctx_MSC.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx_MSC.lineTo(x + radius, y + height);
    ctx_MSC.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx_MSC.lineTo(x, y + radius);
    ctx_MSC.quadraticCurveTo(x, y, x + radius, y);
    ctx_MSC.closePath();
}







// generate random Membership Number
function drawID() {
    if(countryCode.match('mw')) { // check for long country code
        ctx_CC.fillText(randomNo, 1024, 869) //s, x, y, mw
    }
    else ctx_CC.fillText(randomNo, 1010, 869) //s, x, y, mw
}







// function - default to global background image
function defaultBackground (e) {
    toastr.warning('Error... Using default image.');
    cardBackground.src = './assets/img/card-mockup-global.png';
}





// draw canvas for ID card preview and paint background image
function drawBackgroundImage() {
    cardBackground.src = $("#canvasBGImg")[0].src;
    cardBackground.onload = function() {
        ctx_CC.drawImage(cardBackground, 0,0);
        drawID();
    }
    cardBackground.onerror = function() { defaultBackground(); }
}






// upon file select, paste/draw the image on the Canvas
function uploadMugshot(e) {

    let file = this.files[0];
    let fileType = file["type"];
    let validImageTypes = ["image/gif", "image/jpeg", "image/png"];
    if ($.inArray(fileType, validImageTypes) < 0) {
        return toastr.error(
            'Please upload an image with one of these filetypes: [.jpg, .jpeg, .png, .gif, .webp]',
            'Image Upload Error',
            {closeButton: 'true', timeOut: 0, extendedTimeout: 0}
        );
    }

    if (isImgUploaded) ctx_MSC.clearRect(0, 0, mugshotCanvas.width, mugshotCanvas.height); // clear already existing image
    let reader = new FileReader();
    reader.onload = function(event) {
        let uploadedImg = new Image();
        uploadedImg.onload = function() {
            roundedImage(1326, 418, 460, 460, 50);
            ctx_MSC.clip();
            ctx_MSC.drawImage(uploadedImg, 1326, 418, 460, 460);
            isImgUploaded = true;
        }
        uploadedImg.onerror = function() {
            toastr.error('Upload Error', 'Your image could not be uploaded. Please try with another image.');
        }
        uploadedImg.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
}





// function that combines 2 canvases into a 3rd
function combineCanvases() {
    ctx_MC.drawImage(cardCanvas, 0, 0);
    ctx_MC.drawImage(textCanvas, 0, 0);
    ctx_MC.drawImage(mugshotCanvas, 0, 0);
}




// function that changes the id card mockup
function changeBackground(e) {
    countryCode = $(this).val();

    if (countryCode) {

        switch (countryCode) {
            case ('ao'):
                cardBackground.src = './assets/img/card-mockup-ao.png';
                break;
            case ('bw'):
                cardBackground.src = './assets/img/card-mockup-bw.png';
                break;
            case ('cd'):
                cardBackground.src = './assets/img/card-mockup-cd.png';
                break;
            case ('ls'):
                cardBackground.src = './assets/img/card-mockup-ls.png';
                break;
            case ('mg'):
                cardBackground.src = './assets/img/card-mockup-mg.png';
                break;
            case ('mw'):
                cardBackground.src = './assets/img/card-mockup-mw.png';
                break;
            case ('mu'):
                cardBackground.src = './assets/img/card-mockup-mu.png';
                break;
            case ('na'):
                cardBackground.src = './assets/img/card-mockup-na.png';
                break;
            case ('sc'):
                cardBackground.src = './assets/img/card-mockup-sc.png';
                break;
            case ('sz'):
                cardBackground.src = './assets/img/card-mockup-sz.png';
                break;
            case ('tz'):
                cardBackground.src = './assets/img/card-mockup-tz.png';
                break;
            case ('za'):
                cardBackground.src = './assets/img/card-mockup-za.png';
                break;
            case ('zm'):
                cardBackground.src = './assets/img/card-mockup-zm.png';
                break;
            case ('zw'):
                cardBackground.src = './assets/img/card-mockup-zw.png';
                break;
            default:
                cardBackground.src = './assets/img/card-mockup-global.png';
                break;
        }

        cardBackground.onload = function() {
            ctx_CC.clearRect(0, 0, textCanvas.width, textCanvas.height);
            ctx_CC.drawImage(cardBackground,0,0);
            drawID();
        }
        cardBackground.onerror = function() {
            defaultBackground();
        }
    }

}





// download copy of the generated card
function downloadImage(e) {

    combineCanvases();

    e.preventDefault();
    let dataURL = mainCanvas.toDataURL("image/png");
    let dLink = $("#pseudoDownload a");
    var fileName = "SMA-MembershipCard-" + randomNo.toString() +".png";
    dLink.attr("href", mainCanvas.toDataURL());
    dLink.attr("download", fileName);
    dLink[0].click();
    toastr.info('Downloading image...');
    
    $.ajax({
        type: "POST",
        url: 'save.php',
        data: { base64: dataURL, fName: fileName },
        success: function (response) {
            console.log(response);
        },
        fail: function(xhr, textStatus, errorThrown) {
            console.log(errorThrown);
        },
        cache: false,
    });
}




// add event listeners to form input (on key press)
function registerEventListeners() {
    $("#inputName").on('input', function() {
        ctx_TC.clearRect(0, 0, textCanvas.width, textCanvas.height);
        ctx_TC.fillText($(this).val(), 680, 615.5, 560); //s, x, y, mw
        ctx_TC.fillText($("#inputPosition").val(), 730, 700, 500);
        ctx_TC.fillText($("#inputBranch").val(), 700, 783, 500);
    });
    $("#inputPosition").on('input', function() {
        ctx_TC.clearRect(0, 0, textCanvas.width, textCanvas.height);
        ctx_TC.fillText($(this).val(), 730, 700, 500); //s, x, y, mw
        ctx_TC.fillText($("#inputName").val(), 680, 615.5, 560);
        ctx_TC.fillText($("#inputBranch").val(), 700, 783, 500);
    });
    $("#inputBranch").on('input', function() {
        ctx_TC.clearRect(0, 0, textCanvas.width, textCanvas.height);
        ctx_TC.fillText($(this).val(), 700, 783, 500); //s, x, y, mw
        ctx_TC.fillText($("#inputName").val(), 680, 615.5, 560);
        ctx_TC.fillText($("#inputPosition").val(), 730, 700, 500);
    });
    $("#inputCountry").on('change', changeBackground);
    $("#downloadButton").on('click', downloadImage);
}







// main function
$(function() {

    // tooltips init
    $('[data-toggle="tooltip"]').tooltip();

    // paint background image
    drawBackgroundImage();

    // auto-generated ID number
    $("#inputMembershipNo").val(randomNo);
    drawID();


    // handle image upload listener
    $("#inputPhoto").on('change', uploadMugshot);


    // initialize respective event listeners
    registerEventListeners();

});