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
- My Lens and Footprint are visible but disabled until their page checkpoints.
- Drafts and choices live in component state; they are not saved or uploaded.

`CheckPostScreen` accepts `onCheck(request: CheckPostRequest)`. The callback
receives `{ draft, platform, audience }`, with surrounding draft whitespace
trimmed. Replace `previewCheck` in `App.tsx` with the teammate-owned analysis and
results flow; the screen does not implement either.

The screen uses safe-area insets, a scrolling content area, touch targets of at
least 44 points, and keyboard avoidance on iOS. The tab bar hides while the
keyboard is visible. Review these interactions on a phone before the live demo.

## Tasks and implementation status

| Task | Planned interface | Status |
| --- | --- | --- |
| Check a post | Draft input, sharing choices, sample drafts | Input UI complete; analysis/results pending |
| Personalize checks | Goals, concerns, audience and sharing preferences | Not implemented |
| Review digital footprint | Demo accounts, historical posts, filters and details | Not implemented |

Hardcoded content: `src/data/sampleDrafts.ts` contains two fictional draft
examples; platform and audience options are defined in `src/types/checkPost.ts`.
The first sample uses the student-meeting example shown in Figma. There are no
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

Suggested page commit: `Build Check a post input screen from Figma`.

### Verification

```sh
npm run typecheck
npx expo export --platform ios --output-dir .expo/verification-ios
```

Both checks passed for this page checkpoint, including bundling the two local
navigation icons. A temporary component smoke check also passed for blank draft
validation, sample loading, selected sharing choices, callback data, clearing,
and keyboard-driven tab visibility. That check used mocked native primitives;
it does not replace a device test.

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
