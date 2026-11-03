# Future Lens

A React Native mobile app to help with your digital privacy. It will help people
review a draft before sharing, personalize what to check for, and review their
digital footprint.

## Development setup

Use Node.js 24 LTS and npm. From the repository root:

```sh
nvm use
npm install
npm run typecheck
npm start
```

If you do not use nvm, install Node.js 24 LTS using your preferred method.
The dependency lockfile is checked in. After pulling changes, use `npm ci` to
install exactly the versions used by the team.

The project uses Expo SDK 58 (React Native 0.88, React 19.3). The App Store and
Play Store versions of Expo Go run only the latest SDK, so a phone showing
"incompatible with this version of Expo Go" means the project and the app are on
different SDKs. After pulling the SDK 58 upgrade, run `npm ci`.
The iOS Simulator requires Xcode; the Android Emulator requires Android Studio.

```sh
npm run ios
# Or, with an Android emulator configured:
npm run android
```

### Signing in to Expo (computer and phone)

Expo Go only opens the project when the Expo CLI on your computer **and** the
Expo Go app on your phone are signed in to the **same Expo account**. Otherwise
the terminal logs errors such as "You need to be signed in to Expo Go and Expo
CLI" or "You're signed in to Expo Go as … but not signed in to Expo CLI".

**1. Computer (Expo CLI).** Use either method, then check the result:

```sh
npx expo whoami   # should print your Expo username
```

- **Browser login** (works for accounts created with Google). On Windows, Expo
  CLI's automatic browser launch can crash on the `&` characters in the login
  URL, which also stops the local callback, so Approve then fails. Turn off the
  automatic launch and open the printed link yourself:

  ```powershell
  $env:BROWSER = "none"
  npx expo login
  ```

  Copy the new `https://expo.dev/login?...` link into a browser, sign in, and
  choose Approve while the terminal is still waiting. Each link works only for
  the login attempt that printed it.

- **Username and password.** Accounts created with Google can add a password
  with expo.dev's "Forgot password?" flow. Then sign in without a browser:

  ```sh
  npx expo login --no-browser
  ```

An `EXPO_TOKEN` environment variable overrides both methods. A robot-user token
signs the CLI in as the robot (`whoami` shows "(robot)"), not as the account
used in Expo Go, so remove any `EXPO_TOKEN` and open a new terminal before
signing in. Never commit tokens.

**2. Phone (Expo Go).** Open Expo Go, tap the account icon, and sign in with the
same account, using Continue with Google if that is how the account was created.

**3. Start the app.** Run `npm start` in the signed-in terminal. Scan the QR code
with the iPhone Camera or from inside Expo Go on Android, or choose "Enter URL
manually" in Expo Go and type the `exp://…:8081` address shown in the terminal.
If the phone cannot reach the computer (common on school Wi-Fi), use
`npx expo start --tunnel`.

## Design reference

