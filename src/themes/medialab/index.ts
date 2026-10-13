import { buildCustomColorScheme } from 'themes/utils';

/** The "medialab" color scheme (medialab Server default): near-black surfaces with the medialab indigo accent. */
const theme = buildCustomColorScheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#6366f1',
            dark: '#4f46e5',
            light: '#818cf8',
            contrastText: '#fff'
        },
        secondary: {
            main: '#6366f1',
            contrastText: '#fff'
        },
        info: {
            main: '#6366f1'
        },
        background: {
            default: '#0b0e17',
            paper: '#121826'
        },
        text: {
            primary: '#f3f4f6',
            secondary: 'rgba(229, 231, 235, 0.72)'
        },
        action: {
            focus: 'rgba(99, 102, 241, 0.32)',
            hover: 'rgba(99, 102, 241, 0.14)'
        },
        divider: 'rgba(148, 163, 184, 0.16)',
        Alert: {
            infoFilledBg: '#312e81',
            infoFilledColor: '#e0e7ff'
        },
        AppBar: {
            defaultBg: '#0e1220'
        },
        Button: {
            inheritContainedBg: '#1f2637',
            inheritContainedHoverBg: '#2a3349'
        },
        SnackbarContent: {
            bg: '#1f2637',
            color: '#f3f4f6'
        }
    }
});

export default theme;
