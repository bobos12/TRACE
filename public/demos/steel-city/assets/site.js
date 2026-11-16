/* Steel City Bail — concept site by Trace Studio. Vanilla JS, no build step.
   Every record, feed item and form on this site is a fictional demo. */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const money = (n, c = false) => '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: c ? 2 : 0, maximumFractionDigits: c ? 2 : 0 });
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const PHONE = '(701) 518-9640', TEL = 'tel:+17015189640';
const premiumOf = (b) => Math.max(b * 0.10, 100);
function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 4200); }
const ago = (mins) => { const d = new Date(Date.now() - mins * 60000); return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }); };
const clock = (d = new Date()) => d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

/* ======================================================================
   DATA (fictional unless noted)
   ====================================================================== */
const ROSTER = [
  ['Novak', 'Daniel J.', 34, 'ACJ', 95, [['DUI: general impairment', '75 Pa.C.S. § 3802(a)(1)'], ['Driving while BAC .02 or more while license suspended', '75 Pa.C.S. § 1543(b)']], ['Monetary', 2500]],
  ['Novak', 'Michael', 52, 'Westmoreland', 2100, [['Simple assault', '18 Pa.C.S. § 2701']], ['Unsecured', 5000]],
  ['Hayes', 'Brianna L.', 27, 'ACJ', 210, [['Retail theft', '18 Pa.C.S. § 3929']], ['ROR', 0]],
  ['Hayes', 'Jordan', 31, 'ACJ', 40, [['Possession with intent to deliver', '35 P.S. § 780-113(a)(30)'], ['Possession of a controlled substance', '35 P.S. § 780-113(a)(16)']], ['Pending', 0]],
  ['Ortiz', 'Luis A.', 29, 'ACJ', 300, [['Receiving stolen property', '18 Pa.C.S. § 3925']], ['Monetary', 10000]],
  ['Jackson', 'Terrence', 41, 'ACJ', 520, [['Terroristic threats', '18 Pa.C.S. § 2706'], ['Harassment', '18 Pa.C.S. § 2709']], ['Monetary', 15000]],
  ['Mancini', 'Gina R.', 38, 'Butler', 900, [['Theft by deception', '18 Pa.C.S. § 3922']], ['Monetary', 25000]],
  ['Brooks', 'Andre', 24, 'ACJ', 130, [['Fleeing or attempting to elude police', '75 Pa.C.S. § 3733'], ['Reckless driving', '75 Pa.C.S. § 3736']], ['Monetary', 5000]],
  ['Sullivan', 'Kyle P.', 36, 'Washington', 1500, [['Criminal trespass', '18 Pa.C.S. § 3503']], ['Nominal', 1]],
  ['Patel', 'Rohan', 30, 'ACJ', 60, [['DUI: highest rate', '75 Pa.C.S. § 3802(c)']], ['Pending', 0]],
  ['Wright', 'Destiny M.', 22, 'ACJ', 430, [['Disorderly conduct', '18 Pa.C.S. § 5503']], ['ROR', 0]],
  ['Kaminski', 'Joseph', 47, 'Beaver', 1200, [['Probation violation', 'Detainer: Beaver Co. Adult Probation']], ['Detainer', 0]],
  ['Greene', 'Marcus T.', 33, 'ACJ', 260, [['Aggravated assault', '18 Pa.C.S. § 2702'], ['Recklessly endangering another person', '18 Pa.C.S. § 2705']], ['Monetary', 50000]],
  ['Lee', 'Kevin', 28, 'ACJ', 720, [['Theft by unlawful taking', '18 Pa.C.S. § 3921']], ['Monetary', 1500]],
  ['Dombrowski', 'Amy', 44, 'Westmoreland', 380, [['DUI: general impairment', '75 Pa.C.S. § 3802(a)(1)']], ['Unsecured', 2500]],
  ['Washington', 'Tyrell', 26, 'ACJ', 25, [['Possession of small amount of marijuana', '35 P.S. § 780-113(a)(31)'], ['Resisting arrest', '18 Pa.C.S. § 5104']], ['Pending', 0]],
  ['Murphy', 'Sean', 39, 'ACJ', 1600, [['Parole violation', 'Detainer: PA Parole Board']], ['Detainer', 0]],
  ['Price', 'Kayla', 30, 'Butler', 640, [['Burglary', '18 Pa.C.S. § 3502']], ['Monetary', 20000]],
  ['Ferrante', 'Paul', 50, 'ACJ', 180, [['Simple assault', '18 Pa.C.S. § 2701']], ['Monetary', 3500]],
  ['Ortiz', 'Carmen', 35, 'Washington', 980, [['Identity theft', '18 Pa.C.S. § 4120']], ['Monetary', 7500]]
].map(([last, first, age, fac, mins, charges, [type, amt]], i) => ({ last, first, age, fac, mins, charges, type, amt, book: `26-${String(4400 + i * 37).padStart(5, '0')}` }));
const FAC = { ACJ: 'Allegheny County Jail', Westmoreland: 'Westmoreland County Prison', Washington: 'Washington Co. Correctional', Beaver: 'Beaver County Jail', Butler: 'Butler County Prison' };
function statusOf(r) {
  switch (r.type) {
    case 'Monetary': return ['go', 'Bondable', `${money(r.amt)}`, 'Monetary bail'];
    case 'ROR': return ['ok', 'Released', 'ROR', 'No money needed'];
    case 'Unsecured': return ['ok', 'Released', `${money(r.amt)}`, 'Unsecured: nothing up front'];
    case 'Nominal': return ['ok', 'Released', '$1', 'Nominal bail'];
    case 'Pending': return ['wait', 'Pending', 'Not set', 'Awaiting arraignment'];
    case 'Detainer': return ['hold', 'Hold', 'No bail', 'Detainer'];
  }
}

const BOARD = [['STEEL CITY BAIL', 'OPEN 24 HRS 7 DAYS'], ['ON DUTY NOW', 'T. RUSSO DOWNTOWN'], ['ANSWER TIME', 'UNDER 60 SECONDS'], ['ACJ 950 SECOND AV', '2 BLOCKS FROM US'], ['JUDGE ALLOWED 10%?', 'WE WILL TELL YOU'], ['COUNTIES POSTED', 'ALLEGHENY PLUS 4']];

const FEED = [[3, 'Bond posted', 'ACJ · $5,000 monetary · D. Hollis'], [14, 'Text received', '"my brother got picked up in carrick"'], [26, 'Released', 'ACJ · 3h 12m after posting'], [41, 'Cosigner docs complete', 'SC-26-0412'], [57, 'Check-in', 'SC-26-0377 · on time'], [72, 'Arraignment', 'bail set $2,500 · bondable'], [88, 'Court reminders sent', '47 clients · tomorrow\u2019s docket'], [103, 'Bond posted', 'Westmoreland · $10,000 · M. Kowalski'], [131, 'Exonerated', 'SC-25-1198 · collateral returned']];

const PLATES = [
  ['Intake', 'Arrested in Allegheny County? Intake is at the county jail on Second Avenue: fingerprints, photos and a warrant check. It takes hours, not minutes.', 'ACJ · 950 Second Ave · (412) 350-2000'],
  ['Arraignment', 'A magistrate holds the preliminary arraignment, often by video from the jail, and sets the type and amount of bail.', 'Arraignment court · (412) 350-3240'],
  ['Posting', 'If monetary bail is set, we post it. You pay the premium and a cosigner signs. If it\u2019s ROR or unsecured, nobody pays anything up front.', 'Premium 10% · $100 minimum'],
  ['Court', 'Make every date. When the case closes, the bond is exonerated and any collateral comes back.', 'Text reminders · weekly check-ins']
];
const TYPES = [['ROR', 'Released on their own recognizance. No money.'], ['ROR + conditions', 'Released with conditions such as reporting or no contact.'], ['Unsecured', 'A promise to pay a set amount only if they skip court.'], ['Nominal', 'Bail of $1 with a designated surety.'], ['Monetary', 'Money must be posted. The only type that needs us.']];