[HCI-DP3 on Figma](https://www.figma.com/design/UYqm22IgxZxS6G64Ad7T6j/HCI-DP3?node-id=0-1)

The first page implements **Check - 1** (`9:505`): the title, background, button,
and bottom tab styling follow Figma. The Figma content region is a placeholder;
it is filled with an editable draft, platform and audience choices, and two
fictional sample drafts. Tab icons are original Figma exports bundled locally at
3× resolution and displayed at their designed 24×24 size. Text currently uses
the device's system font in place of Inter, which has not been bundled.

### Check a post: UI checkpoint

- Type or paste a draft. Whitespace-only drafts cannot be submitted.
- Choose a platform and an audience; selected chips update immediately.
- Load either fictional sample to populate the draft and its sharing choices.
- Clear the draft with the Clear action.
- Check with Lens opens an explicit preview notice, not generated analysis.
- Switch between Check, My Lens, and Footprint using the bottom tabs.
- Drafts and choices survive tab changes. They live only in component state and
  reset when the app restarts; they are not saved or uploaded.

`CheckPostScreen` accepts `onCheck(request: CheckPostRequest)`. The callback
receives `{ draft, platform, audience }`, with surrounding draft whitespace
trimmed. Replace `previewCheck` in `App.tsx` with the teammate-owned analysis and
results flow; the screen does not implement either. It also accepts `onTabPress`
and `availableTabs` for the app's navigation.

The screen uses safe-area insets, a scrolling content area, touch targets of at
least 44 points, and keyboard avoidance on iOS. The tab bar hides while the
keyboard is visible. Review these interactions on a phone before the live demo.

### My Lens introduction: UI checkpoint

The My Lens tab implements Figma's **Lens - 1** (`26:458`): its title,
illustration, introduction text, primary action, and selected tab state.
Illustration layers are original Figma exports, bundled locally at 3× resolution
and placed in the design's original order and dimensions. The repeated green
dot shares one identical source asset.

Set up my Lens starts the four-step setup flow below. `MyLensScreen.onStartSetup`
is its navigation callback. Once a Lens has been saved, the tab shows that Lens
instead of the introduction (see "Saved Lens" below).

### My Lens setup flow

My Lens → Set up my Lens runs the full "Set up My Lens" task flow from the Figma
board. Every step has a four-segment progress bar that fills completed steps,
header Back, and Android back.

1. **What are you working toward?** (**Lens - 2**, `32:498`): five goals.
2. **Whose eyes worry you most?** Future employers, Voters & press, Admissions
   officers, Strangers with no context, Family, Old rivals.
3. **What should Lens watch for?** Politics, Jokes & sarcasm, Partying, Rants
   about people, Location, Opinions I may change.
4. **Who should see what?** A Public account / Friends account switch, then a
   Public / Friends / Private control for each topic chosen in Step 3. Each
   account keeps its own rules, starting from fixed demo defaults.
5. **Your Lens** summary: Goals, Perspectives, Watching for, and Sharing rules
   cards, each with Edit, followed by Save my Lens.
6. **Your Lens is set**: "Checks now focus on …", worded from the chosen goals,
   with Done and Try it on a draft.

Behavior:

- Steps 1–3 are multi-select: tap to select, tap again to deselect. Next stays
  disabled until something is selected. Checked states are exposed to
  accessibility tools.
- Skip for now on Step 1 returns to the introduction. On Steps 2 and 3 it moves
  to the next step with nothing selected; the summary then shows "Skipped".
- Choices are kept when moving back and forth between steps. Sharing rules are
  stored for all six topics, so changing Step 3 or switching accounts does not
  lose rules already set. If no topics were chosen, Step 4 says so and Review
  still works.
- Edit on a summary card opens that step with the saved choices selected. Next
  (or Review on Step 4) saves the change and returns to the summary; header Back
  and Android back cancel without changes.
- Save my Lens stores the choices and opens the confirmation. Done (and Android
  back) returns to the My Lens tab; Try it on a draft opens the Check tab.

**Saved Lens.** After saving, the My Lens tab shows "My Future Lens": a "Your Lens
is on" card with the focus line, then the saved goals, perspectives, and topics
as tags. Edit my Lens opens the summary, and Back from it returns to the tab.
Changes made there stay drafts until Save my Lens is pressed again.

The Lens lives in app state for the session only and resets when the app
restarts. It is not yet applied to post checks: the Figma's "Based on: …" line
on Check results depends on the teammate-owned results flow. It also does not
change the Footprint dashboard's preset goal-match flags.

Code layout:

- `src/data/goalOptions.ts`: the five goals, and `describeLensFocus` for the
  "Checks now focus on …" wording.
- `src/data/lensOptions.ts`: perspective and topic choices, account and audience
  labels, and the default sharing rules.
- `src/types/lens.ts`: IDs, `SharingRules`, and `SavedLens`.
- Screens: `MultiSelectStepScreen` (shared by Steps 1–3; `GoalSelectionScreen`
  wraps it for Step 1), `SharingRulesScreen`, `LensSummaryScreen`, and
  `LensSetScreen`. `MyLensScreen` takes an optional `savedLens` summary and
  `onEditLens`.
- Shared components: `StepProgress`, `OptionCard` with `CheckMark`,
  `TextButton`, `SegmentedControl` (pill and compact variants), `RuleCard`,
  `TagPill`, `SummaryCard`, and `SuccessBadge`. The check mark is drawn with
  Views, with no SVG dependency.
- `App.tsx` owns navigation (`lensPage`), the draft and saved Lens, Edit mode,
  and one back handler shared by header Back and Android back. Step pages
  remount on Edit so they start from the saved choices.

The app keeps implemented pages mounted, so changing tabs preserves the draft
and sharing selections. Inactive pages are hidden from accessibility navigation.
Android's hardware back action returns from My Lens or the Footprint introduction
to Check.

### Footprint introduction: UI checkpoint

The Footprint tab implements Figma's **Footprint - 1** (`60:676`): its title,
accent-colored subtitle, centered explanation, Connect Accounts action, and
selected tab state. The selected Footprint icon is an original Figma export,
bundled locally at 3× resolution and displayed at 24×24.

Connect Accounts opens the account-selection screen, followed by a confirmation
sheet, simulated scan progress, and a mock results dashboard. No social
accounts are connected and no real scan runs.
The page accepts `onConnectAccounts` as the navigation callback.

The explanation scrolls on smaller screens while the primary action remains
above the bottom tabs. The button follows Figma's 287-point maximum width and
54-point minimum height while fitting narrower devices.

### Account selection: UI checkpoint

From Footprint, choose Connect Accounts to open Figma's **Footprint - 2**
(`61:711`). The screen contains five fictional accounts from the design. Public
and Friends start selected; Video and Photo start unselected. Career profile is
disabled and marked Coming soon.

- Toggles update local selection state and expose checked/disabled accessibility
  states. Their original Figma assets render at 48×28 inside 48×44 touch targets.
- Continue requires at least one available account. With none selected, it is
  disabled and displays an instruction.
- Continue opens the read-only confirmation sheet for the selected demo accounts.
  It does not connect an account, request credentials, or start a scan.
- The back button returns to the Footprint introduction. Android back does the
  same; pressing it again returns to Check.
- Choices survive leaving and reopening this screen but reset on app restart.
  There is no persistent storage or network integration.

Fixtures live in `src/data/demoAccounts.ts`. `AccountSelectionScreen` accepts
`onBack` and `onContinue(accountIds: readonly DemoAccountId[])`. Continue sends
only selected, available IDs in fixture order. `confirmSelectedAccounts` in
`App.tsx` opens the confirmation sheet with that selection. Account avatars and
both toggle states are original Figma exports bundled locally at 3× resolution.
The native OS provides its own home indicator.

### Read-only scan confirmation: UI checkpoint

Account selection → Continue opens Figma's **Footprint - 3** (`76:854`) as a
native modal bottom sheet. It includes the read-only question, two permission
rows, Allow and Cancel actions, the sheet handle, and a dimmed backdrop.

- A visible demo label includes the selected account count and states that no
  real access is granted.
- Cancel, tapping the backdrop, the accessibility escape action, and Android's
  back action dismiss the sheet without changing account choices.
- Allow closes the sheet and opens simulated scan progress. It does not grant
  real permissions, connect an account, or run a real scan.
- Empty account requests cannot proceed. The sheet content scrolls when needed
  and includes safe-area bottom padding.

`ScanConfirmationSheet.onAllow` receives a `DemoScanRequest` containing a copy of
the selected IDs and `access: 'read-only'`. `startDemoScan` in `App.tsx` opens the
progress screen. No permission approval is persisted.

### Simulated scan progress: UI checkpoint

Confirmation → Allow opens Figma's **Footprint - 4** (`76:879`). The original
96-point and 56-point ring assets are exported from Figma at 3× resolution and
bundled locally. The initial scan label and status match the design.

- The page is visibly labeled Demo scan and includes the selected account count.
- Three deterministic UI phases run for approximately one second each, then show
  Demo scan complete. The 2,140-post count is fictional and is not calculated
  from the selected accounts or any actual account history.
- Cancel and Android back return to account selection and retain its choices.
- Completion offers View demo results, Replay demo, and Back to accounts.
  Results are static fictional fixtures, not generated findings.
- Hidden pages run no scan timer. Completion and cancellation clean up timers;
  replay or re-entry starts at the first phase. Backgrounding the app pauses
  progression, which resumes when the app becomes active again.
- Ring opacity pulses while running unless reduced motion is enabled. The pulse
  stops when the app is backgrounded, the scan finishes, or the page is left.

Timing and status text live in `src/data/demoScan.ts`. `ScanProgressScreen`
accepts `active`, `accountCount`, `onCancel`, and `onViewResults`; it performs no
network requests, account operations, or content analysis.

### Mock Footprint results: UI checkpoint

Completed demo scan → View demo results opens **Footprint - 5** (`76:886`),
implemented from the supplied screenshot and previously retrieved Figma layout
metadata. It shows the summary, colored risk badges, category chips, preset
goal-match toggle, sample finding cards, and Footprint tab state.

- The default view shows nine findings: 3 High, 4 Medium, and 2 Low, matching the
  supplied screenshot. Turning off Matches my goals exposes three extra samples.
- Category and goal-match filters combine, and the summary/counts reflect the
  visible sample rows. An empty state is available when no fixtures match.
- Goal matches and risk levels are fixed fixture labels. No model, post checker,
  or personalization algorithm runs.
- Results and filter selections survive changing tabs. Choose demo accounts
  again and Android back both return to account selection.
- Finding cards are read-only. Finding-detail screens, edit/delete actions,
  social integrations, and real scanning are outside this baseplate checkpoint.

`FootprintResultsScreen` takes a `findings` array plus navigation callbacks. Its
12 fictional items live in `src/data/demoFootprintFindings.ts`. The 2,140-post and
3-site metadata are fixed demo values and do not describe real account access.

## Tasks and implementation status

| Task | Planned interface | Status |
| --- | --- | --- |
| Check a post | Draft input, sharing choices, sample drafts | Input UI complete; analysis/results pending |
| Set up My Lens | Introduction, four setup steps, summary with Edit, confirmation, saved Lens | Works end to end; not yet applied to Check results |
| Review digital footprint | Introduction, account selection, confirmation, demo progress/results | Mock results dashboard UI complete |

Hardcoded content: `src/data/sampleDrafts.ts` contains two fictional draft
examples, `src/data/demoAccounts.ts` contains five fictional account rows, and
`src/data/demoScan.ts` supplies the fictional post count and timed UI phases.
`src/data/demoFootprintFindings.ts` contains 12 fictional findings, preset goal
matches, risk labels, filter names, and the demo site count.
`src/data/goalOptions.ts` supplies the five fixed goal choices, and
`src/data/lensOptions.ts` supplies the six perspectives, six topics, account and
audience labels, and default sharing rules.
Platform and audience options are defined in `src/types/checkPost.ts`. The first
draft sample uses the student-meeting example shown in Figma. There is no
generated analysis, account session, or real account connection. Set up My Lens
is the task that works end to end for the November 3 demo.

## Team workflow

- Adarsh owns the UI foundation and pages.
- A teammate owns the functional implementation of one task; confirm ownership
  and the integration interface before editing their files.
- Keep fixtures and feature logic separate from presentation as screens are added.
- Finish and review one page at a time, then commit manually before the next page.
- Contributors must use their own Git identities and commit their own work.
- The coding agent must not stage, commit, push, change author settings, rewrite
  history, or add AI coauthor trailers to commits.

### Scope

The original UI checkpoints ended at goal selection. The full My Lens setup flow
was then built in reviewed increments (shared components, Steps 2–3, Step 4,
summary, confirmation and saved Lens), each committed manually. Footprint
finding-detail flows, real social integrations, and analysis remain open.

Task 1's analysis, interpretation/results generation, and feature integration
belong to the teammate. `previewCheck` remains a placeholder wired through
`CheckPostScreen.onCheck`. Do not implement that functionality during these UI
checkpoints.

### Verification

```sh
npm run typecheck
npx expo export --platform ios --output-dir .expo/verification-ios
npx expo-doctor
```

On SDK 58, all three pass: the typecheck is clean, the iOS bundle builds with all
sixteen local image assets, and expo-doctor passes 20/20 checks.

My Lens smoke checks (run outside the repository with react-test-renderer and
mocked native primitives) passed for every shared component and for the full
flow driven through `App.tsx`: multi-select and deselect on Steps 1–3, disabled
Next, progress per step, default and changed sharing rules per account, adding a
topic after setting rules, the empty Step 4 state, summary contents, Edit and
cancel for each card, Skip while editing, Save, the confirmation wording, Done,
Try it on a draft, the saved My Lens tab, and header and Android back across all
pages.

Earlier checkpoints also passed both checks. Temporary component smoke checks passed for draft input behavior,
all three tab destinations, retained draft and account choices, default account
selections, empty-selection validation, the disabled Career option, confirmation
dismissal paths, copied read-only callback data, preview callbacks, back
navigation, inactive-page accessibility, and image dimensions. Controlled-timer
checks also passed for demo phases, completion, replay, cancellation, background
pause/resume, reduced-motion handling, and timer cleanup. Dashboard checks passed
for navigation, default and expanded counts, combined filters, retained state,
choosing accounts again, and empty results. Goal-selection checks passed for
multi-select/deselect, empty-selection validation, preview feedback, ordered
callback IDs, retained draft choices, Skip, and both back actions. These checks
use mocked native primitives and do not replace a device test.

A device/simulator visual and keyboard check is still required;
the implementation environment could not connect to the simulator or browser.

## Progress check: November 3

The team has five minutes for an overview and live demo. At least one of the three
tasks must work end to end; the UI owner's mocked screens alone do not meet that
requirement.

The separate 2–3 slide presentation should cover the title, mobile platform and
technologies, current status and development timeline, hardcoded data, the three
tasks, and the GitHub repository.

Set up My Lens works end to end and is the planned live-demo task: intro → four
steps → Your Lens summary (with Edit) → Save my Lens → Your Lens is set → saved
Lens on the My Lens tab. The teammate separately connects the post-check task.
Sign in to Expo on both the computer and the phone before presenting (see
"Signing in to Expo"), and rehearse the demo on the phone that will be used.

Repository: https://github.com/AllenZheng-05/FutureLens
