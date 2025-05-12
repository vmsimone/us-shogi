function loadPage() {
    readyMap();
}

function readyMap() {
    $('#outlines .clubs').on('click', e => {
        displayClubInfo(e.currentTarget.id);
    })
    
    $('#outlines .jsaClubs').on('click', e => {
        displayClubInfo(e.currentTarget.id);
    })

    $('#btn-all-clubs').on('click', e => {
        displayClubInfo('club');
    })
}

function displayClubInfo(state) {
    console.log(state);
    $('.club').css('display', 'none');
    $(`.${state}`).css('display', 'block')
    // $('html, body').animate({
    //     scrollTop: $('.clubs').offset().top -10
    // }, 500);
}

$(loadPage);