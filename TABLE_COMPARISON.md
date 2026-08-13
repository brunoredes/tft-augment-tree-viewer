# Table Components — Cross-Library Analysis

Six libraries checked out under `/home/brino/Code/studies`, each analysed from **source in this working tree** (not from public docs or memory). Every claim in the per-library sections cites a repo-relative file path.

| # | Repo | Package under test | Version in tree |
|---|---|---|---|
| 1 | `ag-grid/` | `ag-grid-community` / `ag-grid-enterprise` | `36.1.0-beta.20260809.2045` |
| 2 | `carbon/` | `@carbon/react` → `DataTable` | `1.114.0` |
| 3 | `dell-design-react-common/` | `@dellstorage/dell-design-react-common` | `0.2.12` |
| 4 | `leafygreen-ui/` | `@leafygreen-ui/table` | `15.2.3` |
| 5 | `material-ui/` | `@mui/material` → `Table*` primitives | `9.3.1` |
| 6 | `table/` | `@tanstack/table-core` + adapters | `9.1.2` ⚠️ **v9 rewrite** |

---

## Executive summary

These six are not competitors on one axis — they sit at four different layers of the stack.

```
                        you write markup          library writes markup
                     ┌──────────────────────┬──────────────────────────┐
   library owns      │  TanStack Table v9   │   AG Grid                │
   state/logic       │  (headless engine)   │   Carbon DataTable       │
                     │                      │   Clarity DataGrid (Dell)│
                     ├──────────────────────┼──────────────────────────┤
   you own           │  (nothing — this is  │   MUI Table primitives   │
   state/logic       │   just raw <table>)  │   LeafyGreen (styled TS8)│
                     └──────────────────────┴──────────────────────────┘
```

- **AG Grid** is the only one here that is a *product*: a full data grid with its own imperative DOM engine, four row models, 121 events and ~249 API methods. It is also the only one where the features you actually want are mostly behind a commercial licence.
- **TanStack Table v9** is the opposite pole: a pure state engine that renders nothing, ships zero accessibility, and expects you to build the entire UI. Note this checkout is the **v9 rewrite** — the API differs substantially from the v8 that all public documentation describes.
- **Carbon** and **LeafyGreen** are design-system tables. Carbon rolled its own headless controller; LeafyGreen wrapped TanStack v8. Both give you a compliant-looking table quickly and cap out well below AG Grid on features.
- **MUI** is deliberately just styling over `<table>`. No state, no data model. Its own docs point you at `@mui/x-data-grid` (which is **not in this checkout**) for anything data-heavy.
- **Dell** is not a table library at all. Its own `package.json` description says it is a CSS skin over VMware Clarity. Evaluate it as such.

---

## Comparison matrix

### Architecture & setup

