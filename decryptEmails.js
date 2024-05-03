function loadPage() {
    decrypt();
}

function decrypt() {
    const clubs = document.getElementsByClassName('club');
    const clubKeys = Object.keys(clubs);

    clubKeys.forEach(club => {
        const contactLi = clubs[club].getElementsByClassName('contact')[0];
        if(contactLi) {
            const decryptedEmail = atob(contactLi.id);
    
            const emailAnchor = contactLi.children[0];
    
            emailAnchor.setAttribute("href", `mailto:${decryptedEmail}`);
            emailAnchor.textContent=decryptedEmail;
        }
    })
}

$(loadPage);