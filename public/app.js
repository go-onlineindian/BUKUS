import { videos } from './videos.js';
import { photos, photoSrc, places } from './places.js';
import { ideas, ideaThumbnail } from './ideas.js';

const find = (selector) => document.querySelector(selector);
const element = (tag, text, className) => {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
};

const themeToggle = find('#theme-toggle');
const systemDark = matchMedia('(prefers-color-scheme: dark)');
let themePreference;
try { themePreference = localStorage.getItem('hukus-theme'); } catch {}

function setTheme(dark) {
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  document.querySelector('meta[name="theme-color"]').content = dark ? '#171f19' : '#fcf7eb';
  themeToggle.setAttribute('aria-pressed', String(dark));
  themeToggle.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} mode`);
  themeToggle.querySelector('use').setAttribute('href', dark ? '#icon-sun' : '#icon-moon');
}

setTheme(themePreference ? themePreference === 'dark' : systemDark.matches);
systemDark.addEventListener('change', ({ matches }) => { if (!themePreference) setTheme(matches); });
themeToggle.addEventListener('click', () => {
  const dark = document.documentElement.dataset.theme !== 'dark';
  themePreference = dark ? 'dark' : 'light';
  setTheme(dark);
  try { localStorage.setItem('hukus-theme', themePreference); } catch {}
});

const videoGrid = find('#video-grid');
const videoSearch = find('#video-search');
const moreButton = find('#more-videos');
const playerDialog = find('#player-dialog');
const playerFrame = find('#player-frame');
const compact = matchMedia('(max-width: 760px)');
const canHover = matchMedia('(hover: hover) and (pointer: fine)');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const filterButtons = [...document.querySelectorAll('[data-filter]')];
const featuredTitles = {
  o76NltZjNfg: 'The amazing human body',
  'K-R17UkmuGU': 'Why girls’ education matters',
  FyPGkJ5HvBE: 'Safari counting adventure',
  tsUv8_GyW4E: 'Know your blood pressure',
  uc6RRmxJHwk: 'First aid at home',
  'm-cS82uu02I': 'Cold vs. flu',
};

let selectedFilter = 'all';
let extraPages = 0;
let filteredVideos = [];
let currentIndex = -1;
let previewTimer;
let previewFrame;
let previewMedia;

function videoTitle(video) {
  return featuredTitles[video.id] || video.title.replace(/^HUKUS BUKUS\s*/i, '').replace(/^Tales for Kids\s*\|?\s*/i, '').trim() || video.title;
}

function iframeFor(video, preview = false) {
  const iframe = element('iframe');
  iframe.src = `https://www.youtube-nocookie.com/embed/${video.id}?${preview ? 'autoplay=1&mute=1&controls=0&disablekb=1&modestbranding=1&playsinline=1&rel=0&loop=1&playlist=' + video.id : 'autoplay=1&playsinline=1&rel=0'}`;
  iframe.title = preview ? `Muted preview: ${videoTitle(video)}` : videoTitle(video);
  iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
  iframe.allowFullscreen = !preview;
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  if (preview) {
    iframe.tabIndex = -1;
    iframe.setAttribute('aria-hidden', 'true');
  }
  return iframe;
}

function endPreview() {
  clearTimeout(previewTimer);
  previewFrame?.remove();
  previewMedia?.classList.remove('is-playing');
  previewFrame = null;
  previewMedia = null;
}

const prevVideo = find('#prev-video');
const nextVideo = find('#next-video');

function loadPlayer(index) {
  const video = filteredVideos[index];
  if (!video) return;
  currentIndex = index;
  find('#player-title').textContent = videoTitle(video);
  find('#youtube-fallback').href = `https://www.youtube.com/watch?v=${video.id}`;
  find('#player-position').textContent = `${index + 1} of ${filteredVideos.length}`;
  playerFrame.replaceChildren(iframeFor(video));
  prevVideo.disabled = index === 0;
  nextVideo.disabled = index === filteredVideos.length - 1;
}

function playVideo(video) {
  endPreview();
  loadPlayer(filteredVideos.indexOf(video));
  if (!playerDialog.open) playerDialog.showModal();
}

