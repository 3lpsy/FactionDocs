module.exports = {
  title: 'Faction',
  description: 'Documentation for the Faction C2 Framework',
  themeConfig: {
    nav: [
      { text: 'Documentation', link: '/docs/' },
      { text: 'Marauder Shell', link: 'https://github.com/maraudershell/Marauder'},
      { text: 'Github', link: 'https://github.com/factionc2/'}
    ],
    sidebar: [
      ['/docs/', 'Documentation'],
      '/docs/using/',
      '/docs/development/',
      '/docs/agents/',
      '/docs/api/',
      '/docs/components/',
    ],
    sidebarDepth: 2,
    lastUpdated: 'Last Updated',
    // if your docs are in a different repo from your main project:
    docsRepo: 'FactionC2/Docs',
    // if your docs are in a specific branch (defaults to 'master'):
    docsBranch: 'master',
    // defaults to false, set to true to enable
    editLinks: true
  }
}