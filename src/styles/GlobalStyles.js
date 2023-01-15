const brandPrimary = '#be0f2e' // Granate US. rgba(190,15,46,255)
const brandPrimaryDisabled = `${brandPrimary}a8`
const brandPrimaryTap = '#AA001A' //  Granate US más oscuro
const brandSecondary = '#feca1b' // Amarillo US. rgba(254,202,27,255)
const brandSecondaryTap = '#EAB607' // amarillo US más oscuro
const brandSuccess = '#95be05' // verde US
const brandBackground = 'rgb(242, 242, 242)' // gris claro
const flashStyle = { paddingTop: 50, fontSize: 20 }
const flashTextStyle = { fontSize: 18 }

const navigationTheme = {
  dark: false,
  colors: {
    primary: brandSecondary,
    background: brandBackground,
    card: brandPrimary,
    text: '#ffffff',
    border: `${brandPrimary}99`,
    notification: `${brandSecondaryTap}ff` // badge
  }
}

export { navigationTheme, brandPrimary, brandPrimaryTap, brandSecondary, brandSecondaryTap, brandSuccess, brandBackground, flashStyle, flashTextStyle, brandPrimaryDisabled }
