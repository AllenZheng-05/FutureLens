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
Review and include the generated `package-lock.json` in your manual setup commit
so the team installs the same dependency versions afterward with `npm ci`.

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

The first milestone is only the application bootstrap. The current entry screen
displays the app name; it does not represent a finished Figma page. Design access
or screenshots are needed before implementing the actual pages.

## Tasks and implementation status

| Task | Planned interface | Status |
| --- | --- | --- |
| Check a post | Draft input, audience choices, interpretation results | Not implemented |
| Personalize checks | Goals, concerns, audience and sharing preferences | Not implemented |
| Review digital footprint | Demo accounts, historical posts, filters and details | Not implemented |

No hardcoded posts, analysis results, account sessions, or account connections are
included yet. The app does not currently satisfy the fully functional task
requirement for the November 3 demo.

## Team workflow

- Adarsh owns the UI foundation and pages.
- A teammate owns the functional implementation of one task; confirm ownership
  and the integration interface before editing their files.
- Keep fixtures and feature logic separate from presentation as screens are added.
- Finish and review one page at a time, then commit manually before the next page.
- Contributors must use their own Git identities and commit their own work.
- The coding agent must not stage, commit, push, change author settings, rewrite
  history, or add AI coauthor trailers to commits.

Suggested first commit: `Set up React Native app with Expo and TypeScript`.

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