| | AG Grid | Carbon | Dell | LeafyGreen | MUI | TanStack v9 |
|---|---|---|---|---|---|---|
| **Layer** | Full grid product | Headless ctrl + styled parts | CSS skin | Styled TanStack v8 wrapper | Styling primitives | Headless engine |
| **Renders markup?** | Yes (own DOM engine) | Yes | Yes (Clarity's) | Yes | Yes (thin) | **No** |
| **Owns state?** | Yes (`GridApi`) | Yes (opaque, no controlled props) | Clarity: yes | Mostly (TanStack under it) | **No** | Yes (Store atoms) |
| **Frameworks** | JS, React, Angular 20, Vue 3 | React, Web Components (Lit) | React 17 only | React only | React only | 10–11 adapters |
| **Styling** | Theming API (CSS vars) + legacy themes | Sass design tokens | Sass over Clarity | Emotion + LG tokens | Emotion / Pigment `sx` | None |
| **Extra setup** | Module registration **required**, licence key for enterprise | `sass` peer dep, `@use '@carbon/react'` | `@clr/*` + webcomponents polyfill (undeclared deps) | `LeafyGreenProvider` peer dep | None — `ThemeProvider` optional | None (headless) |
| **Lines for a basic table** | ~10 | ~30 JSX + 10 getters | ~10 | ~40 (`.map()` nesting) | ~15 | ~40 + all markup |
| **Licence** | MIT core / **commercial enterprise** | Apache-2.0 | Apache-2.0 | Apache-2.0 | MIT | MIT |

### Features

`✅` built in · `⚠️` partial / manual wiring · `💰` enterprise-only · `❌` absent

| Feature | AG Grid | Carbon | Dell (Clarity) | LeafyGreen | MUI | TanStack v9 |
|---|---|---|---|---|---|---|
| Sorting | ✅ | ✅ 3-state, locale-aware | ⚠️ hand-written comparators | ✅ | ⚠️ `TableSortLabel` UI only | ✅ |
| Column filtering | ✅ (Set Filter 💰) | ⚠️ substring search only | ⚠️ ref-passing filter children | ❌ no UI | ❌ | ✅ |
| Global filtering | ✅ | ✅ toolbar search | ⚠️ | ❌ | ❌ | ✅ |
| Pagination | ✅ | ⚠️ separate component, **you slice rows** | ✅ | ⚠️ row model only, UI separate | ⚠️ `TablePagination` UI only | ✅ |
| Row selection | ✅ | ✅ checkbox + radio + batch bar | ✅ w/ per-row locks | ✅ | ❌ | ✅ |
| Row expansion | ✅ | ✅ + expand-all | ✅ + detail pane | ✅ nested + `renderExpandedContent` | ⚠️ compose `Collapse` yourself | ✅ |
| Grouping / aggregation | 💰 | ❌ | ❌ | ❌ | ❌ | ✅ |
| Pivoting | 💰 | ❌ | ❌ | ❌ | ❌ | ❌ |
| Tree data | 💰 | ❌ | ❌ | ✅ `subRows` | ❌ | ✅ expanding |
| **Virtualization** | ✅ row + column | ❌ | ❌ | ✅ `@tanstack/react-virtual` | ❌ | ❌ (use TanStack Virtual) |
| Column resize | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ (state only) |
| Column reorder | ✅ | ❌ | ❌ | ⚠️ TanStack state | ❌ | ✅ (state only) |
| Column pinning | ✅ | ❌ | ✅ sticky columns | ❌ | ❌ | ✅ (state only) |
| Column visibility | ✅ (side bar 💰) | ❌ | ✅ show/hide | ✅ | ❌ | ✅ |
| Inline editing | ✅ | ❌ dead constants + TODO | ❌ | ❌ | ❌ | ❌ |
| Sticky header | ✅ | ⚠️ experimental | ✅ | ✅ + shadow on scroll | ✅ | ❌ |
| Master/detail | 💰 | ❌ | ✅ detail pane | ⚠️ expanded content | ❌ | ❌ |
| Export (CSV/Excel) | ✅ CSV / 💰 Excel | ❌ | ❌ | ❌ | ❌ | ❌ |
| Clipboard / range select | 💰 | ❌ | ❌ | ❌ | ❌ | ✅ `cellSelectionFeature` |
| Charts | 💰 | ❌ | ❌ | ❌ | ❌ | ❌ |
| Skeleton / loading | ✅ overlays | ✅ separate component | ✅ empty state | ✅ separate package | ❌ | ❌ |
| Dark mode | ✅ | ✅ themes | ⚠️ | ✅ first-class | ✅ | n/a |
| i18n | ✅ ~153 aria keys | ✅ `translateWithId` ×4 | ❌ | ❌ | ✅ ~60 locales (pagination) | n/a |

### Accessibility

| | AG Grid | Carbon | Dell | LeafyGreen | MUI | TanStack v9 |
|---|---|---|---|---|---|---|
| **Grade** | **A** | **A** | **F** | **C** | **B+** | **n/a (none shipped)** |
| `role=grid`/`treegrid` | ✅ dynamic | native `<table>` | native | native | native | — |
| `aria-sort` | ✅ | ✅ + `aria-describedby` sentence | ❓ | ❌ | ✅ via `sortDirection` | ❌ |
| `aria-expanded` / `-controls` | ✅ | ✅ | ❓ | ❌ | — | ❌ |
| `aria-rowindex` (virtualized) | ✅ | n/a | ❓ | ❌ | n/a | ❌ |
| Arrow-key navigation | ✅ full grid nav + tab guards | ⚠️ tab order only | ❓ | ❌ | ❌ | ❌ |
| Live-region announcements | ✅ dedicated service | ✅ tuned per region | ❌ | ❌ | ❌ | ❌ |
| Automated a11y tests | ✅ axe + Playwright over every docs example | ✅ 15 IBM Equal Access Playwright checks, 2 keyboard walkthroughs | ❌ none | ⚠️ jest-axe in 7 specs | ✅ | ❌ |
| **Red flag** | — | — | **`outline: none !important` ×4 in `DataGrid.scss` with no replacement — the skin *degrades* stock Clarity a11y** | jest-axe passes only because axe doesn't flag missing state semantics; sort `aria-label` breaks with JSX headers | `TableCell` emits no `role` fallback when `component` is not `th`/`td` | Zero ARIA in `table-core` or any adapter (22 hits repo-wide, all in devtools) |

### Developer experience

| | AG Grid | Carbon | Dell | LeafyGreen | MUI | TanStack v9 |
|---|---|---|---|---|---|---|
| TypeScript | Excellent, type-derived option keys | Rough — `any` cell values, `[key: string]: unknown` getters | Weak, `rows: Row[]` prop type is wrong | Good, 2 `@ts-ignore`s | Excellent + module augmentation | **Best in class** — feature-gated mapped types |
| Dev-time errors | **Outstanding** — 62 KB numbered messages, "did you mean", doc links, in-grid overlay | Deprecation validators | None | None | propTypes | `ValidateFeatureSlots` authored type errors |
| Docs in repo | Huge | 19 KB MDX + Storybook | 1 story per component | ~1150-line README + 3 migration guides | Extensive | Good, but **ecosystem docs describe v8** |
| Test utilities | Playwright suites | — | ❌ one CRA boilerplate test | ✅ `getTestUtils()` + `data-lgid` | ✅ | — |
| Learning curve | Steep (~230 options, 4 row models, 2 theming systems) | Moderate (render-prop boilerplate) | Low (but dated API) | Moderate (need TanStack v8 knowledge) | Low | Steep-ish, high ceiling |
| Maintenance signal | Very active | Very active | **Last commit 2024-05-23; React 17 pinned; 3 unused table deps** | Active, changesets | Very active | Active, but early 9.x (`perf-todo.md` is 117 KB) |

---

## API surface at a glance

| | Props/options | Events/callbacks | Helpers |
|---|---|---|---|
| **AG Grid** | ~230 `GridOptions` across 33 sections (`entities/gridOptions.ts`, 3554 lines) | **121** public events (`eventTypes.ts`) | ~249 `GridApi` methods from ~55 sub-interfaces; provided renderers/editors/filters |
| **Carbon** | Per sub-component propTypes; ~20 exported components | Composed handlers via getters (yours are merged, not clobbered) | 10 render-prop getters (`getTableProps`, `getRowProps`, `getHeaderProps`, `getSelectionProps`, `getBatchActionProps`…) |
| **Dell** | Clarity's `DataGrid` props (external); own wrapper has ~4 | Async Promise callbacks (server-side by default) | None exported |
| **LeafyGreen** | Per-component props + `useLeafyGreenTable` options | TanStack `onXxxChange` (⚠️ passing `onExpandedChange` silently breaks LG's own expansion) | `useLeafyGreenTable`, `useLeafyGreenVirtualTable`, `flexRender`, `getTestUtils()`; re-exports all of TanStack |
| **MUI** | ~10 components, small prop sets each | `onPageChange`, `onRowsPerPageChange`, plain DOM handlers | `TableContext`, `Tablelvl2Context`, `*Classes` objects, `sx`/`styled`/`slots` |
| **TanStack v9** | `TableOptions` + `ColumnDef`, both feature-gated by type | `onXxxChange` updater pattern per state slice | `createColumnHelper`, `flexRender`, `create*RowModel` factories, `tableFeatures({})`, fn registries |

---

## Recommendations

| If you need… | Pick |
|---|---|
| 100k rows, grouping, pivot, Excel export, editing — and have budget | **AG Grid Enterprise** |
| A big grid on MIT-only terms | **TanStack Table v9** (or v8) + TanStack Virtual + your own ARIA layer |
| Best-in-class accessibility out of the box, modest row counts | **Carbon DataTable** (or AG Grid) |
| Design-system-consistent tables in an existing MUI app, < few hundred rows | **MUI primitives**; add TanStack for logic if it grows |
| MongoDB/Atlas-style console with 10k+ rows and nesting | **LeafyGreen** — but budget work for the ARIA gaps |
| Dell/Clarity-branded enterprise app on React 17 | **Clarity `DataGrid`** direct; treat `DataGridWithInfiniteScroll` as a fork-and-fix starting point, not a component |

### Three things worth flagging before anyone builds on these

1. **`table/` is TanStack v9, not v8.** `useReactTable` → `useTable`, row models moved into a required `features: tableFeatures({...})` object, everything renamed (`getSortedRowModel` → `createSortedRowModel`). Every tutorial, Stack Overflow answer and LLM answer you find will be for v8. A `@tanstack/react-table/legacy` shim exists for migration.
2. **AG Grid's free tier is smaller than it looks.** Grouping, aggregation, pivot, tree data, master-detail, Set Filter, clipboard, context menus, side bar and the server-side row model are all commercial. The split is enforced by module registration, not separate builds — so it fails at runtime, not at install.
3. **Dell's skin actively removes focus outlines.** `DataGrid.scss:25, 81, 95, 153` set `outline: none !important` with no replacement. Applying the Dell theme makes Clarity *less* accessible than stock. Fix that before shipping.

---
---
## AG Grid — Table/Grid Component Analysis

Source analysed: `/home/brino/Code/studies/ag-grid` @ `e8e0455` (Aug 2026), version `36.1.0-beta.20260809.2045`.

### 1. Overview

AG Grid is an Nx-managed TypeScript monorepo containing a framework-agnostic grid core plus thin framework wrappers.

| Package | Path | Notes |
|---|---|---|
| `ag-grid-community` | `packages/ag-grid-community/` | MIT core. Entry `src/main.ts` (36.7K), UMD entries `main-umd-*.ts` |
| `ag-grid-enterprise` | `packages/ag-grid-enterprise/` | Commercial. Entry `src/main.ts`, depends on `ag-grid-community` |
| `ag-grid-react` | `packages/ag-grid-react/` | React wrapper (`src/agGridReact.tsx`, `src/reactUi/`) |
| `ag-grid-angular` | `packages/ag-grid-angular/` | Angular 20 wrapper (ng-packagr) |
| `ag-grid-vue3` | `packages/ag-grid-vue3/` | Vue 3 wrapper |
| `ag-stack` | `packages/ag-stack/` | Internal shared primitives: DOM/ARIA utils, focus/tab-guard, popups, theming, event bus. Not a public product package |
| `@ag-community/styles` | `community-modules/styles/` | Legacy SCSS/CSS themes |
| `@ag-grid-community/locale` | `community-modules/locale/` | 31 language translations |

Version is single-locked across every package (`36.1.0-beta.20260809.2045`). No Vue 2 package remains in this tree. Angular wrapper pins `@angular/*` ^20.3.x; React wrapper is a class component wrapping a hooks-based UI (`reactUi/agGridReactUi.tsx`, 21K).

Community/enterprise split is enforced by *packages*, not build flags: enterprise features live in `packages/ag-grid-enterprise/src/<feature>/` (44 feature dirs) and each ships its own module object. A hard architectural constraint (documented in the repo's own `AGENTS.md`) is that runtime bundles carry **zero third-party dependencies** — the only external import in enterprise is `ag-charts-types`/`ag-charts-*` for Integrated Charts, and that is injected by the user, not depended on.

### 2. Setup required

Minimum working React grid (verbatim pattern from `documentation/ag-grid-docs/src/content/docs/getting-started/_examples/quick-start-example/provided/reactFunctionalTs/index.tsx`):

```tsx
import { AllCommunityModule, type ColDef } from 'ag-grid-community';
import { AgGridProvider, AgGridReact } from 'ag-grid-react';

const GridExample = () => (
    <AgGridProvider modules={[AllCommunityModule]}>
        <div style={{ width: '100%', height: '100%' }}>
            <AgGridReact rowData={rowData} columnDefs={colDefs} defaultColDef={{ flex: 1 }} />
        </div>
    </AgGridProvider>
);
```

**Module registration is mandatory** — nothing renders without it. Two mechanisms:

- Global: `ModuleRegistry.registerModules([AllCommunityModule])` (`packages/ag-grid-community/src/modules/moduleRegistry.ts`).
- React-scoped: `<AgGridProvider modules={[...]} licenseKey="...">` (`packages/ag-grid-react/src/reactUi/agGridProvider.tsx`). Providers nest and accumulate modules via React context; `licenseKey` is forwarded to `LicenseManager.setLicenseKey`.
- Per-instance: `<AgGridReact modules={[...]} />` (`modules?: Module[]` in `packages/ag-grid-react/src/shared/interfaces.ts`).

`AllCommunityModule` (`packages/ag-grid-community/src/allCommunityModule.ts`) is a meta-module with 45 `dependsOn` entries. Tree-shaking users import individual modules instead (`ClientSideRowModelModule`, `TextFilterModule`, `PaginationModule`, …).

**CSS/theming.** Two mutually exclusive paths:
- **Theming API (default, v33+)**: no CSS import at all. Pass `theme={themeQuartz}` (from `packages/ag-grid-community/src/theming/parts/theme/themes.ts` — `themeQuartz`, `themeAlpine`, `themeBalham`, `themeMaterial`). Styles are generated and injected at runtime from `theming/core/core-css.ts` (31.5K of TS-authored CSS).
- **Legacy CSS**: set `theme: 'legacy'` (`gridOptions.ts:2203` — `theme?: Theme | 'legacy'`) and import `ag-grid-community/styles/ag-grid.css` + a theme file. The package `exports` map still ships `ag-theme-alpine`, `ag-theme-balham`, etc.
- `loadThemeGoogleFonts?: boolean` (`gridOptions.ts:2208`) controls remote font loading — relevant for CSP-restricted apps (there's a dedicated `testing/csp/` project).

**Peer deps.** React wrapper depends only on `react`/`react-dom` + `ag-grid-community`. Angular wrapper pulls the full `@angular/*` + `rxjs` + `zone.js` set. Enterprise depends on `ag-grid-community`; charts require the user to pass `AgChartsEnterpriseModule` into `AllEnterpriseModule.with(...)`.

**Enterprise license**: `LicenseManager.setLicenseKey(key)` (`packages/ag-grid-enterprise/src/license/gridLicenseManager.ts:54`) or the `AgGridProvider licenseKey` prop. Without it the grid renders but stamps a watermark (`license/watermark.ts`, `watermark.css`).

### 3. How it works

**Rendering model.** Custom imperative rendering engine, not virtual DOM in the React sense. The pipeline is Ctrl/Comp: framework-agnostic controllers (`rowCtrl.ts` 53.7K, `cellCtrl.ts`, `headerCellCtrl`) own state and expose a `comp` interface; per-framework components (`rowComp.ts` vanilla, `reactUi/rowComp.tsx` React) implement it. This is how one core drives four frameworks.

- **Row virtualization** in `packages/ag-grid-community/src/rendering/rowRenderer.ts` (68.6K). It computes first/last rows to render from the viewport, and on model updates does `redrawAfterModelUpdate({ recycleRows })` — DOM recycling: existing `RowCtrl`s are reused and re-bound to new `RowNode`s rather than destroyed. `refreshPinnedRowComps(recycleRows = true)` does the same for pinned lanes.
- **Column virtualization** is separate and can be disabled (`suppressColumnVirtualisation`, `gridOptions.ts:1376`). `ensureDomOrder` (`:1356`) forces DOM order to match visual order at a performance cost — needed for some screen readers and for text-selection-based copy.
- Row containers are split by pinning (`getDisplayedLeftColumns` / `Center` / `Right` in the API) plus top/bottom pinned row lanes and sticky rows; `rowContainerHeightService.ts` handles the browser max-height problem for very large datasets.
- `columnDelayRenderService.ts` and an animation-frame queue (`api.isAnimationFrameQueueEmpty()`, `flushAllAnimationFrames()`) spread rendering work across frames.

**Module system.** `packages/ag-grid-community/src/modules/moduleRegistry.ts`. A `Module` is a plain object: `{ moduleName, version, dependsOn?, beans?, userComponents?, apiFunctions?, ... }`. Registration wires beans into the DI container (`src/context/context.ts`) and API functions into `apiFunctionService.ts`. Consequences: (a) the public `GridApi` is dynamically assembled — calling an unregistered method produces a targeted error rather than `undefined is not a function` (`validation/apiFunctionValidator.ts`); (b) bundle size scales with features used; (c) `testing/module-size/` and `testing/module-size-angular/` exist purely to regression-test bundle size.

**State ownership.** Hybrid and this is the main conceptual hurdle. Grid options are *props-driven* (`GridOptionsService`, `gridOptionsService.ts` 15.3K, plus `gridOptionsDefault.ts` / `gridOptionsInitial.ts` distinguishing reactive vs. initial-only properties), but transient state (sort, filter, column order/width, expansion, selection, scroll) is owned **inside** the grid and mutated via `GridApi`. There is no controlled-component mode for most of it. The bridge is the Grid State API — `api.getState()` / `api.setState()` and the `initialState` option plus the `stateUpdated` event (`misc/state/stateModule.ts`) — which is how you persist/restore layout.

**Data flow — four row models**, selected by `rowModelType`:

| Row model | Package | Behaviour |
|---|---|---|
| Client-Side (`clientSideRowModel/`) | community | All rows in memory; grid does filter → sort → group → aggregate → pivot → flatten ("CSRM stages", see `testing/behavioural/src/csrm-stages/`) |
| Infinite (`infiniteRowModel/`) | community | Block-based lazy paging, no grouping |
| Server-Side / SSRM (`serverSideRowModel/`) | enterprise | Server does grouping/sorting/filtering/aggregation; supports lazy group expansion, transactions, `applyServerSideTransaction*` |
| Viewport (`viewportRowModel/`) | enterprise | Server pushes exactly the visible window; for live-streaming feeds |

Client-side updates go through `api.applyTransaction()` / `applyTransactionAsync()` (batched, flushed via `flushAsyncTransactions()`) or immutable `rowData` replacement keyed by `getRowId`.

**Styled, not headless.** AG Grid owns the DOM. There is no headless mode — you customise via cell renderers, theme parameters, and CSS parts, not by supplying your own markup for rows and cells.

### 4. Developer experience

**TypeScript quality: excellent, and unusually so.** Strict mode across all packages. `GridOptions<TData>` is generic in row type, and `ColDef<TData, TValue>` propagates it into value getters, formatters, cell renderer params, and events. `propertyKeys.ts` does something clever: it derives the runtime validation key lists *from* the interface using conditional-type helpers (`KeysWithType<boolean>`, `CallbackKeys`, `AnyGridOptions`), so the string lists can't silently drift from the type — the file's own comment says "If you change the properties on the gridOptions interface, you *must* update this file as well". Events are a discriminated union built from a const tuple (`_PUBLIC_EVENTS`) via `BuildEventTypeMap`, so `api.addEventListener('cellClicked', e => …)` infers `e` precisely.

**Dev-mode diagnostics are a first-class subsystem** — this is one of AG Grid's strongest DX assets. `packages/ag-grid-community/src/validation/`:

- `errorMessages/errorText.ts` — **62 KB** of numbered, parameterised error messages. Each has a stable `ErrorId`; `logging.ts` turns it into a console message plus a deep link to `ag-grid.com/…/errors/<id>` (`getErrorLink`, `MAX_URL_LENGTH = 2000` so long params get truncated out of the URL).
- Messages are *actionable*: for a missing module, `moduleRegistrationSnippet()` generates the exact import + registration code, and detects whether you're using React's `AgGridProvider` vs `ModuleRegistry` to print the right snippet. Typos get `_fuzzySuggestions()` — "did you mean" for grid options and column properties.
- Rule sets: `rules/gridOptionsValidations.ts` (33.6K), `rules/colDefValidations.ts` (22.3K), `iconValidations.ts`, `userCompValidations.ts`, `dynamicBeanValidations.ts`.
- Severity levels `'error' | 'warning' | 'deprecation'` with per-severity enablement (`validationConfig.ts`), and a **programmatic diagnostic listener** API (`_addDiagnosticListener`) so apps can capture grid warnings.
- `validation/errorOverlay/` renders errors *into the grid itself* (`errorOverlayRenderer.ts`, `bootstrapPanel.ts`) rather than only to console — you see a misconfiguration on screen.
- The whole `ValidationModule` is optional and tree-shaken out of production builds.

**Debuggability.** `src/testing/testIdService.ts` (21K) + `testIdUtils.ts` (14K) provide stable test IDs for automation. Deprecations are annotated in-source with version (`@deprecated v33.3 …`). Downsides: the Ctrl/Comp indirection means stack traces from a rendering bug pass through several abstraction layers, and `rowRenderer.ts`/`rowCtrl.ts`/`gridApi.ts` are 50–80 KB single files — stepping through them is heavy going.

**Docs.** A full Astro site lives in-repo (`documentation/ag-grid-docs/`) with per-framework examples generated by an Nx plugin (`plugins/ag-grid-generate-example-files/`) — every example exists in JS, React (functional TS), Angular, and Vue 3 variants from one source. Reference tables are generated from the TS interfaces (`plugins/ag-grid-generate-code-reference-files/`), so option docs cannot drift from types. There's also an `aiToolkit/` enterprise module and `api.getStructuredSchema()`, i.e. machine-readable API description for LLM tooling.

**Learning curve: steep.** ~230 top-level `GridOptions` properties, ~120 public events, ~250 API methods, four row models, a module registry, two theming systems, and community/enterprise boundaries you discover at runtime. The v33+ module requirement in particular breaks naive copy-paste from older tutorials.

**Escape hatches** are plentiful: `getGridElement()`, direct `RowNode` access via `forEachNode`, custom components at nearly every slot, `processCellForClipboard`/`processCellFromClipboard`, `suppressKeyboardEvent`, `navigateToNextCell`, `focusGridInnerElement`, custom row models (the interface is public).

### 5. Features

Derived from module lists in `allCommunityModule.ts` and `allEnterpriseModule.ts`.

| Feature | Tier | Module / source |
|---|---|---|
| Sorting (multi-column, custom comparators) | Community | `src/sort/` |
| Text / Number / BigInt / Date filters, floating filters | Community | `filter/filterModule.ts` |
| Quick filter, external filter, custom filter | Community | `QuickFilterModule`, `ExternalFilterModule`, `CustomFilterModule` |
| Set Filter (Excel-style), Multi Filter | **Enterprise** | `setFilter/`, `multiFilter/` |
| Advanced Filter (query builder) | **Enterprise** | `advancedFilter/` |
| Pagination (+ page-number bar) | Community | `PaginationModule`, `PaginationPageNumbersModule` |
| Row & column virtualization, DOM recycling | Community | `rendering/rowRenderer.ts` |
| Row selection (single/multi, checkbox, header select-all) | Community | `selection/rowSelectionModule.ts` |
| Cell/range selection, fill handle, range delete | **Enterprise** | `rangeSelection/` (`CellSelectionModule`) |
| Inline editing: text, number, date, checkbox, select, large-text, custom | Community | `edit/editModule.ts` |
| Rich Select editor | **Enterprise** | `richSelect/` |
| Undo/redo of edits | Community | `UndoRedoEditModule` |
| Batch / bulk editing | **Enterprise** | `batch-edit/` |
| Column resize, move/reorder, auto-size, hover | Community | `columnResize/`, `columnMove/`, `columnAutosize/` |
| Column & row pinning; pinned (frozen) rows | Community | `pinnedColumns/`, `PinnedRowModule` |
| Row drag & drop, drop zones | Community | `RowDragModule`, `DragAndDropModule` |
| Row auto-height, cell spanning, row spanning | Community | `RowAutoHeightModule`, `CellSpanModule` |
| CSV export | Community | `csvExport/` |
| Excel export (styled, multi-sheet) | **Enterprise** | `excelExport/` |
| PDF export | **Enterprise** | `pdfExport/` |
| Clipboard (copy/cut/paste ranges) | **Enterprise** | `clipboard/` |
| Row grouping + panel, group filter | **Enterprise** | `rowGrouping/` |
| Aggregation, custom agg funcs | **Enterprise** | `aggregation/`, `RowGroupingModule` |
| Pivoting, "Show values as" | **Enterprise** | `pivot/`, `showValuesAs/` |
| Tree data / hierarchy | **Enterprise** | `treeData/`, `groupHierarchy/`, `rowHierarchy/` |
| Master–Detail | **Enterprise** | `masterDetail/` |
| Integrated Charts, Sparklines | **Enterprise** (+ AG Charts) | `charts/`, `sparkline/` |
| Column menu, context menu | **Enterprise** | `menu/` |
| Side Bar, Columns Tool Panel, Filters Tool Panel | **Enterprise** | `sideBar/`, `columnToolPanel/`, `filterToolPanel/` |
| Status Bar, Toolbar, Row Numbers | **Enterprise** | `statusBar/`, `toolbar/`, `rowNumbers/` |
| Find (in-grid search) | **Enterprise** | `find/` |
| Formulas, Calculated Columns, Notes | **Enterprise** | `formula/`, `calculatedColumns/`, `notes/` |
| Column header editing | **Enterprise** | `columnHeaderEdit/` |
| SSRM / Viewport row models | **Enterprise** | `serverSideRowModel/`, `viewportRowModel/` |
| Client-Side & Infinite row models | Community | `clientSideRowModel/`, `infiniteRowModel/` |
| Grid state save/restore, aligned grids, tooltips, locale, cell/row styling, change highlighting | Community | `GridStateModule`, `AlignedGridsModule`, `TooltipModule`, `LocaleModule`, `CellStyleModule`/`RowStyleModule`, `HighlightChangesModule` |
| AI toolkit / structured schema | **Enterprise** | `aiToolkit/` |

### 6. Flexibility & customization

**Custom components.** Every visual slot is replaceable, and each takes either a framework component or a plain-JS class implementing the matching interface: cell renderer (`rendering/cellRenderers/iCellRenderer.ts`), cell editor (`edit/cellEditors/`), header component, header group component, inner header, floating filter, filter, date component, drag-and-drop image, overlays (loading/no-rows), tool panel, status panel, menu item, group cell renderer, tooltip component, loading cell renderer.

**Framework integration** is real component integration, not `dangerouslySetInnerHTML`. For React, `packages/ag-grid-react/src/shared/` contains `portalManager.ts` and `reactComponent.ts`: JS-driven grid parts render React components through portals, while the React UI path (`reactUi/`) renders rows and cells as genuine React elements. `shared/customComp/` holds ~18 wrapper/proxy files (`filterComponentWrapper.ts`, `cellEditorComponentProxy.ts`, `floatingFilterComponentProxy.ts`, …) that adapt AG Grid's imperative lifecycle to React state, plus hooks-style custom-component APIs. Angular and Vue 3 have equivalent wrappers.

**Provided renderers/editors** (community): `checkboxCellRenderer`, `animateShowChangeCellRenderer`, `animateSlideCellRenderer`, `skeletonCellRenderer`, `agGroupCellRenderer`; editors `textCellEditor`, `numberCellEditor`, `dateCellEditor`, `dateStringCellEditor`, `checkboxCellEditor`, `selectCellEditor`, `largeTextCellEditor` — all built on `simpleCellEditor.ts` / `agAbstractCellEditor.ts`, with a `popupEditorWrapper.ts` for popup-mode editing.

**Theming.** Three layers, in ascending order of commitment:
1. **Theme parts** — `src/theming/parts/` decomposes a theme into swappable parts: `color-scheme/`, `icon-set/`, `input-style/`, `checkbox-style/`, `button-style/`, `tab-style/`, `column-drop-style/`. Compose with `themeQuartz.withPart(iconSetMaterial).withParams({...})`.
2. **Theme parameters** — hundreds of typed params (`themeQuartzParams()`, `themeAlpineParams()`, … in `parts/theme/themes.ts`) compiled to CSS custom properties at runtime by `theming/core/core-css.ts`. Typed, so param typos are compile errors — a genuine advantage over raw CSS variables.
3. **Legacy CSS themes** — opt in with `theme: 'legacy'` and import from `community-modules/styles/` or the packaged `styles/*.css`. Still supported, no longer the default.

**Other override points.** `cellClass`/`cellStyle`/`cellClassRules`, `rowClass`/`getRowStyle`, `valueGetter`/`valueSetter`/`valueFormatter`/`valueParser`, `columnTypes` + `defaultColDef` inheritance, `getRowId`, `processCellForClipboard`, custom `aggFunc`s, custom row model implementations, `getLocaleText` and `localeText` for i18n, and `icons` for glyph replacement.

### 7. Accessibility

**ARIA infrastructure is centralised**, in `packages/ag-stack/src/utils/aria.ts` — 36 exported setters rather than scattered `setAttribute` calls: `_setAriaRole`, `_setAriaLabel`, `_setAriaLabelledBy`, `_setAriaDescribedBy`, `_setAriaLive`, `_setAriaAtomic`, `_setAriaRelevant`, `_setAriaInvalid`, `_setAriaLevel`, `_setAriaDisabled`, `_setAriaHidden`, `_setAriaActiveDescendant`, `_setAriaAutoComplete`, `_setAriaExpanded`/`_removeAriaExpanded`, `_setAriaSetSize`, `_setAriaPosInSet`, `_setAriaMultiSelectable`, `_setAriaRowCount`, `_setAriaRowIndex`, `_setAriaRowSpan`, `_setAriaColCount`, `_setAriaColIndex`, `_setAriaSorted`, `_setAriaSelected`, `_setAriaChecked`, `_setAriaHasPopup`, plus getters. The role union is typed in `packages/ag-stack/src/utils/dom.ts:496+`.

**Roles actually applied in source:**

| Role | Where |
|---|---|
| `grid` / `treegrid` (switched dynamically) | `gridBodyComp/gridBodyCtrl.ts:293` → `setGridRole(isTreeGrid ? 'treegrid' : 'grid')`, applied at `gridBodyComp.ts:179` |
| `rowgroup` | `gridBodyComp/gridBodyComp.ts:59` |
| `columnheader` | `headerRendering/cells/column/headerCellComp.ts:13`; group headers `columnGroup/headerGroupCellComp.ts:14` |
| `gridcell` | default per cell, `rendering/cell/cellCtrl.ts:341` — `column.colDef.cellAriaRole ?? 'gridcell'`; floating filter cells `headerFilterCellComp.ts:15` |
| `presentation` | select-all checkbox wrapper, labels, empty lists |
| `spinbutton`, `listbox`, `tablist`, `dialog`, `menu`, `tree`, `img`, `group` | widgets in `agWidgets/`, `agStack/agMenuItemComponent.ts`, `agTabbedLayout.ts`, `agVirtualList.ts`, popups |

`aria-rowindex` is computed with a header- and pinned-lane-aware offset (`rendering/row/rowCtrl.ts:1445` `getAriaRowIndexForRow`, mirrored for spanned cells in `spanning/spannedCellCtrl.ts:72` and header rows in `headerRendering/row/headerRowComp.ts:184`) — necessary because virtualization means DOM position ≠ logical position. `aria-colindex`, `aria-colcount`, `aria-rowcount`, `aria-setsize`/`aria-posinset` (for grouped rows), `aria-level` (tree data), `aria-expanded`, `aria-sort`, `aria-selected` are all set from these helpers. Per-column override via `colDef.cellAriaRole` (`entities/colDef.ts:104`, default `'gridcell'`), and `api.setGridAriaProperty()` for app-level additions.

**Live announcements**: `rendering/ariaAnnouncementService.ts` extends `BaseAriaAnnouncementService` from `ag-stack`, packaged as an optional `ariaModule.ts` — announcements for sort changes, filter results, selection, etc., delivered to an `aria-live` region.

**Keyboard navigation** is a dedicated subsystem: `src/navigation/navigationService.ts` (35K), `cellNavigationService.ts`, `headerNavigationService.ts` (16K), `navigationApi.ts`. Arrow keys, Tab/Shift-Tab across cells and into headers, Home/End, Page Up/Down, Ctrl+Home/End, Enter/F2 to edit, Escape to cancel, Space to select. Override hooks: `navigateToNextCell` (`gridOptions.ts:2361`), `tabToNextCell` (`:2367`), `suppressKeyboardEvent` (per-column), `focusGridInnerElement` (`:2347`), `tabIndex` (`:953`) to place the grid in the page tab order.

**Focus management**: `src/focusService.ts` (26.7K) plus `packages/ag-stack/src/focus/agTabGuardFeature.ts` — tab guards are invisible focus sentinels at container edges that trap/redirect focus correctly despite virtualization (the React equivalent is `reactUi/tabGuardComp.tsx`). Focus is restored to the logically-correct cell after scrolling recycles DOM. There is a 65 KB regression suite for this: `packages/ag-grid-community/src/focus-overrides.test.ts`. API: `getFocusedCell`, `setFocusedCell`, `setFocusedHeader`, `clearFocusedCell`, `tabToNextCell`, `tabToPreviousCell`.

**Testing.** `testing/accessibility/` is a standalone Playwright project that pulls the full example catalogue from the docs site (`all-examples.json`) and generates a11y tests over it; the root `package.json` includes `@axe-core/cli` and `@axe-core/playwright`, so examples are axe-scanned. `testing/csp/` verifies no-inline-style operation.

**Caveats.** Virtualization means most rows aren't in the DOM, so screen readers rely entirely on the `aria-row/colcount` + `aria-rowindex` contract being right — accurate here, but fragile in custom renderers you write. `ensureDomOrder` is off by default and may be required for some AT. `suppressCellFocus` (`gridOptions.ts:1972`) disables cell focus entirely, which removes keyboard grid navigation — use with care.

### 8. Properties / attributes exposed

Primary interface: **`packages/ag-grid-community/src/entities/gridOptions.ts`** — 136 KB, `export interface GridOptions<TData = any>` at line 219. Column-level: **`packages/ag-grid-community/src/entities/colDef.ts`** (64 KB) plus `colDef-base.ts`, `colDef-groupRowValueSetter.ts`, `colDef-showValuesAs.ts`. Runtime key lists and reactivity metadata: `src/propertyKeys.ts`, `src/gridOptionsDefault.ts`, `src/gridOptionsInitial.ts`, helpers in `src/gridOptionsUtils.ts` (26 KB). Global defaults for all grids: `src/globalGridOptions.ts`.

The file is organised into 33 banner-delimited sections (`// *** Section *** //`), which are the de-facto option categories:

| Category | Representative options |
|---|---|
| Columns / Column Headers | `columnDefs`, `defaultColDef`, `columnTypes`, `autoGroupColumnDef`, `headerHeight`, `groupHeaderHeight`, `floatingFiltersHeight` |
| Column Moving / Sizing | `suppressMovableColumns`, `suppressDragLeaveHidesColumns`, `autoSizeStrategy`, `colResizeDefault`, `skipHeaderOnAutoSize` |
| Row Model | `rowModelType`, `rowData`, `getRowId`, `cacheBlockSize`, `maxBlocksInCache`, `serverSideDatasource`, `viewportDatasource` |
| Rendering | `rowHeight`, `getRowHeight`, `rowBuffer`, `suppressColumnVirtualisation`, `ensureDomOrder`, `animateRows`, `suppressRowVirtualisation` |
| Selection | `rowSelection`, `cellSelection`, `isRowSelectable`, `suppressRowClickSelection`, `selectionColumnDef` |
| Editing | `editType`, `singleClickEdit`, `stopEditingWhenCellsLoseFocus`, `readOnlyEdit`, `undoRedoCellEditing`, `enterNavigatesVertically` |
| Filter | `quickFilterText`, `isExternalFilterPresent`, `doesExternalFilterPass`, `excludeChildrenWhenTreeDataFiltering`, `advancedFilterModel` |
| Sorting | `sortingOrder`, `multiSortKey`, `accentedSort`, `postSortRows`, `alwaysMultiSort` |
| Pagination | `pagination`, `paginationPageSize`, `paginationPageSizeSelector`, `paginationAutoPageSize`, `suppressPaginationPanel` |
| Row Grouping | `groupDisplayType`, `groupDefaultExpanded`, `showOpenedGroup`, `groupRowRenderer`, `groupAllowUnbalanced`, `isGroupOpenByDefault` |
| Pivot and Aggregation | `pivotMode`, `pivotColumnGroupTotals`, `pivotRowTotals`, `aggFuncs`, `suppressAggFuncInHeader`, `pivotMaxGeneratedColumns` |
| Row Pinning / Row Full Width | `pinnedTopRowData`, `pinnedBottomRowData`, `isFullWidthRow`, `fullWidthCellRenderer` |
| Row Drag and Drop | `rowDragManaged`, `rowDragMultiRow`, `rowDragEntireRow`, `rowDragText` |
| Master Detail | `masterDetail`, `detailCellRenderer`, `detailRowHeight`, `detailRowAutoHeight`, `keepDetailRows` |
| Clipboard | `copyHeadersToClipboard`, `clipboardDelimiter`, `processCellForClipboard`, `suppressCopyRowsToClipboard` |
| Export | `defaultCsvExportParams`, `defaultExcelExportParams`, `excelStyles`, `suppressCsvExport` |
| Accessories (side bar / menus / status bar) | `sideBar`, `statusBar`, `columnMenu`, `getContextMenuItems`, `getMainMenuItems`, `allowContextMenuWithControlKey` |
| Styling | `theme`, `loadThemeGoogleFonts`, `rowClass`, `getRowStyle`, `getRowClass`, `rowClassRules`, `domLayout` |
| Scrolling | `alwaysShowVerticalScroll`, `suppressHorizontalScroll`, `debounceVerticalScrollbar`, `scrollbarWidth` |
| Localisation | `localeText`, `getLocaleText` |
| Overlays / Loading | `loading`, `overlayLoadingTemplate`, `overlayNoRowsTemplate`, `loadingCellRenderer`, `suppressNoRowsOverlay` |
| Integrated Charts | `enableCharts`, `chartThemes`, `customChartThemes`, `chartToolPanelsDef` |
| Find | `findSearchValue`, `findOptions` |
| Components | `components` (name → implementation registry) |
| Miscellaneous | `context`, `tabIndex`, `getDocument`, `initialState`, `alignedGrids`, `suppressCellFocus`, `enableCellTextSelection`, `reactiveCustomComponents` |

`propertyKeys.ts` also exports `_GET_SHALLOW_GRID_OPTIONS` — the set compared by reference rather than deeply, which is what determines whether re-passing a prop in React re-triggers grid work.

### 9. Events exposed

Canonical list: **`packages/ag-grid-community/src/eventTypes.ts`** — `_PUBLIC_EVENTS` is a `const` tuple of **~120 documented events**; `_INTERNAL_EVENTS` (~60 more) are deliberately excluded from framework codegen and docs. Payload interfaces: **`packages/ag-grid-community/src/events.ts`** (67 KB, 190 exported interfaces), built on `AgGridEvent` / `AgGlobalEvent` (lines 210, 213). The `AgPublicEventType` / `AgEventType` union types are derived from the tuples, and `ALWAYS_SYNC_GLOBAL_EVENTS` marks the three events dispatched synchronously (`gridPreDestroyed`, `fillStart`, `pasteStart`).

| Category | Events |
|---|---|
| Lifecycle | `gridReady`, `gridPreDestroyed`, `firstDataRendered`, `gridSizeChanged`, `componentStateChanged`, `stateUpdated`, `viewportChanged` |
| Cell | `cellClicked`, `cellDoubleClicked`, `cellMouseDown`, `cellMouseOver`, `cellMouseOut`, `cellContextMenu`, `cellKeyDown`, `cellFocused`, `cellValueChanged`, `cellEditRequest` |
| Row | `rowClicked`, `rowDoubleClicked`, `rowSelected`, `rowValueChanged`, `rowGroupOpened`, `rowDataUpdated`, `virtualRowRemoved`, `rowResizeStarted`/`rowResizeEnded` |
| Selection | `selectionChanged`, `cellSelectionChanged`, `rangeSelectionChanged` (deprecated alias) |
| Editing | `cellEditingStarted`/`Stopped`, `rowEditingStarted`/`Stopped`, `bulkEditingStarted`/`Stopped`, `batchEditingStarted`/`Stopped`, `undoStarted`/`undoEnded`, `redoStarted`/`redoEnded` |
| Columns | `columnMoved`, `columnResized`, `columnVisible`, `columnPinned`, `columnGroupOpened`, `columnRowGroupChanged`, `columnValueChanged`, `columnPivotChanged`, `columnPivotModeChanged`, `columnEverythingChanged`, `newColumnsLoaded`, `gridColumnsChanged`, `displayedColumnsChanged`, `virtualColumnsChanged`, `columnHeaderNameChanged`, `columnsReset` |
| Column headers | `columnHeaderClicked`, `columnHeaderContextMenu`, `columnHeaderMouseOver`, `columnHeaderMouseLeave`, `headerFocused` |
| Filtering | `filterChanged`, `filterModified`, `filterOpened`, `filterUiChanged`, `floatingFilterUiChanged`, `advancedFilterBuilderVisibleChanged` |
| Sorting / model | `sortChanged`, `modelUpdated`, `asyncTransactionsFlushed`, `storeRefreshed`, `rowCountReady`* |
| Pagination / scroll | `paginationChanged`, `bodyScroll`, `bodyScrollEnd` |
| Drag & drop | `dragStarted`, `dragStopped`, `dragCancelled`, `rowDragEnter`, `rowDragMove`, `rowDragLeave`, `rowDragEnd`, `rowDragCancel` |
| Clipboard | `cutStart`/`cutEnd`, `pasteStart`/`pasteEnd`, `fillStart`/`fillEnd`, `cellSelectionDeleteStart`/`End` |
| Charts (ent.) | `chartCreated`, `chartRangeSelectionChanged`, `chartOptionsChanged`, `chartDestroyed` |
| Accessories (ent.) | `toolPanelVisibleChanged`, `toolPanelSizeChanged`, `columnMenuVisibleChanged`, `contextMenuVisibleChanged`, `tooltipShow`, `tooltipHide` |
| Find / pinned rows / calc cols (ent.) | `findChanged`, `pinnedRowDataChanged`, `pinnedRowsChanged`, `calculatedColumnCreated`/`Removed`/`ExpressionChanged`/`ValidationStateChanged`, `expandOrCollapseAll`, `pivotMaxColumnsExceeded` |

Subscription: as `on*` props/options (`onCellClicked`, generated per framework from `_PUBLIC_EVENTS`), or imperatively via `api.addEventListener(type, handler)` / `addGlobalListener` (`misc/apiEvents/apiEventModule.ts` — the `EventApiModule`, which must be registered). `src/eventService.ts` and `src/publicEventHandlersMap.ts` handle dispatch.

### 10. Helpers / utilities

**`GridApi`** — `packages/ag-grid-community/src/api/gridApi.ts` (81.5 KB), ~250 methods. **`ColumnApi` no longer exists as a separate object** — it was merged into `GridApi` in v31; column methods now live alongside the rest. The API is assembled at runtime from registered modules (`api/apiFunctionService.ts`, `api/gridApiFunctions.ts`), split across `coreApi.ts`, `rowApi.ts`, `scrollApi.ts`, `rowModelSharedApi.ts`, `ssrmInfiniteSharedApi.ts`.

Representative groups:

| Group | Methods |
|---|---|
| Lifecycle | `getGridId`, `destroy`, `isDestroyed`, `isModuleRegistered`, `getGridElement`, `dispatchEvent` |
| Rows | `getRowNode`, `forEachNode`, `forEachLeafNode`, `forEachNodeAfterFilter(AndSort)`, `getDisplayedRowAtIndex`, `getDisplayedRowCount`, `getRenderedNodes`, `setRowNodeExpanded`, `expandAll`/`collapseAll`, `resetRowHeights` |
| Transactions | `applyTransaction`, `applyTransactionAsync`, `flushAsyncTransactions`, `refreshClientSideRowModel` |
| Selection | `setNodesSelected`, `selectAll`, `deselectAll`, `selectAllFiltered`, `selectAllOnCurrentPage`, `getSelectedNodes`, `getSelectedRows`, `getServerSideSelectionState` |
| Columns | `getColumnDefs`, `getColumns`, `getColumnState`/`applyColumnState`/`resetColumnState`, `setColumnsVisible`, `setColumnsPinned`, `moveColumns`, `setColumnWidths`, `sizeColumnsToFit`, `autoSizeColumns`/`autoSizeAllColumns`, `getAllDisplayedColumns`, column-group equivalents |
| Filtering | `setFilterModel`/`getFilterModel`, `isAnyFilterPresent`, `onFilterChanged`, `destroyFilter`, `showColumnFilter`, `getQuickFilter`/`resetQuickFilter`, `get/setAdvancedFilterModel` |
| Editing | `startEditingCell`, `stopEditing`, `getEditingCells`, `getCellEditorInstances`, `getEditRowValues`, `validateEdit`, `getEditValidationErrors`, `startBatchEdit`/`commitBatchEdit`/`cancelBatchEdit`, `undoCellEditing`/`redoCellEditing` |
| Rendering / scroll | `refreshCells`, `refreshHeader`, `redrawRows`, `flashCells`, `ensureIndexVisible`, `ensureColumnVisible`, `ensureNodeVisible`, `getVerticalPixelRange`, `isAnimationFrameQueueEmpty`, `flushAllAnimationFrames`, `getCellRendererInstances`, `getSizesForCurrentTheme` |
| Focus / a11y | `getFocusedCell`, `setFocusedCell`, `setFocusedHeader`, `clearFocusedCell`, `tabToNextCell`, `tabToPreviousCell`, `setGridAriaProperty` |
| Pagination | `paginationGoToPage/Next/Previous/First/Last`, `paginationGetPageSize`, `paginationGetTotalPages`, `paginationGetRowCount` |
| State | `getState`, `setState` |
| Grouping / pivot (ent.) | `setRowGroupColumns`, `add/removeRowGroupColumns`, `setValueColumns`, `setPivotColumns`, `isPivotMode`, `addAggFuncs`, `setPivotResultColumns` |
| Export | `exportDataAsCsv`/`getDataAsCsv`, `exportDataAsExcel`/`getMultipleSheetsAsExcel`, `exportDataAsPdf` |
| Clipboard (ent.) | `copyToClipboard`, `cutToClipboard`, `copySelectedRowsToClipboard`, `copySelectedRangeToClipboard`, `copySelectedRangeDown`, `pasteFromClipboard` |
| Charts (ent.) | `createRangeChart`, `createPivotChart`, `createCrossFilterChart`, `updateChart`, `restoreChart`, `getChartModels`, `downloadChart`, `getChartImageDataURL` |
| SSRM (ent.) | `applyServerSideTransaction(Async)`, `applyServerSideRowData`, `refreshServerSide`, `retryServerSideLoads`, `getServerSideGroupLevelState` |
| Master-detail (ent.) | `addDetailGridInfo`, `getDetailGridInfo`, `forEachDetailGridInfo` |
| Find / notes / tooling (ent.) | `findNext`, `findPrevious`, `findGoTo`, `findGetTotalMatches`, `getNote`/`setNote`, `getStructuredSchema` |

**Provided components** — renderers and editors listed in §6; filters `agTextColumnFilter`, `agNumberColumnFilter`, `agDateColumnFilter`, plus enterprise `agSetColumnFilter`, `agMultiColumnFilter`.

**Framework hooks/helpers.** React: `AgGridProvider` (module + license context), the `AgGridReact.api` instance field, `registerApiListener`, and `reactiveCustomComponents` hook-based custom component APIs in `shared/customComp/`. Angular/Vue expose equivalents via their wrappers.

**Test utilities.** `packages/ag-grid-community/src/testing/testIdService.ts` + `testIdUtils.ts` + `testingModule.ts` supply stable `data-testid`-style selectors for the whole grid DOM. `src/test-utils/mock.ts` is internal. In-repo test projects: `testing/behavioural/` (the primary black-box suite, ~40 feature dirs), `testing/accessibility/` (axe + Playwright over all docs examples), `testing/performance/`, `testing/module-size/`, `testing/csp/`, and per-framework package tests (`testing/react-package-tests/`, `angular-tests/`, `vue3-tests/`).

### 11. Verdict

- **Strongest-in-class feature depth and engineering discipline.** Four row models, pivoting, SSRM, integrated charts, Excel/PDF export, formulas. The plumbing is unusually well-built: runtime validation keys derived from TS types, a 62 KB catalogue of numbered errors that generate the fix snippet for you and deep-link to docs, a centralised ARIA helper layer, and an in-repo axe suite over every documentation example.
- **Accessibility is genuinely engineered, not bolted on.** Dynamic `grid`/`treegrid` roles, virtualization-aware `aria-rowindex` computation, tab guards with a 65 KB dedicated regression test, a live-region announcement service, and full keyboard-nav override hooks. Still worth verifying `ensureDomOrder` and custom renderers against your target AT.
- **TypeScript story is best-in-class for a grid.** `GridOptions<TData>` threads the row type everywhere; events are a discriminated union derived from a const tuple, so listener payloads are exact.
- **Weakness: the licensing cliff.** The features people actually reach for at enterprise scale — row grouping, aggregation, pivoting, tree data, master-detail, Set Filter, clipboard, context menu, side bar, SSRM — are all commercial. You discover the boundary at runtime via a module error, and mis-scoping a prototype against `AllEnterpriseModule` is an easy and expensive mistake.
- **Weakness: complexity and weight.** ~230 grid options, ~120 events, ~250 API methods, a mandatory module registry, two coexisting theming systems, and the grid owning its own state rather than being a controlled component. Aligning AG Grid's imperative state model with React/Redux conventions takes real effort, and the API surface is far too large for anything simple.
- **Best fit:** internal enterprise applications — trading, ERP, admin, analytics — with tens of thousands to millions of rows, Excel-like interaction expectations, real accessibility obligations, and budget for a licence. **Poor fit:** marketing sites, small data tables, projects needing headless/full-DOM control or a tiny bundle; reach for TanStack Table, a headless library, or a plain `<table>` there.

---

## IBM Carbon Design System — DataTable / Table component analysis

Repo analysed: `/home/brino/Code/studies/carbon` (monorepo, Apache-2.0).
All paths below are repo-relative. Versions read from `package.json` files at the time of analysis:
`@carbon/react` **1.114.0**, `@carbon/web-components` **2.61.0**, `@carbon/styles` **1.113.0**.

---

### 1. Overview

Carbon does not ship a single "Table" widget. It ships a **stateful headless controller (`DataTable`) plus a family of thin, styled primitive components** that map roughly 1:1 to HTML table elements.

| Item | Value |
|---|---|
| Primary package | `@carbon/react` (`packages/react/package.json`) |
| Component root | `packages/react/src/components/DataTable/` |
| Public barrel | `packages/react/src/components/DataTable/index.ts` (re-exported from `packages/react/src/index.ts:36`) |
| Controller | `packages/react/src/components/DataTable/DataTable.tsx` (~1020 LOC) |
| Styles | `packages/styles/scss/components/data-table/` (`_data-table.scss` 36 KB + `action/`, `expandable/`, `skeleton/`, `sort/` subfolders) |
| Skeleton | `packages/react/src/components/DataTableSkeleton/DataTableSkeleton.tsx` |
| Pagination | `packages/react/src/components/Pagination/Pagination.tsx`, `packages/react/src/components/PaginationNav/PaginationNav.tsx` (separate components, **not** wired into DataTable) |

**Frameworks supported in this repo:**

| Framework | Package | Location | Notes |
|---|---|---|---|
| React | `@carbon/react` | `packages/react/src/components/DataTable` | The reference implementation; render-prop based. |
| Web Components (Lit) | `@carbon/web-components` | `packages/web-components/src/components/data-table/` | `cds-table` + ~15 sibling elements; `table.ts` alone is 34 KB. Different architecture (all state inside `<cds-table>`, DOM-event driven). |
| React (legacy) | `carbon-components-react` | `packages/carbon-components-react/` | `"private": true`, EOL 30 Sep 2024 per its `package.json` description. |

No Vue/Angular table exists in this repo (`packages/icons-vue` is icons only).

Sub-components exported (from `index.ts`): `DataTable`, `Table`, `TableActionList`, `TableBatchAction`, `TableBatchActions`, `TableBody`, `TableCell`, `TableContainer`, `TableDecoratorRow`, `TableExpandHeader`, `TableExpandRow`, `TableExpandedRow`, `TableHead`, `TableHeader`, `TableRow`, `TableSelectAll`, `TableSelectRow`, `TableSlugRow` (deprecated), `TableToolbar`, `TableToolbarAction`, `TableToolbarContent`, `TableToolbarSearch`, `TableToolbarMenu`. They are also attached as statics on `DataTable` (`DataTable.tsx:892-913`), so `DataTable.Table` etc. works.

---

### 2. Setup required

#### Install / peer deps

`packages/react/package.json`:

```json
"peerDependencies": {
  "react": "^16.8.6 || ^17.0.1 || ^18.2.0 || ^19.0.0",
  "react-dom": "...",
  "react-is": "...",
  "sass": "^1.33.0"
}
```

Note `sass` is a **required** peer dep — Dart Sass is the intended styling path (`packages/react/README.md`, "This package requires Dart Sass in order to compile styles"). Runtime deps pulled in transitively include `@carbon/styles`, `@carbon/icons-react`, `classnames`, `prop-types`, `react-fast-compare`, `es-toolkit`, `@floating-ui/react`.

There is also an `ibmtelemetry` `postinstall` hook (`packages/react/package.json:41`) — worth knowing for locked-down environments.

#### Styles

`packages/react/index.scss` is generated and simply does `@forward '@carbon/styles';`. So the app entry point is:

```scss
@use '@carbon/react';
// or, cherry-picked:
@use '@carbon/styles/scss/reset';
@use '@carbon/styles/scss/components/data-table';
```

`@carbon/styles` publishes a prebuilt `css/` directory too (`packages/styles/package.json` `files: ["css", ...]`, built by `tasks/build-css.js`), so a non-Sass consumer can import the compiled CSS instead. Sass consumers may need `node_modules` in `includePaths` (README).

#### Minimum working table

This is the canonical snippet from `packages/react/src/components/DataTable/DataTable.mdx:120-150`:

```jsx
import {
  DataTable, Table, TableHead, TableRow,
  TableHeader, TableBody, TableCell,
} from '@carbon/react';

const headers = [ { key: 'name', header: 'Name' }, { key: 'status', header: 'Status' } ];
const rows = [ { id: 'a', name: 'Load balancer 1', status: 'Disabled' } ];

<DataTable rows={rows} headers={headers}>
  {({ rows, headers, getTableProps, getHeaderProps, getRowProps, getCellProps }) => (
    <Table {...getTableProps()} aria-label="load balancers">
      <TableHead>
        <TableRow>
          {headers.map((header) => (
            <TableHeader {...getHeaderProps({ header })}>{header.header}</TableHeader>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow {...getRowProps({ row })}>
            {row.cells.map((cell) => (
              <TableCell {...getCellProps({ cell })}>{cell.value}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )}
</DataTable>
```

Only two props are truly required: `rows` (each needs a unique string `id`) and `headers` (each needs `key` + `header`) — both `.isRequired` in `DataTable.propTypes` (`DataTable.tsx:938-987`).

**Build steps:** none beyond a Sass-capable bundler. For TypeScript, the README recommends `"skipLibCheck": true` because typing coverage is still an in-progress project.

---

### 3. How it works

#### Rendering model — no virtualization

Plain DOM `<table>/<thead>/<tbody>/<tr>/<th>/<td>`. `Table.tsx:213-231` renders a `<div class="cds--data-table-content"><table>…</table></div>`, wrapped in an extra `<section class="cds--data-table_inner-container">` when `stickyHeader` is set. A repo-wide grep for `virtual`/`react-window`/`react-virtual` in `packages/react/src` returns nothing — **there is no row virtualization**. Every row you pass is rendered. Large-table concerns are acknowledged only in prop docs (`experimentalAutoAlign`: "Might have performance issues, intended for smaller tables").

#### State ownership — uncontrolled by default, escape hatches for control

`DataTable` is a **function component holding one `useState` object** (`DataTable.tsx:373-377`):

```ts
interface DataTableState<ColTypes> {
  cellsById, filterInputValue, initialRowOrder, isExpandedAll,
  rowIds, rowsById, shouldShowBatchActions, sortDirection, sortHeaderKey
}
```

Sort, filter, selection and expansion all live **inside** the component. There is no `sortDirection`/`selectedRows` controlled prop. What you do get:

- **Imperative actions** exposed through the render props: `sortBy`, `selectAll`, `selectRow`, `expandRow`, `expandAll`, `onInputChange` (`DataTable.tsx:871-878`).
- **Seed state via `rows`**: `isSelected`, `isExpanded`, `disabled` on a row object are read by `tools/normalize.js:29-48`.
- **Behaviour overrides**: `sortRow` and `filterRows` props replace the default algorithms.

Prop→state resync is a `useEffect` (`DataTable.tsx:379-402`) that deep-compares (`react-fast-compare`) next `rowIds`, header keys, and row metadata; if any changed it re-runs `getDerivedStateFromProps`. Note the comparison ignores changes to *cell values* when ids/metadata are unchanged — but `normalize` re-reads `row[key]` anyway when it does run, and the dependency array is `[headers, rows]`, so a new array identity triggers the check.

`state/getDerivedStateFromProps.js` preserves previous `isSelected`/`isExpanded` for rows that survive, preserves `sortDirection`/`sortHeaderKey`/`filterInputValue`, and re-applies the active sort to the new rows.

#### Normalize → denormalize data flow

The core design (documented in the JSDoc at `DataTable.tsx:341-348`):

1. `tools/normalize.js` flattens the `rows` + `headers` props into three lookup maps: `rowIds: string[]`, `rowsById: Record<id, {id, isSelected, isExpanded, disabled, cells: cellId[]}>`, `cellsById: Record<"rowId:header", cell>`. Cell IDs come from `tools/cells.ts` (`` `${rowId}:${header}` ``).
2. All mutations are keyed lookups on these maps (cheap, no array scans).
3. Sorting reorders `rowIds` only (`tools/sorting.ts:81-100`). Filtering derives a `filteredRowIds` array at render time (`DataTable.tsx:651-660`) and never mutates state.
4. `tools/denormalize.js` re-hydrates `rowIds → [{...row, cells: [...cellObjects]}]` at render and hands that to your render function.

Each denormalized cell carries `{ id, value, isEditable, isEditing, isValid, errors, hasAILabelHeader, info: { header } }` — the editing fields exist but are hard-coded (`normalize.js:53-64` with a `// TODO: When working on inline edits` comment). **Inline editing is scaffolded, not implemented.**

#### Render props / compound components

`DataTable` renders **nothing itself**. It calls `render(renderProps)` (deprecated) or `children(renderProps)` and returns `null` if neither is given (`DataTable.tsx:881-889`). This is Downshift-style "prop getters":

- Getters return the props you spread onto Carbon's primitives.
- Consumer handlers are *composed*, not replaced, via `tools/events.ts#composeEventHandlers` (breaks the chain if `event.defaultPrevented`).
- The primitives themselves are dumb: `TableHead` and `TableToolbarContent` are literally produced by `tools/wrapComponent.ts` (a `<thead>`/`<div>` factory with a class name).

#### Headless vs styled

**Styled, with a headless core.** The `DataTable` controller is headless (zero markup); every other component is a hard-coded element + BEM classes via `usePrefix()` (`internal/usePrefix.ts` — a React context defaulting to `'cds'`, overridable with the `ClassPrefix` component). You cannot swap the element type of `TableRow`/`TableCell` — there is no `as`/polymorphic prop on any of them.

#### Contexts

- `TableContext` (`TableContext.tsx`) — `{ titleId, descriptionId }` set by `TableContainer`, consumed by `Table` to emit `aria-labelledby`/`aria-describedby`.
- `TableToolbarContext` (`TableToolbar.tsx:14-18`, hook `useTableToolbar`) — propagates toolbar `size` down to `TableToolbarSearch` and `TableToolbarMenu`.

#### Web Components architecture (contrast)

`packages/web-components/src/components/data-table/table.ts` inverts the model: `<cds-table>` owns ~10 `@state()` fields plus `@property()` attributes (`is-selectable`, `is-sortable`, `expandable`, `batch-expansion`, `radio`, `size`, `locale`, `use-zebra-styles`, `use-static-width`, `overflow-menu-on-hover`, `filterRows`, `collator`). It listens to bubbling custom events from children (`@HostListener('eventBeforeChangeSelection')`) and mutates child elements directly. `sticky-header` is commented out (`table.ts:222`) with a "TODO: Uncomment when Carbon fully implements sticky header".

---

### 4. Developer experience

**TypeScript.** Source is `.tsx`/`.ts` for every table component (only `state/getDerivedStateFromProps.js`, `tools/normalize.js`, `tools/denormalize.js` remain JS). Generics exist: `DataTable<RowType, ColTypes extends any[]>`, `DataTableRow<ColTypes>`, `DataTableCells<T>` mapped type. Quality is uneven:

- Nine `// eslint-disable-next-line @typescript-eslint/no-explicit-any` escapes in `DataTable.tsx` alone, all pointing at the same tracking issue (carbon#20452). `cell.value` is effectively `any`; `sortRow`'s cell params are `any`.
- Getter return types include `[key: string]: unknown` index signatures, so spread results are loosely typed and typos in extra props aren't caught.
- `getCellProps` types its argument as `cell: DataTableCell<ColTypes>` while rows actually yield `DataTableCell<ColTypes[number]>` — the generics don't line up cleanly.
- The README still tells you to set `skipLibCheck: true`.
- `TableExpandHeader` is a nice bit of type work: a 3-way discriminated union (`TableExpandHeaderPropsWithToggle | …WithExpando | …Base`) that makes `aria-label` and `onExpand` required only when `enableToggle`/`enableExpando` is `true`.

**Docs / Storybook.** Strong. `DataTable.mdx` is 19 KB with a doctoc TOC covering getting started, sorting (incl. programmatic + custom), expansion, selection, filtering (incl. the batch-filter pattern), batch actions, toolbar, overflow menu, `experimentalAutoAlign`, accessibility, and a full render-props reference with three tables (getters / actions / state). Eight story files across `stories/`, `stories/expansion/`, `stories/dynamic-content/`, plus a copy-paste `stories/examples/TableToolbarFilter.tsx`. Storybook runs at `yarn storybook` (port 3011), with a separate v12 preview build.

**Error messages / runtime validation.** PropTypes on every component, with custom validators:
- `prop-types/deprecate.js` for soft deprecations (`render`, `ariaLabel`, `enableExpando`).
- `prop-types/requiredIfGivenPropIsTruthy` — `TableExpandHeader.propTypes.isExpanded/onExpand` become required when `enableToggle` is set.
- `TableBatchAction.propTypes.iconDescription` is a hand-written validator returning `new Error('renderIcon property specified without also providing an iconDescription property.')`.
There is **no** `invariant`/console warning if you forget `getCellProps` or mismatch `rows`/`headers` keys — a bad `key` silently yields `undefined` cell values.

**Debuggability.** Decent: IDs are deterministic and greppable (`data-table-{n}__header-{key}`, `data-table-{n}-expanded-row-{id}`, `rowId:header` cell ids) via `setupGetInstanceId`. Class names are all BEM under the `cds--` prefix. The downside is that state is opaque — there's no way to read `sortDirection` or the internal `rowsById` from outside; only `rows`/`selectedRows` are surfaced.

**Learning curve.** Steep for the first table. You must write ~30 lines of JSX and remember which of ten getters goes on which of ~20 components; forgetting `getCellProps` silently loses the `headers` a11y association, forgetting `getExpandedRowProps` breaks `aria-controls`. Once the pattern clicks, it's mechanical.

**Escape hatches.** Good ones: `sortRow`, `filterRows`, `translateWithId` on 4 components, `className` on essentially everything, `ClassPrefix` for the CSS prefix, plus the option to skip `DataTable` entirely and hand-render `Table`+primitives with your own state (they're independently exported and stateless).

---

### 5. Features

| Feature | Supported | Where |
|---|---|---|
| Sorting | Yes — 3-state cycle NONE→ASC→DESC→NONE | `state/sorting.ts:49-68`, `tools/sorting.ts` |
| Custom sort | Yes — `sortRow(cellA, cellB, {key, sortDirection, sortStates, locale, compare, rowIds})` | `state/sorting.ts:20-24` |
| Locale-aware compare | Yes — `localeCompare` with `{numeric}` auto-detect | `tools/sorting.ts:45-49` |
| Per-column sortability | Yes — resolution order: `getHeaderProps({isSortable})` → `header.isSortable` → table `isSortable` | `DataTable.tsx:422` |
| Filtering / search | Yes — substring across all non-boolean cells | `tools/filter.ts`, `TableToolbarSearch.tsx` |
| Custom filtering | Yes — `filterRows` prop | `DataTable.tsx:356` |
| Multi-filter popover | **Example only**, not exported | `stories/examples/TableToolbarFilter.tsx` |
| Pagination | Separate component, **not integrated** — you slice rows yourself | `Pagination.tsx`; wiring shown in `stories/DataTable-pagination.stories.js:100-205` |
| Row expansion | Yes | `TableExpandRow`, `TableExpandedRow`, `getRowProps`/`getExpandedRowProps` |
| Expand-all | Yes — `TableExpandHeader enableToggle` + `getExpandHeaderProps` | `DataTable.tsx:443-471` |
| Row selection (checkbox) | Yes, incl. indeterminate select-all | `TableSelectAll`, `TableSelectRow`, `DataTable.tsx:537-580` |
| Single selection (radio) | Yes — `radio` prop | `DataTable.tsx:738-759` |
| Disabled rows | Yes — excluded from select-all and from `selectedRows` | `DataTable.tsx:645-649, 685` |
| Selection ∩ filtering | Yes — select-all only touches currently-filtered rows | `DataTable.tsx:678-686` |
| Batch actions | Yes — floating bar with count, optional "Select all (n)", Cancel | `TableBatchActions.tsx`, `TableBatchAction.tsx` |
| Inline editing | **No** — `isEditable/isEditing/isValid/errors` exist on cells but are constants with a TODO | `tools/normalize.js:52-67` |
| Column resize | **No** — no matching code in `DataTable/` or the SCSS | — |
| Column reorder / drag | **No** | — |
| Sticky header | Yes, flagged experimental ("may not work with every combination of table props") | `Table.tsx:225-231`, `_mixins.scss#sticky-header`, `_data-table.scss:771-975` |
| Zebra striping | Yes — `useZebraStyles` | `Table.tsx:123` |
| Row heights | Yes — `xs \| sm \| md \| lg \| xl` (default `lg`) | `Table.tsx:109` |
| Static width | Yes — `useStaticWidth` (`width:auto` instead of 100%) | `Table.tsx:124` |
| Auto top-alignment on wrap | Yes, **experimental** — measures text with a canvas 2D context, debounced on resize + on `document.fonts.ready` | `Table.tsx:63-211` |
| Skeleton / loading | Yes, separate component | `DataTableSkeleton.tsx` (`rowCount`, `columnCount`, `showHeader`, `showToolbar`, `zebra`, `size`, `headers`) |
| Overflow menus | Toolbar: `TableToolbarMenu`. Per-row: documented pattern only — add a `TableCell className="cds--table-column-menu"` yourself | `DataTable.mdx:371-395` |
| `overflowMenuOnHover` | Yes — toggles `cds--data-table--visible-overflow-menu` | `Table.tsx:126` |
| AI label / "slug" decorators | Yes — `TableDecoratorRow` (current), `TableSlugRow` (deprecated), `TableContainer aria-enabled`, header `decorator`/`slug` | `TableDecoratorRow.tsx`, `TableHeader.tsx:173-185` |
| i18n | Yes — `translateWithId` on `DataTable`, `TableHeader`, `TableBatchActions`, `TableToolbarSearch` | `DataTable.tsx:55-84` etc. |
| Title / description header | Yes — `TableContainer title` / `description` | `TableContainer.tsx:75-109` |

---

### 6. Flexibility & customization

**Custom cell / header rendering** — full control, because *you* write the JSX. `cell.value` is `any`, so a row value can be a React element; the default comparator even unwraps one level (`a?.props?.children`) when sorting elements (`tools/sorting.ts:30-35`). `header.header` is typed `ReactNode`. You can add extra columns that don't exist in `headers` (that's how the overflow-menu pattern works) — the DataTable state simply doesn't know about them.

**Theming** — three layers, all Sass/CSS-variable driven:
1. **Design tokens.** `_data-table.scss` consumes semantic tokens (`$layer`, `$layer-accent`, `$layer-hover`, `$layer-selected-hover`, `$text-primary`, `$text-secondary`, `$text-disabled`, `$border-subtle-01/02/03`, …) from `@carbon/themes`. There is exactly one component-level Sass variable: `$data-table-column-hover: $layer-selected-hover !default` (`data-table/_vars.scss`).
2. **Theme swap.** `@use '@carbon/styles/scss/theme' with ($theme: ...)` at build time, or the React `<Theme theme="g100">` / `<GlobalTheme>` components (`packages/react/src/components/Theme/index.tsx`) which set a class and a `ThemeContext`.
3. **Class prefix.** `<ClassPrefix prefix="my">` rewires `PrefixContext`; every table component reads it through `usePrefix()`.

Plus one public Sass mixin for sticky tables: `sticky-header($min-width, $max-width, $max-height)` in `packages/styles/scss/components/data-table/_mixins.scss`.

**Slot / override system** — there isn't one. No `components={{ Row: MyRow }}` map, no `renderCell` prop, no polymorphic `as`. The extension points are: (a) `className` on every component, (b) arbitrary extra props passed through the getters and spread onto the DOM node, (c) `decorator`/`slug` slots on header/row/container, (d) `Pagination.renderPageSelect` (the only genuine render-slot in the family, `Pagination.tsx:118-133`).

**How far can you deviate?** Very far, if you abandon `DataTable`. Because `Table`, `TableHead`, `TableRow`, `TableCell` etc. are exported independently and are essentially class-name wrappers over native elements, you can drive them from TanStack Table, a server-driven store, or anything else and keep 100% of Carbon's visual language. That is the realistic path for virtualization, column resizing, grouping, or server-side sort/filter. Staying *inside* `DataTable` you are constrained: no controlled sort/selection props, no access to internal state beyond `rows`/`selectedRows`, and hard-coded element types.

Notable friction points found in the source:
- `getRowProps` returns `onExpand: composeEventHandlers([handleOnExpandRow(row.id), onClick])` (`DataTable.tsx:514`) — the `onClick` you pass is wired into the *expand* handler as well as `onClick`.
- `TableRow` deliberately **strips** `aria-label`, `aria-controls`, `onExpand`, `isExpanded`, `expandHeader` from the props it receives (`TableRow.tsx:32-41`), so most of what `getRowProps` returns is discarded unless the row is a `TableExpandRow`.
- `TableToolbarSearch` still emits a `''` sentinel instead of an event on mount for `defaultValue`, with TODOs in both files to remove it in the next major (`TableToolbarSearch.tsx:178-188`, `DataTable.tsx:844-846`).

---

### 7. Accessibility

Carbon treats a11y as a first-class requirement here (IBM Able guidelines are cited inline in the source).

**Semantics & ARIA actually emitted:**

| Concern | Implementation |
|---|---|
| Table accessible name | `Table` emits `aria-labelledby={titleId}` / `aria-describedby={descriptionId}` from `TableContext`, populated by `TableContainer`'s `title`/`description` (`Table.tsx:216-217`, `TableContainer.tsx:68-100`). Docs also require you to pass `aria-label`/`aria-labelledby`/`title` yourself (`DataTable.mdx:488-497`). |
| Header↔cell association | `getHeaderProps` assigns `id="data-table-{n}__header-{key}"`; `getCellProps` sets the matching `headers` attribute on each `<td>` (`DataTable.tsx:404-441`, `620-640`). Both `TableCell` and `TableExpandRow` document this as WCAG H43 / IBM Able `ci162`. Unit-tested in `__tests__/DataTable-test.js:159-224` (including custom-id override). |
| Sorting | `<th aria-sort="none\|ascending\|descending">` mapped from sort state (`TableHeader.tsx:77-81, 215-216`). The clickable target is a real `<button type="button">`, not a click handler on the `th`. |
| Sort instructions for SR | A `<div class="cds--table-sort__description" id={uniqueId}>` holds a context-aware sentence ("Click to sort rows by X header in descending order" / "Click to unsort…"), referenced by `aria-describedby` on the button (`TableHeader.tsx:217-256`). |
| Scope | `TableHeader scope="col"` by default; `TableSelectAll` and `TableExpandHeader` hard-code `scope="col"`. |
| Expansion | Toggle is a `<button>` with `aria-expanded`, `aria-controls` and `aria-label`; `getRowProps` supplies `aria-controls="data-table-{n}-expanded-row-{rowId}"` and `getExpandedRowProps` sets the matching `id` (`DataTable.tsx:500-532`). Expand-all's `aria-controls` is the space-separated list of every expanded-row id (`DataTable.tsx:463-466`). |
| Expand/collapse labels | Swap with state via `translateWithId` keys `carbon.table.row.expand/collapse`, `carbon.table.all.expand/collapse`. |
| Selection | `TableSelectRow` renders `InlineCheckbox` or `RadioButton` (real inputs) with a state-dependent `aria-label` (`Select row`/`Unselect row`); `TableSelectAll` supports `indeterminate` (`DataTable.tsx:561-579`). |
| Live regions | `TableBody` defaults to `aria-live="polite"` (`TableBody.tsx:21`), so filter/sort row changes are announced. The selection cells opt *out* with `aria-live="off"` (`TableSelectRow.tsx:126`, `TableSelectAll.tsx:78`) to avoid announcement storms on select-all. |
| Batch action bar | `aria-hidden={!shouldShowBatchActions}` plus `tabIndex={shouldShowBatchActions ? 0 : -1}` on the buttons, so the hidden bar is removed from both the a11y tree and the tab order (`TableBatchActions.tsx:125, 141, 151`). |
| Toolbar | `<section role="group" aria-label="data table toolbar">` (`TableToolbar.tsx:60-62`). |
| Pagination | Prev/next are `IconButton`s with `aria-label={backwardText/forwardText}`; page and page-size are real `<Select>` elements with labels (`Pagination.tsx:564-585`). |

**Focus management.** Deliberately minimal — Carbon relies on native focus order rather than a roving-tabindex grid. There is no arrow-key cell navigation (`aria-rowindex`/`aria-colindex`/`role="grid"` are absent). Explicit focus code found: `TableToolbarSearch` focuses the inner `<input>` after expansion via a `focusTarget` state + effect (`TableToolbarSearch.tsx:171-176`); `TableHeader` guards against the sort handler firing when the click lands inside a nested AILabel (`TableHeader.tsx:231-241`).

**Tests.**
- **AVT/e2e:** `e2e/components/DataTable/DataTable-test.avt.e2e.js` — 15 Playwright tests using `expect(page).toHaveNoACViolations(...)` (IBM Equal Access checker, configured in `achecker.js`) across basic, xl-two-lines, batch-actions, dynamic, expansion (×3), filtering, selection (×2), skeleton, sorting, and toolbar (×4) stories. Two of these are full **`@avt-keyboard-nav`** scripts: one walks search → settings → select-all (asserting Enter does nothing and Space toggles) → expand button → row checkbox → shift-tabs back into the batch bar → Delete/Save/Download/Cancel; the other drives the filter popover entirely by keyboard.
- **Unit:** `__tests__/DataTable-test.js` (~33 cases) covers header/cell `headers` association explicitly, but contains **no** axe/`toHaveNoACViolations` assertions — a11y verification lives entirely in the e2e layer.

**Gaps.** No `role="grid"` / cell-level keyboard navigation; sticky-header + selection needs special CSS handling (comment at `_data-table.scss:866`); `aria-live="polite"` on the whole `<tbody>` can be verbose on large re-renders.

---

### 8. Properties / attributes exposed

Every component defines both a TS interface and runtime `propTypes` in the same `.tsx` file; the barrel `packages/react/src/index.ts:359-373` re-exports the prop types (`TableCellProps`, `TableRowProps`, …).

#### `DataTable` — `DataTable.tsx:294-327` (types), `:915-1019` (propTypes)

| Prop | Type | Notes |
|---|---|---|
| `rows` **(required)** | `Omit<DataTableRow, 'cells'>[]` | needs unique `id`; optional `disabled`, `isSelected`, `isExpanded` |
| `headers` **(required)** | `{ key, header: ReactNode, isSortable?, slug?, decorator? }[]` | |
| `children` | `(renderProps) => ReactElement` | the render function |
| `render` | same | **deprecated** in favour of `children` |
| `isSortable` | `boolean` | table-wide default |
| `sortRow` | `SortRowFn` | custom comparator |
| `filterRows` | `(opts) => string[]` | custom filter |
| `locale` | `string` | passed to `localeCompare` |
| `radio` | `boolean` | single-select mode |
| `size` | `'xs'\|'sm'\|'md'\|'lg'\|'xl'` | default `lg` |
| `useZebraStyles`, `useStaticWidth`, `stickyHeader` | `boolean` | |
| `overflowMenuOnHover` | `boolean` | default `false` in `getTableProps` |
| `experimentalAutoAlign` | `boolean` | |
| `translateWithId` | `TFunc<TranslationKey>` | 8 message ids |

#### `Table` — `Table.tsx:22-61` / `:234-280`
`className`, `isSortable`, `overflowMenuOnHover` (default `true`), `size` (default `lg`), `stickyHeader`, `useStaticWidth`, `useZebraStyles`, `experimentalAutoAlign`, `tabIndex`. Extra props spread onto `<table>`.

#### `TableContainer` — `TableContainer.tsx:16-42` / `:116-146`
`title`, `description` (both `ReactNode`), `decorator`, `aiEnabled`, `stickyHeader`, `useStaticWidth`, plus all `HTMLAttributes<HTMLDivElement>` minus `title`.

#### `TableHead` — `TableHead.tsx`
`ThHTMLAttributes<HTMLTableSectionElement>` only; generated by `wrapComponent`.

#### `TableBody` — `TableBody.tsx:11-17` / `:28-36`
`aria-live` (`'polite'` default), `className`, standard `<tbody>` attributes.

#### `TableHeader` — `TableHeader.tsx:83-146` / `:276-331`
`children`, `className`, `colSpan`, `id`, `isSortable`, `isSortHeader`, `sortDirection` (`'NONE'|'ASC'|'DESC'`), `onClick`, `scope` (default `'col'`), `decorator`, `slug` (deprecated), `translateWithId`. `forwardRef` to the `<th>`.

#### `TableRow` — `TableRow.tsx:18-25` / `:69-98`
`className`, `isSelected`, plus the shared `TableRowExpandInteropProps` (`ariaLabel`, `aria-label`, `aria-controls`, `onExpand`, `isExpanded`, `expandHeader`) which it **destructures away and does not render**. `forwardRef` to `<tr>`.

#### `TableCell` — `TableCell.tsx:13-38` / `:61-82`
`children`, `className`, `colSpan`, `headers`, `hasAILabelHeader`. `forwardRef` to `<td>`.

#### Expansion
- `TableExpandHeader` — `TableExpandHeader.tsx:16-82` / `:129-196`: `enableToggle`, `enableExpando` (deprecated), `isExpanded`, `onExpand`, `aria-label`, `aria-controls`, `expandIconDescription`, `id` (default `'expand'`).
- `TableExpandRow` — `TableExpandRow.tsx:59-102` / `:189-236`: `aria-label` **(required)**, `onExpand` **(required)**, `aria-controls`, `isExpanded`, `isSelected`, `expandHeader` (default `'expand'`), `expandIconDescription`.
- `TableExpandedRow` — `TableExpandedRow.tsx:14-20` / `:58-73`: `colSpan` **(required)**, `children`, `className`.

#### Selection
- `TableSelectAll` — `TableSelectAll.tsx:15-62` / `:94-141`: `id` **(required)**, `name` **(required)**, `onSelect` **(required)**, `checked`, `indeterminate`, `disabled`, `className`, `aria-label`, `ariaLabel` (deprecated).
- `TableSelectRow` — `TableSelectRow.tsx:17-74` / `:144-196`: same plus `radio` and `onChange(value, name, event)`.

#### Toolbar
- `TableToolbar` — `TableToolbar.tsx:20-43` / `:71-97`: `size` (`'xs'|'sm'|'lg'`), `aria-label` (default `'data table toolbar'`), `ariaLabel` (deprecated).
- `TableToolbarContent` — `wrapComponent` `<div class="cds--toolbar-content">`, `className` only.
- `TableToolbarSearch` — `TableToolbarSearch.tsx:66-133` / `:246-341`: `persistent`, `expanded`, `defaultExpanded`, `defaultValue`, `disabled`, `id`, `labelText`, `placeholder`, `size`, `tabIndex`, `searchContainerClass`, `translateWithId`, + `SearchProps` minus the overridden handlers.
- `TableToolbarMenu` — `TableToolbarMenu.tsx:54-81`: `= OverflowMenuProps`; defaults `renderIcon=Settings`, `iconDescription='Settings'`, `flipped`, size inherited from `TableToolbarContext`.
- `TableToolbarAction` — `TableToolbarAction.tsx:12-38`: `onClick` **(required)**, `children`; renders an `OverflowMenuItem`.

#### Batch actions
- `TableBatchActions` — `TableBatchActions.tsx:55-93` / `:160-199`: `totalSelected` **(required)**, `onCancel` **(required)**, `onSelectAll`, `totalCount`, `shouldShowBatchActions`, `translateWithId`.
- `TableBatchAction` — `TableBatchAction.tsx:13-30` / `:44-67`: `renderIcon` (default `AddFilled`), `iconDescription` (default `'Add'`), `hasIconOnly`, + `ButtonHTMLAttributes`.
- `TableActionList` — `wrapComponent` `<div class="cds--action-list">`.

#### Decorators
- `TableDecoratorRow` — `decorator`, `className`.
- `TableSlugRow` — `slug`, `className`; logs a deprecation via `deprecateComponent` in a `useEffect`.

#### Adjacent
- `DataTableSkeleton` — `DataTableSkeleton.tsx:26-66` / `:143-187`: `rowCount` (5), `columnCount` (5), `headers`, `showHeader` (true), `showToolbar` (true), `size` (`lg`), `zebra`, `className`.
- `Pagination` — `Pagination.tsx:29-160`: `pageSizes` **(required)**, `page`, `pageSize`, `totalItems`, `pagesUnknown`, `isLastPage`, `disabled`, `pageInputDisabled`, `pageSizeInputDisabled`, `size`, `backwardText`/`forwardText` (+ tooltip positions), `itemRangeText`, `itemText`, `itemsPerPageText`, `pageRangeText`, `pageSelectLabelText`, `pageText`, `renderPageSelect`, `onChange`.

---

### 9. Events exposed

`DataTable` itself exposes **no `on*` props**. All eventing flows through the render-prop getters, which *compose* your handler with Carbon's internal one via `tools/events.ts#composeEventHandlers` — your handler runs unless a prior one called `preventDefault()`.

| Callback | Passed via | Signature | Defined at |
|---|---|---|---|
| Header click / sort | `getHeaderProps({ header, onClick })` | `(event, { sortHeaderKey, sortDirection }) => void` — your handler receives the **next** sort state | `DataTable.tsx:426-439`, wrapper at `:476-484` |
| Expand-all | `getExpandHeaderProps({ onExpand, onClick })` | `onExpand(event)`; `onClick(event, { isExpanded })` | `DataTable.tsx:443-471`, wrapper `:489-498` |
| Row expand | `getRowProps({ row, onClick })` → `onExpand` | `(event) => void` | `DataTable.tsx:500-522` |
| Row / all selection | `getSelectionProps({ row?, onClick })` → `onSelect` | `(event) => void` | `DataTable.tsx:537-580` |
| Batch cancel | `getBatchActionProps()` → `onCancel` | `() => void` (deselects everything, hides the bar) | `DataTable.tsx:587-599`, impl `:703-711` |
| Batch select-all | `getBatchActionProps({ onSelectAll })` | your own — rendering-only, **no built-in behaviour** (stated in the prop doc, `TableBatchActions.tsx:69-74`) | — |
| Filter input | `onInputChange` render prop → `TableToolbarSearch onChange` | `(event \| '', value?) => void` | `DataTable.tsx:840-849` |

Component-level events (usable standalone):

| Component | Event |
|---|---|
| `TableExpandRow` / `TableExpandHeader` | `onExpand: MouseEventHandler<HTMLButtonElement>` (required on `TableExpandRow`) |
| `TableSelectRow` | `onSelect: MouseEventHandler<HTMLInputElement>` (required) and `onChange(value: boolean, name: string, event)` |
| `TableSelectAll` | `onSelect` (required) |
| `TableBatchActions` | `onCancel` (required), `onSelectAll` |
| `TableBatchAction` | `onClick` (inherited from `Button`) |
| `TableToolbarAction` | `onClick` (required) |
| `TableToolbarSearch` | `onChange(event, value)`, `onClear()`, `onExpand(event, newExpand)`, `onFocus(event, handleExpand)`, `onBlur(event, handleExpand)` — the last two hand you the expand-toggler so you can control expansion (`TableToolbarSearch.tsx:94-120`) |
| `TableExpandedRow` | internal `onMouseEnter`/`onMouseLeave` that toggle `cds--expandable-row--hover` on the previous sibling row (`TableExpandedRow.tsx:32-47`) |
| `Pagination` | `onChange({ page, pageSize, ref })` |
| `TableToolbarFilter` (example) | `onApplyFilter(selectedCheckboxes: string[])`, `onResetFilter()` |

**Web Components** use DOM CustomEvents instead, declared as static getters (`packages/web-components/src/components/data-table/table.ts:966-1032`): `cds-table-header-cell-sort` (`eventBeforeSort`), `eventSearchInput`, `eventBeforeChangeSelection`, `eventBeforeChangeSelectionAll`, `eventClickCancel`, `eventExpandoToggle`, `eventTableRowSelect`, `eventTableRowSelectAll`, `eventTableSorted`, `eventTableFiltered`; plus `eventRadioChange`, `eventCheckboxChange`, `eventBeforeExpandoToggle` on `table-row.ts` and `eventClickSelectAll` on `table-batch-actions.ts`.

---

### 10. Helpers / utilities

#### Prop getters (all defined in `DataTable.tsx`, documented in `DataTable.mdx:515-535`)

| Getter | Line | Returns |
|---|---|---|
| `getTableProps()` | 601 | `{ useZebraStyles, size, isSortable, useStaticWidth, stickyHeader, overflowMenuOnHover, experimentalAutoAlign }` |
| `getTableContainerProps()` | 613 | `{ stickyHeader, useStaticWidth }` |
| `getToolbarProps()` | 582 | `{ size }` (only `xs`/`sm` propagate) |
| `getHeaderProps({header, onClick, isSortable, ...})` | 404 | `{ id, key, sortDirection, isSortable, isSortHeader, slug, decorator, onClick }` |
| `getExpandHeaderProps({onClick, onExpand})` | 443 | `{ 'aria-label', 'aria-controls', isExpanded, onExpand, id }` |
| `getRowProps({row, onClick})` | 500 | `{ key, onClick, onExpand, isExpanded, isSelected, disabled, 'aria-label', 'aria-controls', expandHeader }` |
| `getExpandedRowProps({row})` | 524 | `{ id }` |
| `getSelectionProps({row?, onClick})` | 537 | row: `{ checked, onSelect, id, name, 'aria-label', disabled, radio }`; header: `{ checked, indeterminate, id, name, 'aria-label', onSelect }` |
| `getCellProps({cell, headers?})` | 620 | `{ key, headers, hasAILabelHeader }` |
| `getBatchActionProps()` | 587 | `{ shouldShowBatchActions, totalSelected, totalCount, onCancel, onSelectAll }` |

#### Actions (state mutators on the render props, `DataTable.tsx:871-878`)
`sortBy(headerKey)`, `selectAll()`, `selectRow(rowId)`, `expandRow(rowId)`, `expandAll()`, `onInputChange(event, defaultValue?)`.

#### Sorting utilities
- `state/sortStates.ts` — `sortStates = { NONE, ASC, DESC }` and the `DataTableSortState` type (`DataTableSortState` is publicly exported from the barrel).
- `state/sorting.ts` — `initialSortState`, `getNextSortDirection(prev, current, prevState)` (the NONE→ASC→DESC→NONE cycle), `getNextSortState(props, state, {key})`, `getSortedState(props, state, key, direction)`.
- `tools/sorting.ts` — `compare(a, b, locale)` (number-aware, unwraps `element.props.children`, coerces `null`→`''`), private `compareStrings` using `localeCompare` with `{ numeric }`, `sortRows(config)`, `defaultSortRow(cellA, cellB, { sortDirection, sortStates, locale })`.

#### Data utilities
- `tools/cells.ts` — `getCellId(rowId, header)` → `"rowId:header"`. Also handed to your custom `filterRows`.
- `tools/normalize.js` / `tools/denormalize.js` — the flatten/rehydrate pair described in §3.
- `tools/filter.ts` — `defaultFilterRows({ rowIds, headers, cellsById, inputValue, getCellId })`; trims + lowercases, skips boolean cells.
- `state/getDerivedStateFromProps.js` — the prop→state reconciler.

#### Shared internals used by the table
- `tools/events.ts#composeEventHandlers` — handler composition with `defaultPrevented` short-circuit.
- `tools/wrapComponent.ts` — the element+className factory behind `TableHead`, `TableToolbarContent`, `TableActionList`.
- `tools/setupGetInstanceId.ts`, `internal/useId` — deterministic IDs.
- `internal/usePrefix.ts` (`PrefixContext`, default `'cds'`), `internal/useEvent#useWindowEvent`, `internal/useIsomorphicEffect`, `internal/isComponentElement` (used to detect `AILabel`/`TableSlugRow` children).
- `prop-types/deprecate`, `prop-types/deprecateComponent`, `prop-types/requiredIfGivenPropIsTruthy`.

#### Test utilities
`packages/test-utils/` (`src/dom.js`, `src/react.js`, `src/scss.js`, `src/renderer.js`) — generic Carbon test helpers, not table-specific. There is **no** table-specific testing API (no `getByTableRow`-style helpers). Component tests use plain Testing Library queries by role (`getAllByRole('columnheader')`, `getAllByRole('cell')`). `e2e/test-utils/storybook.js#visitStory` powers the Playwright AVT suite.

---

### 11. Verdict

- **Strength — accessibility is genuinely engineered, not bolted on.** Real `<button>` sort triggers with `aria-sort` plus a state-aware `aria-describedby` sentence, automatic `th id` ↔ `td headers` wiring (unit-tested), `aria-controls`/`aria-expanded` on expansion, `aria-live` tuned per region, batch bar removed from the tab order when hidden, and 15 IBM Equal Access Playwright checks including two scripted keyboard-navigation walkthroughs. Few table libraries ship this much a11y by default.

- **Strength — clean headless core with a normalized store.** The `normalize → id-keyed maps → denormalize` design (`tools/normalize.js` + `tools/denormalize.js`) makes every mutation an O(1) lookup, the render-prop getters follow the well-understood Downshift pattern, and consumer handlers are composed rather than clobbered. Sorting, filtering, selection, expansion and batch actions all work out of the box with zero state code on your side.

- **Strength — enterprise polish around the edges.** Design-token theming with light/dark themes and a swappable class prefix, `translateWithId` i18n on four components, a matching skeleton component, deprecation validators, 19 KB of MDX docs, and a parallel Lit/Web-Components implementation for non-React stacks.

- **Weakness — the feature ceiling is low for a "data table".** No virtualization (grep-confirmed), no column resizing, no column reordering, no inline editing (the cell fields exist as dead constants with a TODO), no grouping, no built-in pagination integration (you slice `rows` yourself), and the multi-filter UI is a copy-paste example file rather than an exported component. Sticky header and auto-alignment are both flagged experimental, and `experimentalAutoAlign` literally measures text with a canvas 2D context on every resize.

- **Weakness — the state is a black box and there are no controlled props.** You cannot drive `sortDirection`, `selectedRows`, or the filter value from outside; you get imperative actions and seed values only. That makes URL-synced sort, server-side sorting/pagination, and cross-component selection state awkward. Combined with the boilerplate cost (~30 lines of JSX and ten getters for a basic table) and typing rough edges (`any`-typed cell values, `[key: string]: unknown` on every getter return, `skipLibCheck: true` still recommended), the DX is verbose relative to TanStack Table.

- **Best fit.** IBM/Carbon-aligned enterprise apps rendering modest page sizes (tens to low hundreds of rows) that need accessible sorting, filtering, selection, expansion and batch actions with minimal state code — and, crucially, that are willing to page/slice their data. For big data grids or heavy customization, the right move is to skip `DataTable` and drive the exported `Table`/`TableRow`/`TableCell` primitives from your own engine: they are stateless class-name wrappers over native elements and keep the full Carbon look.

---

## Dell Design System React Common — Table components

**Repo analyzed:** `/home/brino/Code/studies/dell-design-react-common`
**Package:** `@dellstorage/dell-design-react-common` v0.2.12 (`package.json:2-4`)
**Last commit:** 2024-05-23 (`2c07fca`)

> **Important caveat up front:** `node_modules/` is not installed in this checkout, so the third-party
> component sources (`@dellstorage/clarity-react`, `react-table`) could not be read. Every claim below
> is drawn from files that *are* in this repo. Where behaviour lives inside `clarity-react`, I say so
> and cite the call-sites in this repo that prove the API shape, rather than guessing at internals.

---

### 1. Overview

This repo is **not a table library**. Its own `description` field says it plainly:

> "Override CSS of Clarity-React components to align it with Dell design standards" — `package.json:3`

It is a **SCSS skin + Storybook gallery** layered on top of VMware Clarity (via the
`@dellstorage/clarity-react` fork), plus exactly one hand-written React component. There are four
table-ish directories under `src/components/`, and only one of them contains a component:

| Directory | Contents | Is there a component? |
|---|---|---|
| `src/components/table/` | `Table.stories.tsx` only | No — re-exports nothing; renders `Table` from `@dellstorage/clarity-react/tables` |
| `src/components/dataGrid/` | `DataGrid.stories.tsx`, `DataGridStoriesData.tsx` | No — renders `DataGrid` from `@dellstorage/clarity-react/datagrid` |
| `src/components/datalist/` | `Datalist.stories.tsx` | No, and it is not a table — it's a `<datalist>` form input (`Datalist.stories.tsx:13`) |
| `src/components/DataGridWithInfiniteScroll/` | `DataGridWithInfiniteScroll.tsx` (104 lines), `Constants.ts`, mock data, story | **Yes** — the only table component authored here |

So there are three distinct "tables" in play:

1. **`Table`** — Clarity's static, presentational `<table>` wrapper. This repo contributes only
   `src/styles/components/Table.scss` (127 lines) and a stories file.
2. **`DataGrid`** — Clarity's full-featured datagrid. This repo contributes only
   `src/styles/components/DataGrid.scss` (201 lines) and a stories file. **No source in this repo.**
3. **`DataGridWithInfiniteScroll`** — the repo's own component, a ~65-line-of-logic wrapper over
   **react-table v7** (`react-table: ^7.8.0`, `package.json:24`; `@types/react-table: ^7.7.12`,
   `package.json:113`). Note: **v7, not TanStack Table v8** — the legacy hooks API.

**Frameworks:** React 17 only (`react: ^17.0.2`, `react-dom: 17.0.2`, `package.json:18-19`,
`resolutions.@types/react: 17.0.14`). No Vue/Angular/Svelte. TypeScript 4.5.

**Dead table dependencies:** `react-data-table-component@^7.5.2`, `react-infinite-scroll-component@^6.1.0`
and `react-infinite-scroll-hook@^4.0.3` are declared in `package.json:20-22` but **zero source files
import them** (verified by grep across `src/`). Despite its name, `DataGridWithInfiniteScroll` contains
no infinite-scroll code whatsoever.

---

### 2. Setup required

#### Package-level setup (per README)

```bash
yarn add @dellstorage/dell-design-react-common
```

```tsx
// index.tsx — README.md:15-22
import "@webcomponents/custom-elements/custom-elements.min.js";
import "@dellstorage/dell-design-react-common/main.css";
import "@clr/icons/clr-icons-lite.min.js";
import "@clr/icons/shapes/technology-shapes.js";
```

Peer/companion deps you must also have: `@dellstorage/clarity-react` (the components themselves),
`@clr/icons`, `@clr/ui`, `@webcomponents/custom-elements`. Note `@clr/*` and `@webcomponents/*` are
**not** listed in `package.json` at all — the README asks you to import files from packages the
package does not declare.

#### Minimum working table (`Table`)

```tsx
// src/components/table/Table.stories.tsx:13-26
import {Table} from "@dellstorage/clarity-react/tables";
import "styles/components/Table.scss";

<Table isCompact isNonBordered isVertical>
  <thead><tr><th className="left">Decimal</th><th>Hexadecimal</th></tr></thead>
  <tbody><tr><td className="left">1</td><td>1</td></tr></tbody>
</Table>
```

#### Minimum working datagrid (`DataGrid`)

```tsx
// src/components/dataGrid/DataGrid.stories.tsx:15-21, 86-93
import {DataGrid} from "@dellstorage/clarity-react/datagrid";
import "styles/components/DataGrid.scss";

<DataGrid
  columns={[{columnName: "IP"}, {columnName: "Serial"}]}
  rows={[{rowData: [{columnName: "IP", cellData: "192.168.0.1"},
                    {columnName: "Serial", cellData: "abc"}]}]}
  footer={{showFooter: true}}
  itemText="Items"
/>
```

#### Minimum working `DataGridWithInfiniteScroll`

```tsx
// src/components/DataGridWithInfiniteScroll/DataGridInfiniteScroll.stories.tsx:12-19
import DataGridWithInfiniteScroll from "components/DataGridWithInfiniteScroll/DataGridWithInfiniteScroll";
import "styles/components/DataGridWithInfinteScroll.scss";
import "bootstrap/dist/css/bootstrap.css";

const columns = [{accessor: "ip", Header: "IP"}, {accessor: "serial", Header: "Serial"}];
<DataGridWithInfiniteScroll rows={rowData} columns={columns} />
```

#### Build / packaging problems that block real consumption

These are concrete and verifiable, and they matter more than any feature gap:

| Issue | Evidence |
|---|---|
| **No public barrel export.** There is no `src/components/index.ts`. `main` points at `dist/index.js`, which is compiled from `src/index.tsx` — a Create-React-App bootstrap that calls `ReactDOM.render(<App/>, document.getElementById("root"))`. Importing the package would try to mount a demo app. | `package.json:8`, `src/index.tsx:17-22`, `src/App.tsx` |
| **`DataGridWithInfiniteScroll` is unreachable by consumers** — not exported anywhere, only importable by deep path into `dist/`. | grep: no `export` of it outside its own file |
| **Absolute imports won't resolve for consumers.** The component imports `"components/DataGridWithInfiniteScroll/Constants"`, which only works via `baseUrl: "src"`. `tsc` does not rewrite these, so the emitted `dist/` JS contains a bare `components/...` specifier. | `DataGridWithInfiniteScroll.tsx:13`, `tsconfig.json:9` |
| **Its stylesheet is never bundled.** `src/styles/index.scss` imports 30 component stylesheets but **omits `DataGridWithInfinteScroll.scss`** (also note the typo in the filename: "Infinte"). So the advertised `main.css` does not style this component. | `src/styles/index.scss:11-42` |
| **Webpack only compiles SCSS under `src/styles`**, and the entry is `./src` (the CRA app), so the "library" build is really an app build. | `webpack.config.js:12, 42-44` |
| **Mock data imports a devDependency** from non-story source. `DatagridInfiniteScrollMockData.ts` imports `@faker-js/faker` (a devDep, `package.json:97`) and would be compiled into `dist/`. | `DatagridInfiniteScrollMockData.ts:10` |

Build steps are `yarn build` → `webpack --mode=production && tsc`, then `yarn copy`
(`package.json:40-41`); `Makefile` wraps build/pack/package/publish.

---

### 3. How it works

#### `Table` (Clarity) — pure CSS
Fully **uncontrolled and stateless**. You write raw `<thead>/<tbody>/<tr>/<td>` as children; the
component only toggles class names. The three boolean props map 1:1 to CSS classes, and the repo's
own stories document the mapping (`Table.stories.tsx:260-293`):

| Prop | Class | Effect |
|---|---|---|
| — | `.table` | base styling |
| `isNonBordered` | `.table-noborder` | removes row/edge borders and background |
| `isCompact` | `.table-compact` | row height 36px → 24px |
| `isVertical` | `.table-vertical` | drops header row, styles left-most column as header |
| (on `td`/`th`) | `.left` | left-align cell content |

There is no data model, no virtualization, no state. It is a styled `<table>`.

#### `DataGrid` (Clarity) — imperative, ref-driven, async
Architecturally the most interesting one, and the pattern is unusual. From the call-sites:

- **Data model is column-name-keyed, not index-keyed.** A row is `{rowData: [{columnName, cellData}]}`
  (`DataGridStoriesData.tsx:44-54`), so cells are matched to columns by string name.
- **State is owned by the grid (uncontrolled), and reached via `ref`.** Stories create
  `React.createRef<DataGrid>()` and pass that ref *into the filter component* so the filter can push
  results back into the grid: `<DataGridFilter datagridRef={datagridFilterRef} .../>`
  (`DataGrid.stories.tsx:42-46, 58-63`). Imperative methods are called on the instance, e.g.
  `datagridDetailsDemoRef.current.handleDetailPaneToggle(rowIndex)` (`DataGrid.stories.tsx:255-259`).
  This is a class component with a public imperative API — not a hooks/controlled design.
- **All data operations are async and delegated to you.** Sorting, filtering, pagination and row
  expansion are all `Promise`-returning callbacks that *you* implement:
  - `sortFunction(rows, sortOrder, columnName) => Promise<DataGridRow[]>` (`DataGridStoriesData.tsx:342`)
  - `onFilter(rows, columnValue, columnName) => Promise<DataGridFilterResult>` (`:310-314`)
  - `getPageData(pageIndex, pageSize) => Promise<DataGridRow[]>` (`:207`)
  - `onRowExpand() => Promise<any>` (`:107-114`, wired at `:153`)

  The grid renders a spinner while these resolve (the stories add deliberate 2s `setTimeout` delays
  "to see loading spinner" — `:213, 379, 570`). Net effect: **server-side by default**. There is no
  built-in client-side sort/filter comparator; you write it every time.
- **Not virtualized.** Nothing in the SCSS or the API suggests windowing. Pagination is the scale story.
- **Styled, not headless** — Clarity ships the full DOM and CSS classes (`.datagrid-table`,
  `.datagrid-column`, `.datagrid-row-sticky`, `.datagrid-scrolling-cells`, …).

#### `DataGridWithInfiniteScroll` (this repo) — thin react-table v7 render loop
The whole component is the canonical react-table v7 example, unmodified:

```tsx
// DataGridWithInfiniteScroll.tsx:49-52
const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} = useTable({columns, data});
```

Header/body render via `column.render("Header")` / `cell.render("Cell")` (`:63, :83`, with the string
literals hidden behind a two-member enum in `Constants.ts:11-14`). It adds exactly two things over
a bare `useTable` example: a `<div className="datagrid-column-separator"/>` after each header (`:64`)
and an `isLoading` → `<Spinner size={SpinnerSize.SMALL}/>` early return (`:102`). No plugin hooks
(`useSortBy`, `usePagination`, `useRowSelect`, `useExpanded`, `useFlexLayout`) are registered, so
none of react-table's features are wired up. Fully uncontrolled; data is a plain prop; no memoization
of `columns`/`data` is done or documented, which in react-table v7 causes re-instantiation churn.

---

### 4. Developer experience

**TypeScript quality: weak.**
- `DataGridProps.rows: Row[]` (`DataGridWithInfiniteScroll.tsx:31`) is wrong. `Row` is react-table's
  *instance* type (the thing `prepareRow` produces, carrying `getRowProps`, `cells`, etc.), not the
  input data type. The correct type is a plain data generic `D extends object`. The mock data
  sidesteps this by typing itself `Array<any>` (`DatagridInfiniteScrollMockData.ts:12`), which is
  exactly the smell you'd expect — the story only compiles because the data is `any`.
- `style?: any` (`:32`) instead of `React.CSSProperties`.
- No generics at all — cell data is untyped end-to-end. `DataGrid`'s `cellData` is likewise untyped
  (holds strings, numbers, and JSX interchangeably — `DataGridStoriesData.tsx:410-421`).
- The component file **never imports React** despite returning JSX; this only works because
  `tsconfig.json:24` sets `"jsx": "react-jsx"`.

**Docs:** Storybook 6 is the only documentation surface (`yarn storybook`, port 6006). Coverage is
decent for `DataGrid` — 13 stories covering filtering, pagination, sorting, custom cells, multi/single
select, expandable rows, detail pane, compact rows, empty state, and a "full demo"
(`DataGrid.stories.tsx:48-322`). `Table` has 9 stories. `DataGridWithInfiniteScroll` has **one**
("Basic Grid"). There is no MDX, no argTypes/controls config, and no prose docs for any table.
The README says nothing about tables at all.

**Debuggability / error messages:** No error handling anywhere in the table paths. All the
`Promise` executors in the story helpers accept a `reject` they never call
(`DataGridStoriesData.tsx:208, 315, 343, 552`), so a failed fetch in a real `getPageData` has no
documented recovery path. No `console.warn` guards, no propTypes, no dev-mode validation.

**Tests:** Effectively none. `find src -name "*.test.*"` returns exactly one file — `src/App.test.tsx`,
the stock CRA "renders learn react link" test. **Zero tests for any table component**, no snapshots,
no `__snapshots__` directory — despite the repo configuring jest + ts-jest + enzyme +
enzyme-to-json serializers (`package.json:163-179`).

**Learning curve:** Low for `Table` (it's HTML). Moderate-to-awkward for `DataGrid` — the
ref-passed-into-child-filter pattern and the mandatory async callbacks are non-obvious and only
discoverable by reading the stories. Low for `DataGridWithInfiniteScroll`, but only because it does
almost nothing; the real curve is react-table v7's, which you inherit unmediated.

**Escape hatches:** Good on the SCSS side (see §6), poor on the JS side — `DataGridWithInfiniteScroll`
exposes no `renderRow`/`renderHeader` override, no ref forwarding, and no way to pass react-table
plugin hooks or `useTable` options through.

---

### 5. Features

Legend: ✅ present · ⚠️ present but you implement it · ❌ absent

| Feature | `Table` | `DataGrid` (Clarity) | `DataGridWithInfiniteScroll` (this repo) |
|---|---|---|---|
| Sorting | ❌ | ⚠️ `column.sort = {defaultSortOrder, sortFunction, isSorted}`; you supply the comparator (`DataGrid.stories.tsx:159-181`) | ❌ (`useSortBy` not registered) |
| Filtering | ❌ | ⚠️ `<DataGridFilter onFilter columnName datagridRef position showFilter/>` (`:57-64, 226-235`) | ❌ |
| Pagination | ❌ | ✅ `pagination={{totalItems, getPageData, pageSize, currentPage, pageSizes}}`, incl. `CUSTOM_PAGE_SIZE_OPTION` (`DataGridStoriesData.tsx:280-294`) | ❌ |
| Row selection | ❌ | ✅ `GridSelectionType.SINGLE` / `.MULTI`, per-row `disableRowSelection` (`:451-459`) | ❌ |
| Row expansion | ❌ | ✅ `GridRowType.EXPANDABLE` + `expandableRowData {expandableContent, onRowExpand, onRowContract, hideRowExpandIcon}` (`:116-188`) | ❌ |
| Detail pane | ❌ | ✅ `GridRowType.ROWS_WITH_DETAIL_PANE` + `detailPaneData.detailPaneContent` (`:536-538`) | ❌ |
| Show/hide columns | ❌ | ✅ `footer.hideShowColumns.hideShowColBtn` (`:195-200`) | ❌ |
| Column visibility (static) | ❌ | ✅ `column.isVisible: false` (`DataGrid.stories.tsx:266-269`) | ❌ |
| Column width | via CSS | ✅ `column.style={{width: "20%"}}` (`:274`) | ❌ |
| Sticky / fixed column | ❌ | ✅ CSS hooks `.datagrid-row-sticky`, `.datagrid-fixed-column` (`DataGrid.scss:53-58`) | ❌ |
| Compact density | ✅ `isCompact` | ✅ `GridRowType.COMPACT` (styled at `DataGrid.scss:185-200`) | ❌ |
| Loading state | ❌ | ✅ implicit spinner during async sort/filter/page | ✅ `isLoading` → `<Spinner/>` (`:102`) |
| Empty state | ❌ | ✅ "Empty data grid" story (`DataGrid.stories.tsx:287-291`) | ❌ (renders empty `<tbody>`) |
| Footer / item count | ❌ | ✅ `footer={{showFooter, footerData}}`, `itemText` (`:445-448`) | ❌ |
| Batch actions | ❌ | ⚠️ `GridActions` is only a sample class in the *stories data* file (`:470-502`) — not wired to any story | ❌ |
| Column resize | ❌ | ❌ | ❌ |
| Column reorder | ❌ | ❌ | ❌ |
| Inline editing | ❌ | ❌ | ❌ |
| Virtualization | ❌ | ❌ | ❌ |
| Infinite scroll | ❌ | ❌ | ❌ **— despite the component's name** |
| Grouping / tree data | ❌ | ❌ | ❌ |
| Export (CSV/etc.) | ❌ | ❌ | ❌ |

---

### 6. Flexibility & customization

**Custom cell rendering.**
- `DataGrid` has two escape hatches on a cell: `cellData` (the sortable/filterable value) and
  `cellDisplayData` (arbitrary JSX rendered in its place). The link-in-cell story uses both together
  (`DataGridStoriesData.tsx:513-526`). You can also just put JSX directly in `cellData`
  (`:415-421`, an `<Icon>` + text). Custom footer content via `footer.footerData` (`:445-448`).
- `DataGridWithInfiniteScroll` inherits react-table's `Header` / `Cell` column properties
  (`column.render("Header")`, `cell.render("Cell")` — `:63, :83`), so per-column renderers work.
  Header/row *structure* is hard-coded and not overridable.

**Theming.** SCSS-variable based, no CSS custom properties, no runtime theming, no dark mode
anywhere in the repo. Tokens live in `src/styles/common/`:
- `_colors.scss:74-79` — `$grid-text-default-color`, `$grid-border-color`, `$grid-background-color`,
  `$grid-selected-background-color`, `$grid-hover-color`, `$grid-selected-color`
- `_layout.scss:37-55, 137` — ~20 grid geometry tokens (`$grid-column-height`, `$grid-cell-min-width`,
  `$grid-compact-column-height`, `$datagrid-footer-min-height`, …)
- `_fonts.scss:25-26` — `$grid-font-size-default`, `$grid-footer-font-size-default`
- `_borders.scss:28` — `$table-border`
- `_mixins.scss:42-56` — `@mixin grid-title`, `@mixin grid-cell`

Overriding tokens requires **compiling the SCSS yourself**; the published artifact is pre-compiled
`main.css`. Consumers who take `main.css` get one fixed Dell theme.

**Specificity cost.** The override strategy is class-nesting plus `!important`. `DataGrid.scss` alone
uses `!important` **13 times** (`:26, 54, 71, 96, 143-144, 147, 152, 155, 173`), including on
`background-color`, `outline` and popover positioning. Any consumer trying to re-skin the grid is
fighting `!important` from the design layer on top of Clarity's own CSS. The repo's own style guide
says "Always override the class associated with the HTML element and not the HTML element itself"
(`README.md:115`), yet `Table.scss:19, 49` styles bare `th`/`td`, and `DataGridWithInfinteScroll.scss:26, 64`
does the same.

**className/style props.** `DataGridWithInfiniteScroll` accepts `className` and `style` — but note
`className` is applied to the **`<tbody>`** (`:77`), not the table, while `style` goes on the
`<table>` (`:95`) whose own `className` is hard-coded to `"data-grid-infinite-table"` (`:95`) and
therefore not overridable. That's almost certainly not what a caller expects. `DataGrid` accepts
`id`, `style`, and `className` (`DataGrid.stories.tsx:129, 289`).

**How far can you deviate?** For `Table`: as far as you like, it's your HTML. For `DataGrid`: you get
the Clarity chrome, take it or leave it — the DOM is Clarity's. For `DataGridWithInfiniteScroll`:
barely at all, but since it's ~65 lines, forking it is the obvious move (and arguably the intended one).

---

### 7. Accessibility

**This is the weakest area, and the finding is unambiguous.** A grep across the entire `src/` tree for
`aria-`, `role=`, `tabindex`, and `onKeyDown` returns **exactly one hit**, and it is not a table:

```
src/styles/components/Tabs.scss:17:  .nav[role="tablist"] {
```

Concretely, for this repo's own code:

- **`DataGridWithInfiniteScroll.tsx` contains no ARIA attributes, no roles, no `tabIndex`, and no
  keyboard handlers.** It renders bare `<table>/<thead>/<tr>/<th>/<td>`. It gets native table
  semantics for free, but nothing more: no `scope` on `<th>`, no `<caption>`, no `aria-label`, no
  `aria-sort`, no `aria-busy` during the `isLoading` spinner state, and no announcement of the
  loading→loaded transition.
- The **decorative `<div className="datagrid-column-separator"/>` is injected inside every `<th>`**
  (`:64`) with no `aria-hidden`, putting a non-semantic element inside the header's accessible name
  computation.
- **Focus management:** the SCSS actively removes focus indicators. `outline: none !important` appears
  on `.datagrid-column-title:focus` (`DataGrid.scss:25`), `.datagrid-detail-caret-button:focus` (`:81`),
  `.btn:focus` inside sticky rows (`:95`), and `.datagrid-footer .btn:focus` (`:153`) — four separate
  places, all `!important`, with **no replacement focus style provided**. Keyboard users lose the focus
  ring on the sortable column headers, the detail-pane toggle, and the footer/pagination buttons. This
  is a WCAG 2.4.7 (Focus Visible) failure introduced *by this repo's stylesheet*, not inherited.
- **Keyboard navigation:** no arrow-key grid navigation, no roving tabindex, nothing. Whatever
  `DataGrid` provides comes from Clarity and could not be verified here.
- **A11y tooling:** `eslint-plugin-jsx-a11y@^6.3.1` is a devDependency (`package.json:132`) but
  `.eslintrc` / `eslintConfig` only extend `react-app` + `react-app/jest` (`package.json:60-64`), and
  the lint script only globs `**/*.tsx` via a shell pattern (`package.json:46`). No
  `@storybook/addon-a11y`, no axe, **no accessibility tests of any kind**.
- The stories also model bad practice: `href="javascript:void(0);"` with the eslint rule disabled
  inline (`DataGridStoriesData.tsx:517-518`).

Verdict: accessibility here is *unaddressed*, and in the focus-outline case, *regressed*.

---

### 8. Properties / attributes exposed

#### 8a. `DataGridWithInfiniteScroll` — the only props interface defined in this repo

**File: `src/components/DataGridWithInfiniteScroll/DataGridWithInfiniteScroll.tsx:29-35`**

```ts
type DataGridProps = {
    rows: Row[];              // react-table data (mistyped — see §4)
    columns: Column<Row>[];   // react-table column defs: {accessor, Header, Cell?}
    style?: any;              // inline style applied to <table>
    isLoading?: boolean;      // true → render <Spinner> instead of the table
    className?: string;       // applied to <tbody> (not the table)
};
```

Five props total. The type is **not exported** — `DataGridProps` is file-local, so consumers cannot
even reference it.

#### 8b. `Table` (Clarity) — as exercised by this repo's stories

| Prop | Type | Description | Evidence |
|---|---|---|---|
| `isCompact` | `boolean` | Reduces row height (`.table-compact`) | `Table.stories.tsx:177` |
| `isNonBordered` | `boolean` | Removes borders + background (`.table-noborder`) | `:137` |
| `isVertical` | `boolean` | Header styling on left-most column (`.table-vertical`) | `:257` |
| children | `ReactNode` | Your `<thead>/<tbody>` | throughout |

#### 8c. `DataGrid` (Clarity) — public surface as used here

Types imported from `@dellstorage/clarity-react/datagrid`: `DataGrid`, `DataGridColumn`, `DataGridRow`,
`DataGridFilter`, `DataGridFilterResult`, `DataGridPaginationProps`, `GridRowType`, `GridSelectionType`,
`SortOrder`, `FilterPosition`, `CUSTOM_PAGE_SIZE_OPTION` (`DataGrid.stories.tsx:14-21`,
`DataGridStoriesData.tsx:12-19`).

**Grid-level props**

| Category | Prop | Description | Evidence |
|---|---|---|---|
| Data | `columns: DataGridColumn[]` | Column definitions | `DataGrid.stories.tsx:52` |
| Data | `rows: DataGridRow[]` | Row data (omit → empty state) | `:73`, `:289` |
| Layout | `rowType: GridRowType` | `COMPACT` \| `EXPANDABLE` \| `ROWS_WITH_DETAIL_PANE` | `:81, 250, 280` |
| Selection | `selectionType: GridSelectionType` | `SINGLE` \| `MULTI` | `:121, 140` |
| Paging | `pagination: DataGridPaginationProps` | `{totalItems, getPageData, pageSize, currentPage, pageSizes}` | `DataGridStoriesData.tsx:280-286` |
| Chrome | `footer` | `{showFooter, footerData?, hideShowColumns?: {hideShowColBtn}}` | `:190-200, 445-448` |
| Chrome | `itemText: string` | Noun used in the footer count ("Items", "Users") | `DataGrid.stories.tsx:82, 265` |
| Misc | `id`, `style`, `className` | Passthrough | `:129, 289` |
| Misc | `ref: React.RefObject<DataGrid>` | Required for filters and imperative calls | `:42-46` |

**`DataGridColumn`**

| Field | Description | Evidence |
|---|---|---|
| `columnName: string` | Identity — also the join key to `rowData` | `DataGridStoriesData.tsx:25-32` |
| `isVisible?: boolean` | Hide column | `DataGrid.stories.tsx:269` |
| `style?: CSSProperties` | e.g. `{width: "20%"}` | `:274` |
| `sort?: {defaultSortOrder, sortFunction, isSorted?}` | `SortOrder.ASC/DESC/NONE` | `DataGridStoriesData.tsx:386-402` |
| `filter?: ReactNode` | A `<DataGridFilter>` element | `DataGrid.stories.tsx:57-64` |

**`DataGridRow`**

| Field | Description | Evidence |
|---|---|---|
| `rowData: {columnName, cellData, cellDisplayData?}[]` | Cells; `cellDisplayData` overrides rendering | `DataGridStoriesData.tsx:243-269, 513-526` |
| `disableRowSelection?: boolean` | Per-row selection lock | `:451-459` |
| `expandableRowData?` | `{expandableContent?, onRowExpand?, onRowContract?, hideRowExpandIcon?}` | `:126-187` |
| `detailPaneData?` | `{detailPaneContent}` | `:536-538` |

**`DataGridFilter` props:** `onFilter`, `columnName`, `datagridRef`, `position: FilterPosition`,
`showFilter?: boolean` (`DataGrid.stories.tsx:57-64, 226-235`).

---

### 9. Events exposed

| Callback | Signature | Where defined / used |
|---|---|---|
| `sort.sortFunction` | `(rows, sortOrder: SortOrder, columnName) => Promise<DataGridRow[]>` | `DataGridStoriesData.tsx:342-383`; wired `DataGrid.stories.tsx:161` |
| `DataGridFilter.onFilter` | `(rows, columnValue, columnName) => Promise<DataGridFilterResult>` | `DataGridStoriesData.tsx:310-339`, `:546-574`; wired `:59` |
| `pagination.getPageData` | `(pageIndex, pageSize) => Promise<DataGridRow[]>` | `DataGridStoriesData.tsx:207-217` |
| `expandableRowData.onRowExpand` | `() => Promise<any>` — lazy-load expanded content | `:107-114`, wired `:153` |
| `expandableRowData.onRowContract` | `() => void` | `:154-156, 183-185` |
| `handleDetailPaneToggle` | `(rowIndex: number) => void` — **imperative method on the ref, not a prop** | called at `DataGrid.stories.tsx:258` |

**`DataGridWithInfiniteScroll` exposes zero callbacks.** No `onRowClick`, no `onSelectionChange`, no
`onSort`, no `onScrollEnd` — not even the scroll-end hook its name implies. Its only "event" surface
is the inbound `isLoading` flag.

---

### 10. Helpers / utilities

**Exported from library code (i.e. things a consumer could actually use): essentially nothing.**

| Export | File | Note |
|---|---|---|
| `Constants` enum | `src/components/DataGridWithInfiniteScroll/Constants.ts:11-14` | Two members: `DEFAULT_COLUMN_HEADER = "Header"`, `DEFAULT_CELL_VALUE = "Cell"` — aliases for react-table's magic strings |
| `@mixin grid-title`, `@mixin grid-cell` | `src/styles/common/_mixins.scss:42-56` | SCSS only |
| SCSS token files | `src/styles/common/_{colors,layout,fonts,borders}.scss` | SCSS only |

No hooks, no formatters, no test utilities, no `createColumnHelper` equivalent, no data adapters.

**Story-only helpers** (in `src/components/dataGrid/DataGridStoriesData.tsx` — useful as *reference
implementations*, but they are demo scaffolding and not part of any published API): `normalColumns`,
`sortColumns`, `columnsForCustomRows`, `normalRows`, `expandableRows`, `customRows`, `getRowData()`,
`getRowDataWithLink(fn)`, `getSelectableRowsData()`, `getPageData()`, `filterFunction`,
`pageFilterFunction`, `sortFunction`, `loadExpandableContent`, `paginationDetails`,
`paginationDetailswithCustomPageSize` (note the lowercase `w` typo), `defaultFooter`,
`hideShowColFooter`, `customFooter`, and a `GridActions` component that no story renders.

Mock data for the infinite-scroll grid is faker-generated: `rowData` (7 rows) and `columnsData`
(`DatagridInfiniteScrollMockData.ts:12-38`).

---

### 11. Verdict

- **This is a CSS skin, not a table library — and it should be evaluated as one.** `package.json:3`
  says so outright. The real table capability lives in `@dellstorage/clarity-react`, which is a
  separate package not vendored here. Judging "the Dell table component" from this repo means judging
  201 lines of `DataGrid.scss`, 127 lines of `Table.scss`, and one 104-line react-table wrapper.

- **Clarity's `DataGrid` is genuinely feature-rich** — sorting, filtering, pagination with custom page
  sizes, single/multi selection with per-row locks, expandable rows, detail panes, column show/hide,
  sticky columns, compact density, empty state. If you're already in the Clarity/Dell ecosystem, this
  repo does its one job (Dell-branding that grid) competently. Its async-Promise-callback design also
  means **server-side data is the default path**, which is the right default for the large-volume
  enterprise datasets it targets.

- **The `DataGrid` API is dated and awkward.** Column-name string matching instead of accessors, a
  class component driven by `ref`, filter children that need the parent's ref passed *back down* into
  them, and mandatory hand-written sort/filter comparators. Nothing is generically typed. Compared to
  TanStack Table v8 or AG Grid this feels like a 2019 API, because it is one.

- **`DataGridWithInfiniteScroll` is immature and, as shipped, unusable.** Say this plainly: it does not
  do infinite scroll; it registers no react-table plugins so it has no sorting/paging/selection; its
  `rows: Row[]` prop type is wrong; its `className` lands on `<tbody>`; its stylesheet is missing from
  `index.scss`; it's not exported from the package; and its internal absolute import won't resolve from
  `dist/`. It has one story and zero tests. It reads like an unfinished spike that got committed.

- **Accessibility is a genuine liability, not just a gap.** One `role=` in 87 source files, and that
  one is in a tabs stylesheet. Worse, this repo's own SCSS strips focus outlines with
  `outline: none !important` in four places (`DataGrid.scss:25, 81, 95, 153`) with no replacement — so
  applying the Dell skin actively *degrades* keyboard accessibility versus stock Clarity. There are no
  a11y tests and `eslint-plugin-jsx-a11y` is installed but never enabled.

- **Quality signals are poor across the board.** One CRA boilerplate test for the entire repo; three
  unused table dependencies (`react-data-table-component`, two infinite-scroll packages) still in
  `package.json`; a misspelled SCSS filename; React 17 pinned; last commit May 2024; a `main` entry
  that boots a demo app instead of exporting components.

- **Best fit:** an internal Dell/ECS product already standardized on `@dellstorage/clarity-react` and
  React 17, that needs the Dell visual identity applied to Clarity's `DataGrid` and can accept
  server-driven sorting/filtering/paging. **Poor fit** for anything needing virtualization for large
  client-side datasets, column resize/reorder, inline editing, WCAG conformance, React 18+, or an
  importable, well-typed component API — for those, `DataGridWithInfiniteScroll` should be treated as a
  starting point to fork, not a component to consume.

---

## LeafyGreen UI — Table component analysis

Repo: `/home/brino/Code/studies/leafygreen-ui` (MongoDB LeafyGreen UI monorepo).
All paths below are repo-relative. Everything here was read from source, not memory.

---

### 1. Overview

| Item | Value | Source |
|---|---|---|
| Package name | `@leafygreen-ui/table` | `packages/table/package.json` |
| Version | `15.2.3` | `packages/table/package.json` |
| Location | `packages/table/` | — |
| Framework | React only (React 18 in the workspace; React 17 supported via a dedicated harness) | root `package.json` devDeps `react: ^18.2.0`; `scripts/react17/` (`init.mjs`, `r17-packages.json`, `test-react17.sh`) |
| Wraps TanStack Table? | **Yes.** `@tanstack/react-table ^8.20.5` (lockfile resolves `8.21.3`) | `packages/table/package.json`; `pnpm-lock.yaml:7166` |
| Virtualization lib | `@tanstack/react-virtual ^3.10.7` (lockfile `3.13.12`) | `packages/table/package.json`; `pnpm-lock.yaml:7173` |
| Entry points | `.` and `./testing` (dual ESM/UMD + `types@<=5.0` downlevel) | `packages/table/package.json` `exports` |
| Versioning | Changesets, `baseBranch: main`, per-package CHANGELOG | `.changeset/config.json`; `packages/table/CHANGELOG.md` (1905 lines) |
| Build | `lg-build bundle` / `lg-build tsc` / `lg-build docs`, orchestrated by Turborepo + pnpm workspaces | `packages/table/package.json` scripts; root `turbo.json`, `pnpm-workspace.yaml` |

Related packages in the same repo:

- `packages/skeleton-loader/src/TableSkeleton/` — the loading state (it is **not** in the table package).
- `packages/pagination/` — used as a devDependency and paired in the `WithPagination` story.
- `packages/collection-toolbar/` — toolbar chrome usually placed above a table.
- `packages/leafygreen-provider/` — the only declared peer dependency: `workspace:^5.0.0 || ^4.0.0 || ^3.2.0`.

Notably the package **re-exports all of `@tanstack/react-table`** (`export * from '@tanstack/react-table'` with a `// TODO: Check if some exports might clash with our exports` above it) plus `VirtualItem` from react-virtual — `packages/table/src/index.ts:27-29`.

---

### 2. Setup required

Install: `pnpm add @leafygreen-ui/table` (README shows a stale `@13.0.0-rc.0` pin — `packages/table/README.md:14`).

**Minimum static table** (no hook, no data layer) — the components are plain semantic wrappers:

```tsx
import { Table, TableHead, TableBody, HeaderRow, HeaderCell, Row, Cell }
  from '@leafygreen-ui/table';

<Table>
  <TableHead>
    <HeaderRow><HeaderCell>First</HeaderCell><HeaderCell>Second</HeaderCell></HeaderRow>
  </TableHead>
  <TableBody>
    {data.map(r => (
      <Row key={r.id}><Cell>{r.a}</Cell><Cell>{r.b}</Cell></Row>
    ))}
  </TableBody>
</Table>
```

**Minimum data-driven table** (the intended path — you own the render loop):

```tsx
const columns = useMemo<Array<LGColumnDef<Person>>>(
  () => [{ accessorKey: 'name', header: 'Name' }], []);
const [data] = useState(() => makeData());          // stable reference required
const table = useLeafyGreenTable<Person>({ data, columns });

<Table table={table}>
  <TableHead>
    {table.getHeaderGroups().map(hg => (
      <HeaderRow key={hg.id}>
        {hg.headers.map(h => (
          <HeaderCell key={h.id} header={h}>
            {flexRender(h.column.columnDef.header, h.getContext())}
          </HeaderCell>
        ))}
      </HeaderRow>
    ))}
  </TableHead>
  <TableBody>
    {table.getRowModel().rows.map(row => (
      <Row key={row.id} row={row}>
        {row.getVisibleCells().map(cell => (
          <Cell key={cell.id} cell={cell}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </Cell>
        ))}
      </Row>
    ))}
  </TableBody>
</Table>
```

Setup notes:

- **Provider is optional but implicit.** `LeafyGreenProvider` is the only peer dep, and `TableContextProvider` renders its own nested `<LeafyGreenProvider darkMode={darkMode}>` internally (`packages/table/src/TableContext/TableContext.tsx:65`), so a bare `<Table darkMode>` works without an app-level provider. An app-level provider is still what feeds `useDarkMode()`/`useUpdatedBaseFontSize()` defaults (`packages/table/src/Table/Table.tsx:41-42`).
- **Emotion**: styles ship pre-compiled through LeafyGreen's own Emotion instance (`@leafygreen-ui/emotion`, which wraps `@emotion/css` + `@emotion/server` — `packages/emotion/src/index.ts`). No Babel plugin, no CSS import, no build step for consumers. `@emotion/styled` is only a devDependency (used to prove `styled(Table)` works — `packages/table/src/Table/Table.spec.tsx:313-347`).
- **Runtime deps you inherit**: checkbox, icon, icon-button, typography, tokens, palette, lodash, polished, `react-fast-compare`, `react-intersection-observer` (`packages/table/package.json`).
- **Data must have a stable reference** or you get an infinite re-render loop; the README dedicates a section to it (`packages/table/README.md:240-274`).

---

### 3. How it works

**Architecture: styled shell + headless engine, with the render loop left to you.**

```
useLeafyGreenTable  ──► useReactTable (TanStack v8)  ──► table instance (+ hasSelectableRows, shouldMemoizeRows)
        ▲                                                        │
useLeafyGreenVirtualTable ──► useVirtualizer (react-virtual) ──► table.virtual
                                                                 │
<Table table={table}> ──► TableContextProvider (theme, isVirtual, isSelectable, shouldTruncate,
                          verticalAlignment, virtualTable, lgIds, shouldMemoizeRows)
                            └─ <table> ─ TableHead / HeaderRow / HeaderCell
                                        └─ TableBody ─ Row (RowContextProvider) ─ Cell / ExpandedContent
```

- **DOM model**: real semantic HTML — `<div>` scroll container wrapping `<table>/<thead>/<tbody>/<tr>/<th scope="col">/<td>`. No `role="grid"` div-grid emulation.
- **State ownership is split.** TanStack owns sorting, selection, pagination, column visibility. LeafyGreen *takes over expansion*: `useLeafyGreenTable` keeps `expanded` in its own `useState` and wires `onExpandedChange: setExpanded` (`packages/table/src/useLeafyGreenTable/useLeafyGreenTable.tsx:35-37, 127`). It seeds from `rest.initialState?.expanded`. Presentational state (dark mode, truncation, zebra, vertical alignment, virtual mode) lives in `TableContext`; per-row state (disabled, depth, isExpanded, toggleExpanded) lives in `RowContext`.
- **The adapter's real work** is `getLGExpandedRowModel` (`useLeafyGreenTable.tsx:82-113`): it wraps TanStack's `getExpandedRowModel`, then splices a synthetic row (`id: "<rowId>-expandedContent"`, `isExpandedContent: true`) directly after any expanded row that has `renderExpandedContent`. That's why expanded content arrives as a *sibling row* in `getRowModel().rows` rather than a nested child, and why consumers must branch on `row.isExpandedContent`.
- **Other adapter defaults injected**: `getCoreRowModel`, `getSortedRowModel`, `getSubRows: row => row.subRows`, `enableExpanding: true`, `getRowCanExpand` (true if `renderExpandedContent` or `subRows.length`), `enableSortingRemoval` (only when some column sets `enableSorting`), `getPaginationRowModel` only when `withPagination` (`useLeafyGreenTable.tsx:115-134`).
- **Selection column injection**: when `hasSelectableRows`, a synthetic column `{ id: 'select', size: spacing[1000], header: TableHeaderCheckbox, cell: TableRowCheckbox }` is prepended; `allowSelectAll: false` just `omit`s the `header` (`useLeafyGreenTable.tsx:55-77`).
- **Virtualization** (`packages/table/src/useLeafyGreenVirtualTable/useLeafyGreenVirtualTable.tsx`): calls `useLeafyGreenTable`, then `useVirtualizer({ count: rows.length, getScrollElement: () => containerRef.current, estimateSize: () => 40, overscan: 20, getItemKey: i => rows[i]?.id ?? i, ...virtualizerOptions })`. It returns `virtual.getVirtualItems()` mapping each `VirtualItem` to `{ ...virtualItem, row }`. Scroll offset is faked with **spacer `<tbody><tr aria-hidden><td>` blocks** whose height is set via CSS custom properties, not with transforms — `packages/table/src/TableBody/TableBody.tsx:34-55` and `packages/table/src/TableBody/utils/useVirtualScrollPadding.ts`. Row heights are measured dynamically by passing `virtualTable.measureElement` as a row ref (`packages/table/src/Row/Row.tsx:38`).
- **Perf machinery**: rows render through `MemoizedInternalRowWithRT`, a `React.memo` with a custom comparator using `react-fast-compare` that bails out early when `shouldMemoizeRows` is false (`packages/table/src/Row/InternalRowWithRT.tsx:79-97`). `shouldMemoizeRows` is computed in the hook by deep-comparing the previous column defs (`useLeafyGreenTable.tsx:39-50`).
- **Sticky-header detection** uses an IntersectionObserver sentinel div (`react-intersection-observer`); when it leaves the viewport `data-is-sticky="true"` is stamped on the `<table>` and a CSS shadow fades in (`packages/table/src/Table/Table.tsx:52-66, 85`; `packages/table/src/TableHead/TableHead.styles.tsx:21-48`).
- **Headless vs styled**: headless engine, opinionated styling, **manual composition**. There is no `<Table columns={} data={} />` convenience form — you always write the `getHeaderGroups()`/`getRowModel()` loops yourself.

---

### 4. Developer experience

**TypeScript**: strong overall. Generics flow end-to-end (`LGRowData`, `LGTableDataType<T>`, `LGColumnDef<T,V>`, `LeafyGreenTableRow<T>`, `LeafyGreenTableCell<T>`). Because `React.forwardRef` cannot preserve generics, every generic component declares a hand-written call-signature interface (`RowComponentType`, `CellComponentType`, `HeaderCellComponentType`, `ExpandedContentComponentType`) and is cast to it — e.g. `packages/table/src/Row/Row.types.ts:92-103`, `packages/table/src/Cell/Cell.tsx:31`. Type tests exist but are `describe.skip`/`test.skip` (`packages/table/src/Table/Table.spec.tsx:350`; `useLeafyGreenVirtualTable.spec.tsx:20`).

Rough edges:

- Two `@ts-ignore`s where the custom `align` field on `LGColumnDef` is read back off the TanStack `columnDef` — the type is never merged into the react-table namespace (`packages/table/src/Cell/InternalCellWithRT.tsx:42-44`; `packages/table/src/Cell/HeaderCell/HeaderCell.tsx:47-50`).
- `LeafyGreenTable<T>` declares `virtual: never` as a discriminator hack so `Table` can sniff virtual vs non-virtual at runtime (`useLeafyGreenTable.types.ts:87`; consumed at `Table.tsx:45`).
- `Table` is `forwardRef<HTMLDivElement, TableProps<any>>` — the generic is erased at the component boundary, so `<Table>` itself isn't generic even though `TableProps<T>` is.

**Docs**: a 1158-line `README.md` with runnable snippets, prop tables, table-layout guidance, a performance section, and CodeSandbox links. Three migration documents: `UPGRADE.md` (v12→v13, 446 lines), `V10_to_V13_UPGRADE.md` (611 lines), plus archived `V10_README.md` / `V12_README.md`. Public docs at mongodb.design and storybook.mongodb.design (root `README.md`).

**Storybook**: extensive. `src/Table.stories.tsx` (13 stories: LiveExample, HundredsOfRows, ColumnVisibility, WithButtons, NoTruncation, Basic, ZebraStripes, NestedRows, ExpandableContent, SortableRows, SelectableRows, SelectableRowsNoSelectAll, WithPagination, DynamicData), `src/Table/TableWithVS.stories.tsx` (10 virtual-scroll stories including TallRows and WithLeafyGreenComponents), plus `src/Table.Interactions.stories.tsx` with `@storybook/test` play functions (StickyHeader, DynamicData).

**Error messages / debuggability**: essentially none at the component level — no dev warnings, no invariant checks. The only thrown errors are in the test harness (`getTestUtils.tsx:26, 63, 79`: "Unable to find any `<th>` elements."). Debuggability comes from stable `data-lgid`/`data-testid` attributes and state mirrored to DOM (`data-selected`, `data-expanded`, `data-depth`, `data-index`, `data-is-sticky`).

**Learning curve**: you must know TanStack Table v8 first. On top of that you must learn LeafyGreen-specific conventions that are not enforced by types: passing `row`/`cell`/`header` objects down, branching on `row.isExpandedContent`, using `virtualRow.key` (not `row.id`) as the React key in virtual mode, checking `row.depth > 0` to detect subrows, and the `table-layout: fixed` behaviour for untruncated virtual tables.

**Escape hatches**: `className` on every component, `contentClassName` on `Cell`'s inner div, full `...rest` HTML prop spreading, `forwardRef` on all components, `styled()` compatibility (tested), and direct access to the underlying TanStack instance and all its options.

---

### 5. Features

| Feature | Supported | Where |
|---|---|---|
| Sorting | Yes — per column via `enableSorting`; styled `SortIcon` (asc/desc/unsorted) rendered inside `HeaderCell`; `enableSortingRemoval` auto-enabled so a 3rd click clears sort | `Cell/HeaderCell/HeaderCell.tsx:53-61`, `SortIcon/SortIcon.tsx`, `utils/getHeaderCellState.ts`, `useLeafyGreenTable.tsx:123` |
| Filtering | **Not styled/wired.** Available only because TanStack's API is re-exported; no LG filter UI, no filter row model injected | `src/index.ts:28`; README lists only sub-rows/expandable/selectable/sortable/sticky as "styled according to design guidelines" (`README.md:68-74`) |
| Pagination | Opt-in `withPagination: true` adds `getPaginationRowModel`; the `<Pagination>` UI is a separate package you wire yourself | `useLeafyGreenTable.tsx:126`; `Table.stories.tsx:1202` (`WithPagination`) |
| Nested / sub rows | Yes — `subRows` on data, arbitrary depth, chevron toggle + indentation by `depth` | `useLeafyGreenTable.tsx:124`; `Cell/Cell.styles.ts:17-47` (`getCellPadding` depth math) |
| Expandable content | Yes — `renderExpandedContent(row)` on the data object; rendered by `<ExpandedContent>` as a full-width `<td colSpan>` | `ExpandedContent/ExpandedContent.tsx:26-47` |
| Row selection | Yes — `hasSelectableRows` injects a checkbox column; `allowSelectAll` toggles the header checkbox; indeterminate state supported | `useLeafyGreenTable.tsx:55-77`, `TableRowCheckbox.tsx`, `TableHeaderCheckbox.tsx` |
| Virtual scrolling | Yes — `useLeafyGreenVirtualTable` + required `containerRef`; dynamic row measurement; spacer-row padding technique | `useLeafyGreenVirtualTable.tsx`, `TableBody/TableBody.tsx` |
| Sticky header | Yes — `<TableHead isSticky>`; `position: sticky` + IntersectionObserver-driven shadow | `TableHead/TableHead.styles.tsx:21-48` |
| Column resize | **No.** Zero references to resizing anywhere in `packages/table/src` or the README | grep for `resiz`/`columnResizeMode` returns nothing |
| Column width | Static via `size` in the column def → `width: {size}px` on the `<th>` | `Cell/HeaderCell/HeaderCell.styles.ts:25-29` |
| Column visibility | Works via TanStack `toggleVisibility()`; covered by tests and a story | `Table.spec.tsx:218-303`; `Table.stories.tsx:413` |
| Loading / skeleton | **Different package**: `<TableSkeleton numRows numCols columnLabels enableAnimations>` with `aria-busy` and VisuallyHidden "Loading" | `packages/skeleton-loader/src/TableSkeleton/TableSkeleton.tsx` |
| Zebra striping | Yes — `shouldAlternateRowColor`; uses `:nth-of-type(even)` normally, and `virtualRow.index % 2` for virtual rows since DOM position isn't stable | `Row/Row.styles.ts:52-60, 92-96`; `InternalRowWithRT.tsx:36` |
| Truncation | `shouldTruncate` (single-line + ellipsis) with `verticalAlignment: 'top' \| 'middle'` when off | `Table/Table.types.ts:38-48`; `Cell/Cell.styles.ts:96-108` |
| Disabled rows | `<Row disabled>` → `aria-disabled`, `pointer-events: none`, disabled token colors, disabled checkbox | `Row/InternalRowBase.tsx:26`; `Row/Row.styles.ts:10-14` |
| Clickable rows | Implicit — passing `onClick` to `Row` adds `tabIndex={0}`, hover ring, focus ring | `Row/InternalRowBase.tsx:27-33` |
| Dark mode | Yes, everywhere via `useDarkMode()` + `color[theme]` tokens | `Table/Table.tsx:42`, all `*.styles.ts` |

---

### 6. Flexibility & customization

- **Cell / header rendering**: fully open. You call `flexRender` yourself, so a `columnDef.cell` can return any JSX; stories embed `Badge`, `Button`, `Tooltip`, `IconButton`, `Checkbox` inside cells (`src/Table.stories.tsx:515` `WithButtons`, `src/Table/TableWithVS.stories.tsx:797` `WithLeafyGreenComponents`). You can also skip the column def entirely and put arbitrary children in `<Cell>`.
- **Alignment**: `align` on `Cell`/`HeaderCell` (`'left' | 'right' | 'center'`), or `align` on the column def (LG's own extension to `ColumnDef`, read via `@ts-ignore`) — `Cell/Cell.types.ts:12-23`; `useLeafyGreenTable.types.ts:31-36`.
- **Theming**: `darkMode` prop on `Table` (or inherited from `LeafyGreenProvider`), plus `baseFontSize` of `13 | 16`. Colors come from `@leafygreen-ui/palette` and `@leafygreen-ui/tokens` (`color[theme].background.secondary.default`, `focusRing`, `hoverRing`) — there is **no token override / theme-object API**; you cannot swap the palette, only override CSS.
- **Emotion overrides**: `className` on `Table` (goes to the **outer container div**, not the `<table>` — `Table.tsx:60`), `TableHead`, `HeaderRow`, `HeaderCell`, `TableBody`, `Row`, `Cell` (+ `contentClassName` for the cell's inner flex div). `styled(Table)` is explicitly supported and tested. Emotion's `cx` merge order puts the consumer `className` last in every `get*Styles` helper, so overrides win on equal specificity.
- **Performance caveat on customization**: the README warns that applying Emotion styles per-`Cell`/per-`Row` at hundreds of rows is slow, and recommends styling from `TableBody` with descendant selectors instead (`README.md:900-933`).
- **Deviation ceiling**: high on content, medium on structure, low on chrome. Because you own the mapping loops, you can insert extra rows, skip `HeaderCell` entirely, render custom sort affordances (just don't set `enableSorting` and roll your own), etc. What you cannot easily change: the `<td>` → `<div>` → `<div>` triple-nesting each cell emits (`Cell/InternalCellBase.tsx:30-40`), the chevron expander markup and its position in the first cell, the checkbox column's identity/size, and the fact that LG owns `expanded` state. `getCoreRowModel` and `columns` are `Omit`ted from the options type so they can't be replaced (`useLeafyGreenTable.types.ts:46`).

---

### 7. Accessibility

**What's there** (all from real source):

| Concern | Implementation | File |
|---|---|---|
| Semantics | Native `<table>/<thead>/<tbody>/<tr>/<th>/<td>`; no ARIA grid emulation | `Table.tsx:78`, `TableHead.tsx:21`, `TableBody.tsx:44`, `InternalRowBase.tsx:21`, `InternalCellBase.tsx:30` |
| Column headers | `scope="col"` on every `<th>` | `Cell/HeaderCell/HeaderCell.tsx:41` |
| Sort control | `IconButton` with `aria-label={`Sort by ${columnName}`}` | `HeaderCell.tsx:57` |
| Expand control | `IconButton` with `aria-label={`${isExpanded ? 'Collapse' : 'Expand'} row`}`; chevron `Icon` marked `role="presentation"` | `ToggleExpandedIcon/ToggleExpandedIcon.tsx:31, 46` |
| Row checkbox | `aria-label={`Select row ${row.id}`}` and `aria-controls={`lg-table-row-${row.id}`}` (the row carries that `id`) | `TableRowCheckbox.tsx:33-34`; row id set at `InternalRowWithRT.tsx:68` |
| Select-all checkbox | `aria-label="Select all rows"`, `indeterminate` when partial | `TableHeaderCheckbox.tsx:28-31` |
| Disabled rows | `aria-disabled={disabled}` (not the invalid `disabled` attribute) | `InternalRowBase.tsx:26` |
| Virtual spacers | Spacer rows are `aria-hidden` so AT doesn't see empty rows | `TableBody.tsx:39, 50` |
| Keyboard scroll | Container `<div>` gets `tabIndex={0}` with an explicit eslint-disable comment: "allow select by keyboard to allow scroll by keyboard" | `Table.tsx:61-63` |
| Row focus | `tabIndex={0}` **only** when an `onClick` is provided, plus `focus`/`focus-visible` inset focus ring | `InternalRowBase.tsx:27`; `Row/Row.styles.ts:16-30` |
| Loading | `aria-busy` on the skeleton table + `<VisuallyHidden>Loading</VisuallyHidden>` per header cell | `packages/skeleton-loader/src/TableSkeleton/TableSkeleton.tsx:37, 53` |

**Automated testing**: `jest-axe` (`expect(results).toHaveNoViolations()`) in six spec files — `Table/Table.spec.tsx:91`, `Row/Row.spec.tsx:75`, `Row/HeaderRow/HeaderRow.spec.tsx:24`, `Cell/Cell.spec.tsx:50`, `Cell/HeaderCell/HeaderCell.spec.tsx:111`, `TableBody/TableBody.spec.tsx:15`, `TableHead/TableHead.spec.tsx:16`. Additional attribute assertions on expand-button labels (`RowWithRT.spec.tsx:80-100`, `ExpandedContent.spec.tsx:83-97`) and sort-icon labels (`HeaderCell.spec.tsx:153-177`).

**Gaps found** (grepped the whole `src` tree for `aria-`/`role=`; these simply do not appear):

1. **No `aria-sort`** on sortable `<th>`. Sort state is only conveyed by icon glyph + the button's static label, so screen-reader users can't perceive the current sort direction.
2. **No `aria-expanded`** on the expand button or row. State lives in `data-expanded` only. The label does flip Expand↔Collapse, which partially compensates.
3. **No `aria-selected`** on selected rows — only `data-selected`. Selection is discoverable through the checkbox, not the row.
4. **No `aria-rowcount` / `aria-rowindex`** on the virtual table. With virtualization, AT sees only the rendered window plus two `aria-hidden` spacer rows, so the total row count and each row's position are lost.
5. **No arrow-key / grid keyboard navigation.** Tab order is: container div → whatever focusable widgets exist in cells. Rows are only reachable when clickable.
6. `aria-label={`Sort by ${columnName}`}` casts `column.columnDef.header as string` (`utils/getHeaderCellState.ts:19`). A JSX or function header (a documented pattern, e.g. `header: () => <span>Last Name</span>` in `Table.stories.tsx`) produces a non-string label.
7. `aria-controls` on the row checkbox points at `lg-table-row-${row.id}`, a hardcoded prefix that ignores the configurable `lgIds` root (`TableRowCheckbox.tsx:34` vs `getLgIds.ts`); with two tables on a page the row `id`s can collide.

---

### 8. Properties / attributes exposed

#### `Table` — `packages/table/src/Table/Table.types.ts`
Extends `React.ComponentPropsWithoutRef<'table'>` + `DarkModeProps` + `LgIdProps`.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `table` | `LeafyGreenTable<T> \| LeafyGreenVirtualTable<T>` | – | Optional; omit for a static table |
| `shouldAlternateRowColor` | `boolean` | `false` | Zebra striping |
| `shouldTruncate` | `boolean` | `false` (prop) | Note: `TableContext` consumers default it to `true` when unset (`InternalCellWithRT.tsx:33`) |
| `verticalAlignment` | `'top' \| 'middle'` | `'top'` | Only meaningful when truncation is off |
| `baseFontSize` | `13 \| 16` | provider value | Via `useUpdatedBaseFontSize` |
| `darkMode` | `boolean` | provider value | |
| `data-lgid` | `LgIdString` | `'lg-table'` | Seeds all child `data-lgid`s via `getLgIds` |
| `ref` | `ForwardedRef<HTMLDivElement>` | – | Points at the **scroll container div**, and is what you pass as `containerRef` for virtual tables |

#### `TableHead` — `TableHead/TableHead.types.ts`
`isSticky?: boolean` + all `<thead>` props. Forwards ref to `HTMLTableSectionElement`.

#### `HeaderRow` — `Row/HeaderRow/HeaderRow.types.ts`
All `<tr>` props only; no LG-specific props.

#### `HeaderCell` — `Cell/HeaderCell/HeaderCell.types.ts`
| Prop | Type | Notes |
|---|---|---|
| `header` | `Header<T, unknown>` | TanStack header object; drives width + sort icon |
| `align` | `'left' \| 'right' \| 'center'` | Falls back to `columnDef.align` |
| + all `<th>` props / ref | | |

Also exports `SortState = { Asc, Desc, Off, None }`.

#### `TableBody` — `TableBody/TableBody.types.ts`
All `<tbody>` props. Reads `isVirtual`/`virtualTable` from context and emits the padding spacer tbodies.

#### `Row` — `Row/Row.types.ts`
| Prop | Type | Default | Notes |
|---|---|---|---|
| `row` | `LeafyGreenTableRow<T>` | – | Required when using either hook |
| `virtualRow` | `VirtualItem` | – | Required with the virtual hook |
| `disabled` | `boolean` | `false` | → `aria-disabled` |
| + all `<tr>` props / ref | | | `onClick` makes the row focusable |

Emits `data-selected`, `data-expanded`, `data-depth`, `data-index`, `id="lg-table-row-{row.id}"`.

#### `Cell` — `Cell/Cell.types.ts`
| Prop | Type | Notes |
|---|---|---|
| `cell` | `LeafyGreenTableCell<T>` | Required when using either hook; drives first-column detection + `align` |
| `align` | `'left' \| 'right' \| 'center'` | |
| `contentClassName` | `string` | Class on the inner content `div` |
| + all `<td>` props / ref | | |

#### `ExpandedContent` — `ExpandedContent/ExpandedContent.types.ts`
`row: LeafyGreenTableRow<T>` (required), `virtualRow?: VirtualItem`, + `<tr>` props.

#### `useLeafyGreenTable(options)` — `useLeafyGreenTable/useLeafyGreenTable.types.ts`
`Omit<TableOptions<LGTableDataType<T>>, 'getCoreRowModel' | 'columns'>` plus:

| Option | Type | Default |
|---|---|---|
| `data` | `Array<LGTableDataType<T>>` (each row may carry `subRows` and `renderExpandedContent`) | – |
| `columns` | `Array<LGColumnDef<T, V>>` (`ColumnDef` + `align`) | – |
| `hasSelectableRows` | `boolean` | `false` |
| `withPagination` | `boolean` | `false` |
| `allowSelectAll` | `boolean` | `true` |
| …plus every TanStack option (`state`, `initialState`, `onRowSelectionChange`, `enableSorting`, `manualSorting`, `getRowId`, …) | | |

Returns `LeafyGreenTable<T>` = TanStack `Table` + `hasSelectableRows`, `shouldMemoizeRows`, and the `virtual: never` marker.

#### `useLeafyGreenVirtualTable(options)` — `useLeafyGreenVirtualTable/useLeafyGreenVirtualTable.types.ts`
Everything above plus `containerRef: RefObject<HTMLElement>` (**required**) and `virtualizerOptions?: Partial<VirtualizerOptions<HTMLElement, Element>>`. Returns the same table plus `virtual` (full virtualizer instance with an overridden `getVirtualItems(): Array<LeafyGreenVirtualItem<T>>`).

---

### 9. Events exposed

There are **no LeafyGreen-specific event props** on any component. Every callback is either a native DOM handler spread onto the underlying element, or a TanStack handler you obtain from the table/row/column instance.

| Event | How you get it | Defined at |
|---|---|---|
| Row click | `<Row onClick={...}>` → native `<tr onClick>`, also grants `tabIndex={0}` + focus ring | `Row/InternalRowBase.tsx:15, 25-27` |
| Sort toggle | Internal: `column.getToggleSortingHandler()` wired to the sort `IconButton` | `Cell/HeaderCell/utils/getHeaderCellState.ts:21`; `SortIcon/SortIcon.tsx:39-47` |
| Sort state change | Consumer-side: pass TanStack's `onSortingChange` in the hook options | TanStack passthrough via `...rest` (`useLeafyGreenTable.tsx:129`) |
| Row select toggle | Internal: `row.getToggleSelectedHandler()` on the row checkbox | `useLeafyGreenTable/TableRowCheckbox.tsx:32` |
| Select-all toggle | Internal: `table.getToggleAllRowsSelectedHandler()` | `useLeafyGreenTable/TableHeaderCheckbox.tsx:30` |
| Selection change | Consumer-side: `onRowSelectionChange` in hook options (used in `utils/testHookCalls.testutils.tsx`) | TanStack passthrough |
| Expand toggle | Internal: `row.toggleExpanded()` exposed through `RowContext.toggleExpanded`, invoked by `ToggleExpandedIcon`'s `onClick` | `Row/InternalRowWithRT.tsx:48`; `ToggleExpandedIcon.tsx:33` |
| Expanded state change | `onExpandedChange` is **claimed by the hook** (`onExpandedChange: setExpanded`). Because `...rest` is spread *after* it, a consumer-supplied `onExpandedChange` silently replaces LG's internal setter, and you must then also drive `state.expanded` yourself or expansion stops working | `useLeafyGreenTable.tsx:127-133` — a real gotcha, undocumented in the README |
| Pagination change | `onPaginationChange` via TanStack options; state read from `table.getState().pagination` | `Table.stories.tsx:1202` |
| Sticky-header transition | Not a callback — surfaced as the `data-is-sticky` attribute you can style/observe | `Table.tsx:85` |
| Virtual scroll | Not a callback — use the virtualizer instance on `table.virtual` (`scrollToIndex`, `getTotalSize`, …) | `useLeafyGreenVirtualTable.tsx:46` |

---

### 10. Helpers / utilities

**Hooks**
- `useLeafyGreenTable<T, V>(options)` — `src/useLeafyGreenTable/useLeafyGreenTable.tsx` (default export).
- `useLeafyGreenVirtualTable<T, V>(options)` — `src/useLeafyGreenVirtualTable/useLeafyGreenVirtualTable.tsx`.
- Internal-only: `useTableContext()` (`src/TableContext/TableContext.tsx:19`), `useRowContext()` (`src/Row/RowContext.tsx:24`), `useVirtualScrollPadding()` (`src/TableBody/utils/useVirtualScrollPadding.ts`).

**Re-exports**
- Everything from `@tanstack/react-table` — including `flexRender`, `createColumnHelper`, `getCoreRowModel`, `getFilteredRowModel`, `sortingFns`, and all types (`HeaderGroup`, `Header`, `Row`, `ColumnDef`, `ExpandedState`, …) — `src/index.ts:28`.
- `type VirtualItem` from `@tanstack/react-virtual` — `src/index.ts:29`.

**LG IDs**
- `getLgIds(root = 'lg-table')` and `DEFAULT_LGID_ROOT` — `src/utils/getLgIds.ts`. Produces `root`, `cell`, `row`, `headerRow`, `headerCell`, `header` (marked TODO-deprecate), `selectAllCheckbox`, `checkbox`, `sortIcon`, `expandButton`.

**Test harness** — imported from `@leafygreen-ui/table/testing` (`src/testing/getTestUtils.tsx`, types in `getTestUtils.types.ts`), built on `@lg-tools/test-harnesses` (`getByLgId`, `queryBySelector`):

```ts
const {
  getTable, getAllHeaders, getHeaderByIndex, getSelectAllCheckbox,
  getAllVisibleRows, getRowByIndex, getAllVisibleSelectedRows,
} = getTestUtils(lgId?);          // lgId defaults to 'lg-table'
```
`getHeaderByIndex(i)` → `{ getElement, getSortIcon }`. `getRowByIndex(i)` → `{ getElement, getAllCells, getCheckbox, getExpandButton, isExpanded, isSelected, isDisabled }` — the boolean helpers read `data-expanded` / `data-selected` / `aria-disabled`. Multi-table support via per-table `data-lgid`. Exercised in `src/testing/getTestUtils.spec.tsx` (25 tests).

**Exported types** — `LeafyGreenTable`, `LeafyGreenTableCell`, `LeafyGreenTableOptions`, `LeafyGreenTableRow`, `LGColumnDef`, `LGRowData`, `LGTableDataType`, `LeafyGreenVirtualItem`, `LeafyGreenVirtualTable`, `LeafyGreenVirtualTableOptions`, plus per-component prop types (`TableProps`, `RowProps`, `CellProps`, `HeaderCellProps`, `HeaderRowProps`, `TableBodyProps`, `ExpandedContentProps`).

**Fixture helpers (internal, not published)** — `src/utils/makeData.testutils.tsx` (faker-based `makeData`, `makeKitchenSinkData`, `Person`), `src/utils/testHookCalls.testutils.tsx`, `src/utils/stories.testutils.tsx`.

**Adjacent** — `TableSkeleton` from `@leafygreen-ui/skeleton-loader`; `Pagination` from `@leafygreen-ui/pagination`.

---

### 11. Verdict

- **Strength — the right kind of thin.** It doesn't re-implement a table engine; it delegates to TanStack v8 and adds exactly three things of substance: MongoDB-correct styling, a custom expanded-row model that flattens `renderExpandedContent` into the row list, and a virtualization wiring that handles dynamic row measurement. The full TanStack API stays reachable, so you're never boxed in on data behaviour.
- **Strength — production hygiene.** Every component forwards refs and accepts `className`/`...rest`; there's a first-class `getTestUtils()` harness with stable `data-lgid` attributes; jest-axe runs in seven spec files; three migration guides and ~1150 lines of README; changesets-driven releases with a 1900-line changelog. Real performance thought went in (memoized rows gated on deep column-def comparison, an explicit `table-layout: fixed` workaround documented against an infinite-relayout crash in virtual tables).
- **Weakness — verbose, convention-heavy composition.** There is no declarative shorthand: ~40 lines of nested `.map()` for the simplest data table, and the important rules (`row.isExpandedContent` branching, `virtualRow.key` as React key, `depth > 0` for subrows, stable `data` reference) are enforced by documentation rather than by types or runtime warnings. Nothing tells you when you get it wrong.
- **Weakness — real accessibility gaps for a design-system table.** No `aria-sort`, no `aria-expanded`, no `aria-selected`, no `aria-rowcount`/`aria-rowindex` on virtual tables, and no arrow-key navigation. jest-axe passes because axe doesn't flag missing state semantics on a valid `<table>`. The sort button's `aria-label` also breaks (`columnDef.header as string`) with the JSX headers the docs themselves demonstrate.
- **Weakness — a couple of sharp edges.** LG owns `expanded` state and silently loses it if you pass your own `onExpandedChange`; two `@ts-ignore`s paper over an unmerged `align` column-def extension; no column resizing at all; no filtering UI; loading state lives in a different package.
- **Best fit.** MongoDB-ecosystem React apps (Atlas-style admin/console screens) that already use LeafyGreen and need a design-compliant data grid with sorting, selection, nesting and 10k+ row virtualization, staffed by a team comfortable with TanStack Table v8. Poor fit if you need column resizing, a built-in filter UI, a low-ceremony `<DataGrid columns data />` API, or WCAG-strict grid semantics without writing your own ARIA layer on top.

---

## MUI Table component analysis

Repo: `/home/brino/Code/studies/material-ui` (monorepo, `@mui/material` v9.3.1 per `packages/mui-material/package.json`).
All paths below are repo-relative.

---

### 1. Overview

**Package:** `@mui/material` (`packages/mui-material/package.json`, name `@mui/material`, version `9.3.1`).

**Where the Table code lives** — ten sibling directories under `packages/mui-material/src/`:

| Directory | Default host element | Notes |
|---|---|---|
| `Table/` | `<table>` | Also holds the two internal contexts |
| `TableHead/` | `<thead>` | |
| `TableBody/` | `<tbody>` | |
| `TableFooter/` | `<tfoot>` | |
| `TableRow/` | `<tr>` | |
| `TableCell/` | `<th>` or `<td>` (context-driven) | |
| `TableContainer/` | `<div>` | `overflow-x: auto` wrapper |
| `TableSortLabel/` | `<span role="button">` (via `ButtonBase`) | |
| `TablePagination/` | `TableCell` | |
| `TablePaginationActions/` | `<div>` | Rendered by `TablePagination` |

All are re-exported from `packages/mui-material/src/index.js` lines 334–362, and each has a barrel (`Table/index.js`) that also re-exports its `*Classes` object.

**Frameworks:** React only. Peer deps (`packages/mui-material/package.json` lines ~63–85): `react`/`react-dom` `^17 || ^18 || ^19`, `@emotion/react` + `@emotion/styled` (optional), `@mui/material-pigment-css` (optional), `@types/react` (optional). No Vue/Angular/Svelte bindings anywhere in the repo.

**DataGrid:** **`x-data-grid` source is NOT in this repo.** The only hits are:
- `docs/package.json` lines 41–44 — `@mui/x-data-grid`, `-generator`, `-premium`, `-pro`, all pinned at `9.11.0` as **docs devDependencies** (installed from npm, built in the separate `mui-x` repo).
- `docs/data/material/components/table/DataTable.tsx` — a docs demo that imports `DataGrid` from `@mui/x-data-grid`.
- `test/regressions/syncDataGridGenerator.ts`.

**Relationship** (stated explicitly in `docs/data/material/components/table/table.md` lines 45–49): the `Table` primitives map closely to native `<table>` elements, which "makes building rich data tables challenging"; `DataGrid` is recommended for large tabular datasets, trading a rigid structure for powerful features. The two are separate products with no shared code — DataGrid consumes `@mui/material`'s theme/styling, not its Table components.

---

### 2. Setup required

Minimum install: `@mui/material @emotion/react @emotion/styled` (emotion is the default styled engine; `@mui/material-pigment-css` is the optional zero-runtime alternative).

**A `ThemeProvider` is not required** — `packages/mui-material/src/styles/styled.js` calls `createStyled({ themeId: THEME_ID, defaultTheme, rootShouldForwardProp })`, so every styled slot falls back to `defaultTheme`. `ThemeProvider` is only needed to customize. No build step, no codegen, no CSS import.

Minimal working table (condensed from `docs/data/material/components/table/BasicTable.tsx`):

```tsx
import { Table, TableBody, TableCell, TableContainer,
         TableHead, TableRow, Paper } from '@mui/material';

export default function BasicTable({ rows }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow><TableCell>Dessert</TableCell><TableCell align="right">Calories</TableCell></TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">{row.name}</TableCell>
              <TableCell align="right">{row.calories}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
```

Note there is no `columns` array, no `data` prop, no `rows` prop — you write the JSX loop yourself. That is the whole API model.

Localization is opt-in via theme `defaultProps`: `packages/mui-material/src/locale/` ships ~60 locale files, each supplying `MuiTablePagination.defaultProps` for `getItemAriaLabel`, `labelRowsPerPage`, `labelDisplayedRows` (see `locale/frFR.ts` lines 13–31).

---

### 3. How it works

**Rendering model: no virtualization, none at all.** Every component is a thin `React.forwardRef` wrapper that renders exactly one host element plus `props.children`. There is no windowing, no row recycler, no measurement pass anywhere in `packages/mui-material/src/Table*`. The docs' answer is to bring your own: `docs/data/material/components/table/ReactVirtualizedTable.tsx` wires `react-virtuoso`'s `TableVirtuoso` by handing it a `TableComponents` map of MUI primitives:

```tsx
const VirtuosoTableComponents: TableComponents<Data> = {
  Scroller: forwardRef((props, ref) => <TableContainer component={Paper} {...props} ref={ref} />),
  Table: (props) => <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />,
  TableHead: forwardRef((props, ref) => <TableHead {...props} ref={ref} />),
  TableRow,
  TableBody: forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
};
```

This works precisely *because* the primitives are dumb — they forward refs and spread `...other`, so a third-party virtualizer can own the DOM structure. `react-virtuoso@^4.18.11` is a **docs** dependency (`docs/package.json` line 93), not a library dependency.

**State ownership: fully uncontrolled / stateless.** Grep the sources: there is not a single `useState` in `Table.js`, `TableHead.js`, `TableBody.js`, `TableFooter.js`, `TableRow.js`, `TableCell.js`, `TableContainer.js`, `TableSortLabel.js`, `TablePagination.js`, or `TablePaginationActions.js`. `TablePagination` is a **pure controlled** component: `page`, `rowsPerPage`, `count` are required props (`TablePagination.js` lines 361–433) and it only emits `onPageChange`/`onRowsPerPageChange`. Sorting, selection, filtering, and paging state all live in your app. `TableSortLabel` takes `active` and `direction` as props and renders an arrow; it does not sort anything.

**Implicit data flow via two React contexts** — the only "smart" part of the architecture:

| Context | Provider | Value | Consumers |
|---|---|---|---|
| `TableContext` (`Table/TableContext.js`) | `Table` | `{ padding, size, stickyHeader }`, memoized (`Table.js` lines 77–80) | `TableCell` |
| `Tablelvl2Context` (`Table/Tablelvl2Context.js`) | `TableHead` / `TableBody` / `TableFooter` | `{ variant: 'head' \| 'body' \| 'footer' }` (module-level constant object) | `TableCell`, `TableRow` |

`TableCell.js` lines 188–220 is where it all lands: `isHeadCell = tablelvl2?.variant === 'head'` decides `<th>` vs `<td>`, decides the default `scope="col"`, and picks up `padding`/`size` from `TableContext` and `variant` from `Tablelvl2Context`. `TableRow.js` derives `head`/`footer` ownerState flags from `Tablelvl2Context` for styling hooks. Both contexts get a `displayName` under `NODE_ENV !== 'production'`.

**Styled engine.** Every component imports `styled` from `../zero-styled` (`packages/mui-material/src/zero-styled/index.tsx`), which just re-exports `../styles/styled` — a `createStyled` instance bound to `THEME_ID` and `defaultTheme`. The indirection exists so the same source compiles under Pigment CSS (zero-runtime) or emotion. Theme-reading style callbacks are wrapped in `memoTheme(...)` (e.g. `TableCell.js` line 47) to cache per-theme output. Style variants use the object `variants: [{ props, style }]` form rather than nested template conditionals (`TableCell.js` lines 63–166), which is what makes them Pigment-compilable. CSS variables are supported everywhere via the `(theme.vars || theme)` pattern.

**Class generation.** Each component builds its slot class list in a local `useUtilityClasses(ownerState)` and pipes it through `composeClasses(slots, getXUtilityClass, classes)` from `@mui/utils`, producing global `MuiTableCell-root`, `MuiTableCell-head`, `MuiTableCell-sizeSmall`, … names.

**Headless vs styled: styled, with no headless layer.** There is no `useTable`/`useTableCell` hook in this package. The nearest thing to headless is that the components are so thin that swapping the host via `component`/`as` is trivial. (Contrast `ButtonBase`, which *does* have `useButtonBase.ts` — `TableSortLabel` gets keyboard semantics for free from it.)

---

### 4. Developer experience

**TypeScript.** Strong and consistent. Each component ships a hand-written `.d.ts` and the `propTypes` in the `.js` are *generated from it* (`pnpm proptypes`; see the warning banner at `Table.js` lines 96–100). Patterns used:
- Polymorphic components typed with `OverridableComponent<XTypeMap>` + `OverrideProps` (`Table.d.ts` lines 39–65, `TableRow.d.ts`, `TableHead.d.ts`, `TableContainer.d.ts`).
- Module-augmentation escape hatches: empty interfaces `TablePropsSizeOverrides`, `TableCellPropsSizeOverrides`, `TableCellPropsVariantOverrides` fed into `OverridableStringUnion<'small' | 'medium', …>` so you can add your own `size`/`variant` literals from userland. The runtime propTypes correspondingly widen to `oneOfType([oneOf([...]), string])` with a `/* @typescript-to-proptypes-ignore */` marker (`TableCell.js` lines 285–288).
- `TableSortLabel` is typed as `ExtendButtonBase<TableSortLabelTypeMap>`, so it inherits the whole `ButtonBase` prop surface including `onClick`.
- `TableCell` is the weak spot and the source comment admits it (`TableCell.d.ts` lines 10–17): because it renders `<th>` *or* `<td>` from context rather than from a prop, its base props are the **union** `React.ThHTMLAttributes & React.TdHTMLAttributes`, i.e. "loose typings". You can pass `colSpan` on a `<th>`-rendered cell and TS won't tell you which element you actually got. It's also the one Table component *not* declared as `OverridableComponent` — it's `declare function TableCell(props: TableCellProps): JSX.Element`.
- `packages/mui-material/src/TablePagination/TablePagination.spec.tsx` (175 lines) is a dedicated type-level test file.

**Docs.** `docs/data/material/components/table/table.md` plus 13 runnable demos in both `.js` and `.tsx`: Basic, Dense, Sorting & selecting (`EnhancedTable`, ~11 KB — the "real" example), Customized, Custom pagination actions, Sticky header, Column grouping, Collapsible, Spanning, Virtualized, Accessible/caption. Per-prop API reference is generated into `docs/pages/material-ui/api/table*.json` (10 files) with translations in `docs/translations/api-docs/table*.json`. The intro section (table.md lines 25–35) explicitly enumerates what each of the nine components renders — good orientation.

**Error messages.** Sparse but pointed:
- `TablePagination.js` lines 412–427 uses `chainPropTypes` to range-check `page` against `count`/`rowsPerPage` and emits `MUI: The page prop of a TablePagination is out of range (0 to N, but page is X).` Dev-only, propTypes-based.
- `count` / `page` / `rowsPerPage` use `integerPropType`, so passing `3.5` warns.
- `TableSortLabel` inherits four distinct dev warnings from `ButtonBase/useButtonBase.ts` lines 142–186 about native-vs-pseudo button mismatches.
- Everything else: no runtime validation. Misnesting a `TableCell` outside a `TableHead`/`TableBody` silently produces a `<td>` with `variant === undefined` — no warning.

**Debuggability.** Good. Both contexts have `displayName` in dev. Generated class names are global and semantic (`MuiTableCell-head`, `MuiTableRow-selected`), so you can read the DOM and diff it against the source. `ownerState` is threaded into every styled slot, visible in React DevTools.

**Learning curve.** Very low to render something, and low-but-real to build something useful. The one non-obvious mechanic newcomers hit is the `Tablelvl2Context` inference — that `<TableCell>` becomes `<th scope="col">` only because a `TableHead` ancestor provided context, and that `size`/`padding` set on `<Table>` silently propagate down. Sticky header has a documented gotcha baked into the code: `TableCell.js` lines 157–165 hardcodes `backgroundColor: palette.background.default` for sticky head cells, which mismatches when the table sits on a `Paper` — the docs demo works around it with `sx={{ backgroundColor: 'background.paper' }}` (`ReactVirtualizedTable.tsx` line 97).

**Escape hatches.** Excellent — see §6. The `component`/`as` prop plus `...other` spread plus ref forwarding means you can put these components anywhere, including inside a third-party virtualizer's component map.

---

### 5. Features

#### Provided out of the box

| Feature | Where | Detail |
|---|---|---|
| Semantic table scaffold | all components | Correct default host elements, correct nesting |
| Auto `<th>` vs `<td>` | `TableCell.js` 191–198 | From `Tablelvl2Context` |
| Auto `scope="col"` on head cells | `TableCell.js` 200–207 | And strips `scope` when the cell is a `<td>`, per the HTML spec (comment cites whatwg) |
| Cell variant styling | `TableCell.js` 63–91 | `head` (medium weight, 24px line-height), `body`, `footer` (12px, secondary color) |
| Dense mode | `Table size="small"` → `TableCell.js` 92–106 | Padding 16px → `6px 16px`, plus a narrower checkbox column |
| Padding modes | `padding="checkbox" \| "none" \| "normal"` | `checkbox` = fixed 48px width; `none` = 0 |
| Alignment | `align` on `TableCell` | left/center/right/justify; `right` also sets `flexDirection: row-reverse` so the sort arrow lands on the correct side |
| Sticky header | `Table stickyHeader` → `TableCell.js` 157–165 | `position: sticky; top: 0; z-index: 2`, and `Table.js` 43–50 flips `borderCollapse` to `separate` (required for sticky to work) |
| Horizontal scroll container | `TableContainer.js` 26–29 | `width: 100%; overflow-x: auto` — that's the entire component |
| Row hover / selected states | `TableRow.js` 30–49 | `hover` → `palette.action.hover`; `selected` → alpha-blended primary, with a combined hover+selected opacity calculation |
| Sort indicator | `TableSortLabel` | Rotating `ArrowDownwardIcon` (0°/180°), opacity 0 → 0.5 on hover → 1 when active, transitioned |
| `aria-sort` | `TableCell sortDirection` → `TableCell.js` 224–227 | Maps `asc`/`desc` → `ascending`/`descending` |
| Full pagination UI | `TablePagination` + `TablePaginationActions` | Rows-per-page `Select`, "1–10 of 100" label, prev/next, optional first/last buttons, disabled state, RTL-aware button swapping |
| Unknown-total pagination | `count={-1}` | `TablePagination.js` 197–202, 308–312 → renders "more than N" |
| "All rows" option | `rowsPerPage={-1}` / `rowsPerPageOptions={[10, { value: -1, label: 'All' }]}` | |
| Pagination i18n | `packages/mui-material/src/locale/*.ts` | ~60 locales, each overriding `MuiTablePagination.defaultProps` |
| Number formatting | `locale/utils/buildFormatNumber` | `Intl`-based, per-locale digit grouping in the displayed-rows label |
| Caption styling | `Table.js` 36–42 | `& caption` gets body2 typography, secondary color, `caption-side: bottom` |
| RTL | `TablePaginationActions.js` 49, 80–88 | `useRtl()` swaps which slot renders first/prev/next/last and which slotProps go where |

#### You must build yourself

Sorting logic and comparators; row selection state and select-all/indeterminate wiring; pagination state (`page`/`rowsPerPage` `useState` and slicing); filtering and search; virtualization/windowing; column resizing, reordering, pinning, visibility toggles; row grouping, tree data, aggregation; inline cell editing; CSV/Excel export; server-side data fetching; expandable/detail rows (docs show composing `Collapse` manually — `CollapsibleTable.tsx`); keyboard grid navigation (arrow keys between cells); column widths (you pass `style={{ width }}` or `minWidth` per cell); zebra striping (`:nth-of-type(odd)` via `styled`).

`docs/data/material/components/table/EnhancedTable.tsx` is the honest yardstick: ~11 KB / ~370 lines of application code to get sort + select + paginate + a selection toolbar, including hand-written `descendingComparator`/`getComparator` generics. That is roughly what a `<DataGrid rows={} columns={} checkboxSelection />` one-liner buys you in `DataTable.tsx`.

---

### 6. Flexibility & customization

Five layered mechanisms, in increasing order of reach:

**1. `sx` prop.** Every component declares it (`sx?: SxProps<Theme>` in each `.d.ts`; the propTypes accept object, function, or array-of-those). Supports theme-token shorthands and responsive values: `sx={{ minWidth: 650 }}`, `sx={{ backgroundColor: 'background.paper' }}`, and array form with conditionals as in `EnhancedTable.tsx`'s toolbar.

**2. `styled()` + the `*Classes` objects.** The canonical pattern, straight from `docs/data/material/components/table/CustomizedTables.tsx`:

```tsx
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: { backgroundColor: theme.palette.common.black,
                                    color: theme.palette.common.white },
  [`&.${tableCellClasses.body}`]: { fontSize: 14 },
}));
```

**3. Theme `components`.** All ten components are registered in `packages/mui-material/src/styles/components.ts` (`MuiTable` line 708 through `MuiTablePaginationActions` line 757), each accepting `defaultProps`, `styleOverrides`, and `variants`. Every component calls `useDefaultProps({ props: inProps, name: 'MuiXxx' })` as its first line, so theme `defaultProps` genuinely reach it. `styleOverrides` resolution is fine-grained: `TableCell.js` lines 33–45's `overridesResolver` exposes `root`, per-variant, `sizeSmall`/`sizeMedium`, `paddingCheckbox`/`paddingNone`, `alignLeft`…`alignJustify`, and `stickyHeader` as separately targetable override keys. `TablePagination.js` lines 42–45 and 84–89 even expose *nested* selectors (`& .MuiTablePagination-actions`, `& .MuiTablePagination-select`) as override targets.

**4. `slots` / `slotProps`.** Only two components have them, and it is the modern API:
- `TablePagination`: `root`, `toolbar`, `spacer`, `selectLabel`, `select`, `menuItem`, `displayedRows`, and a nested `actions` object with `firstButton`, `firstButtonIcon`, `lastButton`, `lastButtonIcon`, `nextButton`, `nextButtonIcon`, `previousButton`, `previousButtonIcon` (`TablePagination.js` 486–504; types in `TablePagination.d.ts` 38–110). Each slotProps entry accepts an object *or* a `(ownerState) => object` callback (`TablePagination.js` 182–185).
- `TableSortLabel`: `root` and `icon` (`TableSortLabel.js` 194–205).
Both are wired through `packages/mui-material/src/utils/useSlot.ts`, which merges class names, refs, ownerState, and external forwarded props.
The legacy props are deprecated with codemods available: `packages/mui-codemod/src/deprecations/table-pagination-props/table-pagination-props.js` migrates `ActionsComponent` → `slots.actions` and `SelectProps` → `slotProps.select`; `table-sort-label-classes/` migrates deprecated `tableSortLabelClasses` keys.

**5. `component` prop.** Every component accepts `component: React.ElementType` and passes it through as styled's `as`. This is the deepest escape hatch — it lets you render the entire table as `<div>`s (see §7), or wrap the container in `Paper` (`<TableContainer component={Paper}>`). `TableSortLabel` is the exception: its conformance test lists `skip: ['componentProp']` (`TableSortLabel.test.js` line 27), since it hard-codes `component="span"` on the `ButtonBase` root.

**How far can you deviate?** Visually, arbitrarily far — nothing about the Material look is load-bearing, and `variants` in the theme let you invent new `size`/`variant` values with TS module augmentation to match. Structurally, also far: `component` + `...other` + ref forwarding is enough for `react-virtuoso` to take over layout entirely. What you *cannot* change is behavior, because there is essentially none to change — which is simultaneously the ceiling and the point.

---

### 7. Accessibility

**Native-first.** In the default configuration the components emit real `<table>`/`<thead>`/`<tbody>`/`<tfoot>`/`<tr>`/`<th>`/`<td>` and deliberately add **no** ARIA roles, because the implicit roles are already correct. Each component computes `role={component === defaultComponent ? null : '<role>'}`:

| Component | Default element | Role when `component` differs | Source |
|---|---|---|---|
| `Table` | `table` | `role="table"` | `Table.js` line 86 |
| `TableHead` | `thead` | `role="rowgroup"` | `TableHead.js` line 51 |
| `TableBody` | `tbody` | `role="rowgroup"` | `TableBody.js` line 51 |
| `TableFooter` | `tfoot` | `role="rowgroup"` | `TableFooter.js` line 50 |
| `TableRow` | `tr` | `role="row"` | `TableRow.js` line 83 |
| `TableCell` | `th`/`td` | *(none — see below)* | — |
| `TableContainer` | `div` | *(none)* | — |

So `<Table component="div">` degrades gracefully into a valid ARIA table. Directly tested:
- `Table.test.js` lines 33–36 — `sets role="table"` for `component="div"`.
- `TableHead.test.js` lines 38–41 — `sets role="rowgroup"`.
- `TableRow.test.js` lines 44–47 — asserts `role="row"` (the `it()` title says `rowgroup`, a copy-paste slip; the assertion is correct).

**Gap:** `TableCell` has **no** role fallback. Render `<TableCell component="div">` and you get a bare `<div>` with no `role="cell"`/`"columnheader"`, which breaks the ARIA table it sits in. `TableCell.js` lines 193–198 only chooses the element; no role is computed. This is the one real a11y hole in the set, and it is exactly the case a `component="div"` table hits.

**`scope` handling** (`TableCell.js` 200–207) is careful and spec-cited:
- `scope="col"` is auto-applied to head cells that don't specify one.
- `scope` is force-stripped when the resolved element is `td`, because it isn't valid there (comment links `html.spec.whatwg.org/multipage/tables.html#the-td-element`). Tested: `TableCell.test.js` lines 92–100, "should not set scope attribute when TableCell is rendered as `<td>` within table head".
- Row headers are the author's job: the docs consistently write `<TableCell component="th" scope="row">` for the first column (`BasicTable.tsx`, `AccessibleTable.tsx`).

**`aria-sort`** (`TableCell.js` 224–227, 234): `sortDirection="asc"` → `aria-sort="ascending"`, `"desc"` → `"descending"`, `false`/absent → attribute omitted. Tested at `TableCell.test.js` lines 76–84.

**`TableSortLabel` keyboard/focus.** Built on `ButtonBase` with `component="span"` and `internalNativeButton: false` (`TableSortLabel.js` lines 133–135, 146). That routes through `ButtonBase/useButtonBase.ts`, which for the non-native path (lines 210–225):
- sets `role="button"`,
- sets `tabIndex` (default 0; `-1` when disabled),
- sets `aria-disabled` when disabled,
- and synthesizes keyboard activation: `Enter` on keydown calls `event.currentTarget.click()` (lines 290–293), `Space` is `preventDefault`ed on keydown and fires `click()` on keyup (lines 285–288, 304–311) — matching native button semantics. `hasNativeKeyboardActivation()` (lines 193–208) inspects the actual DOM tag so it never double-fires on a real `<button>`.
- Focus ring: `ButtonBase` manages `focusVisible` state; `TableSortLabel` passes `disableRipple`.
Asserted at `TableSortLabel.test.js` lines 90–96: `screen.getByRole('button')` resolves and the element `.to.have.tagName('SPAN')`.

`TableRow.js` line 35 sets `outline: 0` with the comment "We disable the focus ring for mouse, touch and keyboard users" — rows are not focusable by default, so this only matters if you make them focusable, in which case you must supply your own indicator.

**`TablePagination` a11y** is the most thoroughly tested surface — `TablePagination.test.js` is 893 lines with ~31 role/aria assertions:
- Every action button gets both `aria-label` and `title` from `getItemAriaLabel(type, page)` (`TablePaginationActions.js` lines 96–97, 111–112, 125–126, 139–140). Default: `Go to first/previous/next/last page`.
- The rows-per-page `Select` is associated with its label via generated `id`/`labelId` from `useId` (`TablePagination.js` lines 194–195, 240–242, 280–281). Tests assert `expect(combobox).toHaveAccessibleName('Rows per page:')` and the localized variant (lines 129–130, 155–156, 532–533).
- Next/prev are correctly `disabled` at the boundaries (`TablePaginationActions.js` lines 95, 123, 138), with `count === -1` handled so "next" stays enabled for unknown totals.
- RTL is handled at the semantic level, not just visually — the *components and their slotProps* swap, so "previous page" still means previous (lines 80–88).

**Docs-level guidance.** `table.md` declares `waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/table/` in frontmatter and has an Accessibility section (lines 138–146) linking the WAI tables tutorial, with a `<caption>` demo (`AccessibleTable.tsx`). `EnhancedTable.tsx` demonstrates the correct sort-announcement idiom — a `visuallyHidden` (from `@mui/utils`) span reading "sorted ascending"/"sorted descending" inside the active `TableSortLabel`, paired with `sortDirection` on the enclosing `TableCell`.

**What's missing.** No roving-tabindex or arrow-key grid navigation (that's a DataGrid concern). No `aria-rowcount`/`aria-colcount`/`aria-rowindex` support for paginated or virtualized tables — with virtualization the screen reader sees only the rendered window, and nothing helps you fix that. No automatic `aria-label` on `<Table>`; every docs demo supplies one by hand.

---

### 8. Properties / attributes exposed

Types live in `packages/mui-material/src/<Name>/<Name>.d.ts`; the runtime `propTypes` are generated from those and sit at the bottom of the matching `.js`. Generated reference JSON: `docs/pages/material-ui/api/table*.json`.

All nine public components additionally accept: `children`, `classes`, `className`, `component`, `sx`, plus the native attributes of their host element (spread via `...other`), plus a forwarded `ref`.

| Component | Own props | Types file |
|---|---|---|
| `Table` | `padding: 'normal'\|'checkbox'\|'none'` (def `'normal'`), `size: 'small'\|'medium'` (def `'medium'`, augmentable), `stickyHeader: boolean` (def `false`) | `Table/Table.d.ts` (`TableOwnProps`, `TableTypeMap`) |
| `TableHead` | *(none)* | `TableHead/TableHead.d.ts` |
| `TableBody` | *(none)* | `TableBody/TableBody.d.ts` |
| `TableFooter` | *(none)* | `TableFooter/TableFooter.d.ts` |
| `TableContainer` | *(none)* | `TableContainer/TableContainer.d.ts` |
| `TableRow` | `hover: boolean` (def `false`), `selected: boolean` (def `false`) | `TableRow/TableRow.d.ts` |
| `TableCell` | `align: 'inherit'\|'left'\|'center'\|'right'\|'justify'` (def `'inherit'`), `padding`, `size`, `scope: string`, `sortDirection: 'asc'\|'desc'\|false`, `variant: 'head'\|'body'\|'footer'` | `TableCell/TableCell.d.ts` (`TableCellProps`, `TableCellBaseProps`, `SortDirection`) |
| `TableSortLabel` | `active: boolean` (def `false`), `direction: 'asc'\|'desc'` (def `'asc'`), `hideSortIcon: boolean` (def `false`), `IconComponent` (def `ArrowDownwardIcon`), `slots`, `slotProps` — plus all of `ButtonBase` | `TableSortLabel/TableSortLabel.d.ts` |
| `TablePagination` | **required:** `count: number`, `page: number`, `rowsPerPage: number`, `onPageChange`. **optional:** `rowsPerPageOptions` (def `[10,25,50,100]`), `onRowsPerPageChange`, `labelRowsPerPage` (def `'Rows per page:'`), `labelDisplayedRows`, `getItemAriaLabel`, `showFirstButton`/`showLastButton` (def `false`), `disabled` (def `false`), `colSpan`, `ActionsComponent` (deprecated), `slots`, `slotProps` | `TablePagination/TablePagination.d.ts` (284 lines) |
| `TablePaginationActions` | `count`, `page`, `rowsPerPage`, `onPageChange`, `getItemAriaLabel`, `showFirstButton`, `showLastButton` (all required), `disabled`, `slots`, `slotProps` | `TablePaginationActions/TablePaginationActions.d.ts` |

Notable defaults set in code rather than types: `TablePagination`'s `colSpan` defaults to **`1000`** when the root resolves to `TableCell`/`td` (`TablePagination.js` lines 189–192, comment "col-span over everything").

Sensible-defaults observation: `TableHead`, `TableBody`, `TableFooter`, and `TableContainer` have **zero** own props. They exist purely to publish context and carry one CSS rule each.

---

### 9. Events exposed

There are only two first-class callbacks in the entire component set. Everything else is native DOM handlers spread through `...other`.

| Event | Component | Signature | Defined at |
|---|---|---|---|
| `onPageChange` | `TablePagination` (required), `TablePaginationActions` (required) | `(event: React.MouseEvent<HTMLButtonElement> \| null, page: number) => void` | `TablePagination.d.ts` line ~211; propTypes `TablePagination.js` 396–402 |
| `onRowsPerPageChange` | `TablePagination` | `React.ChangeEventHandler<HTMLTextAreaElement \| HTMLInputElement>` | `TablePagination.d.ts` line ~218; propTypes `TablePagination.js` 403–408 |

`onPageChange` is invoked from four handlers inside `TablePaginationActions.js` lines 55–69, which compute the target page for you:

```js
const handleFirstPageButtonClick = (event) => onPageChange(event, 0);
const handleBackButtonClick     = (event) => onPageChange(event, page - 1);
const handleNextButtonClick     = (event) => onPageChange(event, page + 1);
const handleLastPageButtonClick = (event) =>
  onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
```

The `| null` in the event type is why the signature is what it is — a programmatic page change can pass `null`.

Everything else is plain React:
- `TableSortLabel`'s `onClick` comes from `ButtonBase` (its type is `ExtendButtonBase<…>`), routed through `useButtonBase`'s `getButtonProps` so `Enter`/`Space` also produce clicks. `EnhancedTable.tsx` uses `onClick={createSortHandler(headCell.id)}`.
- `TableRow onClick`, `TableCell onClick`, `onMouseEnter`, etc. are native handlers spread onto the host element. There is no `onRowClick`/`onCellClick`/`onSelectionChange`/`onSortChange` — those are your abstractions to write.
- `onRowsPerPageChange` is wired directly to the internal `Select`'s `onChange` (`TablePagination.js` line 279); `event.target.value` is the new page size.

---

### 10. Helpers / utilities

**Contexts** (both internal, both `@ignore`d in the docs, neither publicly exported):
- `packages/mui-material/src/Table/TableContext.js` + `TableContext.d.ts` — `{ padding, size, stickyHeader }`.
- `packages/mui-material/src/Table/Tablelvl2Context.js` + `Tablelvl2Context.d.ts` — `{ variant: 'head' | 'body' | 'footer' }`. The odd name means "table level 2", i.e. the section level. Because it isn't exported from the package barrel, a custom section component cannot legally provide it — deep-import or reimplement `TableCell` if you need to.

**Class-name objects** — one per component, exported from the component's barrel (`Table/index.js` re-exports `tableClasses`, etc.) and from `@mui/material`:

| Export | File | Keys |
|---|---|---|
| `tableClasses` | `Table/tableClasses.ts` | `root`, `stickyHeader` |
| `tableHeadClasses` / `tableBodyClasses` / `tableFooterClasses` / `tableContainerClasses` | respective `*Classes.ts` | `root` |
| `tableRowClasses` | `TableRow/tableRowClasses.ts` | `root`, `selected`, `hover`, `head`, `footer` |
| `tableCellClasses` | `TableCell/tableCellClasses.ts` | `root`, `head`, `body`, `footer`, `sizeSmall`, `sizeMedium`, `paddingCheckbox`, `paddingNone`, `alignLeft`, `alignCenter`, `alignRight`, `alignJustify`, `stickyHeader` |
| `tableSortLabelClasses` | `TableSortLabel/tableSortLabelClasses.ts` | `root`, `active`, `icon`, `directionAsc`, `directionDesc` |
| `tablePaginationClasses` | `TablePagination/tablePaginationClasses.ts` | `root`, `toolbar`, `spacer`, `selectLabel`, `selectRoot`, `select`, `selectIcon`, `input`, `menuItem`, `displayedRows`, `actions` |
| `tablePaginationActionsClasses` | `TablePaginationActions/tablePaginationActionsClasses.ts` | `root` |

Each file also exports a `getXUtilityClass(slot)` builder and a `XClassKey` type, all built on `generateUtilityClass`/`generateUtilityClasses` from `@mui/utils`.

**Styling/theming helpers used by these components** — `useDefaultProps` (`../DefaultPropsProvider`), `styled` and `useTheme` re-exported from `../zero-styled/index.tsx`, `memoTheme` (`../utils/memoTheme`), `capitalize` (`../utils/capitalize`), `useSlot` (`../utils/useSlot.ts`), `composeClasses` / `integerPropType` / `chainPropTypes` from `@mui/utils`, `useRtl` from `@mui/system/RtlProvider`, `useId` (`../utils/useId`), `getTransitionStyles` (`../transitions/utils`), and `visuallyHidden` from `@mui/utils` (used in the sorting demo, not in the components themselves).

**Localization** — `packages/mui-material/src/locale/index.ts` re-exports ~60 `Localization` objects; each supplies `MuiTablePagination.defaultProps`. `locale/utils/buildFormatNumber` builds the locale-aware number formatter; `locale/utils/LocaleTextApi` holds the types.

**Test utilities:**
- `packages/mui-material/test/describeConformance.ts` — wraps `describeConformance` from `@mui/internal-test-utils`, pre-injecting `ThemeProvider`, `createTheme`, and `DefaultPropsProvider`. Every Table component runs it, which uniformly verifies ref forwarding, `className` merging, the `component`/`as` prop, `sx`, theme `styleOverrides`, theme `defaultProps`, theme `variants`, and (where declared) slots.
- The Table tests use a `renderInTable(node)` helper to mount cells/rows inside a valid `<table>` (see `TableCell.test.js` lines 8–16, `TableRow.test.js` lines 9–15) and override `describeConformance`'s `render`/`container` to point at the real element — a useful pattern to copy when testing your own cell components.
- `packages/mui-material/src/TablePagination/TablePagination.spec.tsx` — type-only assertions.
- `test/regressions/` holds the visual-regression harness.

---

### 11. Verdict

- **Strength — it is honestly a styling layer over `<table>`, and that's a feature.** Ten components, ~1,500 LOC total including propTypes; no state, no virtualization, no data model. Because they're this thin, they compose with anything: `react-virtuoso` drives them via a component map (`ReactVirtualizedTable.tsx`), TanStack Table or your own reducer drops in with zero friction, and `component`/`as` + `...other` + forwarded refs mean you're never fighting the library for control of the DOM.

- **Strength — customization is genuinely five-deep and well-layered.** `sx` → `styled()` + exported `*Classes` → theme `defaultProps`/`styleOverrides`/`variants` (all ten registered in `styles/components.ts`) → `slots`/`slotProps` on `TablePagination` and `TableSortLabel` → `component`. Plus TS module augmentation (`TableCellPropsSizeOverrides` et al.) so custom `size`/`variant` values are type-safe. Deprecations ship with codemods.

- **Strength — accessibility defaults are right, and `TablePagination` is exemplary.** Native semantics by default with no gratuitous ARIA; automatic `scope="col"` with spec-correct stripping on `<td>`; `aria-sort` from `sortDirection`; `role` fallbacks when `component` changes. `TablePagination` gets `useId`-linked label association, `aria-label` + `title` on every button, correct boundary disabling, RTL slot swapping, ~60 locales, and 893 lines of tests.

- **Weakness — you build everything that makes a table useful.** Sorting, selection, pagination state, filtering, virtualization, resizing, editing, export: all yours. `EnhancedTable.tsx` needs ~370 lines of app code for sort + select + paginate, versus a five-prop `<DataGrid />`. The docs themselves point you at DataGrid (`table.md` lines 45–49) for anything data-heavy.

- **Weakness — two concrete rough edges.** (1) `TableCell` emits **no** `role` fallback when `component` isn't `th`/`td`, so a `component="div"` table has correct `table`/`rowgroup`/`row` roles but broken cells — and its props are a loose `ThHTMLAttributes & TdHTMLAttributes` union by the maintainers' own admission (`TableCell.d.ts` lines 10–17). (2) Sticky-header cells hardcode `palette.background.default` (`TableCell.js` line 163), which visibly mismatches inside a `Paper`; even the official demo patches it with `sx`.

- **Best fit:** small-to-medium presentational tables — dashboards, invoices, settings and admin lists, report tables, anything under a few hundred rows where you own the data logic and care about design-system fidelity and bundle weight. Also a good substrate when you pair it with a headless table library or a virtualizer and want MUI-consistent visuals. Reach for `@mui/x-data-grid` (not in this repo) once you need built-in sorting/filtering/virtualization/editing at scale.

---

## TanStack Table (v9) — Library Analysis

> Analyzed checkout: `/home/brino/Code/studies/table` (TanStack Table monorepo). All paths below are repo-relative.

### 1. Overview

TanStack Table is a **headless** table/datagrid library: it computes table state, row models, and derived APIs, and renders nothing. You write 100% of the markup.

**Version: `9.1.2`** — verified in every workspace package manifest (`packages/table-core/package.json`, `packages/react-table/package.json`, etc.). The root `package.json` is the private monorepo shell named `"table"`. **This is v9, a full rewrite** — most public documentation and blog content on the internet describes v8, and the two are not API-compatible without a migration pass (`docs/framework/react/guide/migrating.md`, 48 KB of breaking changes).

| Package | Name | Peer deps |
|---|---|---|
| `packages/table-core` | `@tanstack/table-core` | none (deps: `@tanstack/store`) |
| `packages/react-table` | `@tanstack/react-table` | `react >=18` |
| `packages/preact-table` | `@tanstack/preact-table` | `preact >=10` |
| `packages/solid-table` | `@tanstack/solid-table` | `solid-js >=1.3` |
| `packages/vue-table` | `@tanstack/vue-table` | `vue >=3.2` |
| `packages/svelte-table` | `@tanstack/svelte-table` | `svelte ^5` |
| `packages/angular-table` | `@tanstack/angular-table` | `@angular/core >=19` |
| `packages/lit-table` | `@tanstack/lit-table` | `lit ^3.1`, `@lit/context` |
| `packages/ember-table` | `@tanstack/ember-table` | (Embroider addon) |
| `packages/octane-table` | `@tanstack/octane-table` | `octane 0.1.21` |
| `packages/alpine-table` | `@tanstack/alpine-table` | `alpinejs ^3.15` |
| `packages/*-devtools` | `@tanstack/table-devtools` + react/vue/solid/preact/angular wrappers | framework-specific |
| `packages/match-sorter-utils` | `@tanstack/match-sorter-utils` | none (fuzzy-filter helper) |

**Structural differences vs v8:**

| Concern | v8 | v9 (this checkout) |
|---|---|---|
| Feature loading | All features always present in core | Explicit opt-in via required `features` option; `tableFeatures({...})` (`packages/table-core/src/helpers/tableFeatures.ts`) |
| Row models | `getCoreRowModel()` passed as top-level option | Row-model *factories* live inside the `features` object (`createSortedRowModel()`, …) and are validated against their prerequisite feature (`FeatureSlotPrereqs` in `packages/table-core/src/types/TableFeatures.ts`) |
| State | React `useState` + rerender-everything | TanStack Store atoms per state slice; per-slice subscriptions; React Compiler safe (`packages/table-core/src/core/table/constructTable.ts`) |
| API shape | Methods baked into instances | Methods assigned to shared **prototypes** per table (memory win), plus a `static-functions` entry point exposing every `table_*` / `column_*` / `row_*` function standalone |
| Filter/sort fns | Global string registry | Registries passed on `features` (`filterFns`, `sortFns`, `aggregationFns`), keys become the typed literal union |
| Meta typing | Global `declare module` merging | Per-table `tableMeta` / `columnMeta` / `filterMeta` phantom slots |
| Build | UMD + CJS + ESM | **ESM only**, `target: ES2022`, `sideEffects: false`, no `src`/sourcemaps shipped |
| Hook name | `useReactTable` | `useTable` (a `useLegacyTable` compat shim exists: `packages/react-table/src/useLegacyTable.ts`) |

`table-core` is framework-agnostic and its only runtime dependency is `@tanstack/store`. Subpath exports: `.`, `./static-functions`, `./reactivity`, `./flex-render`, `./store-reactivity-bindings`, `./experimental-worker-plugin`.

### 2. Setup required

```bash
npm i @tanstack/react-table   # pulls @tanstack/table-core + @tanstack/react-store
```

No build step, no CSS, no provider. Peer dep is just `react >=18`. ESM-only, so a bundler (or Node ESM) is required — there is no CJS fallback.

Minimum working table (condensed from `examples/react/basic-use-table/src/main.tsx`):

```tsx
import { createColumnHelper, tableFeatures, useTable } from '@tanstack/react-table'

type Person = { firstName: string; age: number }

const features = tableFeatures({})            // v9: required. {} = core only
const ch = createColumnHelper<typeof features, Person>()
const columns = ch.columns([
  ch.accessor('firstName', { header: 'First Name', cell: (i) => i.getValue() }),
  ch.accessor('age', { header: 'Age' }),
])

function Table({ data }: { data: Array<Person> }) {
  const table = useTable({ features, columns, data })
  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((hg) => (
          <tr key={hg.id}>
            {hg.headers.map((h) => (
              <th key={h.id}>{h.isPlaceholder ? null : <table.FlexRender header={h} />}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getAllCells().map((cell) => (
              <td key={cell.id}><table.FlexRender cell={cell} /></td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

Every `<table>`, `<tr>`, `<th>` above is yours. To add sorting you must import *both* the feature and its row-model factory into `tableFeatures({ rowSortingFeature, sortedRowModel: createSortedRowModel(), sortFns: { alphanumeric: sortFn_alphanumeric } })` — forgetting the factory silently yields unsorted rows, forgetting the feature is a type error by design.

Two important stability rules: `data` and `columns` must have stable references (`useState`/`useMemo`), or the table rebuilds every render.

### 3. How it works

**Instance construction** — `packages/table-core/src/core/table/constructTable.ts`:

1. Split the `features` object: non-feature slots (`coreRowModel`, `filteredRowModel`, `sortFns`, `tableMeta`, … enumerated as `NonFeatureKeys`) are stripped out; the rest are real features.
2. Merge `coreFeatures` (`coreCellsFeature`, `coreColumnsFeature`, `coreHeadersFeature`, `coreRowModelsFeature`, `coreRowsFeature`, `coreTablesFeature` — `src/core/coreFeatures.ts`) with user features.
3. Reduce `feature.getDefaultTableOptions(table)` across all features → merge user options on top.
4. Reduce `feature.getInitialState(state)` → `table.initialState`.
5. For each state key create a writable `baseAtom` and a readonly derived `atom` that resolves precedence: **external atom > controlled `options.state[key]` > internal base atom**.
6. `table.store` is a readonly atom snapshotting all slices with a `shallow` comparator.
7. Loop features once: `initTableInstanceData` → collect `init*InstanceData` hooks → `constructTableAPIs`.

**Feature/plugin system** — the `TableFeature` interface (`src/types/TableFeatures.ts`) has 14 optional hooks: `getInitialState`, `getDefaultTableOptions`, `getDefaultColumnDef`, `constructTableAPIs`, `assign{Cell,Column,Header,Row}Prototype`, `init{Table,Cell,Column,HeaderGroup,Header,Row}InstanceData`, `resetTableInstanceData`. Feature methods land on **shared prototypes** (via `assignPrototypeAPIs`), not per-instance closures — this is where the claimed up-to-90% memory reduction comes from. `rowSortingFeature.ts` is a clean 97-line template: state default, column-def defaults, `onSortingChange: makeStateUpdater('sorting', table)`, then a list of prototype/table API bindings, with all real logic in a sibling `.utils.ts`.

**Row model pipeline** (`src/core/row-models/coreRowModelsFeature.utils.ts`) — lazily created, cached on `table._rowModels`:

```
core → filtered → grouped → sorted → expanded → paginated → getRowModel()
                └→ faceted (per-column branch: facetedRowModel / UniqueValues / MinMaxValues)
```

Each stage has a `getPreXRowModel()` reading the previous stage. If the factory is absent, or the matching `manualFiltering` / `manualSorting` / `manualPagination` flag is set, the stage is a pass-through — that is exactly how server-side mode works.

**State ownership** is tri-modal and per-slice, not all-or-nothing:
- *Uncontrolled* (default): internal base atoms, `initialState` seeds them.
- *Controlled* (v8-compatible): `state: { sorting }` + `onSortingChange`.
- *External atoms* (new): the `atoms` option hands a writable TanStack Store atom for a slice; `constructTable` two-way-syncs it.

**Adapter layer** is thin. `packages/react-table/src/useTable.ts` calls `constructTable` once in `useState`, injects `reactReactivity()` as `coreReactivityFeature`, keeps options fresh during render via `table_setOptions(..., { syncExternalState: false })`, subscribes through `useSelector(rootSource, selector, { compare: shallow })`, and publishes controlled state in a layout effect. The optional second argument to `useTable` is a state selector: pass `(s) => ({ pagination: s.pagination })` and the component only rerenders on pagination. `table.Subscribe` and `table.FlexRender` are attached as components for finer-grained subtree subscriptions.

**Virtualization is not included.** `docs/guide/features.md:132` says so explicitly: virtualization comes from TanStack Virtual. There is a dedicated guide (`docs/framework/react/guide/virtualization.md`) and five examples (`examples/react/virtualized-rows`, `virtualized-columns`, `virtualized-infinite-scrolling`, plus `-experimental` variants) that pair `@tanstack/react-virtual` with `table.getRowModel().rows`. Because the library is headless, this composes cleanly — you index into the rows array yourself.

There is also an **experimental web-worker row-model plugin** (`packages/table-core/src/worker/`, entry `@tanstack/table-core/experimental-worker-plugin`) that moves filter/sort/group off the main thread. `docs/guide/worker-row-models.md` warns it is a proof of concept, may be removed in any release, and is only worth it above ~100k client-side rows.

### 4. Developer experience

**TypeScript quality is the standout, and also the main cost.** Everything is generic over `<TFeatures extends TableFeatures, TData extends RowData>`. The key trick: option, state, and column-def surfaces are *feature-gated* through mapped types —

```ts
export type TableOptions<TFeatures, TData> =
  TableOptions_Core<TFeatures, TData> &
  ExtractFeatureMapTypes<TFeatures, TableOptions_FeatureMap<TFeatures, TData>> &
  DebugOptions<TFeatures>
```

(`src/types/TableOptions.ts`). Only the features you registered contribute options, state slices, and instance methods. `table.getState().sorting` does not typecheck if `rowSortingFeature` was not registered. `ValidateFeatureSlots` goes further and replaces the type of a misconfigured slot with a literal error message naming the missing feature, so `sortedRowModel` without `rowSortingFeature` fails with a readable message.

`createColumnHelper<typeof features, Person>()` infers `TValue` from either a dotted key (`DeepKeys<TData>`) or an accessor function return type; `helper.columns([...])` uses variadic tuple types specifically to stop per-column `TValue` from widening.

**Docs** in-repo are substantial: `docs/guide/` (14 concept guides), `docs/framework/<fw>/guide/` (25 React guides incl. one per feature), `docs/reference/` (generated API), plus `docs/agent-skills.md` and a `docs/devtools.md`. JSDoc coverage in source is unusually good — most exported functions carry an `@example`.

**Dev warnings** are `process.env.NODE_ENV === 'development'` gated and reasonably targeted:

| Warning | Location |
|---|---|
| `[Table] Column with id 'x' does not exist.` | `src/core/columns/coreColumnsFeature.utils.ts:284` |
| accessor returned `undefined` | `src/core/columns/constructColumn.ts:78` |
| unregistered `sortFn` | `src/features/row-sorting/rowSortingFeature.utils.ts:234` |
| unregistered `filterFn` / `globalFilterFn` | `columnFilteringFeature.utils.ts:89`, `globalFilteringFeature.utils.ts:82` |
| aggregation misconfiguration | `rowAggregationFeature.utils.ts:52` |
| worker fallback | `src/worker/createWorkerRowModel.ts:65` |

**Debug flags**: `debugAll`, `debugCache`, `debugCells`, `debugColumns`, `debugHeaders`, `debugRows`, `debugTable`, **plus a generated `debug<FeatureName>` per registered feature** (`DebugKeysFor` template-literal type, `src/types/TableOptions.ts`). `debugTable` prints the resolved feature list, active row models, and state keys at construction. On top of that there are first-class **devtools** packages for React/Vue/Solid/Preact/Angular (`useTanStackTableDevtools(table)` + `tableDevtoolsPlugin()`).

**Learning curve is steeper than v8.** You must now understand the features/row-model/registry triangle before rendering a sorted table, and the generic signatures in error messages are long. Mitigations shipped in-repo: `stockFeatures` (import everything, v8-like), `useLegacyTable` + `packages/react-table/src/legacy.ts` (v8-shaped `getCoreRowModel()` etc.), and `createTableHook` for pre-binding features app-wide.

**Escape hatches**: `@tanstack/table-core/static-functions` re-exports every internal `table_*`/`column_*`/`row_*` util so you can call table logic without an instance; `table.atoms`, `table.baseAtoms`, `table.optionsStore` are all reachable.

### 5. Features

Six always-on core features (`src/core/coreFeatures.ts`): cells, columns, headers, rows, row-models, table. Seventeen opt-in stock features (`src/features/stockFeatures.ts`):

| Feature | Source dir | Notes |
|---|---|---|
| `rowSortingFeature` | `features/row-sorting/` | multi-sort, `sortUndefined`, auto sort-fn detection; `sortFns.ts` ships alphanumeric(+CaseSensitive), text(+CaseSensitive), datetime, basic |
| `columnFilteringFeature` | `features/column-filtering/` | 22 built-in fns in `filterFns.ts` (equals, includesString, startsWith, between, inNumberRange, inDateRange, arrIncludesAll/Some, empty/notEmpty, …) |
| `globalFilteringFeature` | `features/global-filtering/` | requires column filtering as prerequisite |
| `columnFacetingFeature` | `features/column-faceting/` | `createFacetedRowModel`, `createFacetedUniqueValues`, `createFacetedMinMaxValues` |
| `rowPaginationFeature` | `features/row-pagination/` | client or `manualPagination` |
| `columnGroupingFeature` | `features/column-grouping/` | `createGroupedRowModel` |
| `rowAggregationFeature` | `features/row-aggregation/` | 12 fns: sum, min, max, extent, mean, median, unique, uniqueCount, count, first, last |
| `rowExpandingFeature` | `features/row-expanding/` | sub-rows + `createExpandedRowModel` |
| `rowSelectionFeature` | `features/row-selection/` | incl. Shift-range selection |
| `rowPinningFeature` | `features/row-pinning/` | top/bottom |
| `columnOrderingFeature` | `features/column-ordering/` | |
| `columnPinningFeature` | `features/column-pinning/` | logical `start`/`end` pinning (new in v9) |
| `columnSizingFeature` | `features/column-sizing/` | |
| `columnResizingFeature` | `features/column-resizing/` | requires `columnSizingFeature` |
| `columnVisibilityFeature` | `features/column-visibility/` | |
| `cellSelectionFeature` | `features/cell-selection/` | **new in v9** — spreadsheet-style rectangular ranges, drag, Shift-extend, disjoint ranges (`cellSelectionGeometry.ts`) |
| `cellSpanningFeature` | `features/cell-spanning/` | **new in v9** — `spanRows`/`spanColumns`, span-aware selection, `header.rowSpan` |

Not features, but adjacent: fuzzy filtering is a documented recipe over `@tanstack/match-sorter-utils` (`docs/framework/react/guide/fuzzy-filtering.md`), virtualization is TanStack Virtual, drag-and-drop is your DnD library (`examples/react/column-dnd`, `row-dnd`).

Tree-shaking is the point: `docs/framework/react/guide/migrating.md` claims a ~5 kB floor with only what you import; `sideEffects: false` plus per-feature exports makes that credible.

### 6. Flexibility & customization

- **Cell/header/footer renderers**: `cell`, `header`, `footer`, `aggregatedCell` on the column def accept a string, a node, or a component; `flexRender(def, ctx)` / `<FlexRender cell={cell} />` resolves whichever (`packages/react-table/src/FlexRender.tsx`). `FlexRender` also auto-routes aggregated cells to `aggregatedCell` and renders `null` for grouping placeholders.
- **Custom sort/filter/aggregation fns**: build with `constructSortFn` / `constructFilterFn` / `constructAggregationFn` (attaches a resolver definition so variants can be spread), then register them by key in `tableFeatures({ sortFns: { mySort } })`. The registry keys become the typed literal union for `sortFn` / `filterFn` / `globalFilterFn` / `aggregationFn`.
- **Custom row models**: each pipeline slot (`coreRowModel`, `filteredRowModel`, `groupedRowModel`, `sortedRowModel`, `expandedRowModel`, `paginatedRowModel`, faceted variants) accepts any `(table) => () => RowModel` factory. The built-ins are just default factories.
- **Custom features/plugins**: implement `TableFeature`, declaration-merge into `Plugins`, `TableOptions_FeatureMap`, `TableState_FeatureMap`, `ColumnDef_FeatureMap`, and optionally `FeatureSlotPrereqs`, and your feature gets the same type-gating, debug flag, initial state, and default options as a built-in. Guide: `docs/framework/react/guide/custom-features.md`; runnable demo: `examples/react/custom-plugin/`.
- **Composition**: `tableOptions()` (8 overloads, `helpers/tableOptions.ts`) composes reusable option bundles; `createTableHook` (`packages/react-table/src/createTableHook.tsx`, ~1200 lines of types) yields an app-scoped hook with features, column helper, cell/header context types, and a table context pre-bound.
- **Ceiling**: two full-featured MUI/Mantine grid libraries are vendored as examples (`examples/react/material-react-table`, `mantine-react-table`), plus shadcn, Chakra, HeroUI, and React Aria kitchen sinks. That is a fair proxy for "how far it can be pushed": it is the engine under most React datagrid products.

### 7. Accessibility

**The library provides essentially zero accessibility.** This is a direct consequence of being headless — it emits no DOM.

Verified by grep across `packages/*/src` for `aria-`, `role=`, `getAria*`: the **only** hits are in `packages/table-devtools/src/components/ResizableSplit.tsx` and `ThreeWayResizableSplit.tsx` (`role="separator"`, `aria-orientation`, `aria-valuenow/min/max`) — i.e. the devtools panel's own splitter, not the table. `table-core` and `react-table` contain no ARIA code whatsoever, and no exported helper produces ARIA attributes.

| Provided by the library | Must be implemented by you |
|---|---|
| Semantically meaningful *state* (`column.getIsSorted()` → `'asc' \| 'desc' \| false`, `row.getIsSelected()`, `row.getIsExpanded()`, `column.getIsVisible()`, pagination indices) | `role="grid"`/`table` decisions, or native `<table>` semantics |
| Event handler factories (`column.getToggleSortingHandler()`, `row.getToggleSelectedHandler()`, resize handlers) | `aria-sort` on sortable `<th>` (map from `getIsSorted()`) |
| `header.colSpan` / `header.rowSpan` for correct header structure | `aria-selected`, `aria-expanded`, `aria-level`, `aria-rowcount`/`aria-rowindex` for virtualized or paginated grids |
| | Keyboard navigation of any kind — arrow-key cell traversal, roving tabindex, focus management. `cellSelectionFeature` computes selection geometry but binds no keyboard model |
| | Accessible names for icon-only sort/expand/select controls, live-region announcements for filter/sort/page changes |
| | Screen-reader handling of pinned/sticky columns and virtualized row windows (a virtualized `<tbody>` breaks implicit row indices) |

Practical implication: if the sort handler is attached to a `<div>` inside a `<th>` (as several examples do), it is not keyboard reachable unless you add `tabIndex`, key handling, and a role. The React Aria example (`examples/react/kitchen-sink-react-aria`, `lib-react-aria`) is the one in-repo pattern that pairs the library with an accessibility-complete component layer — that is the recommended route for a11y-critical products.

### 8. Properties / attributes exposed

Composed type: `TableOptions<TFeatures, TData> = TableOptions_Core & ExtractFeatureMapTypes<...> & DebugOptions` — `packages/table-core/src/types/TableOptions.ts`. Each feature owns its slice in a `TableOptions_<Feature>` interface inside `packages/table-core/src/features/<feature>/<feature>Feature.types.ts`.

| Category | Options (representative) | Defined in |
|---|---|---|
| Required core | `features`, `columns`, `data` | `core/columns/coreColumnsFeature.types.ts`, `core/rows/coreRowsFeature.types.ts` |
| Core table | `key` (devtools id), `initialState`, `state`, `atoms`, `defaultColumn`, `meta`, `getRowId`, `getSubRows`, `renderFallbackValue`, `mergeOptions`, `autoResetAll` | `core/table/coreTablesFeature.types.ts` |
| State (controlled) | one `state` slice per feature, mirrored by `TableState_FeatureMap` | `types/TableState.ts` |
| Callbacks | `on<Slice>Change` per state slice (see §9) | per-feature `.types.ts` |
| Enable flags | `enableSorting`, `enableMultiSort`, `enableColumnFilters`, `enableGlobalFilter`, `enableGrouping`, `enableExpanding`, `enableRowSelection`, `enableMultiRowSelection`, `enableSubRowSelection`, `enableColumnPinning`, `enableRowPinning`, `enableColumnResizing`, `enableHiding`, `enableCellSelection`, … | per-feature |
| Manual / server-side | `manualFiltering`, `manualSorting`, `manualGrouping`, `manualExpanding`, `manualPagination`, `rowCount`, `pageCount` | per-feature |
| Auto-reset | `autoResetSorting`, `autoResetPageIndex`, `autoResetExpanded`, `autoResetAll` | per-feature |
| Behavior tuning | `isMultiSortEvent`, `maxMultiSortColCount`, `sortDescFirst`, `enableSortingRemoval`, `filterFromLeafRows`, `maxLeafRowFilterDepth`, `globalFilterFn`, `groupedColumnMode`, `paginateExpandedRows`, `columnResizeMode`, `columnResizeDirection`, `keepPinnedRows` | per-feature |
| Debug | `debugAll`, `debugCache`, `debugCells`, `debugColumns`, `debugHeaders`, `debugRows`, `debugTable`, `debug<AnyRegisteredFeature>` | `types/TableOptions.ts` (`DebugOptions`) |
| Non-feature `features` slots | `coreRowModel`, `filteredRowModel`, `groupedRowModel`, `sortedRowModel`, `expandedRowModel`, `paginatedRowModel`, `facetedRowModel`, `facetedUniqueValues`, `facetedMinMaxValues`, `filterFns`, `sortFns`, `aggregationFns`, `tableMeta`, `columnMeta`, `filterMeta` | `types/TableFeatures.ts` (`NonFeatureKeys`) |

**ColumnDef surface** — `packages/table-core/src/types/ColumnDef.ts`:

| Category | Fields |
|---|---|
| Identity / access | `id`, `accessorKey`, `accessorFn`, `columns` (group columns), `getUniqueValues` |
| Rendering | `header`, `footer`, `cell`, `aggregatedCell`, `meta` (typed via `ExtractColumnMeta`) |
| Feature-gated (`ColumnDef_FeatureMap`) | sorting: `sortFn`, `sortDescFirst`, `sortUndefined`, `enableSorting`, `enableMultiSort`; filtering: `filterFn`, `enableColumnFilter`; global filter: `enableGlobalFilter`; grouping: `enableGrouping`, `getGroupingValue`; aggregation: `aggregationFn`, aggregated cell defs; sizing: `size`, `minSize`, `maxSize`; resizing: `enableResizing`; pinning: `enablePinning`; visibility: `enableHiding`; cell selection & cell spanning (`spanRows`, `spanColumns`) |
| Variants | `AccessorKeyColumnDef`, `AccessorFnColumnDef`, `DisplayColumnDef`, `GroupColumnDef`, `IdentifiedColumnDef`, `ColumnDefResolved` |

Instance-side surfaces live in `types/Table.ts`, `types/Column.ts`, `types/Row.ts`, `types/Header.ts`, `types/HeaderGroup.ts`, `types/Cell.ts`, `types/RowModel.ts`, `types/RowModelFns.ts`.

### 9. Events exposed

There is no event emitter. The whole event surface is the **state-updater callback pattern**: `on<Slice>Change?: OnChangeFn<TState>` where `OnChangeFn<T> = (updater: Updater<T>) => void` and `Updater<T> = T | ((old: T) => T)` — i.e. React-`setState` semantics, so you must call `functionalUpdate` (or handle both branches) in your handler.

Full list, grepped from the feature `.types.ts` files:

| Callback | State slice | Feature dir |
|---|---|---|
| `onSortingChange` | `sorting` | `row-sorting` |
| `onColumnFiltersChange` | `columnFilters` | `column-filtering` |
| `onGlobalFilterChange` | `globalFilter` | `global-filtering` |
| `onPaginationChange` | `pagination` | `row-pagination` |
| `onGroupingChange` | `grouping` | `column-grouping` |
| `onExpandedChange` | `expanded` | `row-expanding` |
| `onRowSelectionChange` | `rowSelection` | `row-selection` |
| `onRowPinningChange` | `rowPinning` | `row-pinning` |
| `onColumnOrderChange` | `columnOrder` | `column-ordering` |
| `onColumnPinningChange` | `columnPinning` | `column-pinning` |
| `onColumnVisibilityChange` | `columnVisibility` | `column-visibility` |
| `onColumnSizingChange` | `columnSizing` | `column-sizing` |
| `onColumnResizingChange` | `columnResizing` | `column-resizing` |
| `onCellSelectionChange` | `cellSelection` | `cell-selection` |

Default wiring: each feature's `getDefaultTableOptions` installs `makeStateUpdater('<slice>', table)` (`src/utils.ts`), which writes the feature's base atom. Supplying your own `on<Slice>Change` replaces that default, which is why controlled mode requires you to also pass `state.<slice>` back in — otherwise the write is swallowed.

Adjacent to callbacks are **DOM handler factories** you spread onto your own elements: `column.getToggleSortingHandler()`, `header.getResizeHandler()`, `row.getToggleSelectedHandler()`, `row.getToggleExpandedHandler()`, `table.getToggleAllRowsSelectedHandler()`. `isMultiSortEvent` (default: `e.shiftKey`) is the hook for reinterpreting the raw event.

Subscription-side "events" in v9: `table.store.subscribe(...)`, `table.atoms.<slice>.subscribe(...)`, `useSelector(table.store, selector)`, and `<table.Subscribe source={table.atoms.rowSelection}>` (`packages/react-table/src/Subscribe.ts`, `useTable.ts`).

### 10. Helpers / utilities

| Helper | Where | Purpose |
|---|---|---|
| `tableFeatures(obj)` | `table-core/src/helpers/tableFeatures.ts` | Declare features + row models + fn registries + meta slots; validates prerequisites at the type level |
| `tableOptions(...)` | `table-core/src/helpers/tableOptions.ts` | 8 overloads for composing reusable option bundles |
| `createColumnHelper<TFeatures, TData>()` | `table-core/src/helpers/columnHelper.ts` | `.accessor()`, `.display()`, `.group()`, `.columns()` — pure type-inference sugar, returns the object unchanged at runtime |
| `metaHelper<TMeta>()` | `table-core/src/helpers/metaHelper.ts` | Phantom value for typing `tableMeta`/`columnMeta` |
| `flexRender` / `<FlexRender>` | `react-table/src/FlexRender.tsx`, core `flex-render.ts` | Render a string \| node \| component uniformly; handles aggregated/placeholder cells |
| Row model factories | `createCoreRowModel`, `createFilteredRowModel`, `createGroupedRowModel`, `createSortedRowModel`, `createExpandedRowModel`, `createPaginatedRowModel`, `createFacetedRowModel`, `createFacetedUniqueValues`, `createFacetedMinMaxValues` | one per pipeline stage, each in its feature dir |
| Sort fns | `features/row-sorting/sortFns.ts` | `sortFn_alphanumeric(+CaseSensitive)`, `sortFn_text(+CaseSensitive)`, `sortFn_datetime`, `sortFn_basic`, `constructSortFn` |
| Filter fns | `features/column-filtering/filterFns.ts` | 22 fns + `constructFilterFn` |
| Aggregation fns | `features/row-aggregation/aggregationFns.ts` | 12 fns + `constructAggregationFn` |
| Instance API | `table.getHeaderGroups()`, `getFooterGroups()`, `getRowModel()`, `getCoreRowModel()`, `getPre*RowModel()`, `getAllColumns()`, `getVisibleLeafColumns()`, `getColumn(id)`, `getRow(id)`, `getMaxSubRowDepth()`, `getState()`, `setOptions()`, `reset()`, plus `set<Slice>` / `reset<Slice>` per feature | `types/Table.ts` + feature `.utils.ts` |
| Standalone functions | `@tanstack/table-core/static-functions` | Every `table_*` / `column_*` / `row_*` / `cell_*` util, callable without an instance |
| Framework composition | `createTableHook`, `createTableHookContexts`, `useLegacyTable`, `legacy.ts` (v8-named `getCoreRowModel` etc.) | `packages/react-table/src/` |
| Fuzzy search | `@tanstack/match-sorter-utils` | separate package, used by `examples/react/filters-fuzzy` |
| Devtools | `useTanStackTableDevtools(table)` + `tableDevtoolsPlugin()` | `packages/react-table-devtools` (and vue/solid/preact/angular equivalents) |

**Test utilities**: none are exported for consumers. Internally the repo has `packages/table-core/tests/{unit,implementation,performance,fixtures,helpers,declaration-emit}`, adapter tests such as `packages/react-table/tests/useTable.test.tsx` and `ssr.test.tsx`, root-level `tests/e2e/helpers/` with Playwright (`playwright.config.ts`), and CI targets `test:lib`, `test:types`, `test:build`, `test:knip`, `test:sherif`. Because the library is headless and the instance is a plain object, unit-testing your own table logic is straightforward — construct it with `constructTable` and assert on `getRowModel().rows`.

### 11. Verdict

- **Strength — the type system is the product.** Feature-gated options/state/APIs mean the compiler tells you when a row-model factory or prerequisite feature is missing, with authored error strings rather than a wall of generic soup. `createColumnHelper` inference over dotted keys and accessor functions is best-in-class. No other datagrid library gets this close.
- **Strength — genuinely unlimited rendering flexibility, and a real performance story.** Zero markup opinions, works with any component library (7 kitchen-sink examples in-repo), and v9's prototype-shared APIs, per-slice atoms, selector-based subscriptions, and tree-shakeable features address the two loudest v8 complaints (memory at scale, whole-tree rerenders). Server-side mode is a first-class path via the `manual*` flags, not a hack.
- **Weakness — accessibility is entirely your problem, and the library gives you nothing.** Not one ARIA attribute or keyboard handler outside the devtools panel. Budget real engineering for `aria-sort`, roving focus, live regions, and virtualized row indexing, or pair it with React Aria / a headless UI kit. Teams routinely underestimate this.
- **Weakness — setup ceremony and a steeper ramp than v8.** The features / row-model-factory / fn-registry triangle means "render a sorted table" is now three coordinated imports plus a `tableFeatures()` call. `stockFeatures` and `useLegacyTable` blunt this, but the mental model is bigger, error messages are long, and ESM-only rules out legacy CJS toolchains.
- **v9 maturity: released and versioned `9.1.2`, not a prerelease** — no `.changeset/pre.json`, stable semver, adapters for 11 frameworks all shipped in lockstep. But it is *early* 9.x, and the repo carries a lot of in-flight signal: `beta-window-triage.md`, `remaining-issues.md` (42 KB), and `perf-todo.md` (117 KB) sit at the root. The worker row-model plugin is explicitly labeled experimental and removable. Ecosystem lag is the real risk: most third-party wrappers, StackOverflow answers, and LLM training data still describe v8's `useReactTable` API, so expect to read `docs/framework/react/guide/migrating.md` rather than search results.
- **Best fit:** a product team building a bespoke, design-system-native datagrid in TypeScript — complex column definitions, server-side or 10k+ client-side rows, custom cell editors — that has the budget to own markup and accessibility. **Poor fit:** "I need a spreadsheet on screen by Friday" (use AG Grid, MUI DataGrid, or the vendored Material/Mantine React Table wrappers), or any project that cannot own its a11y implementation.

---