prevVideo.addEventListener('click', () => loadPlayer(currentIndex - 1));
nextVideo.addEventListener('click', () => loadPlayer(currentIndex + 1));
playerDialog.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight') loadPlayer(Math.min(currentIndex + 1, filteredVideos.length - 1));
  if (event.key === 'ArrowLeft') loadPlayer(Math.max(currentIndex - 1, 0));
});

function videoCard(video) {
  const card = element('article', null, 'video-card');
  const media = element('div', null, 'video-media');
  const thumbnail = element('img');
  thumbnail.src = `https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`;
  thumbnail.alt = '';
  thumbnail.width = 320;
  thumbnail.height = 180;
  thumbnail.loading = 'lazy';
  thumbnail.addEventListener('error', () => { thumbnail.src = '/img/hukus-bukus.jpg'; }, { once: true });

  const button = element('button', null, 'video-open');
  button.type = 'button';
  button.setAttribute('aria-label', `Play ${videoTitle(video)}`);
  button.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#icon-youtube"/></svg>';
  button.addEventListener('click', () => playVideo(video));
  media.append(thumbnail, button);

  card.addEventListener('pointerenter', (event) => {
    if (!['mouse', 'pen'].includes(event.pointerType) || !canHover.matches || reducedMotion.matches || playerDialog.open) return;
    endPreview();
    previewMedia = media;
    previewTimer = setTimeout(() => {
      previewFrame = iframeFor(video, true);
      previewFrame.addEventListener('load', () => {
        if (previewMedia === media) media.classList.add('is-playing');
      }, { once: true });
      media.insertBefore(previewFrame, button);
    }, 150);
  });
  card.addEventListener('pointerleave', () => { if (previewMedia === media) endPreview(); });

  const info = element('div', null, 'video-info');
  info.append(element('small', video.category), element('h3', videoTitle(video)));
  card.append(media, info);
  return card;
}

function renderVideos(append = false) {
  endPreview();
  const query = videoSearch.value.trim().toLowerCase();
  const filtered = videos.filter((video) => (selectedFilter === 'all' || video.category === selectedFilter)
    && `${video.title} ${videoTitle(video)} ${video.category}`.toLowerCase().includes(query));
  filteredVideos = filtered;
  const perPage = compact.matches ? 4 : 6;
  const count = Math.min(filtered.length, perPage * (extraPages + 1));
  const start = append ? videoGrid.childElementCount : 0;
  const cards = filtered.slice(start, count).map(videoCard);
  if (append) videoGrid.append(...cards);
  else videoGrid.replaceChildren(...cards);
  if (!count) videoGrid.append(element('p', 'No videos match. Try a different search or category.', 'empty-grid'));
  moreButton.hidden = count === filtered.length;
  find('#video-status').textContent = `Showing ${count} of ${filtered.length} videos.`;
  if (append && moreButton.hidden) cards[0]?.querySelector('button').focus();
}

filterButtons.forEach((button) => button.addEventListener('click', () => {
  selectedFilter = button.dataset.filter;
  extraPages = 0;
  filterButtons.forEach((filter) => filter.setAttribute('aria-pressed', String(filter === button)));
  renderVideos();
}));
videoSearch.addEventListener('input', () => { extraPages = 0; renderVideos(); });
moreButton.addEventListener('click', () => { extraPages += 1; renderVideos(true); });
compact.addEventListener('change', () => renderVideos());
reducedMotion.addEventListener('change', endPreview);
document.addEventListener('visibilitychange', () => { if (document.hidden) endPreview(); });
playerDialog.addEventListener('close', () => playerFrame.replaceChildren());
renderVideos();

function photoFor(key) {
  const image = element('img');
  image.alt = photos[key].alt;
  image.src = photoSrc(key);
  image.loading = 'lazy';
  image.decoding = 'async';
  return image;
}

