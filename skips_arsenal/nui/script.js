/* =============================================
   ARSENAL SKS — script.js (v2)
   ============================================= */

let selectedItem = null;
let selectedItemType = null; // 'weapon' ou 'ammo'

// -----------------------------------------------
// Seleciona um item e exibe os detalhes no painel
// -----------------------------------------------
function selectItem(event) {
    const card = event.currentTarget;

    // Remove seleção anterior
    if (selectedItem) {
        selectedItem.classList.remove('selected');
    }

    card.classList.add('selected');
    selectedItem = card;

    // Detecta tipo de item
    if (card.classList.contains('ammo-card')) {
        selectedItemType = 'ammo';
    } else {
        selectedItemType = 'weapon';
    }

    // Lê os dados do card
    const id      = card.dataset.id;
    const name    = card.dataset.name;
    const type    = card.dataset.type;
    const cadencia = parseInt(card.dataset.cadencia) || 0;
    const recuo    = parseInt(card.dataset.recuo) || 0;
    const dano     = parseInt(card.dataset.dano) || 0;

    // Atualiza o painel de detalhes
    const detailEmpty   = document.getElementById('detailEmpty');
    const detailContent = document.getElementById('detailContent');
    const detailStats   = document.getElementById('detailStats');

    detailEmpty.style.display   = 'none';
    detailContent.style.display = 'flex';

    // Se for munição, oculta as barras de stat
    if (selectedItemType === 'ammo') {
        detailStats.style.display = 'none';
    } else {
        detailStats.style.display = 'flex';
    }

    document.getElementById('detailName').textContent = name;
    document.getElementById('detailType').textContent = type;

    // Anima as barras de estatística (apenas para armas)
    if (selectedItemType === 'weapon') {
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
    }

    // Atualiza o botão de confirmação
    const confirmBtn = document.getElementById('confirmBtn');
    if (selectedItemType === 'ammo') {
        confirmBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            PEGAR x50 MUNIÇÕES`;
    } else {
        confirmBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            ADICIONAR AO INVENTÁRIO`;
    }
}

// -----------------------------------------------
// Confirma e envia a ação do item selecionado
// -----------------------------------------------
function confirmItem() {
    if (!selectedItem) return;

    const id   = selectedItem.dataset.id;
    const name = selectedItem.dataset.name;

    if (selectedItemType === 'ammo') {
        postAction('giveAmmo', { id: id });
        showToast(`${name} adicionado ao inventário!`);
    } else {
        postAction('giveWeapon', { id: id });
        showToast(`${name} adicionado ao inventário!`);
    }

    // Fecha o menu após confirmar
    setTimeout(() => closeMenu(), 800);
}

// -----------------------------------------------
// Ação rápida (kit básico / guardar pela sidebar)
// -----------------------------------------------
function sendAction(action) {
    if (action === 'KITBASICO') {
        postAction('KITBASICO', {});
        showToast('Kit básico adicionado ao inventário!');
    } else if (action === 'Limpar') {
        postAction('Limpar', {});
        showToast('Armas guardadas com sucesso!');
    }
    setTimeout(() => closeMenu(), 800);
}

// -----------------------------------------------
// Envia o fetch para o FiveM NUI callback
// -----------------------------------------------
async function postAction(action, data) {
    try {
        await fetch(`http://skips_arsenal/${action}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data || {})
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

    postAction('NUIFocusOff', {});
}

// -----------------------------------------------
// Reseta o painel de detalhes
// -----------------------------------------------
function resetDetail() {
    selectedItem     = null;
    selectedItemType = null;

    document.getElementById('detailEmpty').style.display   = 'flex';
    document.getElementById('detailContent').style.display = 'none';

    document.querySelectorAll('.item-card.selected, .ammo-card.selected').forEach(c => {
        c.classList.remove('selected');
    });
}

// -----------------------------------------------
// Troca de categoria (Armas / Munição / Utilitários)
// -----------------------------------------------
function changeCategory(event) {
    const btn = event.currentTarget;
    const cat = btn.dataset.cat;

    // Atualiza botões
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Mostra/oculta cards
    const firearms  = document.querySelectorAll('.item-card.firearms');
    const ammo      = document.querySelectorAll('.ammo-card.ammo');
    const utilities = document.querySelectorAll('.item-card.utilities');

    if (cat === 'firearms') {
        firearms.forEach(c  => c.classList.remove('hidden'));
        ammo.forEach(c      => c.classList.add('hidden'));
        utilities.forEach(c => c.classList.add('hidden'));
        document.getElementById('categoryTitle').textContent = 'ARMAS';
        document.getElementById('categoryCount').textContent = `${firearms.length} itens`;
        document.querySelector('.firearms-only').style.display = 'flex';
    } else if (cat === 'ammo') {
        firearms.forEach(c  => c.classList.add('hidden'));
        ammo.forEach(c      => c.classList.remove('hidden'));
        utilities.forEach(c => c.classList.add('hidden'));
        document.getElementById('categoryTitle').textContent = 'MUNIÇÃO';
        document.getElementById('categoryCount').textContent = `${ammo.length} itens`;
        document.querySelector('.firearms-only').style.display = 'none';
    } else {
        firearms.forEach(c  => c.classList.add('hidden'));
        ammo.forEach(c      => c.classList.add('hidden'));
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
    
    const firearms = document.querySelectorAll('.item-card.firearms');
    const ammo     = document.querySelectorAll('.ammo-card.ammo');
    const utilities = document.querySelectorAll('.item-card.utilities');
    
    firearms.forEach(c  => c.classList.remove('hidden'));
    ammo.forEach(c      => c.classList.add('hidden'));
    utilities.forEach(c => c.classList.add('hidden'));
    
    document.getElementById('categoryTitle').textContent = 'ARMAS';
    document.getElementById('categoryCount').textContent = `${firearms.length} itens`;
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
