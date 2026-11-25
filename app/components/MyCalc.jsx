'use client';

import { useEffect, useReducer } from 'react';

const MAX_DIGITS = 15;
const OP_SYMBOLS = { '+': '+', '-': '−', '*': '×', '/': '÷' };

const initialState = {
  display: '0', // number currently on screen (raw string)
  prev: null, // stored left operand
  op: null, // pending operator
  waiting: false, // next digit starts a new number
  expr: '', // small history line above the display
  error: false,
};

function compute(a, b, op) {
  switch (op) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      return b === 0 ? NaN : a / b;
    default:
      return b;
  }
}

// Clean up floating-point noise (0.1 + 0.2) and keep huge/tiny numbers readable.
function toDisplay(n) {
  if (!Number.isFinite(n)) return null;
  const clean = parseFloat(n.toPrecision(12));
  if (Math.abs(clean) >= 1e15 || (clean !== 0 && Math.abs(clean) < 1e-9)) {
    return clean.toExponential(6).replace(/\.?0+e/, 'e');
  }
  return String(clean);
}

// Add thousand separators to the integer part, keep the decimal part as typed.
function prettify(str) {
  if (str.includes('e')) return str;
  const [int, dec] = str.split('.');
  const sign = int.startsWith('-') ? '-' : '';
  const digits = sign ? int.slice(1) : int;
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return sign + grouped + (dec !== undefined ? '.' + dec : '');
}

function errorState() {
  return { ...initialState, display: 'Error', error: true, expr: 'Cannot divide by zero' };
}

function reducer(state, action) {
  // Any key after an error starts fresh.
  const s = state.error && action.type !== 'clear' ? initialState : state;

  switch (action.type) {
    case 'digit': {
      if (s.waiting) return { ...s, display: action.value, waiting: false };
      if (s.display.replace(/[-.]/g, '').length >= MAX_DIGITS) return s;
      const display = s.display === '0' ? action.value : s.display + action.value;
      return { ...s, display };
    }

    case 'dot': {
      if (s.waiting) return { ...s, display: '0.', waiting: false };
      if (s.display.includes('.')) return s;
      return { ...s, display: s.display + '.' };
    }

    case 'operator': {
      const current = parseFloat(s.display);
      // Switching operator before typing the next number.
      if (s.op && s.waiting) {
        return { ...s, op: action.value, expr: `${prettify(toDisplay(s.prev))} ${OP_SYMBOLS[action.value]}` };
      }
      let result = current;
      if (s.prev !== null && s.op) {
        result = compute(s.prev, current, s.op);
        if (toDisplay(result) === null) return errorState();
      }
      const shown = toDisplay(result);
      return {
        ...s,
        display: shown,
        prev: parseFloat(shown),
        op: action.value,
        waiting: true,
        expr: `${prettify(shown)} ${OP_SYMBOLS[action.value]}`,
      };
    }

    case 'equals': {
      if (s.op === null || s.prev === null) return s;
      const current = parseFloat(s.display);
      const result = compute(s.prev, current, s.op);
      const shown = toDisplay(result);
      if (shown === null) return errorState();
      return {
        ...initialState,
        display: shown,
        waiting: true,
        expr: `${prettify(toDisplay(s.prev))} ${OP_SYMBOLS[s.op]} ${prettify(toDisplay(current))} =`,
      };
    }

    case 'clear':
      return initialState;

    case 'backspace': {
      if (s.waiting) return s;
      const next = s.display.slice(0, -1);
      return { ...s, display: next === '' || next === '-' ? '0' : next };
    }

    case 'sign': {
      if (s.display === '0') return s;
      const display = s.display.startsWith('-') ? s.display.slice(1) : '-' + s.display;
      return { ...s, display, waiting: false };
    }

    case 'percent': {
      const value = parseFloat(s.display) / 100;
      return { ...s, display: toDisplay(value), waiting: false };
    }

    default:
      return s;
  }
}

const KEYMAP = {
  Enter: { type: 'equals' },
  '=': { type: 'equals' },
  Escape: { type: 'clear' },
  Delete: { type: 'clear' },
  Backspace: { type: 'backspace' },
  '.': { type: 'dot' },
  ',': { type: 'dot' },
  '%': { type: 'percent' },
  '+': { type: 'operator', value: '+' },
  '-': { type: 'operator', value: '-' },
  '*': { type: 'operator', value: '*' },
  x: { type: 'operator', value: '*' },
  '/': { type: 'operator', value: '/' },
};

