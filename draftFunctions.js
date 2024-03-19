const 
    AZclubs = [
        {
            site: "https://phxshogi.com/",
            title: "Phoenix Shogi",
            leader: "Tyiss Goodman",
            id: "cGhvZW5peHNob2dpQGdtYWlsLmNvbQ=="
        }
    ],
    CAclubs = [
        {
            site: "",
            title: "",
            leader: "",
            id: ""
        }
    ],
    DCclubs = [
        {
            site: "",
            title: "",
            leader: "",
            id: ""
        }
    ],
    ILclubs = [
        {
            site: "",
            title: "",
            leader: "",
            id: ""
        }
    ],
    MAclubs = [
        {
            site: "",
            title: "",
            leader: "",
            id: ""
        }
    ],
    NYclubs = [
        {
            site: "",
            title: "",
            leader: "",
            id: ""
        }
    ],
    ORclubs = [
        {
            site: "",
            title: "",
            leader: "",
            id: ""
        }
    ],
    WA = [
        {
            site: "",
            title: "",
            leader: "",
            id: ""
        }
    ]
;

const stateInfo = {
    AZ: clubInfoConstructor(),
    CA: clubInfoConstructor(),
    DC: clubInfoConstructor({
        site: "https://phxshogi.com/",
        title: "Phoenix Shogi",
        leader: "Tyiss Goodman",
        id: "cGhvZW5peHNob2dpQGdtYWlsLmNvbQ=="
    }),
    IL: clubInfoConstructor({
        site: "https://phxshogi.com/",
        title: "Phoenix Shogi",
        leader: "Tyiss Goodman",
        id: "cGhvZW5peHNob2dpQGdtYWlsLmNvbQ=="
    }),
    MA: clubInfoConstructor({
        site: "https://phxshogi.com/",
        title: "Phoenix Shogi",
        leader: "Tyiss Goodman",
        id: "cGhvZW5peHNob2dpQGdtYWlsLmNvbQ=="
    }),
    NY: clubInfoConstructor({
        site: "https://phxshogi.com/",
        title: "Phoenix Shogi",
        leader: "Tyiss Goodman",
        id: "cGhvZW5peHNob2dpQGdtYWlsLmNvbQ=="
    }),
    OR: clubInfoConstructor({
        site: "https://phxshogi.com/",
        title: "Phoenix Shogi",
        leader: "Tyiss Goodman",
        id: "cGhvZW5peHNob2dpQGdtYWlsLmNvbQ=="
    }),
    WA: clubInfoConstructor({
        site: "https://phxshogi.com/",
        title: "Phoenix Shogi",
        leader: "Tyiss Goodman",
        id: "cGhvZW5peHNob2dpQGdtYWlsLmNvbQ=="
    })
}

function clubInfoConstructor(clubInfo) {
    return `
        <h2>Clubs in [State]</h2>
        <h3><a href="${clubInfo.site}">${clubInfo.title}</a></h3>
        <ul class="club-details">
            <li>Leader: ${clubInfo.leader}</li>
            <li class="contact" id="${clubInfo.id}">Contact: <a href="mailto:${atob(clubInfo.id)}">${atob(clubInfo.id)}</a></li>
        </ul>
    `
}