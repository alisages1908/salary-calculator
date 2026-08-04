# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A single-page Israeli salary/payslip calculator ("מחשבון שכר"), in Hebrew with RTL layout. The entire application — markup, styles, and logic — lives in one file: `index.html`. There is no build system, package manager, bundler, or test framework; this is a static site meant to be opened directly in a browser or served as-is.

- `index.html` — the whole app (HTML + inline `<style>` + inline `<script>`).
- `README.md` — Hebrew product description of the calculator's features.
- `CNAME` / `CNAME.txt` — GitHub Pages custom domain config (`salarycalculator.work` / `www.salarycalculator.work`). Both files exist; if changing the domain, check whether both are actually needed or one is stale before editing just one.
- `images.jpg` — static asset (not referenced from `index.html` as of the current version — verify before assuming it's used).

## Development Workflow

There is no install/build/lint/test step. To work on this app:
- Open `index.html` directly in a browser, or serve the directory with any static file server (e.g. `python3 -m http.server`).
- Verify changes manually in the browser — there are no automated tests. After editing calculation logic, walk through the wizard (steps 1-4) with sample values and confirm the payslip result and the live net-salary preview (step 4) look correct.
- External dependencies are loaded from CDNs at runtime: Tailwind CSS (`cdn.tailwindcss.com`) and the Heebo Google Font. There's no local copy to update — styling changes are Tailwind utility classes directly in the markup, plus a small `<style>` block for animations, custom scrollbars, and print rules.
- Deployment is via GitHub Pages using the custom domain in `CNAME`; pushing to the default branch is the deploy mechanism.

## Architecture

### Wizard flow (state machine in `<script>`)

The app is a single-page wizard with steps tracked by the global `currentStep` (0-5) and `totalSteps = 4`:
- `page-0` — welcome screen, collects first/last name (`startCalculator()`).
- `page-1` — employment details (workplace, role).
- `page-2` — base salary: either monthly gross (`gross-salary`) or hourly wage (`hourly-wage`), plus tax credit points (`tax-points`, default 2.25).
- `page-3` — hours worked, with two mutually exclusive entry modes toggled by `activeTab` (`toggleTab()`):
  - `regular`: manual total hours + total days (`total-hours`, `total-days`).
  - `advanced`: a per-day time-in/time-out table (`#hours-table`); `calculateTableHours()` derives 100%/125%/150% hour buckets per row (≤8h = 100%, 8-10h = 125%, >10h = 150%) and stores totals in `tableCalcData`.
- `page-4` — absences (vacation/sick/unpaid days, absent hours), travel reimbursement, pension/keren hishtalmut contributions, voluntary deductions. Shows a live net-salary estimate (`updateLivePreview()`) as fields change.
- `step-result` — final payslip, populated by `processFinalCalculation()`, shown via `goToStep(5)`.

Navigation: `attemptGoToStep(n)` validates every step before the target via `validateSpecificStep()` (checks `input[required]`, plus `.step-3-req` inputs only when `activeTab === 'regular'`) before allowing a forward jump; backward jumps via `goToStep()` are unrestricted. `updateTracker()` drives the progress-bar UI. Enter-key handling auto-advances focus between inputs within the current step.

### Calculation engine

`computeSalary()` is the single source of truth for salary math. It reads all current form values via `getVal(id)` (DOM-driven, not a passed-in state object) and returns a plain result object; it's called both for the live preview on step 4 and for the final payslip. Key behaviors:
- `isGlobal = grossInput > 0` switches several formulas between "global" (fixed monthly salary) and "hourly" employment — e.g. sick pay/vacation deductions are computed differently depending on which mode is active, and `dailyWage` is `gross / 21.67` vs `hourly * 8.4`.
- Sick pay follows Israeli labor law tiers: day 1 unpaid, days 2-3 at 50%, day 4+ at 100% of daily wage.
- Income tax uses hardcoded 2025/2026 Israeli brackets and a ₪242 credit-point value; National Insurance (Bituach Leumi) and health tax use their own bracket thresholds (`reducedLimit`, `maxBtlLimit`). If these change (annual updates), the bracket tables and constants inside `computeSalary()` are the only place to update — there's no external config file.
- Pension/keren hishtalmut and voluntary deductions are entered as flat ₪ amounts (not percentages, despite the `-pct` id suffixes) and are subtracted directly from gross to get `netSalary`; employer contributions are informational only and don't affect net pay.

### Result rendering

`processFinalCalculation()` populates the result DOM directly by element id. `setRow(rowId, valId, value, prefix)` is the shared helper that hides a payslip line entirely when its value is 0 and fills it in otherwise — follow this pattern when adding new optional payslip lines rather than inlining show/hide logic.

User-entered text (name, workplace, role) is written with `textContent`, never `innerText`/`innerHTML`, to avoid XSS — preserve this when touching that code.

### Print flow

`printMobileSafe()` handles printing the payslip (`#step-result`). When the page is embedded in an iframe (`window.self !== window.top`), it clones the result markup into a separate hidden iframe with its own Tailwind/font `<head>` and prints that, since printing the parent frame directly doesn't work reliably when embedded; otherwise it falls back to `window.print()`. Print-specific layout is handled by the `@media print` block in the main `<style>`, using `.no-print` / `.print-only` classes.

### Reset/clear

`clearPage(n)` clears all inputs on a given step (resetting `tax-points` to its default and rebuilding the hours table to one empty row for step 3); `resetCalculator()` calls this for all steps plus clears the name fields and returns to step 0. When adding a new input field to a step, make sure it's covered by the existing `input, select, textarea` query in `clearPage()` (it is, automatically) and add default-value handling there only if the field needs a non-empty default like `tax-points` does.

## Conventions

- RTL Hebrew throughout (`dir="rtl"`, `lang="he"`); keep new UI text in Hebrew consistent with the existing tone, and keep icons/arrows mirrored for RTL (e.g. `&larr;`/`&rarr;` are used per visual direction, not per logical next/back).
- Each wizard step has its own accent color (blue/indigo/teal/orange/emerald) applied consistently to its header banner, buttons, and focus rings — match the step's color when adding elements to it.
- Inline `<!-- FIX #n -->` comments mark points where specific historical bugs were fixed; they're informational, not a convention to keep extending — no need to add new numbered "FIX" comments for new work.
