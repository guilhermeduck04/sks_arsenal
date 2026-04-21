function showGun(event) {
    let all = document.querySelector(".gunInf-container")
    all.style.display = 'flex'

    let main = event.currentTarget;
    let name = main.childNodes[3]
    let bttn = main.childNodes[5]

    name.style.display = 'none';
    bttn.style.display = 'block';
    bttn.classList.remove('fade')
    bttn.classList.add('fade')
    

    // =========================================================

    let status = main.dataset.status.split('|')
    
    let c = document.querySelector('.C')
    let r = document.querySelector('.R')
    let d = document.querySelector('.D')
    c.classList.add('width')
    r.classList.add('width')
    d.classList.add('width')

    c.style.width = `${status[0]}0%`
    c.textContent = `${status[0]}/10`


    d.style.width = `${status[1]}0%`
    d.textContent = `${status[1]}/10`

    r.style.width = `${status[2]}0%`
    r.textContent = `${status[2]}/10`

    let img = document.querySelector('.bigImage')
    if (main.dataset.name == 'LANTERNA' || main.dataset.name == 'ESCOPETA') {
        img.style.height = '100px'
    } else {
        img.style.height = '170px'
    }

    img.src = main.dataset.url
    img.classList.add('fade')

    let title = document.querySelector('.mainTitle')
    title.textContent = main.dataset.name
    title.classList.add('fade')

}

function hideGun(event){
    let title = document.querySelector('.mainTitle')
    title.classList.remove('fade')

    let img = document.querySelector('.bigImage')
    img.classList.remove('fade')


    let main = event.currentTarget;
    let name = main.childNodes[3]
    let bttn = main.childNodes[5]

    name.style.display = 'block';
    name.classList.remove('fade')
    name.classList.add('fade')


    bttn.style.display = 'none';
    bttn.classList.remove('fade')
    bttn.classList.add('fade')

    let c = document.querySelector('.C')
    let r = document.querySelector('.R')
    let d = document.querySelector('.D')
    c.classList.remove('width')
    r.classList.remove('width')
    d.classList.remove('width')
}

function changeFilter(event) {
    let filters = document.querySelectorAll('.filter')
    for (let i in filters) {
        try {
            filters[i].classList.remove('active-filter')
        } catch (e) {
            continue
        }
    }

    let element = event.currentTarget
    element.classList.add('active-filter')
    element.classList.add('border')

    setTimeout(() =>{
        element.classList.remove('border')
    }, 600)

    let guns = document.querySelectorAll('.gun')
    let pass = document.querySelectorAll('.pass')
    if (element.textContent == 'ARMAS DE FOGO') {
        document.querySelector('.main-title').textContent = 'ARMAS DE FOGO'

        for (let a in guns) {
            try {
                guns[a].style.display = 'flex'
                guns[a].classList.add('left')

            } catch (e) {
                continue
            }
        }

        for (let p in guns) {
            try {
                pass[p].style.display = 'none'
                pass[p].classList.remove('left')
            } catch (e) {
                continue
            }
        }
        
    } else {
        document.querySelector('.main-title').textContent = 'UTILITÁRIOS'

        for (let a in guns) {
            try {
                guns[a].style.display = 'none'
                guns[a].classList.remove('left')
            } catch (e) {
                continue
            }
        }

        for (let p in guns) {
            try {
                pass[p].style.display = 'flex'
                pass[p].classList.add('left')
            } catch (e) {
                continue
            }
        }
    }
}

async function sendData(event) {
    let main = event.currentTarget;
    

    let options = {
        method: 'POST',
        body: JSON.stringify({})
    }

    await fetch(`http://skips_arsenal/${main.dataset.id}`, options)
}

async function sendData2(action) {
    let options = {
        method: 'POST',
        body:JSON.stringify({})
    }

    await fetch(`http://skips_arsenal/${action}`, options)
}


document.querySelector('body').addEventListener('keydown', function(event) {

    let all = document.querySelector('.all')

    let black = document.querySelector('.black-screen')

    if (event.keyCode == '27') {
        all.classList.remove('fade')
        all.classList.add('hide')
        black.classList.add('hide')
        setTimeout(function() {
            black.style.display = 'none'
            all.style.display = 'none'
        }, 580)

        sendData2('NUIFocusOff')
    }
});

window.addEventListener('message', (data) => {
    console.log(data)
    let all = document.querySelector('.all')

    if (data.data.showMenu) {
        document.querySelector('.black-screen').style.display = 'block'
        all.classList.add('fade')
        all.classList.remove('hide')
        setTimeout(function() {
            all.style.display = 'block'
        }, 580)
    } else if (data.data.hideMenu) {
        document.querySelector('.black-screen').style.display = 'none'
        all.classList.add('hide')
        all.classList.remove('fade')
        setTimeout(function() {
            all.style.display = 'none'
        }, 580)
    }


}) 