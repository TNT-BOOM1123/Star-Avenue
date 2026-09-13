const main = document.querySelector('#main');
const photos = ['slide1-8.png', 'slide1-9.png', 'slide1-10.png', 'slide1-13.png', 'slide1-14.png', 'slide4-5.png', 'slide4-6.png', 'slide4-3.png', 'slide4-7.png'];
const src = i => 'assets/' + photos[i % photos.length];

function home() {
    main.innerHTML = `<div class="section-head"><div><p class="eyebrow">CAPTURE THE MOMENT</p><div class="heading-inline"><h1>热门推荐</h1><span class="chip">精选影像</span></div><p class="subtext">循着光影，重逢每一个心动瞬间。</p></div><a class="text-link" href="#library">浏览作品库 ↗</a></div><div class="featured">${['聚光灯下', '舞台瞬间', '光影之间'].map((x, i) => `<a class="feature" href="#timeline/artist/${encodeURIComponent('丁程鑫')}" aria-label="${x}，探索丁程鑫时间轴"><img src="${src(i)}" alt="${x}，PPT 中的舞台摄影示例"><span class="tag-over">${['现场记录', '舞台影像', '精选作品'][i]}</span><div class="feature-copy"><div><h3>${x}</h3><p>探索艺人影像时间轴</p></div><span class="circle-arrow">↗</span></div></a>`).join('')}</div><section class="home-second"><div class="section-head"><div class="heading-inline"><h2>时代峰峻</h2><span class="chip">示例专区</span></div><a class="text-link" href="#library">全部作品 ↗</a></div><div class="artist-grid"><a class="artist-card" href="#timeline/artist/${encodeURIComponent('丁程鑫')}"><img src="${src(3)}" alt="PPT 示例照片"><div><strong>丁程鑫</strong><small>探索影像时间轴</small></div><span class="arrow">↗</span></a><a class="artist-card" href="#timeline/artist/${encodeURIComponent('丁程鑫')}/2019"><img src="${src(4)}" alt="PPT 示例照片"><div><strong>2019 年影像</strong><small>从这一年开始回看</small></div><span class="arrow">↗</span></a><a class="artist-card" href="#timeline/photographer/${encodeURIComponent('遠花火')}"><img src="${src(5)}" alt="PPT 示例照片"><div><strong>遠花火</strong><small>站姐时间轴 · 演示</small></div><span class="arrow">↗</span></a><a class="artist-card" href="#join"><span class="avatar">＋</span><div><strong>站姐入驻</strong><small>了解入驻流程</small></div><span class="arrow">↗</span></a></div></section><div class="intro-strip"><span class="spark">✧</span><p><strong>沿着时间，找到喜欢的那一帧。</strong><br>搜索艺人或站姐，点击年份与月份，探索每一段影像记录。</p><a class="text-link" style="margin-left:auto;white-space:nowrap" href="#timeline/artist/${encodeURIComponent('丁程鑫')}">体验时间轴 →</a></div>`
}

home();
const enc = encodeURIComponent, esc = s => String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
}[c]));
const names = ['遠花火', 'OHMYBABEPRINCE'];
const records = Array.from({length: 8}, (_, yi) => Array.from({length: yi === 0 ? 2 : 3}, (_, mi) => Array.from({length: 4}, (_, n) => ({
    id: `${yi}-${mi}-${n}`,
    year: 2019 + yi,
    month: yi === 0 ? 11 + mi : [3, 7, 11][mi],
    photographer: n < 2 ? names[0] : names[1],
    artist: '丁程鑫',
    photo: (yi * 2 + mi + n) % photos.length
})))).flat(2);
// Dates and photographer assignments are demonstration metadata, not verified attribution.
let visiblePhotos = [], lightIndex = 0;
const box = document.querySelector('#lightbox');

function photoButton(r) {
    const i = visiblePhotos.push(r) - 1;
    return `<button class="photo-button" data-photo="${i}" aria-label="查看照片 ${i + 1}"><img src="${src(r.photo)}" alt="PPT 摄影作品示例 ${r.photo + 1}" loading="lazy"><span>查看大图 ↗</span></button>`
}

function basePath(kind, name) {
    return '#timeline/' + kind + '/' + enc(name)
}

function crumbs(items) {
    return `<div class="breadcrumbs"><a href="#home">首页</a>${items.map(([t, h]) => `<span aria-hidden="true">/</span>${h ? `<a href="${h}">${esc(t)}</a>` : `<span aria-current="page">${esc(t)}</span>`}`).join('')}</div>`
}