const PLACES = [
  { id: 'acj', type: 'jail', name: 'Allegheny County Jail', county: 'Allegheny', addr: '950 Second Ave, Pittsburgh, PA 15219', phone: '(412) 350-2000', ll: [40.43459, -79.99184], note: 'Intake and release for Allegheny County arrests.' },
  { id: 'wcp', type: 'jail', name: 'Westmoreland County Prison', county: 'Westmoreland', addr: '3000 S Grande Blvd, Greensburg, PA 15601', phone: '', ll: [40.27346, -79.56091], note: 'County prison for Westmoreland County.' },
  { id: 'wccf', type: 'jail', name: 'Washington County Correctional Facility', county: 'Washington', addr: '100 W Cherry Ave, Washington, PA 15301', phone: '', ll: [40.1695, -80.24931], note: 'County jail for Washington County.' },
  { id: 'bcj', type: 'jail', name: 'Beaver County Jail', county: 'Beaver', addr: '6000 Woodlawn Rd, Aliquippa, PA 15001', phone: '', ll: [40.6457, -80.24207], note: 'County jail for Beaver County.' },
  { id: 'bcp', type: 'jail', name: 'Butler County Prison', county: 'Butler', addr: '202 S Washington St, Butler, PA 16001', phone: '', ll: [40.85952, -79.89767], note: 'County prison for Butler County.' },
  { id: 'pmc', type: 'court', name: 'Pittsburgh Municipal Court', county: 'Allegheny', addr: '660 First Ave, Pittsburgh, PA 15219', phone: '(412) 350-3240', ll: [40.43543, -79.99592], note: 'Arraignment court, bail information, and preliminary hearings for City of Pittsburgh cases.' },
  { id: 'acc', type: 'court', name: 'Allegheny County Courthouse', county: 'Allegheny', addr: '436 Grant St, Pittsburgh, PA 15219', phone: '', ll: [40.43879, -79.99705], note: 'Court of Common Pleas, Fifth Judicial District.' },
  { id: 'wmc', type: 'court', name: 'Westmoreland County Courthouse', county: 'Westmoreland', addr: '2 N Main St, Greensburg, PA 15601', phone: '', ll: [40.30268, -79.54459], note: 'Court of Common Pleas, Tenth Judicial District.' },
  { id: 'wsc', type: 'court', name: 'Washington County Courthouse', county: 'Washington', addr: '1 S Main St, Washington, PA 15301', phone: '', ll: [40.1708, -80.24551], note: 'Court of Common Pleas, 27th Judicial District.' },
  { id: 'bvc', type: 'court', name: 'Beaver County Courthouse', county: 'Beaver', addr: '810 Third St, Beaver, PA 15009', phone: '', ll: [40.6942, -80.30743], note: 'Court of Common Pleas, 36th Judicial District.' },
  { id: 'btc', type: 'court', name: 'Butler County Courthouse', county: 'Butler', addr: '124 W Diamond St, Butler, PA 16001', phone: '', ll: [40.85851, -79.89637], note: 'Court of Common Pleas, 50th Judicial District.' },
  { id: 'o-dt', type: 'office', name: 'Steel City Bail \u00b7 Downtown', county: 'Allegheny', addr: '917 Fort Pitt Blvd, Suite 2, Pittsburgh, PA 15219', phone: PHONE, ll: [40.4357, -79.9958], note: 'Open 24 hours. A two-minute walk from the jail.', img: '/demos/steel-city/img/skyline-dusk.jpg', hours: [['Every day', '24 hours'], ['Walk-ins', 'Always']] },
  { id: 'o-gb', type: 'office', name: 'Steel City Bail \u00b7 Greensburg', county: 'Westmoreland', addr: '212 S Pennsylvania Ave, Greensburg, PA 15601', phone: '(701) 518-9640', ll: [40.2999, -79.5431], note: 'For Westmoreland County bonds and court.', img: '/demos/steel-city/img/truss-river.jpg', hours: [['Mon\u2013Fri', '8a \u2013 8p'], ['Sat\u2013Sun', 'On call']] }
];

const WANTED = [
  { img: '/demos/steel-city/img/wanted-1.jpg', name: 'Ray Castellano', age: 41, fta: 'Formal arraignment', ch: 'Retail theft', bond: 7500, area: 'Carrick / Brentwood', since: 'Sep 22', reward: 750 },
  { img: '/demos/steel-city/img/wanted-2.jpg', name: 'Kyle Brennan', age: 33, fta: 'Preliminary hearing', ch: 'DUI; fleeing or eluding', bond: 10000, area: 'McKees Rocks', since: 'Oct 1', reward: 1000 },
  { img: '/demos/steel-city/img/wanted-3.jpg', name: 'Shawn Mercer', age: 38, fta: 'Status conference', ch: 'Receiving stolen property', bond: 5000, area: 'Hazelwood', since: 'Aug 30', reward: 500 },
  { img: '/demos/steel-city/img/wanted-4.jpg', name: 'Marisol Vega', age: 29, fta: 'Formal arraignment', ch: 'Theft by deception', bond: 15000, area: 'Beechview / Dormont', since: 'Sep 9', reward: 1500 },
  { img: '/demos/steel-city/img/wanted-5.jpg', name: 'Peter Haldane', age: 44, fta: 'Pretrial conference', ch: 'Possession with intent to deliver', bond: 25000, area: 'Penn Hills', since: 'Jul 18', reward: 2500 },
  { img: '/demos/steel-city/img/wanted-6.jpg', name: 'Greg Ostrowski', age: 46, fta: 'Preliminary hearing', ch: 'Simple assault', bond: 5000, area: 'Butler', since: 'Oct 4', reward: 500 }
];

const TEAM = [
  { img: '/demos/steel-city/img/agent-dwayne.jpg', name: 'Dwayne Hollis', role: 'Owner · Bondsman', since: 2006, from: 'Hill District', bio: 'Started Steel City after twelve years as a Common Pleas court officer. Writes the big bonds and still answers the 3 a.m. calls himself.', langs: 'English' },
  { img: '/demos/steel-city/img/agent-marie.jpg', name: 'Marie Kowalski', role: 'Partner · Collateral & Westmoreland', since: 2009, from: 'Polish Hill', bio: 'Runs the Greensburg office and every collateral file. If something was pledged, Marie knows where it is and when it\u2019s coming back.', langs: 'English, Polski' },
  { img: '/demos/steel-city/img/agent-tony.jpg', name: 'Tony Russo', role: 'Night desk · Bondsman', since: 2014, from: 'Bloomfield', bio: 'Nights at the Downtown office, two blocks from intake. Reads a docket faster than most lawyers.', langs: 'English' },
  { img: '/demos/steel-city/img/agent-ana.jpg', name: 'Ana Ruiz', role: 'Cosigner services', since: 2018, from: 'Beechview', bio: 'Owns the cosigner portal, the check-ins and the reminders. Walks Spanish-speaking families through every page.', langs: 'English, Espa\u00f1ol' }
];

const REVIEWS = [
  { big: true, t: 'Called at 2:50 a.m. from the sidewalk outside the jail. Tony walked over. Actually walked over.', who: 'Renee W.', where: 'Lawrenceville' },
  { t: 'They told me my son\u2019s bail was unsecured and I didn\u2019t need them. Who does that? I\u2019ll be sending people their way for life.', who: 'Carl D.', where: 'Brookline' },
  { t: 'The cosigner portal told me exactly which papers were missing. Uploaded my pay stub from the bus.', who: 'Jasmine T.', where: 'Wilkinsburg' },
  { t: 'Straight shooters. Premium was what they said, in writing, before I signed anything.', who: 'Mike P.', where: 'Greensburg' },
  { t: 'Ana explained the whole thing to my mother in Spanish. Patient and kind.', who: 'Luis O.', where: 'Beechview' },
  { t: 'Weekly check-in takes a minute. My brother hasn\u2019t missed one, or a court date.', who: 'Steph K.', where: 'Bethel Park' },
  { t: 'Texted at work since I couldn\u2019t call. Had it handled by my lunch break.', who: 'Devon R.', where: 'North Side' },
  { t: 'Marie returned our truck title the same week the case closed. No chasing.', who: 'Frank S.', where: 'Butler' }
];

const FAQ = [
  ['Does everyone need a bail bondsman?', '<p>No. In Pennsylvania, bail can be ROR, ROR with conditions, unsecured, nominal or monetary. Only monetary bail requires money up front. And if the judge allowed a 10% cash deposit, you may be able to post that yourself. We\u2019ll tell you which applies.</p>'],
  ['How much does a bail bond cost in Pennsylvania?', '<p>There\u2019s no single statewide percentage. Premium rates are filed by each surety with the Pennsylvania Insurance Department. Steel City\u2019s premium is <b>10% of the bail amount, $100 minimum</b>, and it\u2019s non-refundable once the bond is posted.</p>'],
  ['Where is the Allegheny County Jail?', '<p>950 Second Avenue, Pittsburgh, PA 15219. Main line (412) 350-2000. Our Downtown office is a two-minute walk away and open 24 hours.</p>'],
  ['How long does release take?', '<p>After the bond is posted it\u2019s up to the jail. A few hours is typical, and shift changes can stretch it. We\u2019ll call you when the release starts moving.</p>'],
  ['What is unsecured bail?', '<p>A promise to pay a set amount only if the defendant fails to appear. Nothing is paid up front, so you don\u2019t need us.</p>'],
  ['What\u2019s a detainer?', '<p>A hold from probation, parole, another county or immigration authorities. It keeps someone in custody even if bail is posted. We check for detainers before you pay anything.</p>'],
  ['Can I pay cash bail online myself?', '<p>Pennsylvania\u2019s Unified Judicial System offers online payment of cash bail through its portal (PAePay). If cash bail or a 10% deposit is all that\u2019s needed, we\u2019ll point you to it.</p>'],
  ['What does a cosigner owe?', '<p>The cosigner (indemnitor) promises the defendant goes to court. If they don\u2019t and the bond is forfeited, the cosigner can owe the full bail amount plus the costs of returning them to court.</p>'],
  ['Do you offer payment plans?', '<p>Yes, on approval. Typically a down payment and monthly installments on the premium, always in a written agreement you get a copy of.</p>'],
  ['Do I get the premium back?', '<p>No, the premium is the fee for the bond. Collateral, if any, is returned when the bond is exonerated.</p>']
];

