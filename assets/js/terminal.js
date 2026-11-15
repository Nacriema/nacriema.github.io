/* ==========================================================================
   Interactive terminal ("nacriema@space")
   Open: click the header prompt, press ` (backtick) or Ctrl/Cmd+K.
   Close: Esc, click outside, or type `exit`.
   It is an extra layer on top of the normal links/menu, which stay as-is.
   All output is built with textContent / DOM nodes (never innerHTML).
   ========================================================================== */
(function () {
  'use strict';

  var dataEl = document.getElementById('term-data');
  if (!dataEl) return;

  var DATA;
  try {
    DATA = JSON.parse(dataEl.textContent);
  } catch (e) {
    return;
  }

  var BASE = DATA.baseurl || '';
  var USER = DATA.user || 'guest';
  var HOST = 'space';
  var HISTORY_KEY = 'nacriema-term-history';

  /* Virtual filesystem: directory name -> page URL */
  var DIRS = {
    posts: BASE + '/posts/',
    tags: BASE + '/tags/',
    series: BASE + '/series/',
    about: BASE + '/about/',
    projects: null, /* listing only */
    leverage: BASE + '/leverage/'
  };

  var TAGS = {};
  DATA.posts.forEach(function (p) {
    p.tags.forEach(function (t) {
      (TAGS[t] = TAGS[t] || []).push(p);
    });
  });

  /* ---------- helpers ---------------------------------------------------- */

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function link(text, href, cls, external) {
    var a = el('a', cls || 'tt-link', text);
    a.href = href;
    if (external) {
      a.target = '_blank';
      a.rel = 'noopener';
    }
    return a;
  }

  function cwd() {
    var path = window.location.pathname.replace(BASE, '');
    var seg = path.split('/').filter(Boolean)[0];
    if (!seg || seg === 'index.html') return '~';
    if (seg === '404.html') return '~/void';
    return '~/' + seg;
  }

  function stripMd(name) {
    return String(name || '').replace(/\/+$/, '').replace(/\.md$/i, '');
  }

  function findPost(arg) {
    var slug = stripMd(arg).toLowerCase();
    for (var i = 0; i < DATA.posts.length; i++) {
      if (DATA.posts[i].slug === slug) return DATA.posts[i];
    }
    return null;
  }

  function findProject(arg) {
    var slug = stripMd(arg).toLowerCase();
    for (var i = 0; i < DATA.projects.length; i++) {
      if (DATA.projects[i].slug === slug) return DATA.projects[i];
    }
    return null;
  }

  function loadHistory() {
    try {
      return JSON.parse(sessionStorage.getItem(HISTORY_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveHistory(h) {
    try {
      sessionStorage.setItem(HISTORY_KEY, JSON.stringify(h.slice(-50)));
    } catch (e) { /* private mode etc. - history just won't persist */ }
  }

  /* ---------- DOM -------------------------------------------------------- */

  var root = el('div', 'tt-root');
  root.hidden = true;

  var backdrop = el('div', 'tt-backdrop');
  var win = el('div', 'tt-window');
  win.setAttribute('role', 'dialog');
  win.setAttribute('aria-modal', 'true');
  win.setAttribute('aria-label', 'Interactive terminal');

  var bar = el('div', 'tt-bar');
  bar.appendChild(el('span', 'tt-dots'));
  bar.appendChild(el('span', 'tt-title', USER + '@' + HOST + ': ' + cwd()));
  var closeBtn = el('button', 'tt-close', '×');
  closeBtn.type = 'button';
  closeBtn.setAttribute('aria-label', 'Close terminal');
  bar.appendChild(closeBtn);

  var body = el('div', 'tt-body');
  var out = el('div', 'tt-out');
  out.setAttribute('role', 'log');
  out.setAttribute('aria-live', 'polite');

  var form = el('form', 'tt-form');
  form.setAttribute('autocomplete', 'off');
  var ps1 = el('label', 'tt-ps1');
  var input = el('input', 'tt-input');
  input.id = 'tt-input';
  input.type = 'text';
  input.spellcheck = false;
  input.setAttribute('autocapitalize', 'off');
  input.setAttribute('autocorrect', 'off');
  input.setAttribute('aria-label', 'Terminal command');
  ps1.htmlFor = 'tt-input';

  form.appendChild(ps1);
  form.appendChild(input);
  body.appendChild(out);
  body.appendChild(form);
  win.appendChild(bar);
  win.appendChild(body);
  root.appendChild(backdrop);
  root.appendChild(win);
  document.body.appendChild(root);

  function renderPrompt(target) {
    target.textContent = '';
    target.appendChild(el('span', 'tt-user', USER));
    target.appendChild(el('span', 'tt-muted', '@'));
    target.appendChild(el('span', 'tt-host', HOST));
    target.appendChild(el('span', 'tt-muted', ':'));
    target.appendChild(el('span', 'tt-path', cwd()));
    target.appendChild(el('span', 'tt-sign', '$'));
  }
  renderPrompt(ps1);

  /* ---------- output ----------------------------------------------------- */

  function line(content, cls) {
    var row = el('div', 'tt-line' + (cls ? ' ' + cls : ''));
    if (content == null) {
      row.appendChild(document.createTextNode(' '));
    } else if (typeof content === 'string') {
      row.textContent = content;
    } else {
      [].concat(content).forEach(function (part) {
        row.appendChild(typeof part === 'string' ? document.createTextNode(part) : part);
      });
    }
    out.appendChild(row);
    body.scrollTop = body.scrollHeight;
    return row;
  }

  function echoCommand(cmd) {
    var row = el('div', 'tt-line tt-echo');
    var p = el('span', 'tt-ps1');
    renderPrompt(p);
    row.appendChild(p);
    row.appendChild(document.createTextNode(' ' + cmd));
    out.appendChild(row);
  }

  function err(text) {
    line(text, 'tt-err');
  }

  function navigate(url, label) {
    line([el('span', 'tt-muted', '→ '), label || url]);
    setTimeout(function () { window.location.href = url; }, 180);
  }

  /* ---------- commands --------------------------------------------------- */

  var COMMANDS = {};
  var HELP = [
    ['help', 'show this help'],
    ['ls [dir]', 'list: posts, tags, tags/<tag>, series, projects'],
    ['cd <dir>', 'go to a page: ~, posts, tags, series, about, leverage'],
    ['cat <post>.md', 'open a post (Tab completes names)'],
    ['open <project>', 'open a project'],
    ['grep <words>', 'search posts by title or tag'],
    ['./leverage-calc', 'launch the leverage calculator'],
    ['whoami | neofetch', 'about me'],
    ['pwd | date | echo', 'the usual'],
    ['history | clear', 'shell history / clear screen (Ctrl+L)'],
    ['exit', 'close the terminal (Esc)']
  ];

  COMMANDS.help = function () {
    line('Available commands:', 'tt-strong');
    HELP.forEach(function (h) {
      line([el('span', 'tt-cmdname', h[0]), el('span', 'tt-muted', h[1])], 'tt-help');
    });
    line([el('span', 'tt-muted', 'Tip: '), 'Tab to autocomplete, ↑/↓ for history.']);
  };

  function listPosts(posts) {
    posts.forEach(function (p) {
      line([el('span', 'tt-muted', p.date + '  '), link(p.slug + '.md', p.url, 'tt-link tt-file')]);
    });
  }

  COMMANDS.ls = function (args) {
    var target = stripMd(args[0] || '').replace(/^~\/?/, '').replace(/^\.\//, '');
    if (!target) {
      var row = [];
      Object.keys(DIRS).forEach(function (d) {
        row.push(DIRS[d] ? link(d + '/', DIRS[d], 'tt-link tt-dir') : el('span', 'tt-dir', d + '/'));
        row.push('  ');
      });
      row.push(el('span', 'tt-exec', 'leverage-calc*'));
      line(row);
      return;
    }
    if (target === 'posts') return listPosts(DATA.posts);
    if (target === 'projects') {
      DATA.projects.forEach(function (p) {
        line(link(p.slug + '/', p.url, 'tt-link tt-dir', p.external));
      });
      return;
    }
    if (target === 'tags' || target === 'series') {
      Object.keys(TAGS).sort().forEach(function (t) {
        line([link(t + '/', DIRS.tags + '#' + t, 'tt-link tt-dir'), el('span', 'tt-muted', '  ' + TAGS[t].length + ' post(s)')]);
      });
      return;
    }
    var m = target.match(/^tags\/(.+)$/);
    if (m) {
      if (TAGS[m[1]]) return listPosts(TAGS[m[1]]);
      return err('ls: cannot access \'' + args[0] + '\': No such tag');
    }
    var pm = target.match(/^projects\/(.+)$/);
    if (pm) {
      var proj = findProject(pm[1]);
      if (proj) return line(link(proj.slug + '/', proj.url, 'tt-link tt-dir', proj.external));
      return err('ls: cannot access \'' + args[0] + '\': No such project');
    }
    var fm = target.match(/^posts\/(.+)$/);
    if (fm) target = fm[1];
    if (findPost(target)) return listPosts([findPost(target)]);
    err('ls: cannot access \'' + args[0] + '\': No such file or directory');
  };

  COMMANDS.cd = function (args) {
    var target = (args[0] || '~').replace(/\/+$/, '');
    if (target === '' || target === '~' || target === '/' || target === '..' || target === '~/') {
      return navigate(BASE + '/', 'cd ~');
    }
    target = target.replace(/^~\//, '').replace(/^\.\//, '');
    var m = target.match(/^tags\/(.+)$/);
    if (m && TAGS[m[1]]) return navigate(DIRS.tags + '#' + m[1]);
    var pm = target.match(/^projects\/(.+)$/);
    if (pm && findProject(pm[1])) return openProject(findProject(pm[1]));
    if (DIRS[target]) return navigate(DIRS[target]);
    if (target === 'projects') return COMMANDS.ls(['projects']);
    if (findPost(target)) return err('cd: ' + args[0] + ': Not a directory (try: cat ' + args[0] + ')');
    err('cd: ' + args[0] + ': No such file or directory');
  };

  COMMANDS.cat = function (args) {
    if (!args[0]) return err('cat: missing file operand (try: ls posts)');
    var name = stripMd(args[0]).replace(/^~\/?/, '').replace(/^posts\//, '');
    if (name === 'about' || name === 'readme') return navigate(DIRS.about);
    var post = findPost(name);
    if (post) return navigate(post.url, post.title);
    err('cat: ' + args[0] + ': No such file or directory');
  };
  COMMANDS.less = COMMANDS.more = COMMANDS.vim = COMMANDS.nano = COMMANDS.cat;

  function openProject(proj) {
    if (proj.external) {
      window.open(proj.url, '_blank', 'noopener');
      return line([el('span', 'tt-muted', '→ opened in a new tab: '), link(proj.name, proj.url, null, true)]);
    }
    return navigate(proj.url, proj.name);
  }

  COMMANDS.open = function (args) {
    if (!args[0]) return err('open: missing operand (try: ls projects)');
    var proj = findProject(args[0].replace(/^~\//, '').replace(/^projects\//, ''));
    if (proj) return openProject(proj);
    COMMANDS.cat(args);
  };
  COMMANDS['xdg-open'] = COMMANDS.open;

  COMMANDS.grep = function (args) {
    var q = args.join(' ').replace(/^-\w+\s*/, '').toLowerCase().trim();
    if (!q) return err('usage: grep <words>');
    var hits = DATA.posts.filter(function (p) {
      return (p.title + ' ' + p.slug + ' ' + p.tags.join(' ')).toLowerCase().indexOf(q) !== -1;
    });
    if (!hits.length) return line('(no matches for "' + q + '")', 'tt-muted');
    listPosts(hits);
  };
  COMMANDS.search = COMMANDS.find = COMMANDS.grep;

  COMMANDS['./leverage-calc'] = function () {
    navigate(DIRS.leverage, './leverage-calc');
  };
  COMMANDS['leverage-calc'] = COMMANDS['./leverage-calc'];

  COMMANDS.whoami = function () {
    line(USER + ' — ' + DATA.title);
  };

  COMMANDS.neofetch = function () {
    var rows = [
      ['', USER + '@' + HOST],
      ['', '-----------------'],
      ['Role', DATA.title],
      ['OS', 'nacriema.github.io (Jekyll)'],
      ['Shell', 'nacsh 1.0'],
      ['Posts', String(DATA.posts.length)],
      ['GitHub', 'github.com/' + DATA.github],
      ['LinkedIn', DATA.linkedin ? 'linkedin.com/in/' + DATA.linkedin : '-'],
      ['Email', DATA.email]
    ];
    rows.forEach(function (r, i) {
      if (!r[0]) return line(r[1], i === 0 ? 'tt-strong tt-host' : 'tt-muted');
      line([el('span', 'tt-key', r[0] + ': '), r[1]]);
    });
    var pal = el('div', 'tt-line tt-palette');
    for (var i = 0; i < 8; i++) pal.appendChild(el('span'));
    out.appendChild(pal);
  };

  COMMANDS.pwd = function () {
    line(cwd().replace('~', '/home/' + USER));
  };

  COMMANDS.date = function () {
    line(new Date().toString());
  };

  COMMANDS.echo = function (args) {
    line(args.join(' '));
  };

  COMMANDS.history = function () {
    cmdHistory.forEach(function (h, i) {
      line([el('span', 'tt-muted', String(i + 1).padStart(4, ' ') + '  '), h]);
    });
  };

  COMMANDS.clear = function () {
    out.textContent = '';
  };

  COMMANDS.exit = function () {
    close();
  };
  COMMANDS.logout = COMMANDS.exit;

  COMMANDS.sudo = function () {
    line('visitor is not in the sudoers file. This incident will be reported. 😏', 'tt-err');
  };

  COMMANDS.rm = function (args) {
    var joined = args.join(' ');
    if (!/-\w*r\w*f|-\w*f\w*r/.test(joined) || !/(^|\s)(\/|~|\*)(\s|$)/.test(joined)) {
      return err('rm: refusing to remove that — this universe is read-only');
    }
    var steps = ['removing /universe/galaxies ...', 'removing /universe/stars ...', 'removing /home/' + USER + '/coffee ...'];
    input.disabled = true;
    steps.forEach(function (s, i) {
      setTimeout(function () { line(s, 'tt-err'); }, 280 * (i + 1));
    });
    setTimeout(function () {
      document.body.classList.add('tt-shake');
      setTimeout(function () {
        document.body.classList.remove('tt-shake');
        line('just kidding 🚀 everything is fine.', 'tt-ok');
        input.disabled = false;
        input.focus();
      }, 700);
    }, 280 * (steps.length + 1));
  };

  var NAMES = Object.keys(COMMANDS).filter(function (c) {
    return ['less', 'more', 'vim', 'nano', 'find', 'search', 'xdg-open', 'logout', 'leverage-calc'].indexOf(c) === -1;
  }).sort();

  /* ---------- run / completion / history --------------------------------- */

  var cmdHistory = loadHistory();
  var histIndex = cmdHistory.length;

  function run(raw) {
    var cmd = raw.trim();
    echoCommand(raw);
    if (!cmd) return;
    cmdHistory.push(cmd);
    saveHistory(cmdHistory);
    histIndex = cmdHistory.length;

    var parts = cmd.split(/\s+/);
    var name = parts[0];
    var fn = COMMANDS[name] || COMMANDS[name.toLowerCase()];
    if (!fn) {
      err('nacsh: command not found: ' + name + "  (type 'help')");
      return;
    }
    try {
      fn(parts.slice(1));
    } catch (e) {
      err('nacsh: ' + name + ': something went wrong');
    }
  }

  /* Path-aware completion, like bash: "projects/los" -> "projects/loss-.../" */
  var CHILDREN = {
    projects: function () { return DATA.projects.map(function (p) { return p.slug + '/'; }); },
    tags: function () { return Object.keys(TAGS).map(function (t) { return t + '/'; }); },
    posts: function () { return DATA.posts.map(function (p) { return p.slug + '.md'; }); }
  };

  /* which top-level entries and which sub-directories each command can complete */
  var COMPLETION = {
    cd: { top: ['dirs', '~'], sub: ['projects', 'tags'] },
    ls: { top: ['dirs'], sub: ['projects', 'tags', 'posts'] },
    cat: { top: ['posts', 'postsDir'], sub: ['posts'] },
    open: { top: ['projects', 'posts', 'projectsDir', 'postsDir'], sub: ['projects', 'posts'] }
  };
  COMPLETION.less = COMPLETION.vim = COMPLETION.more = COMPLETION.nano = COMPLETION.cat;
  COMPLETION['xdg-open'] = COMPLETION.open;

  function argCandidates(cmdName, partial) {
    var rule = COMPLETION[cmdName];
    if (!rule) return [];
    var home = /^~\//.test(partial) ? '~/' : '';
    var path = partial.slice(home.length);
    var slash = path.indexOf('/');
    var list = [];

    if (slash === -1) {
      rule.top.forEach(function (kind) {
        if (kind === 'dirs') list = list.concat(Object.keys(DIRS).map(function (d) { return d + '/'; }));
        if (kind === '~' && !home) list.push('~');
        if (kind === 'posts') list = list.concat(CHILDREN.posts());
        if (kind === 'projects') list = list.concat(DATA.projects.map(function (p) { return p.slug; }));
        if (kind === 'postsDir') list.push('posts/');
        if (kind === 'projectsDir') list.push('projects/');
      });
    } else {
      var dir = path.slice(0, slash);
      if (rule.sub.indexOf(dir) !== -1 && CHILDREN[dir]) {
        list = CHILDREN[dir]().map(function (c) { return dir + '/' + c; });
      }
    }
    return list.map(function (c) { return home + c; });
  }

  function commonPrefix(list) {
    if (!list.length) return '';
    var p = list[0];
    list.forEach(function (s) {
      while (s.indexOf(p) !== 0) p = p.slice(0, -1);
    });
    return p;
  }

  function complete() {
    var value = input.value;
    var parts = value.split(/\s+/);
    var isFirst = parts.length === 1;
    var partial = parts[parts.length - 1];
    var pool = isFirst ? NAMES.concat(['./leverage-calc']) : argCandidates(parts[0], partial);
    var matches = pool.filter(function (c) { return c.indexOf(partial) === 0; });
    if (!matches.length) return;
    if (matches.length === 1) {
      parts[parts.length - 1] = matches[0] + (isFirst || !/\/$/.test(matches[0]) ? ' ' : '');
      input.value = parts.join(' ');
      return;
    }
    var prefix = commonPrefix(matches);
    if (prefix.length > partial.length) {
      parts[parts.length - 1] = prefix;
      input.value = parts.join(' ');
    } else {
      echoCommand(value);
      line(matches.join('    '), 'tt-muted');
    }
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = input.value;
    input.value = '';
    run(v);
  });

  /* Tab completion must read the text AFTER any input method (e.g. Vietnamese
     Telex/VNI, EVKey, OpenKey) has finished writing into the field. IMEs
     differ: some commit "composition" text when they see Tab, some delete and
     retype the word. So instead of guessing, Tab waits until the field has
     been quiet for a moment (and no composition is in progress), then
     completes from whatever the final text is. */
  var composing = false;
  var lastInputAt = 0;
  var tabTimer = null;
  var tabDeadline = 0;
  var QUIET_MS = 40;
  var MAX_WAIT_MS = 400;

  input.addEventListener('compositionstart', function () { composing = true; });
  input.addEventListener('compositionend', function () {
    composing = false;
    lastInputAt = Date.now();
  });
  input.addEventListener('input', function () { lastInputAt = Date.now(); });

  function completeWhenSettled() {
    clearTimeout(tabTimer);
    var now = Date.now();
    var settled = !composing && now - lastInputAt >= QUIET_MS;
    if (settled || now >= tabDeadline) {
      tabTimer = null;
      complete();
      return;
    }
    tabTimer = setTimeout(completeWhenSettled, QUIET_MS);
  }

  function requestCompletion() {
    if (tabTimer) return; /* one pending completion at a time */
    tabDeadline = Date.now() + MAX_WAIT_MS;
    /* always give the IME at least one quiet window to act on the Tab */
    lastInputAt = Math.max(lastInputAt, Date.now());
    tabTimer = setTimeout(completeWhenSettled, QUIET_MS);
  }

  input.addEventListener('keydown', function (e) {
    /* Keep the site's global shortcuts (space = menu, 1-6, s...) out of the way */
    e.stopPropagation();

    if (e.key === 'Tab' || (e.keyCode === 229 && e.code === 'Tab')) {
      e.preventDefault();
      requestCompletion();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (histIndex > 0) {
        histIndex--;
        input.value = cmdHistory[histIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIndex < cmdHistory.length - 1) {
        histIndex++;
        input.value = cmdHistory[histIndex];
      } else {
        histIndex = cmdHistory.length;
        input.value = '';
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if ((e.key === 'l' || e.key === 'L') && e.ctrlKey) {
      e.preventDefault();
      COMMANDS.clear();
    } else if ((e.key === 'c' || e.key === 'C') && e.ctrlKey && input.selectionStart === input.selectionEnd) {
      /* Ctrl+C with nothing selected = interrupt (with a selection, normal copy) */
      e.preventDefault();
      echoCommand(input.value + '^C');
      input.value = '';
    }
  });
  input.addEventListener('keyup', function (e) { e.stopPropagation(); });

  /* ---------- open / close ----------------------------------------------- */

  var lastFocus = null;
  var greeted = false;

  function open(initialCommand) {
    if (!root.hidden) {
      input.focus();
      return;
    }
    lastFocus = document.activeElement;
    root.hidden = false;
    document.documentElement.classList.add('tt-open');
    requestAnimationFrame(function () { root.classList.add('tt-visible'); });
    if (!greeted) {
      greeted = true;
      line([el('span', 'tt-strong', 'nacsh 1.0'), el('span', 'tt-muted', ' — interactive shell for ' + USER + '.github.io')]);
      line([el('span', 'tt-muted', "Type "), el('span', 'tt-cmdname', 'help'), el('span', 'tt-muted', " to see what you can do. Esc to close.")]);
      line(null);
    }
    input.focus();
    if (initialCommand) run(initialCommand);
  }

  function close() {
    if (root.hidden) return;
    root.classList.remove('tt-visible');
    document.documentElement.classList.remove('tt-open');
    setTimeout(function () { root.hidden = true; }, 160);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  backdrop.addEventListener('click', close);
  closeBtn.addEventListener('click', close);
  win.addEventListener('click', function (e) {
    if (!e.target.closest('a, button') && window.getSelection().isCollapsed) input.focus();
  });

  /* Keep keyboard focus inside the dialog, and keep the site's global
     shortcuts (space = menu, 1-6...) from firing while it is open */
  win.addEventListener('keydown', function (e) {
    e.stopPropagation();
    if (e.key === 'Escape') {
      close();
      return;
    }
    if (e.key !== 'Tab' || e.target === input) return;
    e.preventDefault();
    input.focus();
  });

  /* Openers: header prompt, any [data-open-terminal] element, keyboard */
  document.querySelectorAll('.header-post .prompt, [data-open-terminal]').forEach(function (opener) {
    if (!opener.matches('button, a')) {
      opener.setAttribute('role', 'button');
      opener.setAttribute('tabindex', '0');
    }
    opener.setAttribute('aria-haspopup', 'dialog');
    opener.setAttribute('title', 'Open terminal ( ` or Ctrl+K )');
    var cmd = opener.getAttribute('data-open-terminal') || '';
    opener.addEventListener('click', function (e) {
      e.preventDefault();
      open(cmd);
    });
    opener.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        open(cmd);
      }
    });
  });

  document.addEventListener('keydown', function (e) {
    var t = e.target;
    var typing = t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
    if (!root.hidden && e.key === 'Escape') {
      close();
      return;
    }
    if (typing) return;
    if (e.key === '`' || ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K'))) {
      e.preventDefault();
      e.stopImmediatePropagation();
      open();
    }
  }, true);
})();