// A swipeable strip of photos with previous/next buttons and dots.
function gallery(keys, { eager = false, contain = false, onOpen } = {}) {
  const box = element('div', null, 'gallery');
  const track = element('div', null, 'gallery-track');
  track.tabIndex = 0;
  track.setAttribute('role', 'group');
  track.setAttribute('aria-label', 'Photos. Swipe or use the arrow keys.');
  keys.forEach((key, index) => {
    const slide = element('div', null, 'gallery-slide');
    const image = photoFor(key);
    if (eager || index === 0) image.loading = 'eager';
    if (contain) image.classList.add('contain-photo');
    slide.append(image);
    if (onOpen) slide.addEventListener('click', onOpen);
    track.append(slide);
  });
  box.append(track);
  if (keys.length < 2) return box;

  const dots = element('div', null, 'gallery-dots');
  dots.setAttribute('aria-hidden', 'true');
  const dotNodes = keys.map(() => dots.appendChild(element('i')));
  const step = (direction) => track.scrollBy({ left: direction * track.clientWidth, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
  const makeButton = (label, text, direction) => {
    const button = element('button', text, `gallery-nav ${direction < 0 ? 'prev' : 'next'}`);
    button.type = 'button';
    button.setAttribute('aria-label', label);
    button.addEventListener('click', (event) => { event.stopPropagation(); step(direction); });
    return button;
  };
  const sync = () => {
    const index = Math.round(track.scrollLeft / Math.max(track.clientWidth, 1));
    dotNodes.forEach((dot, position) => dot.classList.toggle('on', position === index));
  };
  track.addEventListener('scroll', sync, { passive: true });
  track.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') { event.preventDefault(); step(1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); step(-1); }
  });
  box.append(makeButton('Previous photo', '‹', -1), makeButton('Next photo', '›', 1), dots);
  sync();
  return box;
}

function externalLink(label, url) {
  const link = element('a', label);
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  return link;
}

const placeDialog = find('#place-dialog');
function showPlace(place) {
  find('#place-area').textContent = place.area.toUpperCase();
  find('#place-title').textContent = place.name;
  find('#place-description').textContent = place.description;
  const stops = place.stops.map((stop) => {
    const card = element('article', null, 'stop');
    const photoBox = gallery(stop.photos, { eager: true, contain: stop.contain });
    const copy = element('div');
    copy.append(element('h3', stop.name), element('p', stop.description), externalLink('Open in Maps ↗', `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.map)}`));
    card.append(photoBox, copy);
    return card;
  });
  find('#place-stops').replaceChildren(...stops);
  placeDialog.showModal();
  placeDialog.scrollTop = 0;
}

const placesGrid = find('#places-grid');
places.forEach((place, index) => {
  const card = element('article', null, 'place-card');
  const figure = element('figure');
  const count = element('span', String(index + 1).padStart(2, '0'), 'place-count');
  count.setAttribute('aria-hidden', 'true');
  figure.append(gallery(place.photos, { onOpen: () => showPlace(place) }), count);
  const info = element('div', null, 'place-info');
  const button = element('button', 'Touring places');
  button.type = 'button';
  button.setAttribute('aria-label', `Touring places: ${place.name}`);
  button.setAttribute('aria-haspopup', 'dialog');
  button.insertAdjacentHTML('beforeend', '<svg class="icon" aria-hidden="true"><use href="#icon-arrow"/></svg>');
  button.addEventListener('click', () => showPlace(place));
  info.append(element('small', place.area), element('h3', place.name), element('p', place.near), button);
  card.append(figure, info);
  placesGrid.append(card);
});

for (const dialog of [playerDialog, placeDialog]) {
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
}

let ideaIndex = 0;
function updateIdea() {
  const idea = ideas[ideaIndex];
  find('#idea-count').textContent = `CREATIVE MISSION / ${String(ideaIndex + 1).padStart(2, '0')} OF ${String(ideas.length).padStart(2, '0')}`;
  find('#idea-text').textContent = `${idea.title} ${idea.prompt}`;
  find('#idea-urdu').textContent = idea.urdu;
  find('#idea-art').innerHTML = ideaThumbnail(idea);
}

const cosmosDialog = find('#cosmos-dialog');
const cosmosCanvas = find('#cosmos-canvas');
let cosmosFrame = 0;