const CREDITS = [
  ['bridge-night.jpg', 'Golden Arch', 'brunkfordbraun', 'CC BY-SA 2.0', 'https://www.flickr.com/photos/67961268@N00/1350579023'],
  ['bridge-bw.jpg', 'Pittsburgh Bridges', 'lady_lbrty', 'CC BY 2.0', 'https://www.flickr.com/photos/7305041@N05/1829772829'],
  ['rail-truss.jpg', 'Pittsburgh Bridges', 'dmuth', 'CC BY-SA 2.0', 'https://www.flickr.com/photos/30647744@N00/4747180919'],
  ['clemente-day.jpg', 'Pittsburgh Bridges', 'dmuth', 'CC BY-SA 2.0', 'https://www.flickr.com/photos/30647744@N00/4747823334'],
  ['bridges-golden.jpg', 'Pittsburgh Bridges over Monongahela River', '6SN7', 'CC BY 2.0', 'https://www.flickr.com/photos/47800690@N03/4837835726'],
  ['truss-river.jpg', 'Pittsburgh bridge', 'gina pina', 'CC BY 2.0', 'https://www.flickr.com/photos/11406748@N00/14233685052'],
  ['skyline-dusk.jpg', 'Pittsburgh Skyline', 'j.reed', 'CC BY-SA 2.0', 'https://www.flickr.com/photos/45383134@N00/4978165814'],
  ['skyline-night.jpg', 'Pittsburgh Skyline', 'allenran 917', 'CC BY 2.0', 'https://www.flickr.com/photos/61322584@N07/7155504632'],
  ['incline-track.jpg', 'Looking up the Duquesne Incline, Pittsburgh', 'SeeMidTN.com (aka Brent)', 'CC BY 2.0', 'https://www.flickr.com/photos/94502827@N00/89369700'],
  ['night-view.jpg', 'Downtown Pittsburgh from the Duquesne Incline observation deck', 'jiuguangw', 'CC BY-SA 2.0', 'https://www.flickr.com/photos/32366606@N00/6872799543'],
  ['agent-*.jpg, wanted-*.jpg', 'Portraits', 'AI-generated (thispersondoesnotexist.com)', 'Not real people', 'https://thispersondoesnotexist.com']
];

/* ======================================================================
   TICKER + SPLIT-FLAP (signature)
   ====================================================================== */
function initTicker() {
  const items = FEED.map(([m, a, b]) => `<span><b>${clock(new Date(Date.now() - m * 60000))}</b> \u00b7 ${esc(a).toUpperCase()} \u00b7 ${esc(b)}</span>`).join('');
  $('#ticker').innerHTML = items + items;
}
const CHARS = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.%+?$-';
function initBoard() {
  const N = 18, root = $('#flaps'); if (!root) return;
  const rows = [0, 1].map(r => { const row = h(`<div class="flap-row" style="--n:${N}"></div>`); for (let i = 0; i < N; i++) row.append(h(`<span class="cell ${r === 0 ? 'y' : ''}"> </span>`)); root.append(row); return $$('.cell', row); });
  const setRow = (cells, text) => {
    const t = text.toUpperCase().padEnd(N).slice(0, N);
    cells.forEach((c, i) => {
      const target = t[i]; if (c.textContent === target) return;
      if (reduce) { c.textContent = target; return; }
      let n = 2 + ((i * 7) % 6);
      const step = () => {
        c.classList.remove('flip'); void c.offsetWidth; c.classList.add('flip');
        c.textContent = n-- > 0 ? CHARS[(Math.random() * CHARS.length) | 0] : target;
        if (n >= 0) setTimeout(step, 70);
      };
      setTimeout(step, i * 22);
    });
  };
  let k = 0;
  const show = () => { const [a, b] = BOARD[k % BOARD.length]; setRow(rows[0], a); setRow(rows[1], b); k++; };
  show(); if (!reduce) setInterval(show, 4800);
  const ck = () => { $('#board-clock').textContent = clock() + ' ET'; }; ck(); setInterval(ck, 20000);
}

/* ======================================================================
   LOCATOR
   ====================================================================== */
function initLocator(el) {
  const full = !!el.dataset.full;
  el.innerHTML = `<div class="locator crop">
    <form class="loc-form" autocomplete="off">
      <div class="f"><label for="lq-${el.dataset.uid}">Last name</label><input id="lq-${el.dataset.uid}" name="last" placeholder="e.g. Novak"></div>
      <div class="f"><label for="lf-${el.dataset.uid}">First name</label><input id="lf-${el.dataset.uid}" name="first" placeholder="optional"></div>
      <div class="f"><label for="lw-${el.dataset.uid}">Booked</label><select id="lw-${el.dataset.uid}" name="when"><option value="99999">Any time</option><option value="1440">Last 24 hrs</option><option value="4320">Last 3 days</option></select></div>
      <div class="f"><label for="lc-${el.dataset.uid}">Facility</label><select id="lc-${el.dataset.uid}" name="fac"><option value="">All five counties</option>${Object.entries(FAC).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}</select></div>
      <button class="btn y" type="submit"><svg><use href="#i-search"/></svg>Search</button>
    </form>
    <div class="loc-meta"><span class="res-l">Most recent bookings</span><span><span class="demo">Demo roster</span> fictional records · try Novak, Hayes, Ortiz</span></div>
    <div class="tbl-wrap"><table class="roster"><thead><tr><th>Name / booking</th><th>Facility · booked</th><th>Charges</th><th>Bail</th><th>Status</th><th></th></tr></thead><tbody></tbody></table></div>
    <div class="loc-cards"></div>
  </div>`;
  const form = $('form', el), tb = $('tbody', el), cards = $('.loc-cards', el), lab = $('.res-l', el);
  const act = (r, s) => s[0] === 'go' ? `<a class="btn y sm" href="#/apply?d=${encodeURIComponent(r.first.split(' ')[0] + ' ' + r.last)}&b=${r.amt}&f=${encodeURIComponent(FAC[r.fac])}">Start bail</a>` : s[0] === 'hold' || s[0] === 'wait' ? `<a class="btn o sm" href="${TEL}">Call us</a>` : `<span class="small muted">No bond needed</span>`;
  function draw(list, label) {
    lab.textContent = label;
    if (!list.length) { tb.innerHTML = `<tr><td colspan="6"><div class="loc-empty"><b class="h-s">No match in the demo roster.</b><p class="muted">Intake can take hours, and new bookings appear after arraignment. Call us and we'll check the live docket.</p><div><a class="btn y sm" href="${TEL}">Call ${PHONE}</a></div></div></td></tr>`; cards.innerHTML = tb.querySelector('td').innerHTML; return; }
    tb.innerHTML = list.map(r => { const s = statusOf(r); return `<tr>
      <td class="nm"><b>${esc(r.last)}, ${esc(r.first)}</b><span>#${r.book} \u00b7 age ${r.age}</span></td>
      <td class="ch">${FAC[r.fac]}<small>${ago(r.mins)}</small></td>
      <td class="ch">${r.charges.map(c => `${esc(c[0])}<small>${esc(c[1])}</small>`).join('')}</td>
      <td class="bail">${s[2]}<small>${s[3]}</small></td>
      <td><span class="chip ${s[0]}">${s[1]}</span></td>
      <td class="act">${act(r, s)}</td></tr>`; }).join('');
    cards.innerHTML = list.map(r => { const s = statusOf(r); return `<article><div class="k"><div><b>${esc(r.last)}, ${esc(r.first)}</b><div class="m">#${r.book} \u00b7 ${FAC[r.fac]} \u00b7 ${ago(r.mins)}</div></div><span class="chip ${s[0]}">${s[1]}</span></div><div class="small">${r.charges.map(c => esc(c[0])).join('; ')}</div><div class="k"><span class="num"><b>${s[2]}</b> <span class="muted small">${s[3]}</span></span>${act(r, s)}</div></article>`; }).join('');
  }
  const recent = () => [...ROSTER].sort((a, b) => a.mins - b.mins).slice(0, full ? 12 : 5);
  form.addEventListener('submit', e => {
    e.preventDefault();
    const q = form.last.value.trim().toLowerCase(), f = form.first.value.trim().toLowerCase(), w = +form.when.value, fac = form.fac.value;
    if (!q && !fac) { draw(recent().filter(r => r.mins <= w), 'Most recent bookings'); return; }
    const res = ROSTER.filter(r => (!q || r.last.toLowerCase().startsWith(q)) && (!f || r.first.toLowerCase().startsWith(f)) && (!fac || r.fac === fac) && r.mins <= w);
    draw(res, `${res.length} result${res.length === 1 ? '' : 's'}${q ? ` for \u201c${form.last.value.trim()}\u201d` : ''}`);
  });
  draw(recent(), 'Most recent bookings');
}

