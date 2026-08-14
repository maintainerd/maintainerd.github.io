export const assetPath = (path) => `/assets/${path}`;

export const brandAssets = {
  mark: assetPath("maintainerd-mark.svg"),
  logoDark: assetPath("maintainerd-logo-dark.png"),
  logoLight: assetPath("maintainerd-logo-light.png"),
  iconDark: assetPath("maintainerd-icon-dark.png"),
  iconLight: assetPath("maintainerd-icon-light.png")
};

export const screenshots = {
  authIdentityProvider: assetPath("auth-console-identity-provider.png"),
  authConsole: assetPath("m9d-auth-console.png")
};

export const serviceIcon = (slug) => assetPath(`icons/${slug}.svg`);