function runCosmos() {
  const ctx = cosmosCanvas.getContext('2d');
  const dpr = Math.min(devicePixelRatio || 1, 2);
  let width = 0;
  let height = 0;
  const resize = () => {
    width = cosmosDialog.clientWidth;
    height = cosmosDialog.clientHeight;
    cosmosCanvas.width = width * dpr;
    cosmosCanvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  addEventListener('resize', resize);

  const rand = (min, max) => min + Math.random() * (max - min);
  const stars = Array.from({ length: 320 }, () => ({ x: Math.random(), y: Math.random(), size: rand(.4, 1.8), phase: rand(0, 6.28), speed: rand(.6, 2.2), drift: rand(.002, .012) }));
  const galaxies = [
    { x: .5, y: .5, scale: 1, tilt: -.5, spin: .16, hues: [38, 215], arms: 3, count: 3600 },
    { x: .15, y: .22, scale: .34, tilt: .6, spin: -.28, hues: [300, 190], arms: 2, count: 900 },
    { x: .86, y: .78, scale: .4, tilt: -.2, spin: .22, hues: [170, 260], arms: 2, count: 1000 },
  ].map((galaxy) => ({
    ...galaxy,
    dots: Array.from({ length: galaxy.count }, () => {
      const radius = Math.pow(Math.random(), .62);
      const arm = Math.floor(Math.random() * galaxy.arms) * (6.283 / galaxy.arms);
      return { radius, angle: arm + radius * 5.2 + rand(-.38, .38) * (1 - radius * .4), size: rand(.7, 2), mix: Math.min(1, radius * 1.2), jitter: rand(-.03, .03) };
    }),
  }));
  let shooting = null;
  let start = 0;

  const draw = (time) => {
    const seconds = (time - start) / 1000;
    const sky = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) * .75);
    sky.addColorStop(0, '#1b1440');
    sky.addColorStop(.55, '#0a0b25');
    sky.addColorStop(1, '#03040d');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);

    for (const star of stars) {
      const twinkle = .45 + .55 * Math.sin(seconds * star.speed + star.phase);
      ctx.globalAlpha = .25 + .75 * twinkle;
      ctx.fillStyle = '#fff6df';
      ctx.beginPath();
      ctx.arc(((star.x + seconds * star.drift) % 1) * width, star.y * height, star.size, 0, 6.283);
      ctx.fill();
    }

    ctx.globalCompositeOperation = 'lighter';
    for (const galaxy of galaxies) {
      const size = Math.min(width, height) * .46 * galaxy.scale;
      const glow = ctx.createRadialGradient(galaxy.x * width, galaxy.y * height, 0, galaxy.x * width, galaxy.y * height, size * .8);
      glow.addColorStop(0, `hsla(${galaxy.hues[0]}, 90%, 70%, .5)`);
      glow.addColorStop(.35, `hsla(${galaxy.hues[1]}, 80%, 50%, .14)`);
      glow.addColorStop(1, 'transparent');
      ctx.globalAlpha = 1;
      ctx.fillStyle = glow;
      ctx.fillRect(galaxy.x * width - size, galaxy.y * height - size, size * 2, size * 2);
      ctx.save();
      ctx.translate(galaxy.x * width, galaxy.y * height);
      ctx.rotate(galaxy.tilt);
      for (const dot of galaxy.dots) {
        const angle = dot.angle + seconds * galaxy.spin / (.35 + dot.radius);
        const x = Math.cos(angle) * dot.radius * size;
        const y = Math.sin(angle) * dot.radius * size * .45 + dot.jitter * size;
        ctx.globalAlpha = .85 - dot.radius * .45;
        ctx.fillStyle = `hsl(${galaxy.hues[0] + (galaxy.hues[1] - galaxy.hues[0]) * dot.mix}, 85%, ${78 - dot.mix * 26}%)`;
        ctx.fillRect(x, y, dot.size, dot.size);
      }
      ctx.restore();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;

    if (!shooting && Math.random() < .012) shooting = { x: rand(.1, .9) * width, y: rand(0, .35) * height, vx: rand(5, 9), vy: rand(2.5, 5), life: 1 };
    if (shooting) {
      const tail = ctx.createLinearGradient(shooting.x, shooting.y, shooting.x - shooting.vx * 12, shooting.y - shooting.vy * 12);
      tail.addColorStop(0, `rgba(255,255,255,${shooting.life})`);
      tail.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.strokeStyle = tail;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(shooting.x, shooting.y);
      ctx.lineTo(shooting.x - shooting.vx * 12, shooting.y - shooting.vy * 12);
      ctx.stroke();
      shooting.x += shooting.vx;
      shooting.y += shooting.vy;
      shooting.life -= .018;
      if (shooting.life <= 0) shooting = null;
    }
    if (!reducedMotion.matches) cosmosFrame = requestAnimationFrame(draw);
  };
  start = performance.now();
  cosmosFrame = requestAnimationFrame(draw);
  cosmosDialog.addEventListener('close', () => { cancelAnimationFrame(cosmosFrame); removeEventListener('resize', resize); }, { once: true });
}