/* ======================================================================
   PLATES + COST
   ====================================================================== */
function initPlates(el) {
  el.innerHTML = `<div class="plates">${PLATES.map((p, i) => `<article class="plate ${i === 2 ? 'hot' : ''}"><i class="rv1"></i><i class="rv2"></i><span class="label" style="color:var(--ink)">Step ${i + 1} of 4</span><div class="n">0${i + 1}</div><h3>${p[0]}</h3><p>${p[1]}</p><p class="spec">${p[2]}</p></article>`).join('')}</div>
  ${el.dataset.full || true ? `<div class="bail-types">${TYPES.map(t => `<div><b>${t[0]}</b><p>${t[1]}</p></div>`).join('')}</div>` : ''}`;
}
function initCost(el) {
  const st = { bail: 5000, dep: false, plan: false };
  el.innerHTML = `<div class="cost">
    <div class="cost-in crop">
      <label class="label" for="bail-${el.dataset.uid}">Bail amount</label>
      <div class="big-input"><span>$</span><input id="bail-${el.dataset.uid}" class="bi" inputmode="numeric" value="5,000" aria-label="Bail amount in dollars"></div>
      <input type="range" class="rg" min="250" max="100000" step="250" value="5000" aria-label="Bail amount slider">
      <div class="presets">${[1000, 2500, 5000, 10000, 25000, 50000].map(v => `<button type="button" data-v="${v}" aria-pressed="${v === 5000}">${money(v)}</button>`).join('')}</div>
      <label class="toggle"><input type="checkbox" class="t-dep"><span><b>Judge allowed a 10% cash deposit</b><span>Pa.R.Crim.P. 528. It's on the bail order if granted.</span></span></label>
      <label class="toggle"><input type="checkbox" class="t-plan"><span><b>Spread the premium</b><span>Down payment plus monthly installments, on approval.</span></span></label>
    </div>
    <div><div class="options"></div><div class="plan-row" hidden></div>
      <p class="cost-note">Cash bail and deposits are paid to the court, not to us, and refunds follow the court's rules and deductions. Steel City's premium is 10% of the bail, $100 minimum, non-refundable once posted. Bonds of $25,000 and up usually need collateral. Illustration only; not legal advice.</p></div>
  </div>`;
  const bi = $('.bi', el), rg = $('.rg', el), opts = $('.options', el), plan = $('.plan-row', el);
  function draw() {
    const b = st.bail, p = premiumOf(b), dep = Math.ceil(b * 0.10);
    const best = st.dep ? 'dep' : 'us';
    opts.innerHTML = `
      <article class="opt"><div class="oh"><span class="label">A · Full cash</span></div><div class="ob"><span class="amt">${money(b)}</span><span class="back">Back at case end*</span><ul><li>Paid to the court, not us</li><li>Refund minus fines, costs and fees</li><li>Card payments via the state's PAePay portal</li></ul></div></article>
      <article class="opt ${st.dep ? 'best' : 'na'}"><div class="oh"><span class="label">B · 10% deposit</span>${best === 'dep' ? '<span class="badge">Cheapest</span>' : ''}</div><div class="ob"><span class="amt">${st.dep ? money(dep) : '\u2014'}</span><span class="back">${st.dep ? 'Mostly back at case end*' : 'Only if the judge allowed it'}</span><ul><li>Posted with the court</li><li>Defendant owes the full ${money(b)} on a missed date</li><li>${st.dep ? 'We\u2019ll tell you to do this, if you can cover it' : 'Toggle on if it\u2019s on the bail order'}</li></ul></div></article>
      <article class="opt us"><div class="oh"><span class="label">C · Steel City bond</span>${best === 'us' ? '<span class="badge">Least today</span>' : ''}</div><div class="ob"><span class="amt">${money(p)}</span><span class="back">Premium, non-refundable</span><ul><li>We post the full ${money(b)}</li><li>Cosigner signs the indemnity agreement</li><li>${b >= 25000 ? 'Collateral likely at this amount' : 'Usually no collateral at this amount'}</li></ul></div></article>`;
    plan.hidden = !st.plan;
    if (st.plan) { const down = Math.max(100, Math.round(p * 0.3)), rest = p - down, mo = rest > 0 ? rest / 4 : 0; plan.innerHTML = `<div><span class="label">Down today</span><b>${money(down)}</b></div><div><span class="label">Monthly</span><b>${mo ? money(mo, true) : '\u2014'}</b></div><div><span class="label">Term</span><b>${mo ? '4 months' : 'Paid in full'}</b></div><div><span class="label">Total premium</span><b>${money(p)}</b></div>`; }
    $$('.presets button', el).forEach(x => x.setAttribute('aria-pressed', +x.dataset.v === b));
  }
  const set = (v, from) => { st.bail = Math.max(0, Math.min(1000000, v || 0)); if (from !== 'bi') bi.value = st.bail.toLocaleString('en-US'); if (from !== 'rg') rg.value = Math.min(100000, st.bail); draw(); };
  bi.addEventListener('input', () => { const v = +bi.value.replace(/\D/g, ''); bi.value = v ? v.toLocaleString('en-US') : ''; set(v, 'bi'); });
  rg.addEventListener('input', () => set(+rg.value, 'rg'));
  $('.presets', el).addEventListener('click', e => { const b = e.target.closest('button'); if (b) set(+b.dataset.v); });
  $('.t-dep', el).addEventListener('change', e => { st.dep = e.target.checked; draw(); });
  $('.t-plan', el).addEventListener('change', e => { st.plan = e.target.checked; draw(); });
  draw();
}

/* ======================================================================
   TEXT TO START
   ====================================================================== */
let pendingName = '';
function initTTS(el) {
  el.innerHTML = `<div class="tts">
    <ol class="steps">
      <li><b>1</b><div><h4>Text START</h4><p>To (701) 518-9640, from any phone. Standard message rates.</p></div></li>
      <li><b>2</b><div><h4>Answer four questions</h4><p>Who, which county, the bail amount if you know it, and who you are.</p></div></li>
      <li><b>3</b><div><h4>A bondsman calls</h4><p>Usually within ten minutes, from (701) 518-9640. Real person, every time.</p></div></li>
      <li><b>4</b><div><h4>Sign and pay by link</h4><p>We text you a secure link to e-sign and pay. No office visit needed for most bonds.</p></div></li>
    </ol>
    <div class="phone" aria-label="Text conversation demo"><div class="scr">
      <div class="ph-top"><div class="av">SC</div><b>Steel City Bail</b><span>(701) 518-9640 \u00b7 demo</span></div>
      <div class="thread" aria-live="polite"></div>
      <div class="quick"></div>
      <form class="compose" autocomplete="off"><input placeholder="Text message" aria-label="Message"><button aria-label="Send"><svg><use href="#i-send"/></svg></button></form>
    </div></div>
  </div>`;
  const th = $('.thread', el), qk = $('.quick', el), form = $('.compose', el), inp = $('input', form);
  const ctx = {}; let step = 0, busy = false;
  const add = (cls, text) => { const m = h(`<div class="msg ${cls}"></div>`); m.textContent = text; th.append(m); th.scrollTop = th.scrollHeight; return m; };
  const say = (text, quick = [], wait = 900) => new Promise(res => {
    busy = true; qk.innerHTML = ''; const t = h('<div class="msg them typing"><i></i><i></i><i></i></div>'); th.append(t); th.scrollTop = th.scrollHeight;
    setTimeout(() => { t.remove(); add('them', text); qk.innerHTML = quick.map(q => `<button type="button">${esc(q)}</button>`).join(''); busy = false; res(); }, reduce ? 50 : wait);
  });
  const flow = [
    async () => say('Steel City Bail here, 24/7. Who\u2019s in custody? Their full name is fine.'),
    async (v) => { ctx.name = v; return say(`Got it: ${v.split(' ')[0]}. Which county were they arrested in?`, ['Allegheny', 'Westmoreland', 'Washington', 'Beaver', 'Butler', 'Not sure']); },
    async (v) => { ctx.county = v; return say('Do you know the bail amount yet?', ['Not yet', '$1,000', '$2,500', '$5,000', '$10,000+']); },
    async (v) => {
      const n = +v.replace(/\D/g, '');
      if (!n) await say('No problem. Bail is set at the preliminary arraignment, often within hours. We\u2019ll watch the docket for you.', [], 1100);
      else await say(`On ${money(n)} our premium would be ${money(premiumOf(n))}. If the judge allowed a 10% deposit, posting it yourself is ${money(Math.ceil(n * .1))} and mostly comes back. We\u2019ll check which applies.`, [], 1300);
      return say('Last thing: your name, and how are you related?', ['I\u2019m their mom', 'Partner', 'Friend']);
    },
    async (v) => { ctx.me = v; window.traceDemo && traceDemo.notify('text', { 'In custody': ctx.name, County: ctx.county, From: ctx.me }); await say(`Thanks. Tony is on duty and will call you from ${PHONE} within about 10 minutes. Reply STOP to opt out.`, [], 1100); add('sys', 'Demo conversation \u00b7 no texts are sent'); qk.innerHTML = '<button type="button" data-r="1">Restart demo</button>'; }
  ];
  const send = async (v) => {
    v = v.trim(); if (!v) return;
    if (busy) { setTimeout(() => send(v), 400); return; }
    if (v === 'Restart demo') { th.innerHTML = ''; step = 0; add('me', 'START'); await flow[0](); step = 1; return; }
    if (step >= flow.length) return;
    add('me', v); inp.value = ''; await flow[step](v); step++;
  };
  form.addEventListener('submit', e => { e.preventDefault(); send(inp.value); });
  qk.addEventListener('click', e => { const b = e.target.closest('button'); if (b) send(b.textContent); });
  add('sys', 'Today ' + clock()); add('me', 'START');
  flow[0]().then(() => { step = 1; if (pendingName) { const n = pendingName; pendingName = ''; send(n); } });
  el._send = send;
}