function Key({ label, onClick, variant = 'num', active = false, wide = false, ariaLabel }) {
  const base =
    'h-16 rounded-2xl text-xl font-semibold select-none transition-all duration-150 ' +
    'active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ' +
    'focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900';

  const variants = {
    num: 'bg-slate-800 text-slate-100 hover:bg-slate-700 shadow-inner shadow-white/5',
    fn: 'bg-slate-700/70 text-indigo-200 hover:bg-slate-600',
    op: active
      ? 'bg-white text-indigo-600 shadow-lg shadow-indigo-500/30'
      : 'bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30',
    eq: 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-600/40 hover:brightness-110',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel || label}
      aria-pressed={variant === 'op' ? active : undefined}
      className={`${base} ${variants[variant]} ${wide ? 'col-span-2' : ''}`}
    >
      {label}
    </button>
  );
}

export default function MyCalc() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Keyboard support
  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      let action = null;
      if (/^[0-9]$/.test(e.key)) action = { type: 'digit', value: e.key };
      else action = KEYMAP[e.key];
      if (!action) return;
      e.preventDefault();
      dispatch(action);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const shown = state.error ? state.display : prettify(state.display);
  const size =
    shown.length > 14 ? 'text-3xl' : shown.length > 10 ? 'text-4xl' : shown.length > 7 ? 'text-5xl' : 'text-6xl';

  const digit = (d) => () => dispatch({ type: 'digit', value: d });
  const op = (o) => () => dispatch({ type: 'operator', value: o });
  const isActive = (o) => state.op === o && state.waiting;

  return (
    <div className="w-full max-w-xs rounded-[2rem] bg-slate-900 p-5 shadow-2xl shadow-indigo-950/40 ring-1 ring-white/10">
      {/* Display */}
      <div className="mb-5 flex h-32 flex-col justify-end rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 px-4 py-3 ring-1 ring-white/5">
        <p className={`h-5 truncate text-right text-sm ${state.error ? 'text-rose-400' : 'text-slate-500'}`}>
          {state.expr}
        </p>
        <output
          aria-live="polite"
          className={`mt-1 block truncate text-right font-light tracking-tight tabular-nums transition-all ${size} ${
            state.error ? 'text-rose-400' : 'text-white'
          }`}
        >
          {shown}
        </output>
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-4 gap-3">
        <Key label="AC" variant="fn" onClick={() => dispatch({ type: 'clear' })} ariaLabel="All clear" />
        <Key label="±" variant="fn" onClick={() => dispatch({ type: 'sign' })} ariaLabel="Toggle sign" />
        <Key label="%" variant="fn" onClick={() => dispatch({ type: 'percent' })} ariaLabel="Percent" />
        <Key label="÷" variant="op" active={isActive('/')} onClick={op('/')} ariaLabel="Divide" />

        <Key label="7" onClick={digit('7')} />
        <Key label="8" onClick={digit('8')} />
        <Key label="9" onClick={digit('9')} />
        <Key label="×" variant="op" active={isActive('*')} onClick={op('*')} ariaLabel="Multiply" />

        <Key label="4" onClick={digit('4')} />
        <Key label="5" onClick={digit('5')} />
        <Key label="6" onClick={digit('6')} />
        <Key label="−" variant="op" active={isActive('-')} onClick={op('-')} ariaLabel="Subtract" />

        <Key label="1" onClick={digit('1')} />
        <Key label="2" onClick={digit('2')} />
        <Key label="3" onClick={digit('3')} />
        <Key label="+" variant="op" active={isActive('+')} onClick={op('+')} ariaLabel="Add" />

        <Key label="⌫" variant="fn" onClick={() => dispatch({ type: 'backspace' })} ariaLabel="Backspace" />
        <Key label="0" onClick={digit('0')} />
        <Key label="." onClick={() => dispatch({ type: 'dot' })} ariaLabel="Decimal point" />
        <Key label="=" variant="eq" onClick={() => dispatch({ type: 'equals' })} ariaLabel="Equals" />
      </div>

      <p className="mt-4 text-center text-[11px] text-slate-500">Keyboard supported · Esc to clear · ⌫ to delete</p>
    </div>
  );
}