function timeline(kind, name, year, month, page) {
    if (!['artist', 'photographer'].includes(kind) || !(kind === 'artist' ? name === '丁程鑫' : names.includes(name))) {
        empty('没有找到这个影像时间轴');
        return
    }
    let all = records.filter(r => kind === 'artist' ? r.artist === name : r.photographer === name);
    const base = basePath(kind, name);
    const y = Number(year), m = Number(month);
    if (year && !all.some(r => r.year === y) || month && !all.some(r => r.year === y && r.month === m)) {
        empty('这个时间段暂无示例作品');
        return
    }
    let items = [[name, year ? base : null]];
    if (year) items.push([year + ' 年', month ? base + '/' + year : null]);
    if (month) items.push([month + ' 月', null]);
    main.innerHTML = crumbs(items) + `<div class="timeline-heading"><div class="subject"><img src="${src(kind === 'artist' ? 3 : 5)}" alt="PPT 示例照片"><div><p class="eyebrow">${kind === 'artist' ? 'ARTIST ARCHIVE' : 'PHOTOGRAPHER ARCHIVE'}</p><h1>${esc(name)}</h1><p class="subtext">${kind === 'artist' ? '艺人影像时间轴' : '站姐影像时间轴 · 丁程鑫'}${year ? ' · ' + year + ' 年' : ''}${month ? ' ' + month + ' 月' : ''}</p></div></div><span class="scope">${month ? '按站姐分组' : year ? '月份视图' : '年份视图'} · 演示数据</span></div>`;
    if (month) {
        let selected = all.filter(r => r.year === y && r.month === m);
        main.innerHTML += `<p class="timeline-hint">${y} 年 ${m} 月 · ${selected.length} 张示例照片。点击照片查看大图。</p>` + names.filter(n => selected.some(r => r.photographer === n)).map(n => `<section class="album-group"><div class="group-head"><span class="avatar">${n === '遠花火' ? '遠' : 'O'}</span><h2><a href="${basePath('photographer', n)}">${n} ↗</a></h2><small>${selected.filter(r => r.photographer === n).length} 张 · 分组演示</small></div><div class="photo-grid">${selected.filter(r => r.photographer === n).map(photoButton).join('')}</div></section>`).join('');
        return
    }
    const groups = [...new Set(all.filter(r => !year || r.year === y).map(r => year ? r.month : r.year))].sort((a, b) => a - b);
    const count = Math.ceil(groups.length / 4), p = Math.min(Math.max(Number(page) || 1, 1), count);
    main.innerHTML += `<p class="timeline-hint">${year ? '点击月份照片或圆点，查看按站姐分组的相册。' : '点击年份照片或圆点，逐步放大到月份。'} <span class="chip">${groups.length} 个${year ? '月份' : '年份'}</span></p><div class="timeline">${groups.slice((p - 1) * 4, p * 4).map(g => {
        let list = all.filter(r => year ? r.year === y && r.month === g : r.year === g);
        return `<a class="time-item" href="${base}/${year ? year + '/' : ''}${g}"><img src="${src(list[0].photo)}" alt="${g}${year ? '月' : '年'}示例影像"><span class="dot"></span><strong>${g}${year ? ' 月' : ''}</strong><small>${list.length} 张示例影像 · ${year ? '打开相册' : '探索月份'}</small></a>`
    }).join('')}</div><div class="pager"><button data-page="${p - 1}" ${p === 1 ? 'disabled' : ''} aria-label="上一页">‹</button><span>${p} / ${count} 页</span><button data-page="${p + 1}" ${p === count ? 'disabled' : ''} aria-label="下一页">›</button></div>`;
    main.querySelectorAll('[data-page]').forEach(b => b.onclick = () => {
        location.hash = base + (year ? '/' + year : '') + '?page=' + b.dataset.page
    });
}

function library(filter = '全部') {
    main.innerHTML = `<p class="eyebrow">PHOTO LIBRARY</p><div class="section-head"><div><h1>作品库</h1><p class="subtext">浏览设计稿中的影像，或沿时间轴探索作品。</p></div><a class="text-link" href="${basePath('artist', '丁程鑫')}">时间轴视图 →</a></div><div class="filters" aria-label="按站姐筛选">${['全部', ...names].map(n => `<button data-filter="${n}" class="${filter === n ? 'selected' : ''}" aria-pressed="${filter === n}">${n}</button>`).join('')}</div><div class="photo-grid">${photos.map((_, i) => ({
        photo: i,
        photographer: names[i % 2]
    })).filter(r => filter === '全部' || r.photographer === filter).map(r => `<article class="library-card">${photoButton(r)}<div class="library-caption"><div>${r.photographer}<small>示例分组 · 来源：设计 PPT</small></div><a href="${basePath('photographer', r.photographer)}">时间轴 ↗</a></div></article>`).join('')}</div>`;
    main.querySelectorAll('[data-filter]').forEach(b => b.onclick = () => location.hash = 'library/' + enc(b.dataset.filter))
}