/* ======================================================================
   COSIGNER PORTAL
   ====================================================================== */
const DOCS = [['Photo ID', 'Driver\u2019s license or state ID', 'done', 'Oct 12'], ['Proof of address', 'Utility bill or lease, last 60 days', 'done', 'Oct 12'], ['Proof of income', 'Recent pay stub or benefits letter', 'need'], ['Indemnity agreement', 'E-signed', 'done', 'Oct 12'], ['Collateral: vehicle title', '2017 Ford F-150 \u00b7 original title', 'review', 'Oct 13'], ['Defendant check-in acknowledgement', 'Signed by the defendant at release', 'need']];
function initPortal(el) {
  el.innerHTML = `<div class="portal crop">
    <div class="portal-bar"><span><b>Cosigner portal</b> \u00b7 secure demo</span><span class="who">Not signed in</span></div>
    <form class="login" novalidate>
      <div class="l">
        <h3 class="h-m">Sign in to your case</h3>
        <p class="muted small">Use the case ID from your paperwork and the PIN we texted you.</p>
        <div class="grid2"><div class="field"><label>Case ID</label><input class="input num" name="cid" value="SC-26-0418"></div><div class="field"><label>PIN</label><input class="input num" name="pin" value="4412" inputmode="numeric" maxlength="6"></div></div>
        <button class="btn y" type="submit">Open my case</button>
        <p class="small muted">Demo credentials are pre-filled. Fictional case.</p>
      </div>
      <div class="r"><img src="/demos/steel-city/img/incline-track.jpg" alt="" loading="lazy"><p>Your documents. Your court dates. Your balance. One page.</p></div>
    </form>
    <div class="dash" hidden></div>
  </div>`;
  const login = $('.login', el), dash = $('.dash', el);
  const docs = DOCS.map(d => ({ n: d[0], s: d[1], st: d[2], when: d[3] }));
  const court = new Date(); court.setDate(court.getDate() + 22); court.setHours(9, 0, 0, 0);
  function render() {
    const done = docs.filter(d => d.st === 'done').length, pct = Math.round(done / docs.length * 100);
    dash.innerHTML = `<div>
      <div class="case-hd"><div><span class="label">Defendant</span><b>Daniel Novak</b></div><div><span class="label">Bail</span><b>$2,500</b></div><div><span class="label">Type</span><b>Monetary</b></div><div><span class="label">Status</span><b><span class="chip ok">Released</span></b></div></div>
      <div style="display:flex;justify-content:space-between;align-items:end;gap:12px;flex-wrap:wrap"><h3 class="h-m">Document checklist</h3><span class="num small">${done}/${docs.length} complete</span></div>
      <div class="progress"><div class="bar"><i style="width:${pct}%"></i></div><span class="num small">${pct}%</span></div>
      <div class="docs">${docs.map((d, i) => `<div class="doc is-${d.st}"><span class="box">${d.st === 'done' ? '\u2713' : d.st === 'review' ? '\u2022' : ''}</span><div><b>${d.n}</b><small>${d.st === 'done' ? 'Received ' + d.when : d.st === 'review' ? 'Under review \u00b7 ' + (d.file ? esc(d.file) : 'uploaded ' + d.when) : d.s}</small></div>${d.st === 'need' ? `<label class="btn sm y up">Upload<input type="file" data-i="${i}" aria-label="Upload ${d.n}"></label>` : d.st === 'review' ? '<span class="chip wait">Review</span>' : '<span class="chip ok">Done</span>'}</div>`).join('')}</div>
    </div>
    <div>
      <div class="money"><div class="r"><span>Premium (10%)</span><span>$250.00</span></div><div class="r"><span>Paid Oct 12</span><span>\u2212$150.00</span></div><div class="r"><span>Balance \u00b7 due Nov 12</span><span>$100.00</span></div></div>
      <div style="display:grid;gap:8px;margin-bottom:22px"><a class="btn block" href="#/pay">Pay balance</a><button type="button" class="btn o block ics">Add court date to calendar</button></div>
      <span class="label" style="display:block;margin-bottom:10px">Next court date</span>
      <div class="note" style="margin-bottom:22px"><div class="h"><span>Preliminary hearing</span><span>${court.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span></div><p><b>${court.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}, 9:00 a.m.</b><br>Pittsburgh Municipal Court, 660 First Ave</p></div>
      <span class="label" style="display:block;margin-bottom:10px">Messages</span>
      <div class="inbox"><div class="note"><div class="h"><span>Ana Ruiz</span><span>Today</span></div><p>Hi! Just need a recent pay stub to finish your file. A photo is fine.</p></div><div class="note"><div class="h"><span>Marie Kowalski</span><span>Oct 13</span></div><p>Got the F-150 title, thank you. It's logged in our trust file and comes back when the bond is exonerated.</p></div></div>
    </div>`;
    $$('input[type=file]', dash).forEach(inp => inp.addEventListener('change', () => { const f = inp.files[0]; if (!f) return; const d = docs[+inp.dataset.i]; d.st = 'review'; d.file = f.name; render(); toast('Uploaded for review (demo: the file stayed on your device).'); }));
    $('.ics', dash).addEventListener('click', () => downloadICS({ title: 'Court: Daniel Novak, preliminary hearing', start: court, mins: 120, location: 'Pittsburgh Municipal Court, 660 First Ave, Pittsburgh, PA 15219', desc: 'Arrive 30 minutes early with photo ID. Steel City Bail ' + PHONE, alarms: [1440, 120] }, 'court-date.ics'));
  }
  login.addEventListener('submit', e => {
    e.preventDefault();
    if (login.cid.value.trim().toUpperCase() !== 'SC-26-0418' || login.pin.value.trim() !== '4412') { toast('Demo: use case SC-26-0418 and PIN 4412.'); return; }
    login.hidden = true; dash.hidden = false; $('.who', el).innerHTML = 'Signed in \u00b7 <b>R. Novak</b> (cosigner)'; render();
  });
}

/* ======================================================================
   MAP
   ====================================================================== */