find('#ideas-grow').addEventListener('click', () => {
  cosmosDialog.showModal();
  runCosmos();
});
find('#cosmos-close').addEventListener('click', () => cosmosDialog.close());
cosmosDialog.addEventListener('click', (event) => { if (event.target === cosmosCanvas) cosmosDialog.close(); });

find('#new-idea').addEventListener('click', () => { ideaIndex = (ideaIndex + 1) % ideas.length; updateIdea(); });
updateIdea();

const reviewFeed = find('#review-feed');
const reviewCount = find('#review-count');
const dateFormat = new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeZone: 'Asia/Kolkata' });
async function loadReviews() {
  try {
    const response = await fetch('/api/reviews', { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error();
    const { reviews } = await response.json();
    reviewCount.textContent = reviews.length === 1 ? '1 comment' : `${reviews.length} comments`;
    const entries = reviews.map((review) => {
      const article = element('article', null, 'review-entry');
      const title = element('header');
      const time = element('time', dateFormat.format(new Date(review.createdAt)));
      time.dateTime = review.createdAt;
      title.append(element('strong', review.name), time);
      const message = element('p', review.message);
      message.dir = 'auto';
      article.append(title, message);
      return article;
    });
    reviewFeed.replaceChildren(...(entries.length ? entries : [element('p', 'No comments yet. Leave the first one!')]));
  } catch {
    reviewCount.textContent = '';
    const note = element('p', 'Comments couldn’t load. ');
    const retry = element('button', 'Try again', 'retry-button');
    retry.type = 'button';
    retry.addEventListener('click', () => { retry.disabled = true; loadReviews(); });
    note.append(retry);
    reviewFeed.replaceChildren(note);
  }
}

const reviewForm = find('#review-form');
const reviewToggle = find('#review-toggle');
reviewToggle.addEventListener('click', () => {
  const open = reviewForm.hidden;
  reviewForm.hidden = !open;
  reviewToggle.setAttribute('aria-expanded', String(open));
  reviewToggle.textContent = open ? 'Close' : 'Add a comment';
  if (open) find('#review-message').focus();
});

function connectForm(form, endpoint, successMessage) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = form.querySelector('button');
    const status = form.querySelector('.form-status');
    const submission = Object.fromEntries(new FormData(form));
    button.disabled = true;
    delete status.dataset.error;
    status.textContent = 'Sending…';
    try {
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(submission) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      form.reset();
      status.textContent = successMessage;
    } catch (error) {
      status.dataset.error = 'true';
      status.textContent = error.message && !/JSON|fetch|Unexpected/i.test(error.message) ? error.message : 'Your message couldn’t be sent. Please try again.';
    } finally {
      button.disabled = false;
    }
  });
}

connectForm(find('#review-form'), '/api/reviews', 'Thank you! Your comment was sent and will appear after review.');
connectForm(find('#feedback-form'), '/api/feedback', 'Thank you! Your message was sent privately to the Hukus Bukus team.');
loadReviews();
find('#year').textContent = new Date().getFullYear();
