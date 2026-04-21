/* =============================================
   ARSENAL SKS — script.js
   ============================================= */

let selectedCard = null;
let selectedAction = null;

// -----------------------------------------------
// Seleciona um card e exibe os detalhes no painel
// -----------------------------------------------
function selectWeapon(event) {
    const card = event.currentTarget;

    // Remove seleção anterior
    if (selectedCard) {
        selectedCard.classList.remove('selected');
    }

    card.classList.add('selected');
    selectedCard = card;
    selectedAction = card.dataset.action;

    // Lê os dados do card
    const name      = card.dataset.name;
    const type      = card.dataset.type;
    const ammo      = card.dataset.ammo;
    const url       = card.dataset.url;
    const cadencia  = parseInt(card.dataset.cadencia) || 0;
    const recuo     = parseInt(card.dataset.recuo)    || 0;
    const dano      = parseInt(card.dataset.dano)     || 0;

    // Atualiza o painel de detalhes
    const detailEmpty   = document.getElementById('detailEmpty');
    const detailContent = document.getElementById('detailContent');

    detailEmpty.style.display   = 'none';
    detailContent.style.display = 'flex';

    document.getElementById('detailImg').src    = url;
    document.getElementById('detailName').textContent = name;
    document.getElementById('detailType').textContent = type;
    document.getElementById('detailAmmo').textContent = ammo;

    // Anima as barras de estatística
    requestAnimationFrame(() => {
        const barC = document.getElementById('statCadencia');
        const barR = document.getElementById('statRecuo');
        const barD = document.getElementById('statDano');

        // Reseta primeiro para forçar re-animação
        barC.style.width = '0%';
        barR.style.width = '0%';
        barD.style.width = '0%';

        requestAnimationFrame(() => {
            barC.style.width = `${cadencia * 10}%`;
            barR.style.width = `${recuo * 10}%`;
            barD.style.width = `${dano * 10}%`;
        });
    });

    document.getElementById('valCadencia').textContent = cadencia;
    document.getElementById('valRecuo').textContent    = recuo;
    document.getElementById('valDano').textContent     = dano;

    // Ajusta o botão de confirmação para itens sem stats (utilitários)
    const confirmBtn = document.getElementById('confirmBtn');
    if (selectedAction === 'Limpar') {
        confirmBtn.textContent = '';
        confirmBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none">
                <polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M19 6l-1 14H6L5 6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            GUARDAR TODAS AS ARMAS`;
        confirmBtn.style.background = 'var(--danger)';
    } else {
        confirmBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            ADICIONAR AO INVENTÁRIO`;
        confirmBtn.style.background = '';
    }
}

// -----------------------------------------------
// Confirma e envia a ação do item selecionado
// -----------------------------------------------
function confirmWeapon() {
    if (!selectedAction) return;

    const name = selectedCard ? selectedCard.dataset.name : 'Item';
    postAction(selectedAction);

    // Feedback visual
    showToast(
        selectedAction === 'Limpar'
            ? 'Armas guardadas com sucesso!'
            : `${name} adicionado ao inventário!`
    );

    // Fecha o menu após confirmar
    setTimeout(() => closeMenu(), 800);
}

// -----------------------------------------------
// Ação rápida (kit básico / guardar pela sidebar)
// -----------------------------------------------
function sendAction(action) {
    postAction(action);

    const labels = {
        'KITBASICO': 'Kit básico adicionado ao inventário!',
        'Limpar':    'Armas guardadas com sucesso!'
    };

    showToast(labels[action] || 'Ação executada!');
    setTimeout(() => closeMenu(), 800);
}

// -----------------------------------------------
// Envia o fetch para o FiveM NUI callback
// -----------------------------------------------
async function postAction(action) {
    try {
        await fetch(`http://skips_arsenal/${action}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });
    } catch (e) {
        // Silencia erros fora do ambiente FiveM
    }
}

// -----------------------------------------------
// Fecha o menu e libera o foco da NUI
// -----------------------------------------------
function closeMenu() {
    const all     = document.querySelector('.all');
    const overlay = document.querySelector('.overlay');

    all.classList.remove('entering');
    all.classList.add('hide');
    overlay.classList.add('hide');

    setTimeout(() => {
        all.style.display     = 'none';
        overlay.style.display = 'none';
        all.classList.remove('hide');
        overlay.classList.remove('hide');
        resetDetail();
    }, 580);

    postAction('NUIFocusOff');
}

// -----------------------------------------------
// Reseta o painel de detalhes
// -----------------------------------------------
function resetDetail() {
    selectedCard   = null;
    selectedAction = null;

    document.getElementById('detailEmpty').style.display   = 'flex';
    document.getElementById('detailContent').style.display = 'none';

    document.querySelectorAll('.weapon-card.selected').forEach(c => {
        c.classList.remove('selected');
    });
}

// -----------------------------------------------
// Troca de categoria (Armas de Fogo / Utilitários)
// -----------------------------------------------
function changeCategory(event) {
    const btn = event.currentTarget;
    const cat = btn.dataset.cat;

    // Atualiza botões
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Mostra/oculta cards
    const firearms  = document.querySelectorAll('.weapon-card.firearms');
    const utilities = document.querySelectorAll('.weapon-card.utilities');

    if (cat === 'firearms') {
        firearms.forEach(c  => c.classList.remove('hidden'));
        utilities.forEach(c => c.classList.add('hidden'));
        document.getElementById('categoryTitle').textContent = 'ARMAS DE FOGO';
        document.getElementById('categoryCount').textContent = `${firearms.length} itens`;
        document.querySelector('.firearms-only').style.display = 'flex';
    } else {
        firearms.forEach(c  => c.classList.add('hidden'));
        utilities.forEach(c => c.classList.remove('hidden'));
        document.getElementById('categoryTitle').textContent = 'UTILITÁRIOS';
        document.getElementById('categoryCount').textContent = `${utilities.length} itens`;
        document.querySelector('.firearms-only').style.display = 'none';
    }

    resetDetail();
}

// -----------------------------------------------
// Toast de feedback
// -----------------------------------------------
let toastTimer = null;
function showToast(msg) {
    const toast = document.getElementById('toast');
    document.getElementById('toastMsg').textContent = msg;

    toast.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}

// -----------------------------------------------
// Tecla ESC para fechar
// -----------------------------------------------
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' || e.keyCode === 27) {
        closeMenu();
    }
});

// -----------------------------------------------
// Mensagens vindas do FiveM (showMenu / hideMenu)
// -----------------------------------------------
window.addEventListener('message', function(event) {
    const data = event.data;

    if (data.showMenu) {
        openMenu();
    } else if (data.hideMenu) {
        closeMenu();
    }
});

function openMenu() {
    const all     = document.querySelector('.all');
    const overlay = document.querySelector('.overlay');

    // Garante categoria inicial correta
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-cat="firearms"]').classList.add('active');
    document.querySelectorAll('.weapon-card.firearms').forEach(c  => c.classList.remove('hidden'));
    document.querySelectorAll('.weapon-card.utilities').forEach(c => c.classList.add('hidden'));
    document.getElementById('categoryTitle').textContent = 'ARMAS DE FOGO';
    document.getElementById('categoryCount').textContent = `${document.querySelectorAll('.weapon-card.firearms').length} itens`;
    document.querySelector('.firearms-only').style.display = 'flex';

    resetDetail();

    overlay.style.display = 'block';
    all.style.display     = 'flex';

    // Força reflow para animação
    void all.offsetWidth;
    all.classList.add('entering');
    all.classList.remove('hide');
    overlay.classList.remove('hide');
}
