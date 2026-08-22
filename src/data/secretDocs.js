export const docsGroups = [
  {
    label: "Start",
    sections: [
      ["introduction", "Introduction"],
      ["run-modes", "Run modes"],
      ["standalone-setup", "Standalone setup"]
    ]
  },
  {
    label: "Configuration",
    sections: [
      ["environment", "Environment variables"],
      ["console", "Console"]
    ]
  },
  {
    label: "Authorization",
    sections: [["permissions", "Permissions"]]
  },
  {
    label: "Operations",
    sections: [["security", "Security"]]
  }
];

export const docsSections = docsGroups.flatMap((group) =>
  group.sections.map(([slug, title]) => ({
    slug,
    title
  }))
);

export const findDocSection = (slug) => docsSections.find((section) => section.slug === slug);
