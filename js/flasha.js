(function(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports)
    module.exports = api;
  else
    root.Flasha = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  'use strict';
  const icons = {
    success: '<path d="M20 6 9 17l-5-5"/>',
    error: '<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6m0-6-6 6"/>',
    warning: '<path d="m12 3 10 18H2L12 3Z"/><path d="M12 9v5m0 3h.01"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10h.01"/>',
    social: '<circle cx="12" cy="8" r="3"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/>'
  };
  const types = ['success', 'error', 'warning', 'info', 'social'];
  const defaults = {
    duration: 5000,
    progress: true,
    pauseOnHover: true,
    closeOnClick: false,
    theme: 'default',
    animation: 'slide',
    animationOut: 'fade',
    animationDuration: 250,
    animateIcon: true,
    iconAnimationDuration: 700,
    position: 'top-right',
    maxVisible: 4
  };
  let settings = { ...defaults
  };
  const active = new Set();
  const hosts = new Map();
  const slots = new Map();
  const queues = new Map();
  const positions = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'];
  let clearing = false;

  function normalize(args) {
    let [a, b, c] = args;
    let data;
    if (typeof a === 'string' && types.includes(a) && typeof b === 'string')
      data = {
        type: a,
        message: b,
        ...(c || {})
      };
    else if (typeof a === 'string')
      data = {
        message: a,
        ...(b && typeof b === 'object' ? b : {})
      };
    else if (a && typeof a === 'object')
      data = { ...a
      };
    else
      throw new TypeError('Flasha.show: invalid arguments');
    return { ...settings,
      type: 'info',
      ...data
    };
  }

  function display(...args) {
    if (typeof document === 'undefined')
      throw new Error('Flasha requires a browser');
    const o = normalize(args);
    if (o.modal && !['success', 'error'].includes(o.type))
      throw new TypeError('modal is only supported for success and error');
    if (!types.includes(o.type))
      throw new TypeError('Unknown notification type');
    if (!['default', 'light', 'dark'].includes(o.theme))
      throw new TypeError('theme must be default, light or dark');
    const animations = ['slide', 'fade', 'scale', 'bounce', 'none'];
    if (!animations.includes(o.animation) || !animations.includes(o.animationOut))
      throw new TypeError('Unknown animation');
    const animationDuration = Number(o.animationDuration);
    if (!Number.isFinite(animationDuration) || animationDuration < 0 || animationDuration > 10000)
      throw new TypeError('animationDuration must be between 0 and 10000');
    const iconAnimationDuration = Number(o.iconAnimationDuration);
    if (!Number.isFinite(iconAnimationDuration) || iconAnimationDuration < 100 || iconAnimationDuration > 5000)
      throw new TypeError('iconAnimationDuration must be between 100 and 5000');
    const duration = Number(o.duration);
    if (!Number.isFinite(duration) || duration < 0)
      throw new TypeError('duration must be >= 0');
    if (!o.modal && !hosts.has(o.position)) {
      const stack = document.createElement('div');
      stack.className = 'flasha-stack flasha-stack-' + o.position;
      document.body.appendChild(stack);
      hosts.set(o.position, stack);
    }
    const el = document.createElement('div');
    el.className = 'flasha-toast flasha-' + o.type + ' flasha-theme-' + o.theme + ' flasha-enter-' + o.animation;
    el.style.setProperty('--flasha-animation-duration', animationDuration + 'ms');
    el.style.setProperty('--flasha-icon-duration', iconAnimationDuration + 'ms');
    el.setAttribute('role', o.type === 'error' ? 'alert' : 'status');
    if (o.type === 'social' && typeof o.category === 'string' && o.category.trim())
      el.dataset.category = o.category.trim();
    const symbol = document.createElement('span');
    symbol.className = 'flasha-icon';
    symbol.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + icons[o.type] + '</svg>';
    if (o.type === 'social' && typeof o.avatar === 'string' && o.avatar.trim()) {
      const avatar = document.createElement('img');
      avatar.className = 'flasha-avatar';
      avatar.alt = '';
      avatar.loading = 'eager';
      avatar.referrerPolicy = 'no-referrer';
      avatar.addEventListener('load', () => {
        symbol.classList.add('flasha-has-avatar');
      });
      avatar.addEventListener('error', () => {
        avatar.remove();
        symbol.classList.remove('flasha-has-avatar');
      });
      avatar.src = o.avatar.trim();
      symbol.appendChild(avatar);
    }
    if (o.animateIcon !== false)
      symbol.classList.add('flasha-icon-animated');
    el.appendChild(symbol);
    const content = document.createElement('div');
    content.className = 'flasha-content';
    if (o.title) {
      const title = document.createElement('strong');
      title.textContent = String(o.title);
      content.appendChild(title);
    }
    const message = document.createElement('span');
    message.textContent = String(o.message ?? '');
    content.appendChild(message);
    if (o.type === 'social' && Array.isArray(o.actions) && o.actions.length) {
      const actions = document.createElement('div');
      actions.className = 'flasha-actions';
      for (const action of o.actions.slice(0, 2)) {
        if (!action || typeof action.label !== 'string' || !action.label.trim())
          continue;
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'flasha-action' + (action.variant === 'secondary' ? ' flasha-action-secondary' : '');
        button.textContent = action.label;
        button.addEventListener('click', event => {
          event.stopPropagation();
          if (typeof action.onClick === 'function')
            action.onClick({
              event,
              notification: handle,
              category: o.category ?? null
            });
          if (action.closeOnClick !== false)
            close();
        });
        actions.appendChild(button);
      }
      if (actions.childElementCount)
        content.appendChild(actions);
    }
    el.appendChild(content);
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'flasha-close';
    closeBtn.setAttribute('aria-label', 'Fermer');
    closeBtn.textContent = '×';
    el.appendChild(closeBtn);
    let bar;
    if (o.progress && duration > 0) {
      bar = document.createElement('div');
      bar.className = 'flasha-progress';
      el.appendChild(bar);
    }
    let overlay = null;
    if (o.modal) {
      overlay = document.createElement('div');
      overlay.className = 'flasha-modal-overlay';
      overlay.appendChild(el);
      document.body.appendChild(overlay);
      if (o.showConfirmButton === true) {
        const ok = document.createElement('button');
        ok.type = 'button';
        ok.className = 'flasha-modal-confirm';
        ok.textContent = typeof o.confirmText === 'string' && o.confirmText.trim() ? o.confirmText : 'OK';
        ok.addEventListener('click', () => close());
        content.appendChild(ok);
        requestAnimationFrame(() => ok.focus());
      }
      el.setAttribute('aria-modal', 'true');
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-label', String(o.title || (o.type === 'success' ? 'Succès' : 'Erreur')));
      if (o.draggable) {
        el.classList.add('flasha-modal-draggable');
        let drag = null;
        el.addEventListener('pointerdown', e => {
          if (e.button !== 0 || e.target.closest('button'))
            return;
          drag = {
            x: e.clientX,
            y: e.clientY,
            left: parseFloat(el.style.getPropertyValue('--flasha-drag-x')) || 0,
            top: parseFloat(el.style.getPropertyValue('--flasha-drag-y')) || 0
          };
          el.setPointerCapture(e.pointerId);
        });
        el.addEventListener('pointermove', e => {
          if (!drag)
            return;
          el.style.setProperty('--flasha-drag-x', drag.left + e.clientX - drag.x + 'px');
          el.style.setProperty('--flasha-drag-y', drag.top + e.clientY - drag.y + 'px');
        });
        el.addEventListener('pointerup', () => {
          drag = null;
        });
        el.addEventListener('pointercancel', () => {
          drag = null;
        });
      }
      el.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
          e.preventDefault();
          close();
        }
      });
    } else
      hosts.get(o.position).appendChild(el);
    let remaining = duration,
      started = performance.now(),
      timer = null,
      closed = false,
      exitTimer = null;
    const paint = () => {
      if (bar)
        bar.style.transform = 'scaleX(' + Math.max(0, remaining / duration) + ')';
    };

    function pause() {
      if (closed || duration === 0 || timer === null)
        return;
      clearTimeout(timer);
      timer = null;
      remaining = Math.max(0, remaining - (performance.now() - started));
      paint();
    }

    function resume() {
      if (closed || duration === 0 || timer !== null)
        return;
      started = performance.now();
      timer = setTimeout(close, remaining);
      if (bar) {
        bar.style.transition = 'none';
        paint();
        bar.getBoundingClientRect();
        bar.style.transition = 'transform ' + remaining + 'ms linear';
        bar.style.transform = 'scaleX(0)';
      }
    }

    function close() {
      if (closed)
        return;
      closed = true;
      clearTimeout(timer);
      active.delete(handle);
      if (typeof o.__onClose === 'function')
        o.__onClose();
      const remove = () => {
        if (overlay) {
          overlay.remove();
        } else {
          el.remove();
          const stack = hosts.get(o.position);
          if (stack && !stack.childElementCount) {
            stack.remove();
            hosts.delete(o.position);
          }
        }
      };
      if (o.animationOut === 'none' || animationDuration === 0 || window.matchMedia ?.('(prefers-reduced-motion: reduce)').matches) {
        remove();
        return;
      }
      el.classList.remove('flasha-enter-' + o.animation);
      el.classList.add('flasha-exit-' + o.animationOut);
      exitTimer = setTimeout(remove, animationDuration);
    }
    const handle = {
      element: el,
      close,
      pause,
      resume
    };
    active.add(handle);
    closeBtn.addEventListener('click', event => {
      event.stopPropagation();
      close();
    });
    if (o.closeOnClick && !o.modal) {
      el.classList.add('flasha-clickable');
      el.tabIndex = 0;
      el.setAttribute('aria-label', 'Fermer la notification');
      el.addEventListener('click', event => {
        if (event.target.closest('button'))
          return;
        close();
      });
      el.addEventListener('keydown', event => {
        if (event.target !== el)
          return;
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          close();
        }
      });
    }
    if (o.pauseOnHover) {
      el.addEventListener('mouseenter', pause);
      el.addEventListener('mouseleave', resume);
    }
    if (duration > 0)
      resume();
    return handle;
  }

  function validateQueueOptions(o) {
    if (!positions.includes(o.position))
      throw new TypeError('position must be one of: ' + positions.join(', '));
    if (!Number.isInteger(Number(o.maxVisible)) || Number(o.maxVisible) < 1 || Number(o.maxVisible) > 100)
      throw new TypeError('maxVisible must be an integer between 1 and 100');
  }

  function drain(position) {
    if (clearing)
      return;
    const q = queues.get(position);
    if (!q)
      return;
    while (q.length) {
      const next = q[0];
      const count = slots.get(position) || 0;
      if (count >= next.limit)
        break;
      q.shift();
      if (next.cancelled)
        continue;
      mount(next);
    }
    if (!q.length)
      queues.delete(position);
  }

  function mount(entry) {
    const position = entry.options.position;
    slots.set(position, (slots.get(position) || 0) + 1);
    let inner;
    try {
      inner = display({ ...entry.options,
        __onClose: () => {
          if (entry.released)
            return;
          entry.released = true;
          slots.set(position, Math.max(0, (slots.get(position) || 1) - 1));
          drain(position);
        }
      });
    } catch (error) {
      slots.set(position, Math.max(0, (slots.get(position) || 1) - 1));
      drain(position);
      throw error;
    }
    entry.inner = inner;
    entry.handle.element = inner.element;
    entry.handle.close = () => inner.close();
    entry.handle.pause = () => inner.pause();
    entry.handle.resume = () => inner.resume();
  }

  function show(...args) {
    const o = normalize(args);
    validateQueueOptions(o);
    if (o.modal)
      return display(o);
    const entry = {
      options: o,
      limit: Number(o.maxVisible),
      cancelled: false,
      inner: null,
      handle: null
    };
    const handle = {
      element: null,
      close() {
        if (entry.inner) {
          entry.inner.close();
          return;
        }
        entry.cancelled = true;
        const q = queues.get(o.position);
        if (q) {
          const i = q.indexOf(entry);
          if (i !== -1)
            q.splice(i, 1);
          drain(o.position);
        }
      },
      pause() {
        entry.inner ?.pause();
      },
      resume() {
        entry.inner ?.resume();
      }
    };
    entry.handle = handle;
    const q = queues.get(o.position) || [];
    queues.set(o.position, q);
    q.push(entry);
    drain(o.position);
    return handle;
  }
  const api = {
    show,
    configure(options = {}) {
      if (!options || typeof options !== 'object')
        throw new TypeError('Expected options object');
      const next = { ...settings,
        ...options
      };
      validateQueueOptions(next);
      settings = next;
      return api;
    },
    clear() {
      clearing = true;
      for (const q of queues.values())
        for (const entry of q)
          entry.cancelled = true;
      queues.clear();
      for (const item of [...active])
        item.close();
      slots.clear();
      clearing = false;
    }
  };
  for (const type of types)
    api[type] = (message, options = {}) => api.show(typeof message === 'object' && message !== null ? { ...message,
      type
    } : { ...options,
      type,
      message
    });
  return api;
});