const maps = [];
const dirUrl = (p) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(p.addr.replace(/, Suite [^,]+/, ''))}`;
const mkIcon = (t) => L.divIcon({ className: '', html: `<div class="mk ${t}"></div>`, iconSize: [22, 22], iconAnchor: [11, 11], popupAnchor: [0, -14] });
const pop = (p) => `<b>${esc(p.name)}</b>${esc(p.addr)}${p.phone ? '<br>' + esc(p.phone) : ''}<br><a href="${dirUrl(p)}" target="_blank" rel="noopener">DIRECTIONS \u2192</a>`;
function makeMap(node) {
  if (!window.L) { node.innerHTML = '<p style="padding:20px" class="muted">Map needs an internet connection.</p>'; return null; }
  const m = L.map(node, { scrollWheelZoom: false });
  const esri = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/';
  L.tileLayer(esri + 'World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', { maxZoom: 16, attribution: 'Tiles &copy; Esri &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap contributors' }).addTo(m);
  L.tileLayer(esri + 'World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}', { maxZoom: 16, pane: 'overlayPane' }).addTo(m);
  maps.push(m); return m;
}
function initDir(el) {
  el.innerHTML = `<div class="dir crop"${el.dataset.tall ? ' style="min-height:700px"' : ''}><div class="dir-l"><div class="dir-filter" role="tablist">${[['all', 'All'], ['jail', 'Jails'], ['court', 'Courts'], ['office', 'Us']].map(([k, l], i) => `<button role="tab" data-t="${k}" aria-selected="${i === 0}">${l}</button>`).join('')}</div><div class="dir-items"></div></div><div class="map" role="region" aria-label="Map"></div></div>`;
  const items = $('.dir-items', el); let t = 'all', layer, mk = {};
  const map = makeMap($('.map', el)); if (map) layer = L.layerGroup().addTo(map);
  function draw() {
    const list = PLACES.filter(p => t === 'all' || p.type === t);
    items.innerHTML = list.map(p => `<button type="button" class="place" data-id="${p.id}" aria-current="false"><span class="k"><b>${esc(p.name)}</b><span class="cty">${p.type} \u00b7 ${p.county}</span></span><p>${esc(p.addr)}</p><p class="muted">${esc(p.note)}</p><span class="acts"><a href="${dirUrl(p)}" target="_blank" rel="noopener">Directions</a>${p.phone ? `<a href="tel:+1${p.phone.replace(/\D/g, '')}">${esc(p.phone)}</a>` : ''}</span></button>`).join('');
    if (!map) return; layer.clearLayers(); mk = {};
    list.forEach(p => { mk[p.id] = L.marker(p.ll, { icon: mkIcon(p.type), title: p.name }).bindPopup(pop(p)).on('click', () => sel(p.id, false)).addTo(layer); });
    map.fitBounds(L.latLngBounds(list.map(p => p.ll)).pad(.15), { maxZoom: 14 });
  }
  function sel(id, fly = true) {
    $$('.place', items).forEach(b => b.setAttribute('aria-current', b.dataset.id === id));
    const p = PLACES.find(x => x.id === id);
    if (map && fly) { map.flyTo(p.ll, 15, { duration: reduce ? 0 : .7 }); setTimeout(() => mk[id] && mk[id].openPopup(), reduce ? 0 : 720); }
  }
  items.addEventListener('click', e => { if (e.target.closest('a')) return; const b = e.target.closest('.place'); if (b) sel(b.dataset.id); });
  $('.dir-filter', el).addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; t = b.dataset.t; $$('.dir-filter button', el).forEach(x => x.setAttribute('aria-selected', x === b)); draw(); });
  draw();
}

/* ======================================================================
   WANTED / TEAM / REVIEWS / FAQ / OFFICES
   ====================================================================== */
function initWanted(el) {
  const lim = +el.dataset.limit || 99;
  el.innerHTML = `<div class="skip-warn"><b>Fictional entries</b><span>AI-generated faces · not real people · concept demo only</span><span>Never approach. Call ${PHONE} or 911.</span></div>
  <div class="board-grid">${WANTED.slice(0, lim).map(w => `<article class="poster"><div class="top"><b>FTA</b><span>Since ${w.since}</span></div><div class="ph"><span class="ruler"></span><img src="${w.img}" alt="AI-generated portrait for fictional entry ${w.name}" loading="lazy"><span class="ai">AI face \u00b7 fictional</span></div>
    <div class="bd"><h3>${w.name}</h3><dl><dt>Age</dt><dd>${w.age}</dd><dt>Missed</dt><dd>${w.fta}</dd><dt>Charge</dt><dd>${w.ch}</dd><dt>Bond</dt><dd class="num">${money(w.bond)}</dd><dt>Last seen</dt><dd>${w.area}</dd></dl>
    <div class="rw"><div><span>Reward up to</span><br><b>${money(w.reward)}</b></div><a class="btn sm" href="#/wanted" data-tip="${esc(w.name)}">Send tip</a></div></div></article>`).join('')}</div>`;
  $$('[data-tip]', el).forEach(a => a.addEventListener('click', () => { setTimeout(() => { const s = $('#tip-who'); if (s) { s.value = a.dataset.tip; $('#tipf').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); } }, 120); }));
}
function initTeam(el) {
  el.innerHTML = `<div class="team">${TEAM.map(a => `<article class="agent"><div class="ph"><img src="${a.img}" alt="Portrait of ${a.name}" loading="lazy"></div><div class="bd"><h3>${a.name}</h3><span class="role">${a.role}</span><p>${a.bio}</p><div class="kv"><span>Since ${a.since}</span><span>${a.from}</span></div>${el.dataset.full ? `<div class="kv"><span>Languages</span><span>${a.langs}</span></div>` : ''}</div></article>`).join('')}</div>`;
}
function initReviews(el) {
  const lim = +el.dataset.limit || 99;
  el.innerHTML = `${lim > 50 ? `<div class="score" style="margin-bottom:var(--gap)"><b>4.9</b><div><span class="label">Sample rating</span><p class="small">${REVIEWS.length} sample reviews \u00b7 fictional</p></div></div>` : ''}<div class="reviews">${REVIEWS.slice(0, lim).map(r => `<article class="rv ${r.big ? 'big' : ''}"><div class="h"><span class="stars" aria-label="5 out of 5">\u2605\u2605\u2605\u2605\u2605</span><span class="sample">Sample</span></div><blockquote>\u201c${r.t}\u201d</blockquote><div class="who"><span>${r.who}</span><span>${r.where}</span></div></article>`).join('')}</div>`;
}
function initFaq(el) {
  const lim = +el.dataset.limit || 99;
  el.innerHTML = `<div class="faq">${FAQ.slice(0, lim).map(([q, a], i) => `<details ${i === 0 ? 'open' : ''}><summary><span class="n">Q.${String(i + 1).padStart(2, '0')}</span><h3>${q}</h3><i aria-hidden="true"></i></summary><div class="a">${a}</div></details>`).join('')}</div>`;
}
function initOffices(el) {
  el.innerHTML = `<div class="offices">${PLACES.filter(p => p.type === 'office').map(o => `<article class="office"><div class="ph"><img src="${o.img}" alt="" loading="lazy"></div><div class="bd"><span class="label">${o.county} County</span><h3>${o.name.split('\u00b7')[1].trim()}</h3><address>${esc(o.addr)}</address><dl>${o.hours.map(([d, t]) => `<dt>${d}</dt><dd>${t}</dd>`).join('')}</dl><p class="small muted">${o.note}</p><div class="acts"><a class="lnk" href="${dirUrl(o)}" target="_blank" rel="noopener">Directions</a><a class="lnk" href="tel:+1${o.phone.replace(/\D/g, '')}">${o.phone}</a></div></div></article>`).join('')}</div>`;
}

/* ======================================================================
   ICS
   ====================================================================== */
const icsD = (d) => `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}00`;
const icsE = (s) => String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
function downloadICS({ title, start, mins, location, desc, alarms = [] }, file) {
  const end = new Date(start.getTime() + mins * 60000);
  const body = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Trace Studio//Steel City concept//EN', 'BEGIN:VEVENT', `UID:${Date.now()}@steelcity.example.com`, `DTSTAMP:${icsD(new Date())}`, `DTSTART:${icsD(start)}`, `DTEND:${icsD(end)}`, `SUMMARY:${icsE(title)}`, `LOCATION:${icsE(location)}`, `DESCRIPTION:${icsE(desc)}`, ...alarms.flatMap(m => ['BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${icsE(title)}`, `TRIGGER:-PT${m}M`, 'END:VALARM']), 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([body], { type: 'text/calendar' })); a.download = file; document.body.append(a); a.click(); a.remove();
  toast('Calendar file downloaded.');
}

/* ======================================================================
   APPLY (work order)
   ====================================================================== */
