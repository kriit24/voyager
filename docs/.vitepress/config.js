import sidebar from './sidebar.json';
// import sidebar_de from './sidebar_de.json'

module.exports = {
    title: 'Voyager',
    description: 'Documentation for Voyager II',
    lang: 'en',
    base: '/voyager/',
    themeConfig: {
        logo: '/helm.svg',
        sidebar,
        nav: [
            { text: 'Home', link: '/' },
            /*{ text: 'German', link: '/de/' },*/
            { text: 'Issues', link: 'https://github.com/voyager-admin/voyager/issues' },
            { text: 'Github', link: 'https://github.com/voyager-admin/voyager' },
        ],
        locales: {
            '/': {
                label: 'English',
                sidebar,
            },
            /*'/de/': {
                label: 'Deutsch',
                sidebar: sidebar_de,
            }*/
        }
    },
    locales: {
        '/': {
            lang: 'en',
            title: 'Voyager II',
            description: 'Documentation for Voyager II'
        },
        /*'/de/': {
            lang: 'de',
            title: 'Voyager II',
            description: 'Dokumentation für Voyager II'
        }*/
    }
}