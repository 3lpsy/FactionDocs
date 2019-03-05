module.exports = {
  title: 'Faction',
  description: 'Documentation for the Faction C2 Framework',
  themeConfig: {
    logo: '../assets/img/faction-white-orange-fist-outline.png',
    nav: [
      { text: 'Documentation', link: '/docs/' },
      { text: 'Marauder Shell', link: 'https://www.maraudershell.com'},
      { text: 'Github', link: 'https://github.com/factionc2/'}
    ],
    sidebar: [
      ['/docs/', 'Documentation'],
      '/docs/components/',
      '/docs/development/',
      '/docs/operation/',
    ],
    sidebarDepth: 2,
    lastUpdated: 'Last Updated'
  }
}