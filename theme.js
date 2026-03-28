(() => {
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];

  const STORAGE_KEYS = {
    globalTheme: 'netflixpro_theme',
    globalProfile: 'netflixpro_profile',
    profilesData: 'netflixpro_profiles_data'
  };

  const DEFAULT_PROFILE_STATE = {
    myList: [],
    favorites: [],
    recent: [],
    progress: {},
    theme: 'dark'
  };

  const CONTENTS = [
    {
      title: 'Stranger Things',
      description: 'Quando um garoto desaparece, Hawkins mergulha em um mistério cercado por forças sobrenaturais, experimentos secretos e uma garota extraordinária.',
      meta: '4 temporadas • 16 • Ficção científica, Terror',
      image: 'https://image.tmdb.org/t/p/w500/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg',
      tag: '#1 em séries'
    },
    {
      title: 'The Witcher',
      description: 'Geralt de Rívia, um caçador de monstros mutante, enfrenta perigos, política e destinos cruzados em um continente caótico.',
      meta: '3 temporadas • 16 • Fantasia, Ação',
      image: 'https://image.tmdb.org/t/p/w500/zrPpUlehQaBf8YX2NrVrKK8IEpf.jpg',
      tag: '#2 em séries'
    },
    {
      title: 'Dark',
      description: 'O desaparecimento de crianças revela uma rede complexa de segredos, viagens no tempo e relações familiares entrelaçadas.',
      meta: '3 temporadas • 16 • Mistério, Ficção científica',
      image: 'https://image.tmdb.org/t/p/w500/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg',
      tag: '#3 em séries'
    },
    {
      title: 'La Casa de Papel',
      description: 'Um grupo de criminosos executa um assalto meticuloso à Casa da Moeda da Espanha sob o comando do Professor.',
      meta: '5 temporadas • 16 • Crime, Suspense',
      image: 'https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg',
      tag: '#4 em séries'
    },
    {
      title: 'Round 6',
      description: 'Pessoas endividadas entram em jogos mortais com regras simples, mas consequências extremas, em busca de sobrevivência.',
      meta: '2 temporadas • 16 • Drama, Thriller',
      image: 'https://image.tmdb.org/t/p/w500/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg',
      tag: '#5 em séries'
    }
  ];

  const els = {
    introScreen: $('#introScreen'),
    introVideo: $('#introVideo'),
    introLogoBtn: $('#introLogoBtn'),
    introAudio: $('#introAudio'),
    loadingScreen: $('#loadingScreen'),
    profileScreen: $('#profileScreen'),
    homeScreen: $('#homeScreen'),
    detailScreen: $('#detailScreen'),
    profiles: $$('.profile'),
    currentProfile: $('#currentProfile'),
    profileAvatar: $('#profileAvatar'),
    profileBtn: $('#profileBtn'),
    manageProfiles: $('#manageProfiles'),
    modal: $('#profileModal'),
    modalTitle: $('#modalTitle'),
    modalDescription: $('#modalDescription'),
    modalMeta: $('#modalMeta'),
    closeProfileModal: $('#closeProfileModal'),
    modalAddListBtn: $('#modalAddListBtn'),
    watchNowBtn: $('#watchNowBtn'),
    themeToggle: $('#themeToggle'),
    homeProfile: $('#homeProfile'),
    heroPlayBtn: $('#heroPlayBtn'),
    heroInfoBtn: $('#heroInfoBtn'),
    addToListBtn: $('#addToListBtn'),
    homeSearch: $('#homeSearch'),
    searchInput: $('#searchInput'),
    voiceSearch: $('#voiceSearch'),
    toastContainer: $('#toast-container'),
    mobileMenuBtn: $('#mobileMenuBtn'),
    topNav: $('#topNav'),
    rowTrending: $('#rowTrending'),
    rowContinue: $('#rowContinue'),
    rowRecent: $('#rowRecent'),
    rowRecommendations: $('#rowRecommendations'),
    rowMyList: $('#rowMyList'),
    backToHomeBtn: $('#backToHomeBtn'),
    detailImage: $('#detailImage'),
    detailTitle: $('#detailTitle'),
    detailMeta: $('#detailMeta'),
    detailDescription: $('#detailDescription'),
    detailWatchBtn: $('#detailWatchBtn'),
    detailListBtn: $('#detailListBtn'),
    favoritesBtn: $('#favoritesBtn'),
    favoritesCount: $('#favoritesCount'),
    listCount: $('#listCount'),
    topLogo: $('#topLogo')
  };

  const globalState = {
    activeProfile: localStorage.getItem(STORAGE_KEYS.globalProfile) || null,
    theme: localStorage.getItem(STORAGE_KEYS.globalTheme) || 'dark',
    menuOpen: false,
    currentContent: null,
    data: JSON.parse(localStorage.getItem(STORAGE_KEYS.profilesData) || '{}')
  };

  const profileKey = name => `profile:${name || 'convidado'}`;
  const getProfileState = name => {
    const key = profileKey(name);
    if (!globalState.data[key]) globalState.data[key] = structuredClone(DEFAULT_PROFILE_STATE);
    return globalState.data[key];
  };
  const saveProfilesData = () => localStorage.setItem(STORAGE_KEYS.profilesData, JSON.stringify(globalState.data));
  const activeState = () => getProfileState(globalState.activeProfile);

  function setTheme(theme) {
    globalState.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEYS.globalTheme, theme);
    if (els.themeToggle) {
      els.themeToggle.textContent = theme === 'dark' ? '☀' : '🌙';
      els.themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro');
    }
  }

  function showToast(icon, message, color = '#e50914') {
    if (!els.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.borderLeft = `4px solid ${color}`;
    toast.innerHTML = `<div>${icon}</div><div>${message}</div>`;
    els.toastContainer.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 280);
    }, 2200);
  }

  function activateScreen(screen) {
    [els.profileScreen, els.homeScreen, els.detailScreen].forEach(el => el?.classList.remove('active-screen'));
    screen?.classList.add('active-screen');
  }

  function openModal(title, description, meta = '') {
    if (!els.modal) return;
    els.modalTitle.textContent = title;
    els.modalDescription.textContent = description;
    els.modalMeta.textContent = meta;
    if (!els.modal.open) els.modal.showModal();
  }

  function updateCounters() {
    const st = activeState();
    if (els.listCount) els.listCount.textContent = st.myList.length;
    if (els.favoritesCount) els.favoritesCount.textContent = st.favorites.length;
  }

  function persistActiveState() {
    const name = globalState.activeProfile || 'convidado';
    globalState.data[profileKey(name)] = activeState();
    saveProfilesData();
    updateCounters();
  }

  function isFavorite(title) {
    return activeState().favorites.some(item => item.title === title);
  }

  function toggleFavorite(content = globalState.currentContent) {
    if (!content) return;
    const st = activeState();
    const index = st.favorites.findIndex(item => item.title === content.title);
    if (index >= 0) {
      st.favorites.splice(index, 1);
      showToast('♡', `${content.title} removido dos favoritos`);
    } else {
      st.favorites.push(content);
      showToast('♥', `${content.title} adicionado aos favoritos`);
    }
    persistActiveState();
    renderAllLists();
  }

  function saveRecent(content) {
    if (!content) return;
    const st = activeState();
    st.recent = [content, ...st.recent.filter(i => i.title !== content.title)].slice(0, 10);
    persistActiveState();
    renderAllLists();
  }

  function saveProgress(title, percent) {
    const st = activeState();
    st.progress[title] = percent;
    persistActiveState();
  }

  function createCard(item, mode = '') {
    const card = document.createElement('div');
    card.className = 'movie-card reveal-card';
    card.style.backgroundImage = `url('${item.image}')`;
    card.dataset.title = item.title;
    card.dataset.description = item.description;
    card.dataset.meta = item.meta;
    card.dataset.image = item.image;
    card.dataset.tag = mode === 'recommendation' ? 'Recomendado' : (mode === 'recent' ? 'Recente' : item.tag || '');

    if (isFavorite(item.title)) card.classList.add('is-favorite');

    const progress = activeState().progress[item.title];
    if (progress) {
      card.classList.add('progress');
      const bar = document.createElement('div');
      bar.className = 'progress-bar';
      bar.style.width = `${progress}%`;
      card.appendChild(bar);
    }

    card.addEventListener('click', () => {
      globalState.currentContent = item;
      openModal(item.title, item.description, item.meta);
      saveRecent(item);
    });

    return card;
  }

  function renderAllLists() {
    updateCounters();
    if (els.rowTrending) {
      els.rowTrending.innerHTML = '';
      CONTENTS.forEach(item => els.rowTrending.appendChild(createCard(item, 'trending')));
    }
    if (els.rowContinue) {
      els.rowContinue.innerHTML = '';
      const st = activeState();
      CONTENTS.slice(0, 3).forEach(item => {
        const progressItem = { ...item, meta: `${st.progress[item.title] || 0}% assistido • ${item.meta}` };
        els.rowContinue.appendChild(createCard(progressItem, 'continue'));
      });
    }
    if (els.rowMyList) {
      const st = activeState();
      els.rowMyList.innerHTML = '';
      if (!st.myList.length) {
        const empty = document.createElement('div');
        empty.className = 'movie-card empty-state';
        empty.dataset.empty = 'true';
        els.rowMyList.appendChild(empty);
      } else {
        st.myList.forEach(item => els.rowMyList.appendChild(createCard(item, 'mylist')));
      }
    }
    if (els.rowRecent) {
      const st = activeState();
      els.rowRecent.innerHTML = '';
      st.recent.slice(0, 8).forEach(item => els.rowRecent.appendChild(createCard(item, 'recent')));
    }
    if (els.rowRecommendations) {
      els.rowRecommendations.innerHTML = '';
      const st = activeState();
      const source = [...st.favorites, ...st.myList, ...st.recent];
      const unique = [];
      source.forEach(item => {
        if (!unique.some(u => u.title === item.title)) unique.push(item);
      });
      const list = unique.length ? unique : CONTENTS;
      list.slice(0, 8).forEach(item => {
        const card = createCard(item, 'recommendation');
        const chip = document.createElement('span');
        chip.className = 'recommend-chip';
        chip.textContent = 'Recomendado';
        card.appendChild(chip);
        els.rowRecommendations.appendChild(card);
      });
    }
  }

  function setCurrentContent(content) {
    globalState.currentContent = content;
    if (els.detailTitle) els.detailTitle.textContent = content.title;
    if (els.detailMeta) els.detailMeta.textContent = content.meta;
    if (els.detailDescription) els.detailDescription.textContent = content.description;
    if (els.detailImage) {
      els.detailImage.src = content.image;
      els.detailImage.alt = content.title;
    }
    if (els.detailListBtn) els.detailListBtn.textContent = isFavorite(content.title) ? '♥ Favorito' : '＋ Minha lista';
  }

  function openDetail(content) {
    setCurrentContent(content);
    activateScreen(els.detailScreen);
    els.detailScreen?.classList.add('active-detail');
    if (els.detailScreen) els.detailScreen.setAttribute('aria-hidden', 'false');
    saveRecent(content);
  }

  function closeDetail() {
    els.detailScreen?.classList.remove('active-detail');
    if (els.detailScreen) els.detailScreen.setAttribute('aria-hidden', 'true');
    activateScreen(els.homeScreen);
  }

  async function playIntroAudio() {
    const audio = els.introAudio;
    if (!audio) return true;
    try {
      audio.currentTime = 0;
      audio.volume = 0.85;
      await audio.play();
      return true;
    } catch {
      return false;
    }
  }

  async function startIntro() {
    setTimeout(() => els.introScreen?.classList.add('is-hidden'), 2200);
    setTimeout(() => {
      els.loadingScreen?.classList.add('is-hidden');
      activateScreen(globalState.activeProfile ? els.homeScreen : els.profileScreen);
    }, 2550);
  }

  function selectProfile(profile, notify = true) {
    const name = profile.dataset.profile || 'convidado';
    const label = name.charAt(0).toUpperCase() + name.slice(1);
    const img = $('img', profile);
    globalState.activeProfile = name;
    localStorage.setItem(STORAGE_KEYS.globalProfile, name);
    if (els.currentProfile) els.currentProfile.textContent = label;
    if (img && els.profileAvatar) els.profileAvatar.src = img.src;
    if (els.topLogo && img) els.topLogo.innerHTML = `<img src="${img.src}" alt="${label}" style="width:40px;height:40px;border-radius:50%;object-fit:cover">`;
    const st = activeState();
    if (st.theme) setTheme(st.theme);
    if (notify) showToast('🎬', `Bem-vindo, ${label}!`);
    renderAllLists();
    activateScreen(els.homeScreen);
  }

  function simulateWatchProgress() {
    if (!globalState.currentContent) return;
    const st = activeState();
    const current = st.progress[globalState.currentContent.title] || 0;
    const next = Math.min(current + 15, 100);
    saveProgress(globalState.currentContent.title, next);
    persistActiveState();
    renderAllLists();
    showToast('▶', `${globalState.currentContent.title}: ${next}% assistido`);
  }

  function getContentByTitle(title) {
    return CONTENTS.find(item => item.title === title) ||
      activeState().myList.find(item => item.title === title) ||
      activeState().favorites.find(item => item.title === title) ||
      activeState().recent.find(item => item.title === title) ||
      globalState.currentContent;
  }

  function bootSequence() {
    activateScreen(null);
    setTheme(globalState.theme);
    if (globalState.activeProfile) {
      const profile = els.profiles.find(p => p.dataset.profile === globalState.activeProfile);
      if (profile) selectProfile(profile, false);
    }
    renderAllLists();
    startIntro();
  }

  function setupProfiles() {
    els.profiles.forEach(profile => profile.addEventListener('click', e => {
      e.preventDefault();
      selectProfile(profile, true);
    }));
  }

  function setupModal() {
    els.manageProfiles?.addEventListener('click', () => {
      openModal('Gerenciar Perfis', 'Cada perfil mantém suas preferências separadas neste projeto. Assim, tema, lista, recentes e favoritos ficam únicos por usuário.', 'Perfis independentes');
    });

    els.heroInfoBtn?.addEventListener('click', () => {
      const content = getContentByTitle('Stranger Things');
      globalState.currentContent = content;
      openModal(content.title, content.description, content.meta);
    });

    els.closeProfileModal?.addEventListener('click', () => els.modal?.close());
    els.modalAddListBtn?.addEventListener('click', () => {
      toggleFavorite();
      if (globalState.currentContent) {
        const st = activeState();
        const i = st.myList.findIndex(item => item.title === globalState.currentContent.title);
        if (i >= 0) st.myList.splice(i, 1);
        else st.myList.push(globalState.currentContent);
        persistActiveState();
        renderAllLists();
      }
    });

    els.watchNowBtn?.addEventListener('click', simulateWatchProgress);
    els.modal?.addEventListener('click', e => { if (e.target === els.modal) els.modal.close(); });
  }

  function setupTheme() {
    els.themeToggle?.addEventListener('click', () => {
      const st = activeState();
      const nextTheme = st.theme === 'dark' ? 'light' : 'dark';
      st.theme = nextTheme;
      persistActiveState();
      setTheme(nextTheme);
      showToast('🌓', nextTheme === 'dark' ? 'Tema escuro ativado' : 'Tema claro ativado');
    });
  }

  function setupSearch() {
    els.homeSearch?.addEventListener('input', e => {
      const term = e.target.value.toLowerCase().trim();
      $$('.movie-card').forEach(card => {
        if (card.dataset.empty === 'true') return;
        const title = (card.dataset.title || '').toLowerCase();
        card.style.display = title.includes(term) ? '' : 'none';
      });
    });

    els.searchInput?.addEventListener('input', e => {
      const term = e.target.value.toLowerCase().trim();
      els.profiles.forEach(profile => {
        const name = (profile.dataset.profile || '').toLowerCase();
        profile.style.display = name.includes(term) ? '' : 'none';
      });
    });
  }

  function setupVoice() {
    if (!els.voiceSearch) return;
    if (!('webkitSpeechRecognition' in window)) {
      els.voiceSearch.style.display = 'none';
      return;
    }

    els.voiceSearch.addEventListener('click', () => {
      const recognition = new webkitSpeechRecognition();
      recognition.lang = 'pt-BR';
      recognition.start();

      recognition.onresult = event => {
        const spoken = event.results[0][0].transcript;
        els.searchInput.value = spoken;
        els.searchInput.dispatchEvent(new Event('input'));
        showToast('🎤', `Buscando: ${spoken}`);
      };

      recognition.onerror = () => showToast('❌', 'Microfone não disponível');
    });
  }

  function closeMenu() {
    globalState.menuOpen = false;
    els.topNav?.classList.remove('open');
    els.mobileMenuBtn?.setAttribute('aria-expanded', 'false');
    if (els.mobileMenuBtn) els.mobileMenuBtn.textContent = '☰';
  }

  function openMenu() {
    globalState.menuOpen = true;
    els.topNav?.classList.add('open');
    els.mobileMenuBtn?.setAttribute('aria-expanded', 'true');
    if (els.mobileMenuBtn) els.mobileMenuBtn.textContent = '✕';
  }

  function setupMenu() {
    els.mobileMenuBtn?.addEventListener('click', () => {
      globalState.menuOpen ? closeMenu() : openMenu();
    });

    $$('.top-nav-link').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        $$('.top-nav-link').forEach(item => item.classList.remove('active'));
        link.classList.add('active');
        showToast('📺', `Seção: ${link.textContent}`);
        if (window.innerWidth <= 980) closeMenu();
      });
    });

    document.addEventListener('click', e => {
      if (!els.topNav || !els.mobileMenuBtn) return;
      if (window.innerWidth > 980) return;
      if (els.topNav.contains(e.target) || els.mobileMenuBtn.contains(e.target)) return;
      closeMenu();
    });
  }

  function setupActions() {
    els.heroPlayBtn?.addEventListener('click', () => showToast('▶', 'Iniciando reprodução...'));
    els.addToListBtn?.addEventListener('click', () => {
      const content = getContentByTitle('Stranger Things');
      globalState.currentContent = content;
      const st = activeState();
      if (!st.myList.some(item => item.title === content.title)) st.myList.push(content);
      toggleFavorite(content);
      persistActiveState();
      renderAllLists();
    });

    els.homeProfile?.addEventListener('click', () => {
      activateScreen(els.profileScreen);
      showToast('👥', 'Escolha outro perfil');
    });

    els.profileBtn?.addEventListener('click', () => {
      activateScreen(els.profileScreen);
      showToast('👤', 'Gerencie ou troque seu perfil');
    });

    els.backToHomeBtn?.addEventListener('click', closeDetail);
    els.detailWatchBtn?.addEventListener('click', simulateWatchProgress);

    els.detailListBtn?.addEventListener('click', () => {
      toggleFavorite();
      if (globalState.currentContent) {
        const st = activeState();
        const i = st.myList.findIndex(item => item.title === globalState.currentContent.title);
        if (i >= 0) st.myList.splice(i, 1);
        else st.myList.push(globalState.currentContent);
        persistActiveState();
        renderAllLists();
      }
    });

    els.favoritesBtn?.addEventListener('click', () => {
      const st = activeState();
      if (!st.favorites.length) {
        showToast('♡', 'Você ainda não favoritou nada');
        return;
      }
      openDetail(st.favorites[0]);
    });

    $$('.row-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.target);
        if (!target) return;
        const direction = btn.textContent === '‹' ? -1 : 1;
        target.scrollBy({ left: direction * 320, behavior: 'smooth' });
      });
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && els.modal?.open) els.modal.close();
      if (e.key === 'Escape' && els.detailScreen?.classList.contains('active-detail')) closeDetail();
      if (e.key === '/' && els.homeScreen?.classList.contains('active-screen')) {
        e.preventDefault();
        els.homeSearch?.focus();
      }
      if (e.key.toLowerCase() === 'f' && globalState.currentContent) toggleFavorite();
    });

    els.introLogoBtn?.addEventListener('click', async () => {
      await playIntroAudio();
      setTimeout(() => els.introScreen?.classList.add('is-hidden'), 2200);
      setTimeout(() => {
        els.loadingScreen?.classList.add('is-hidden');
        activateScreen(globalState.activeProfile ? els.homeScreen : els.profileScreen);
      }, 2550);
    });
  }

  function init() {
    bootSequence();
    setupProfiles();
    setupModal();
    setupTheme();
    setupSearch();
    setupVoice();
    setupMenu();
    setupActions();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();