<script setup lang="ts">
/**
 * TmplMap.vue
 *
 * Mock map widget. No Google Maps API key needed.
 * Renders a stylized SVG-style map with a pin and info popup.
 *
 * For "real" map (e.g. OpenStreetMap via Leaflet), use TmplMapReal.
 */
const props = withDefaults(defineProps<{
  /** Display label (e.g. venue name) */
  label: string
  /** Address line 1 */
  address: string
  /** Address line 2 (city) */
  city: string
  /** Latitude (for centering) */
  lat?: number
  /** Longitude (for centering) */
  lng?: number
  /** Optional: link to Google Maps */
  googleMapsUrl?: string
  /** Optional: link to Waze */
  wazeUrl?: string
  /** Accent */
  accent?: string
}>(), {
  lat: -6.2,
  lng: 106.8,
  googleMapsUrl: undefined,
  wazeUrl: undefined,
  accent: '#0A0A0A',
})

const computedGoogleMaps = computed(() => {
  if (props.googleMapsUrl) return props.googleMapsUrl
  return `https://maps.google.com/?q=${encodeURIComponent(`${props.label}, ${props.address}, ${props.city}`)}`
})
</script>

<template>
  <div class="tmpl-map" :style="{ '--accent': accent }">
    <!-- Stylized SVG map placeholder -->
    <div class="tmpl-map__art" aria-hidden="true">
      <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" class="tmpl-map__svg">
        <defs>
          <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" stroke-width="0.5" opacity="0.15" />
          </pattern>
          <pattern id="map-blocks" width="80" height="80" patternUnits="userSpaceOnUse">
            <rect width="80" height="80" fill="currentColor" opacity="0.04" />
          </pattern>
        </defs>
        <rect width="800" height="500" fill="url(#map-blocks)" />
        <rect width="800" height="500" fill="url(#map-grid)" />
        <!-- Streets (curved) -->
        <path
          d="M 0 200 Q 200 180 400 220 T 800 240"
          stroke="currentColor"
          stroke-width="14"
          fill="none"
          opacity="0.06"
        />
        <path
          d="M 0 350 Q 250 320 500 380 T 800 360"
          stroke="currentColor"
          stroke-width="10"
          fill="none"
          opacity="0.06"
        />
        <path
          d="M 150 0 Q 170 200 220 400 T 250 500"
          stroke="currentColor"
          stroke-width="10"
          fill="none"
          opacity="0.06"
        />
        <path
          d="M 600 0 Q 580 150 620 300 T 600 500"
          stroke="currentColor"
          stroke-width="10"
          fill="none"
          opacity="0.06"
        />
        <!-- River / park -->
        <path
          d="M 0 100 Q 200 120 400 80 T 800 110"
          stroke="var(--accent)"
          stroke-width="6"
          fill="none"
          opacity="0.18"
        />
      </svg>

      <!-- Centered pin -->
      <div class="tmpl-map__pin" aria-hidden="true">
        <span class="tmpl-map__pin-pulse" />
        <span class="tmpl-map__pin-dot" />
      </div>
    </div>

    <div class="tmpl-map__info">
      <h4 class="tmpl-map__label">{{ label }}</h4>
      <address class="tmpl-map__address">
        {{ address }}<br>
        {{ city }}
      </address>
      <div class="tmpl-map__actions">
        <a
          :href="computedGoogleMaps"
          target="_blank"
          rel="noopener"
          class="tmpl-map__btn"
          :style="{ borderColor: accent, color: accent }"
        >
          <UIcon name="i-lucide-map" class="w-4 h-4" />
          Google Maps
        </a>
        <a
          v-if="wazeUrl"
          :href="wazeUrl"
          target="_blank"
          rel="noopener"
          class="tmpl-map__btn"
          :style="{ borderColor: accent, color: accent }"
        >
          Waze
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tmpl-map {
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  border: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  border-radius: 16px;
  overflow: hidden;
  background: color-mix(in srgb, currentColor 3%, transparent);
}
@media (min-width: 768px) {
  .tmpl-map {
    grid-template-columns: 1.2fr 1fr;
  }
}
.tmpl-map__art {
  position: relative;
  aspect-ratio: 4 / 3;
  color: currentColor;
}
@media (min-width: 768px) {
  .tmpl-map__art {
    aspect-ratio: auto;
    min-height: 280px;
  }
}
.tmpl-map__svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.tmpl-map__pin {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -100%);
  display: flex;
  align-items: center;
  justify-content: center;
}
.tmpl-map__pin-pulse {
  position: absolute;
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: var(--accent, currentColor);
  opacity: 0.4;
  animation: tmpl-map-ping 2s ease-out infinite;
}
.tmpl-map__pin-dot {
  position: relative;
  width: 14px;
  height: 14px;
  border-radius: 999px;
  background: var(--accent, currentColor);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent, currentColor) 25%, transparent), 0 4px 12px rgba(0, 0, 0, 0.2);
}
@keyframes tmpl-map-ping {
  0% { transform: scale(0.6); opacity: 0.6; }
  100% { transform: scale(2.5); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .tmpl-map__pin-pulse { animation: none; }
}
.tmpl-map__info {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  justify-content: center;
}
.tmpl-map__label {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.01em;
}
.tmpl-map__address {
  font-style: normal;
  font-size: 13px;
  opacity: 0.7;
  line-height: 1.5;
}
.tmpl-map__actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
}
.tmpl-map__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  border: 1px solid;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 200ms ease;
}
.tmpl-map__btn:hover {
  background: color-mix(in srgb, currentColor 6%, transparent);
}
</style>
