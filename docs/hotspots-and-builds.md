# Forward Auto: Hotspots, Transitions, and Standalone Builds

## Screen transitions

The app uses a lightweight React Native `Animated.View` transition around the active screen. When `screenKey` changes, the screen fades in and slides 18 logical pixels from the right over 220 ms. It uses the native driver and does not require Reanimated.

The transition is intentionally short because the main Home, Quote, and Claims canvases are image-based UX references. Keep the duration between 180–260 ms unless usability testing shows a reason to change it.

## Updating interactive hotspots

The exact UX canvases are stored in `assets/`:

- `ux-home-reference.webp`
- `ux-quote-reference.webp`
- `ux-claims-reference.webp`

`MockupScreen` renders one full-screen 9:16 image and places transparent `Pressable` regions over it. Hotspot positions are percentages of the image, not device pixels, so they scale with different phone sizes.

Current hotspot styles are in `App.tsx`:

```tsx
hotspotPrimary: { left: '5%', top: '27%', width: '38%', height: '7%' }
hotspotHome: { left: '0%', bottom: '0%', width: '20%', height: '9%' }
hotspotQuote: { left: '20%', bottom: '0%', width: '20%', height: '9%' }
hotspotClaims: { left: '60%', bottom: '0%', width: '20%', height: '9%' }
hotspotHelp: { left: '80%', bottom: '0%', width: '20%', height: '9%' }
```

### When adding a new screen

1. Add the new 9:16 reference image to `assets/`.
2. Add a new `Tab` value if it is a bottom-navigation destination.
3. Add a new `MockupScreen` call with a descriptive `accessibilityLabel`.
4. Add a new absolute-positioned hotspot style using percentage coordinates.
5. Connect the hotspot to a state transition, for example `onTab('Policy')` or `setQuoteStep(4)`.
6. Update the relevant bottom-navigation hotspot widths if the menu layout changes.
7. Test on both a narrow Android phone and an iPhone-sized viewport; do not use fixed pixel coordinates.

### When changing the menu layout

The bottom bar is divided into five equal 20% zones in the current mockups. If the menu changes to four items, use 25% zones. If an item is wider or visually offset, define explicit `left` and `width` percentages for each hotspot rather than relying on the old zones.

Keep hotspot labels accessible. Every invisible control should have an `accessibilityLabel`, even though it has no visible styling.

## Standalone Android APK

The repository includes `app.json` and `eas.json`.

### One-time setup

```bash
npm install
npx eas-cli login
npx eas-cli build:configure
```

If Expo asks to create or link an EAS project, accept it. Change the Android package identifier in `app.json` if `et.forward.auto` is already used by another app.

### Installable testing APK

```bash
npx eas-cli build --platform android --profile preview
```

When the build finishes, open the returned build URL on the Android phone and install the APK. This is the recommended internal-testing artifact.

### Google Play release bundle

```bash
npx eas-cli build --platform android --profile production
```

The production profile creates an Android App Bundle (`.aab`). Upload it to Google Play Console, complete the store listing and data-safety declarations, and release through an internal, closed, or production track.

## Standalone iOS build

An iOS build requires an Apple Developer Program membership and Apple signing credentials. EAS can perform the cloud build from Windows or Linux, but Apple credentials and App Store Connect access are still required.

### Internal device testing

```bash
npx eas-cli build --platform ios --profile production
```

For an internal distribution profile, use a separate EAS profile with `distribution: internal` and register the test device UDIDs when EAS requests them. The resulting install link can be opened on registered iPhones.

### TestFlight / App Store

```bash
npx eas-cli build --platform ios --profile production
npx eas-cli submit --platform ios
```

The production iOS build is uploaded to App Store Connect. From there, use TestFlight for beta testing or complete App Store review for public distribution.

Before the final build, replace the placeholder bundle identifier `et.forward.auto` with the organization-owned identifier and add the final app icon, privacy URL, support URL, insurance disclosures, and App Store / Play Store metadata.

## Important production boundary

The current app is still a visual and interaction MVP. Standalone builds package the client UI, but production release also requires a secure Forward backend for authentication, quote calculation, policy data, claims, telebirr payment verification, analytics consent, and crash reporting. Do not put telebirr secrets, wallet PINs, OTPs, or signing keys in the mobile bundle.
