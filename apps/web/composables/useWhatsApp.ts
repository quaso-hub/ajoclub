const DEFAULT_PHONE = '6285188627365'
const DEFAULT_MESSAGE = 'Halo AjoClub, saya ingin konsultasi tentang website dan portfolio digital.'

export function useWhatsApp() {
  const config = useRuntimeConfig()
  const phoneNumber = computed(() => config.public.whatsappPhone || DEFAULT_PHONE)

  function buildUrl(message = DEFAULT_MESSAGE) {
    return `https://wa.me/${phoneNumber.value}?text=${encodeURIComponent(message)}`
  }

  function sectionMessage(section: string, context?: string) {
    const suffix = context ? ` Konteks: ${context}.` : ''
    return `Halo AjoClub, saya tertarik membahas ${section}.${suffix}`
  }

  return {
    phoneNumber,
    displayPhone: '+62 851-8862-7365',
    buildUrl,
    sectionMessage,
  }
}