function join() {
    main.innerHTML = `<div class="join-intro"><p class="eyebrow">FOR PHOTOGRAPHERS</p><h1>让你的镜头，<br>成为星路上的一段记录。</h1><p class="subtext">站姐入驻流程说明</p></div><div class="steps"><section class="step"><span class="num">01</span><h2>准备站点资料</h2><p>准备站名、拍摄艺人、站点介绍与可用于核验的公开主页链接。</p></section><section class="step"><span class="num">02</span><h2>确认作品信息</h2><p>整理原创照片、拍摄日期与署名，确认作品的展示授权范围，并保留原有水印。</p></section><section class="step"><span class="num">03</span><h2>建立影像时间轴</h2><p>正式开放后，作品将按艺人、拍摄年份和月份归档，并在月度相册中按站姐展示。</p></section></div><div class="notice"><strong>当前为体验版本，暂未开放入驻申请。</strong><br>本页展示拟定流程，不收集个人资料。示例照片来自网站设计 PPT，页面中的日期与站姐分组用于演示交互，不代表已核实的拍摄信息或已入驻关系。</div><div class="join-actions"><a class="primary" href="${basePath('photographer', names[0])}">体验站姐时间轴</a><a class="text-link" href="#library">浏览示例作品 ↗</a></div>`
}

function empty(title, query = '') {
    main.innerHTML = `<div class="empty"><span class="spark">✧</span><h1>${esc(title)}</h1>${query ? `<p class="subtext">搜索词：${esc(query)}</p>` : ''}<p class="subtext">体验版收录：丁程鑫、遠花火、OHMYBABEPRINCE。</p><p><a class="primary" href="#library">浏览示例作品</a></p></div>`
}

function search(query) {
    const q = query.trim().toLowerCase();
    document.querySelector('#query').value = query;
    let choices = [{
        kind: 'artist',
        name: '丁程鑫',
        aliases: '丁程鑫 丁 chengxin ding',
        image: 3
    }, ...names.map((name, i) => ({
        kind: 'photographer',
        name,
        aliases: name.toLowerCase() + (i === 0 ? ' 远花火' : ''),
        image: 5 + i
    }))];
    let results = q ? choices.filter(r => r.aliases.includes(q)) : [];
    if (!results.length) {
        empty(q ? '没有找到相关作品' : '输入艺人或站姐名字', query);
        return
    }
    main.innerHTML = crumbs([['搜索结果']]) + `<div class="section-head"><div><h1>搜索结果</h1><p class="subtext">“${esc(query)}” · 找到 ${results.length} 个相关条目</p></div></div><div class="result-list">${results.map(r => `<a class="artist-card" href="${basePath(r.kind, r.name)}"><img src="${src(r.image)}" alt="示例作品"><div><strong>${r.name}</strong><small>${r.kind === 'artist' ? '艺人' : '站姐'} · 查看影像时间轴</small></div><span class="arrow">↗</span></a>`).join('')}</div>`
}

function render() {
    visiblePhotos = [];
    let parts;
    try {
        parts = location.hash.slice(1).split('?')[0].split('/').map(decodeURIComponent)
    } catch {
        empty('链接格式无效');
        return
    }
    let [route, a, b, y, m] = parts;
    document.querySelectorAll('[data-nav]').forEach(n => n.classList.toggle('active', n.dataset.nav === (route || 'home')));
    if (!route || route === 'home') home(); else if (route === 'library') library(['全部', ...names].includes(a) ? a : '全部'); else if (route === 'join') join(); else if (route === 'search') search(a || ''); else if (route === 'timeline') timeline(a, b, y, m, new URLSearchParams(location.hash.split('?')[1]).get('page')); else empty('这个页面不存在');
    document.title = (route === 'timeline' && b ? b + ' · ' : route === 'join' ? '站姐入驻 · ' : route === 'library' ? '作品库 · ' : '') + '星路';
    main.querySelectorAll('[data-photo]').forEach(btn => btn.onclick = () => {
        lightIndex = Number(btn.dataset.photo);
        showPhoto();
        box.showModal()
    });
    window.scrollTo(0, 0)
}

function showPhoto() {
    const r = visiblePhotos[lightIndex];
    if (!r) return;
    box.querySelector('img').src = src(r.photo);
    box.querySelector('img').alt = 'PPT 摄影作品示例 ' + (r.photo + 1);
    box.querySelector('.light-caption').textContent = `${lightIndex + 1} / ${visiblePhotos.length} · ${r.photographer} · 示例分组${r.year ? ' · ' + r.year + '.' + String(r.month).padStart(2, '0') : ''}`;
    box.querySelector('.light-prev').disabled = lightIndex === 0;
    box.querySelector('.light-next').disabled = lightIndex === visiblePhotos.length - 1
}

function movePhoto(delta) {
    lightIndex = Math.max(0, Math.min(visiblePhotos.length - 1, lightIndex + delta));
    showPhoto()
}

box.querySelector('.close').onclick = () => box.close();
box.querySelector('.light-prev').onclick = () => movePhoto(-1);
box.querySelector('.light-next').onclick = () => movePhoto(1);
box.addEventListener('click', e => {
    if (e.target === box) {
        const r = box.getBoundingClientRect();
        if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) box.close()
    }
});
box.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') movePhoto(-1);
    if (e.key === 'ArrowRight') movePhoto(1)
});
document.querySelector('#search').addEventListener('submit', e => {
    e.preventDefault();
    location.hash = 'search/' + enc(document.querySelector('#query').value.trim())
});
window.addEventListener('hashchange', render);
render();