function initApply() {
  const form = $('#ap'), files = {}; let sigMode = 'draw', drawn = false;
  const secOk = {
    def: () => ['#d-first', '#d-last', '#d-dob', '#d-jail'].every(s => $(s).value.trim()),
    you: () => ['#c-name', '#c-rel', '#c-addr'].every(s => $(s).value.trim()) && $('#c-phone').value.replace(/\D/g, '').length >= 10 && /^\S+@\S+\.\S+$/.test($('#c-email').value),
    id: () => !!(files.front && files.back),
    sign: () => (sigMode === 'draw' ? drawn : $('#sig-name').value.trim().length > 3) && $('#agree1').checked && $('#agree2').checked
  };
  const sync = () => { let n = 0; Object.entries(secOk).forEach(([k, f]) => { const ok = f(); n += ok; $(`#ap-cl [data-c=${k}]`).classList.toggle('ok', ok); $(`.wo-sec[data-s=${k}]`).classList.toggle('ok', ok); }); $('#ap-count').textContent = `${n}/4`; return n; };
  form.addEventListener('input', e => { e.target.classList && e.target.classList.remove('bad'); sync(); });
  form.addEventListener('change', sync);
  $('#d-bail').addEventListener('input', e => { const v = e.target.value.replace(/\D/g, ''); e.target.value = v ? '$' + (+v).toLocaleString('en-US') : ''; });
  // uploads
  $$('.drop', form).forEach(d => {
    const inp = $('input', d);
    const take = (f) => { if (!f) return; files[d.dataset.drop] = f; $$('.pv,.pv-l', d).forEach(n => n.remove()); if (f.type.startsWith('image/')) { const i = new Image(); i.className = 'pv'; i.alt = ''; i.src = URL.createObjectURL(f); d.append(i); } d.append(h(`<span class="pv-l">\u2713 ${esc(f.name.slice(0, 30))}</span>`)); sync(); };
    inp.addEventListener('change', () => take(inp.files[0]));
    ['dragenter', 'dragover'].forEach(t => d.addEventListener(t, e => { e.preventDefault(); d.classList.add('over'); }));
    ['dragleave', 'drop'].forEach(t => d.addEventListener(t, e => { e.preventDefault(); d.classList.remove('over'); }));
    d.addEventListener('drop', e => take(e.dataTransfer.files[0]));
  });
  // signature
  const cv = $('#sig-canvas'), ctx = cv.getContext('2d'); let down = false, last;
  const size = () => { const r = cv.getBoundingClientRect(); if (!r.width) return; const dpr = Math.max(1, devicePixelRatio || 1); cv.width = r.width * dpr; cv.height = r.height * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#111'; drawn = false; sync(); };
  const pt = (e) => { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top, t: performance.now() }; };
  cv.addEventListener('pointerdown', e => { down = true; last = pt(e); cv.setPointerCapture(e.pointerId); });
  cv.addEventListener('pointermove', e => { if (!down) return; const p = pt(e), v = Math.hypot(p.x - last.x, p.y - last.y) / Math.max(1, p.t - last.t); ctx.lineWidth = Math.max(1.3, 3.4 - v * 1.5); ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(p.x, p.y); ctx.stroke(); last = p; if (!drawn) { drawn = true; stamp(); sync(); } });
  ['pointerup', 'pointercancel'].forEach(t => cv.addEventListener(t, () => down = false));
  const stamp = () => $('#sig-stamp').textContent = 'SIGNED ' + new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }).toUpperCase();
  $('#sig-clear').addEventListener('click', () => { ctx.clearRect(0, 0, cv.width, cv.height); drawn = false; $('#sig-name').value = ''; $('#sig-preview').innerHTML = '&nbsp;'; $('#sig-stamp').textContent = ''; sync(); });
  $$('[data-sig]').forEach(b => b.addEventListener('click', () => { sigMode = b.dataset.sig; $$('[data-sig]').forEach(x => x.setAttribute('aria-pressed', x === b)); $('#sig-draw').hidden = sigMode !== 'draw'; $('#sig-type').hidden = sigMode !== 'type'; if (sigMode === 'draw') size(); sync(); }));
  $('#sig-name').addEventListener('input', e => { $('#sig-preview').textContent = e.target.value || '\u00a0'; if (e.target.value.trim().length > 3) stamp(); });
  new ResizeObserver(() => { if (!drawn) size(); }).observe(cv);
  $('#ap-submit').addEventListener('click', () => {
    const bad = Object.entries(secOk).filter(([, f]) => !f()).map(([k]) => k);
    if (bad.length) {
      $('#ap-err').textContent = `Still needed: ${bad.map(k => ({ def: 'A', you: 'B', id: 'C', sign: 'D' })[k]).join(', ')}`;
      const s = $(`.wo-sec[data-s=${bad[0]}]`); s.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      $$('[required]', s).forEach(i => { if (!i.value.trim()) i.classList.add('bad'); });
      return;
    }
    $('#ap-err').textContent = ''; form.hidden = true; $('.wo-side').hidden = true;
    $('#ap-done').hidden = false; $('#ap-phone').textContent = $('#c-phone').value; $('#ap-ref').textContent = 'SC-26-' + (1000 + Math.floor(Math.random() * 8999));
    window.traceDemo && traceDemo.notify('application', { Reference: $('#ap-ref').textContent, Defendant: (document.getElementById('d-first')||{}).value + ' ' + (document.getElementById('d-last')||{}).value, 'Date of birth': (document.getElementById('d-dob')||{}).value, 'Booking / OTN': (document.getElementById('d-book')||{}).value, Facility: ((document.getElementById('d-jail')||{}).selectedOptions||[{}])[0].text, 'Bail amount': (document.getElementById('d-bail')||{}).value, Cosigner: (document.getElementById('c-name')||{}).value, Relationship: ((document.getElementById('c-rel')||{}).selectedOptions||[{}])[0].text, Mobile: (document.getElementById('c-phone')||{}).value, Email: (document.getElementById('c-email')||{}).value, 'Home address': (document.getElementById('c-addr')||{}).value, 'ID photos': Object.keys(files).length + ' attached (not sent)', Signature: sigMode === 'draw' ? 'Drawn on screen' : 'Typed: ' + (document.getElementById('sig-name')||{}).value });
    $('#ap-done').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
  });
  $('#ap-restart').addEventListener('click', () => { form.reset(); Object.keys(files).forEach(k => delete files[k]); $$('.pv,.pv-l', form).forEach(n => n.remove()); $('#sig-clear').click(); form.hidden = false; $('.wo-side').hidden = false; $('#ap-done').hidden = true; sync(); });
  initApply.prefill = (q) => { if (q.d) { const [f, ...l] = q.d.split(' '); $('#d-first').value = f; $('#d-last').value = l.join(' '); } if (q.b) $('#d-bail').value = '$' + (+q.b).toLocaleString('en-US'); if (q.f) $('#d-jail').value = q.f; sync(); };
  sync();
}

/* ======================================================================
   PAY (tape receipt)
   ====================================================================== */
const BR = { visa: ['#1A1F71', 'visa'], mc: ['#EB001B', 'mastercard'], amex: ['#2E77BC', 'americanexpress'], disc: ['#FF6000', 'discover'] };
const brandOf = (n) => /^4/.test(n) ? 'visa' : /^(5[1-5]|2[2-7])/.test(n) ? 'mc' : /^3[47]/.test(n) ? 'amex' : /^(6011|65|64[4-9])/.test(n) ? 'disc' : null;
const luhn = (n) => { let s = 0, alt = false; for (let i = n.length - 1; i >= 0; i--) { let d = +n[i]; if (alt) { d *= 2; if (d > 9) d -= 9; } s += d; alt = !alt; } return s % 10 === 0; };
function initPay() {
  const f = $('#payf'), card = $('#p-card'), exp = $('#p-exp'), amt = $('#p-amt'), bi = $('#p-brand i'), tape = $('#tape');
  const tapeHTML = (paid) => { const a = parseFloat(amt.value) || 0, typ = $('input[name=pw]:checked', f).value, n = card.value.replace(/\D/g, ''); return `<p class="c"><b>Steel City Bail Bonds</b><br>917 Fort Pitt Blvd \u00b7 Pittsburgh PA</p><hr>
    <div class="r"><span>DATE</span><span class="dots"></span><span>${new Date().toLocaleDateString('en-US')}</span></div><div class="r"><span>TIME</span><span class="dots"></span><span>${clock()}</span></div><div class="r"><span>CASE</span><span class="dots"></span><span>${esc($('#p-ref').value || '\u2014')}</span></div><div class="r"><span>TYPE</span><span class="dots"></span><span>${typ.toUpperCase()}</span></div>${n.length > 4 ? `<div class="r"><span>CARD</span><span class="dots"></span><span>\u2022\u2022\u2022\u2022 ${n.slice(-4)}</span></div>` : ''}<div class="r"><span>FEE</span><span class="dots"></span><span>$0.00</span></div><hr>
    <div class="r tot"><span>TOTAL</span><span class="dots"></span><span>${money(a, true)}</span></div><hr><p class="c">${paid ? '*** APPROVED \u00b7 DEMO ***<br>NO CARD WAS CHARGED' : 'AWAITING PAYMENT'}</p>`; };
  const sync = () => tape.innerHTML = tapeHTML(false);
  f.addEventListener('input', e => { e.target.classList.remove('bad'); sync(); });
  f.addEventListener('change', sync);
  card.addEventListener('input', () => { const d = card.value.replace(/\D/g, '').slice(0, 19), b = brandOf(d); card.value = b === 'amex' ? d.replace(/^(\d{0,4})(\d{0,6})(\d{0,5}).*/, (m, a, c, e) => [a, c, e].filter(Boolean).join(' ')) : d.replace(/(.{4})/g, '$1 ').trim(); if (b) { bi.style.setProperty('--c', BR[b][0]); bi.style.setProperty('--u', `url(https://cdn.jsdelivr.net/npm/simple-icons@13.21.0/icons/${BR[b][1]}.svg)`); } else bi.style.removeProperty('--c'); });
  exp.addEventListener('input', () => { const d = exp.value.replace(/\D/g, '').slice(0, 4); exp.value = d.length > 2 ? d.slice(0, 2) + ' / ' + d.slice(2) : d; });
  amt.addEventListener('blur', () => { const v = parseFloat(amt.value.replace(/[^\d.]/g, '')); if (v) amt.value = v.toFixed(2); sync(); });
  $$('.wallet').forEach(w => w.addEventListener('click', () => toast(`Demo: the ${w.dataset.wallet} sheet would open here.`)));
  f.addEventListener('submit', e => {
    e.preventDefault(); const num = card.value.replace(/\D/g, ''), [mm, yy] = exp.value.split('/').map(s => +s.trim()), bad = [];
    if (!$('#p-ref').value.trim()) bad.push($('#p-ref')); if (!(parseFloat(amt.value) > 0)) bad.push(amt); if (!$('#p-name').value.trim()) bad.push($('#p-name'));
    if (num.length < 13 || !luhn(num)) bad.push(card); if (!(mm >= 1 && mm <= 12 && new Date(2000 + yy, mm, 1) > new Date())) bad.push(exp);
    if (!/^\d{3,4}$/.test($('#p-cvc').value)) bad.push($('#p-cvc')); if (!/^\d{5}$/.test($('#p-zip').value)) bad.push($('#p-zip'));
    $$('.input', f).forEach(i => i.classList.toggle('bad', bad.includes(i)));
    if (bad.length) { $('#pay-err').textContent = bad.includes(card) ? 'Card number failed the check. Demo: 4242 4242 4242 4242.' : 'Check the highlighted fields.'; bad[0].focus(); return; }
    $('#pay-err').textContent = ''; $('#pay-l').textContent = 'Processing\u2026';
    window.traceDemo && traceDemo.notify('payment', { Case: $('#p-ref').value, Amount: amt.value, Type: (f.querySelector('input[name=pw]:checked')||{}).value, 'Name on card': $('#p-name').value, Card: (brandOf(num) || 'card') + ' ending ' + num.slice(-4) });
    setTimeout(() => { tape.innerHTML = tapeHTML(true); $('#pay-l').textContent = 'Pay now'; tape.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }); }, 1000);
  });
  sync();
}

