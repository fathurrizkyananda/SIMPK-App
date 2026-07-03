// =====================================================================
// UI.JS — Komponen UI bersama: toast, modal konfirmasi, export CSV,
// grafik distribusi grade, dan toggle sidebar mobile.
// =====================================================================

// ---------------------------------------------------------------------
// TOAST NOTIFICATION (pengganti alert())
// ---------------------------------------------------------------------
function ensureToastWrap() {
    let wrap = document.querySelector('.toast-wrap');
    if (!wrap) {
        wrap = document.createElement('div');
        wrap.className = 'toast-wrap';
        document.body.appendChild(wrap);
    }
    return wrap;
}

function toast(message, type) {
    const wrap = ensureToastWrap();
    const el = document.createElement('div');
    el.className = 'toast' + (type ? ' ' + type : '');
    el.textContent = message;
    wrap.appendChild(el);

    setTimeout(() => {
        el.classList.add('hide');
        setTimeout(() => el.remove(), 220);
    }, 3200);
}

// ---------------------------------------------------------------------
// MODAL KONFIRMASI (pengganti confirm())
// ---------------------------------------------------------------------
function confirmModal(message, onConfirm, title) {
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.innerHTML = `
        <div class="modal-box">
            <h4>${title || 'Konfirmasi'}</h4>
            <p>${message}</p>
            <div class="modal-actions">
                <button class="btn-confirm-cancel" type="button">Batal</button>
                <button class="btn-confirm-danger" type="button">Ya, Lanjutkan</button>
            </div>
        </div>`;
    document.body.appendChild(backdrop);

    const close = () => backdrop.remove();

    backdrop.querySelector('.btn-confirm-cancel').addEventListener('click', close);
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });
    backdrop.querySelector('.btn-confirm-danger').addEventListener('click', () => {
        close();
        onConfirm();
    });
}
// ---------------------------------------------------------------------
// EXPORT CSV
// ---------------------------------------------------------------------
function exportCSV(filename, headers, rows) {
    if (!rows || rows.length === 0) {
        toast('Tidak ada data untuk diekspor.', 'error');
        return;
    }
    const escapeCell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const lines = [headers.map(escapeCell).join(',')];
    rows.forEach(row => lines.push(row.map(escapeCell).join(',')));

    const blob = new Blob(['\uFEFF' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast('Data berhasil diekspor ke CSV.', 'success');
}

// ---------------------------------------------------------------------
// GRAFIK DISTRIBUSI GRADE (donut SVG, tanpa library eksternal)
// ---------------------------------------------------------------------
function renderGradeChart(containerId, nilaiList) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!nilaiList || nilaiList.length === 0) {
        container.innerHTML = '<p class="chart-empty">Belum ada data nilai untuk ditampilkan pada grafik.</p>';
        return;
    }

    const groups = { A: 0, B: 0, C: 0, D: 0 };
    nilaiList.forEach(item => {
        const g = (item.grade || '').charAt(0).toUpperCase();
        if (groups[g] !== undefined) groups[g]++; else groups.D++;
    });

    const colors = { A: '#3f7a5c', B: '#3654c9', C: '#c6952f', D: '#b23a48' };
    const total = nilaiList.length;
    const radius = 46;
    const circumference = 2 * Math.PI * radius;
    let offset = 0;

    let circles = '';
    Object.keys(groups).forEach(key => {
        const value = groups[key];
        if (value === 0) return;
        const fraction = value / total;
        const dash = fraction * circumference;
        circles += `<circle cx="60" cy="60" r="${radius}" fill="none" stroke="${colors[key]}"
            stroke-width="16" stroke-dasharray="${dash} ${circumference - dash}"
            stroke-dashoffset="${-offset}" transform="rotate(-90 60 60)" />`;
        offset += dash;
    });

    const legendRows = Object.keys(groups).map(key => `
        <div class="row">
            <span class="label"><i style="background:${colors[key]}"></i>Grade ${key}</span>
            <span class="count">${groups[key]}</span>
        </div>`).join('');

    container.innerHTML = `
        <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="${radius}" fill="none" stroke="#eef0f5" stroke-width="16" />
            ${circles}
            <text x="60" y="56" text-anchor="middle" font-family="'Fraunces', serif" font-size="22" font-weight="700" fill="#1c2333">${total}</text>
            <text x="60" y="74" text-anchor="middle" font-family="'Inter', sans-serif" font-size="10" fill="#64748b">Total Nilai</text>
        </svg>
        <div class="chart-legend">${legendRows}</div>`;
}

// ---------------------------------------------------------------------
// SIDEBAR TOGGLE (mobile)
// ---------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    const openBtn = document.getElementById('sidebarOpen');
    const backdrop = document.querySelector('.sidebar-backdrop');

    if (sidebar && openBtn && backdrop) {
        openBtn.addEventListener('click', () => {
            sidebar.classList.add('open');
            backdrop.classList.add('show');
        });
        backdrop.addEventListener('click', () => {
            sidebar.classList.remove('open');
            backdrop.classList.remove('show');
        });
    }
});

// ---------------------------------------------------------------------
// FILTER TABEL SEDERHANA (live search)
// Menyembunyikan baris <tr> pada tbody yang tidak cocok dengan kata kunci
// ---------------------------------------------------------------------
function liveFilterTable(inputId, tbodyId) {
    const input = document.getElementById(inputId);
    const tbody = document.getElementById(tbodyId);
    if (!input || !tbody) return;

    input.addEventListener('input', () => {
        const keyword = input.value.trim().toLowerCase();
        Array.from(tbody.querySelectorAll('tr')).forEach(tr => {
            if (tr.classList.contains('empty-row')) return;
            const text = tr.textContent.toLowerCase();
            tr.style.display = text.includes(keyword) ? '' : 'none';
        });
    });
}
