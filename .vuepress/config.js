module.exports = {
  title: 'Faction',
  description: 'Documentation for the Faction C2 Framework',
  themeConfig: {
    nav: [
      { text: 'Documentation', link: '/docs/' },
      { text: 'Marauder Shell', link: 'https://www.maraudershell.com'},
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
    lastUpdated: 'Last Updated'
  }
}