/* ======================================================================
   CHECK-IN + TIP
   ====================================================================== */
function initCheckin() {
  const f = $('#cif');
  f.addEventListener('change', () => { $('#ci-newaddr').hidden = $('input[name=addr]:checked', f).value === 'y'; });
  f.addEventListener('submit', e => {
    e.preventDefault(); const bad = ['#ci-case', '#ci-dob'].map(s => $(s)).filter(i => !i.value.trim()); bad.forEach(i => i.classList.add('bad'));
    if (bad.length || !$('#ci-ok').checked) { $('#ci-err').textContent = bad.length ? 'Case ID and date of birth are required.' : 'Please confirm the statement.'; return; }
    $('#ci-err').textContent = ''; const nx = new Date(); nx.setDate(nx.getDate() + 7);
    const flags = [$('input[name=addr]:checked', f).value === 'n' && 'ADDRESS CHANGE', $('input[name=pol]:checked', f).value === 'y' && 'POLICE CONTACT', $('input[name=crt]:checked', f).value === 'n' && 'NEEDS COURT INFO'].filter(Boolean);
    $('#ci-tape').innerHTML = `<p class="c"><b>Check-in received</b><br>Demo \u00b7 nothing sent</p><hr><div class="r"><span>CASE</span><span class="dots"></span><span>${esc($('#ci-case').value.toUpperCase())}</span></div><div class="r"><span>TIME</span><span class="dots"></span><span>${new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })}</span></div><div class="r"><span>STATUS</span><span class="dots"></span><span>ON TIME</span></div><div class="r"><span>FLAGS</span><span class="dots"></span><span>${flags.length ? flags.join(', ') : 'NONE'}</span></div><hr><div class="r tot"><span>NEXT DUE</span><span class="dots"></span><span>${nx.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span></div><hr><p class="small" style="font-family:var(--f-body)">${flags.length ? 'Ana will call you today about the items flagged above.' : 'All clear. See you next week.'}</p>`;
    window.traceDemo && traceDemo.notify('checkin', { Case: $('#ci-case').value.toUpperCase(), 'Date of birth': $('#ci-dob').value, 'Same address': (f.querySelector('input[name=addr]:checked')||{}).value, 'New address': ($('#ci-newaddr input')||{}).value, 'Same employer': (f.querySelector('input[name=emp]:checked')||{}).value, 'Police contact': (f.querySelector('input[name=pol]:checked')||{}).value, 'Knows court date': (f.querySelector('input[name=crt]:checked')||{}).value, Flags: flags.join(', ') || 'None', Note: ($('#ci-note')||{}).value });
    f.reset(); $('#ci-newaddr').hidden = true; $('#ci-tape').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
  });
}
function initTip() {
  $('#tip-who').innerHTML = WANTED.map(w => `<option>${w.name}</option>`).join('') + '<option>Someone else</option>';
  $('#tipf').addEventListener('submit', e => { e.preventDefault(); if (!$('#tip-where').value.trim() && !$('#tip-msg').value.trim()) { $('#tip-where').classList.add('bad'); return; } window.traceDemo && traceDemo.notify('tip', { Wanted: $('#tip-who').value, Where: $('#tip-where').value, Message: $('#tip-msg').value, Contact: ($('#tip-c')||{}).value || 'Anonymous' }); e.target.reset(); toast('Tip received (demo, nothing sent). Thank you. Never approach anyone yourself.'); });
}

/* ======================================================================
   ROUTER
   ====================================================================== */
const TITLES = { home: 'Steel City Bail \u00b7 Pittsburgh bail bonds, 24/7', locate: 'Inmate search', text: 'Text to start', how: 'How bail works in Allegheny County', cost: 'Cost calculator', cosigner: 'Cosigner portal', checkin: 'Weekly check-in', jails: 'Jails & courts', wanted: 'Skip board', apply: 'Apply online', pay: 'Make a payment', team: 'Bondsmen', reviews: 'Reviews', faq: 'FAQ', offices: 'Offices', credits: 'Credits' };
const INIT = { '.js-locator': initLocator, '.js-plates': initPlates, '.js-cost': initCost, '.js-tts': initTTS, '.js-portal': initPortal, '.js-dir': initDir, '.js-wanted': initWanted, '.js-team': initTeam, '.js-reviews': initReviews, '.js-faq': initFaq, '.js-offices': initOffices };
let uid = 0, first = true;
function route() {
  const raw = location.hash.replace(/^#\/?/, ''); if (raw === 'main') return;
  const [path, qs] = raw.split('?'); let key = path || 'home';
  let page = $(`[data-page="${CSS.escape(key)}"]`); if (!page) { key = 'home'; page = $('[data-page="home"]'); }
  $$('[data-page]').forEach(p => p.hidden = p !== page);
  Object.entries(INIT).forEach(([s, fn]) => $$(s, page).forEach(el => { if (!el.dataset.ready) { el.dataset.ready = 1; el.dataset.uid = ++uid; fn(el); } }));
  if (key === 'apply' && qs) initApply.prefill(Object.fromEntries(new URLSearchParams(qs)));
  if (key === 'text' && pendingName) { const t = $('.js-tts', page); if (t._send) { const n = pendingName; pendingName = ''; t._send(n); } }
  document.title = key === 'home' ? TITLES.home : `${TITLES[key]} \u00b7 Steel City Bail`;
  $$('.nav a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#/' + key));
  closeDrawer(); if (!first) scrollTo(0, 0); first = false;
  requestAnimationFrame(() => { maps.forEach(m => m.invalidateSize()); reveal(page); });
}
addEventListener('hashchange', route);
const drawer = $('#drawer'), mb = $('.menu-btn');
function closeDrawer() { drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); mb.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; }
mb.addEventListener('click', () => { drawer.classList.add('open'); drawer.setAttribute('aria-hidden', 'false'); mb.setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden'; $('.close', drawer).focus(); });
$('.close', drawer).addEventListener('click', closeDrawer);
addEventListener('keydown', e => e.key === 'Escape' && closeDrawer());
let rz; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => maps.forEach(m => m.invalidateSize()), 150); });

const io = 'IntersectionObserver' in window && !reduce ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -6% 0px' }) : null;
function reveal(root) { if (!io) return; $$('.shead, .plate, .opt, .poster, .agent, .rv, .office, .bail-types', root).forEach((n, i) => { if (n.dataset.rv) return; n.dataset.rv = 1; n.classList.add('rv-in'); n.style.transitionDelay = (i % 4) * 60 + 'ms'; io.observe(n); }); }

// hero "text us their name" → text-to-start
$('#sms-start').addEventListener('submit', e => { e.preventDefault(); const v = $('#sms-name').value.trim(); pendingName = v; location.hash = '#/text'; });

$('#credits-body').innerHTML = CREDITS.map(([f, t, a, l, u]) => `<tr><td class="num">${f}</td><td><a class="lnk" style="text-transform:none" href="${u}" target="_blank" rel="noopener">${esc(t)}</a></td><td>${esc(a)}</td><td class="num">${l}</td></tr>`).join('');
initTicker(); initBoard(); initApply(); initPay(); initCheckin(); initTip();
route();
})();
