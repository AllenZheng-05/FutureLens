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

This bootstrap uses Expo SDK 56 with its matching React and React Native versions.
Use an Expo Go client compatible with SDK 56, or a matching development build.
The iOS Simulator requires Xcode; the Android Emulator requires Android Studio.

```sh
npm run ios
# Or, with an Android emulator configured:
npm run android
```

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

Set up my Lens opens an explicit preview notice. Goal selection, audience
selection, concerns, sharing rules, and preference saving remain future page
checkpoints. `MyLensScreen.onStartSetup` is the handoff point for that wizard;
no preferences are currently saved or applied to post checks.

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
sheet and simulated scan progress. History results and review actions remain
future UI checkpoints. No social accounts are connected and no real scan runs.
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
- Completion offers Replay demo and Back to accounts. Results are a future UI
  checkpoint, so this version does not show generated findings.
- Hidden pages run no scan timer. Completion and cancellation clean up timers;
  replay or re-entry starts at the first phase. Backgrounding the app pauses
  progression, which resumes when the app becomes active again.
- Ring opacity pulses while running unless reduced motion is enabled. The pulse
  stops when the app is backgrounded, the scan finishes, or the page is left.

Timing and status text live in `src/data/demoScan.ts`. `ScanProgressScreen`
accepts `active`, `accountCount`, and `onCancel`; it performs no network requests,
account operations, or content analysis.

## Tasks and implementation status

| Task | Planned interface | Status |
| --- | --- | --- |
| Check a post | Draft input, sharing choices, sample drafts | Input UI complete; analysis/results pending |
| Personalize checks | My Lens introduction and setup entry | Introduction UI complete; settings wizard pending |
| Review digital footprint | Introduction, account selection, confirmation, demo progress | Simulated progress UI complete; results pending |

Hardcoded content: `src/data/sampleDrafts.ts` contains two fictional draft
examples, `src/data/demoAccounts.ts` contains five fictional account rows, and
`src/data/demoScan.ts` supplies the fictional post count and timed UI phases.
Platform and audience options are defined in `src/types/checkPost.ts`. The first
draft sample uses the student-meeting example shown in Figma. There are no
analysis results, account sessions, or account connections. The app does not yet
satisfy the fully functional task requirement for the November 3 demo.

## Team workflow

- Adarsh owns the UI foundation and pages.
- A teammate owns the functional implementation of one task; confirm ownership
  and the integration interface before editing their files.
- Keep fixtures and feature logic separate from presentation as screens are added.
- Finish and review one page at a time, then commit manually before the next page.
- Contributors must use their own Git identities and commit their own work.
- The coding agent must not stage, commit, push, change author settings, rewrite
  history, or add AI coauthor trailers to commits.

Suggested page commit: `Add simulated Footprint scan progress screen`.

### Verification

```sh
npm run typecheck
npx expo export --platform ios --output-dir .expo/verification-ios
```

Both checks passed for this page checkpoint, including bundling all sixteen local
image assets. Temporary component smoke checks passed for draft input behavior,
all three tab destinations, retained draft and account choices, default account
selections, empty-selection validation, the disabled Career option, confirmation
dismissal paths, copied read-only callback data, preview callbacks, back
navigation, inactive-page accessibility, and image dimensions. Controlled-timer
checks also passed for demo phases, completion, replay, cancellation, background
pause/resume, reduced-motion handling, and timer cleanup. These checks use mocked
native primitives and do not replace a device test.

A device/simulator visual and keyboard check is still required;
the implementation environment could not connect to the simulator or browser.

## Progress check: November 3

The team has five minutes for an overview and live demo. At least one of the three
tasks must work end to end; the UI owner's mocked screens alone do not meet that
requirement.

The separate 2–3 slide presentation should cover the title, mobile platform and
technologies, current status and development timeline, hardcoded data, the three
tasks, and the GitHub repository.

Next milestones: implement one Figma page per review/commit checkpoint, connect
the teammate's working task, and rehearse the complete live demo.

Repository: https://github.com/AllenZheng-05/FutureLens
